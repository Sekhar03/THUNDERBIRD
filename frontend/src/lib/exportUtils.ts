/**
 * Export Utilities for ThunderBird
 * Provides advanced export functionality for graphs and data
 */

export interface ExportOptions {
  fileName?: string;
  includeTimestamp?: boolean;
  timeRange?: {
    start: Date;
    end: Date;
  };
}

/**
 * Export data to CSV format
 */
export const exportToCSV = (data: any[], options: ExportOptions = {}) => {
  if (!data || data.length === 0) {
    throw new Error('No data to export');
  }

  const fileName = options.includeTimestamp
    ? `${options.fileName || 'export'}_${new Date().toISOString().split('T')[0]}.csv`
    : `${options.fileName || 'export'}.csv`;

  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Handle values with commas, quotes, or newlines
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ];

  const csvContent = csvRows.join('\n');
  downloadFile(csvContent, fileName, 'text/csv');
};

/**
 * Export data to JSON format
 */
export const exportToJSON = (data: any, options: ExportOptions = {}) => {
  const fileName = options.includeTimestamp
    ? `${options.fileName || 'export'}_${new Date().toISOString().split('T')[0]}.json`
    : `${options.fileName || 'export'}.json`;

  const jsonContent = JSON.stringify(data, null, 2);
  downloadFile(jsonContent, fileName, 'application/json');
};

/**
 * Export data to Excel-compatible format (Tab-separated values)
 */
export const exportToExcel = (data: any[], options: ExportOptions = {}) => {
  if (!data || data.length === 0) {
    throw new Error('No data to export');
  }

  const fileName = options.includeTimestamp
    ? `${options.fileName || 'export'}_${new Date().toISOString().split('T')[0]}.xls`
    : `${options.fileName || 'export'}.xls`;

  const headers = Object.keys(data[0]);
  const rows = [
    headers.join('\t'),
    ...data.map(row => headers.map(header => row[header]).join('\t'))
  ];

  const content = rows.join('\n');
  downloadFile(content, fileName, 'application/vnd.ms-excel');
};

/**
 * Export chart/graph as PNG image
 * Requires html2canvas library (install: npm install html2canvas)
 */
export const exportChartToPNG = async (
  element: HTMLElement,
  options: ExportOptions = {}
) => {
  try {
    // Dynamic import to avoid SSR issues
    const html2canvas = (await import('html2canvas')).default;
    
    const canvas = await html2canvas(element, {
      backgroundColor: '#0f172a',
      scale: 2, // Higher quality
      logging: false,
    });

    const fileName = options.includeTimestamp
      ? `${options.fileName || 'chart'}_${new Date().toISOString().split('T')[0]}.png`
      : `${options.fileName || 'chart'}.png`;

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    });
  } catch (error) {
    console.error('Failed to export chart as PNG:', error);
    // Fallback: Use canvas API
    fallbackChartExport(element, options);
  }
};

/**
 * Export chart as SVG
 */
export const exportChartToSVG = (svgElement: SVGElement, options: ExportOptions = {}) => {
  const fileName = options.includeTimestamp
    ? `${options.fileName || 'chart'}_${new Date().toISOString().split('T')[0]}.svg`
    : `${options.fileName || 'chart'}.svg`;

  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgElement);
  
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Export data to PDF format
 * Requires jspdf library (install: npm install jspdf)
 */
export const exportToPDF = async (
  data: any[],
  options: ExportOptions & { title?: string; orientation?: 'portrait' | 'landscape' } = {}
) => {
  try {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({
      orientation: options.orientation || 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const fileName = options.includeTimestamp
      ? `${options.fileName || 'report'}_${new Date().toISOString().split('T')[0]}.pdf`
      : `${options.fileName || 'report'}.pdf`;

    // Add title
    doc.setFontSize(20);
    doc.text(options.title || 'ThunderBird Export Report', 14, 22);

    // Add timestamp
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);

    // Add data summary
    doc.setFontSize(12);
    doc.text(`Total Records: ${data.length}`, 14, 40);

    if (options.timeRange) {
      doc.text(`Time Range: ${options.timeRange.start.toLocaleString()} - ${options.timeRange.end.toLocaleString()}`, 14, 47);
    }

    // Add data table (simplified - for full table support, use jspdf-autotable)
    let yPosition = 60;
    const headers = data.length > 0 ? Object.keys(data[0]) : [];
    
    doc.setFontSize(10);
    doc.text(headers.join('  |  '), 14, yPosition);
    yPosition += 7;

    data.slice(0, 30).forEach((row) => { // Limit to 30 rows for demo
      const values = headers.map(h => String(row[h]).substring(0, 15));
      doc.text(values.join('  |  '), 14, yPosition);
      yPosition += 7;
      
      if (yPosition > 280) {
        doc.addPage();
        yPosition = 20;
      }
    });

    doc.save(fileName);
  } catch (error) {
    console.error('Failed to export PDF:', error);
    // Fallback: simple text PDF
    fallbackPDFExport(data, options);
  }
};

/**
 * Filter data by time range
 */
export const filterDataByTimeRange = (
  data: any[],
  timeRange: { start: Date; end: Date },
  timestampField: string = 'timestamp'
) => {
  return data.filter(item => {
    const itemDate = new Date(item[timestampField]);
    return itemDate >= timeRange.start && itemDate <= timeRange.end;
  });
};

/**
 * Get time range presets
 */
export const getTimeRangePreset = (preset: 'hour' | 'day' | 'week' | 'month') => {
  const end = new Date();
  const start = new Date();

  switch (preset) {
    case 'hour':
      start.setHours(start.getHours() - 1);
      break;
    case 'day':
      start.setHours(start.getHours() - 24);
      break;
    case 'week':
      start.setDate(start.getDate() - 7);
      break;
    case 'month':
      start.setDate(start.getDate() - 30);
      break;
  }

  return { start, end };
};

/**
 * Helper function to download a file
 */
const downloadFile = (content: string, fileName: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Fallback chart export using canvas
 */
const fallbackChartExport = (element: HTMLElement, options: ExportOptions) => {
  const canvas = document.createElement('canvas');
  const rect = element.getBoundingClientRect();
  canvas.width = rect.width * 2;
  canvas.height = rect.height * 2;
  
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.scale(2, 2);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    ctx.fillText('Chart Export', 20, 30);
    ctx.fillText(`${new Date().toLocaleString()}`, 20, 50);
  }

  const fileName = options.includeTimestamp
    ? `${options.fileName || 'chart'}_${new Date().toISOString().split('T')[0]}.png`
    : `${options.fileName || 'chart'}.png`;

  canvas.toBlob((blob) => {
    if (blob) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  });
};

/**
 * Fallback PDF export
 */
const fallbackPDFExport = (data: any[], options: ExportOptions) => {
  const content = `ThunderBird Export Report
Generated: ${new Date().toLocaleString()}
Total Records: ${data.length}

${JSON.stringify(data, null, 2)}
`;

  const fileName = options.includeTimestamp
    ? `${options.fileName || 'report'}_${new Date().toISOString().split('T')[0]}.txt`
    : `${options.fileName || 'report'}.txt`;

  downloadFile(content, fileName, 'text/plain');
};

/**
 * Batch export multiple datasets
 */
export const batchExport = async (
  datasets: Array<{ data: any[]; fileName: string; format: 'csv' | 'json' | 'excel' }>,
  options: ExportOptions = {}
) => {
  for (const dataset of datasets) {
    const exportOptions = { ...options, fileName: dataset.fileName };
    
    switch (dataset.format) {
      case 'csv':
        exportToCSV(dataset.data, exportOptions);
        break;
      case 'json':
        exportToJSON(dataset.data, exportOptions);
        break;
      case 'excel':
        exportToExcel(dataset.data, exportOptions);
        break;
    }
    
    // Small delay between exports to prevent browser blocking
    await new Promise(resolve => setTimeout(resolve, 300));
  }
};

/**
 * Export with compression (for large datasets)
 */
export const exportCompressed = async (data: any[], options: ExportOptions = {}) => {
  try {
    const jsonString = JSON.stringify(data);
    const encoder = new TextEncoder();
    const dataArray = encoder.encode(jsonString);

    // Use compression if available (modern browsers)
    if ('CompressionStream' in window) {
      const compressionStream = new (window as any).CompressionStream('gzip');
      const writer = compressionStream.writable.getWriter();
      writer.write(dataArray);
      writer.close();

      const blob = await new Response(compressionStream.readable).blob();
      const fileName = `${options.fileName || 'export'}.json.gz`;
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      // Fallback to regular JSON export
      exportToJSON(data, options);
    }
  } catch (error) {
    console.error('Compression failed, falling back to regular export:', error);
    exportToJSON(data, options);
  }
};
