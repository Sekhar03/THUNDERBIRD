# 📊 Export Manager Feature Guide

## Overview
The **Export Manager** provides comprehensive time-based export capabilities for graphs and data in the ThunderBird system.

---

## ✨ Features

### 📁 Export Formats Supported
1. **CSV** - Comma-separated values for Excel, Google Sheets
2. **Excel (XLS)** - Microsoft Excel format
3. **JSON** - JavaScript Object Notation for developers
4. **PDF** - Portable Document Format with formatted reports
5. **PNG** - High-quality image export for graphs
6. **SVG** - Scalable vector graphics for presentations

### ⏰ Time-Based Filtering
- **Last Hour** - Export data from the past 60 minutes
- **Last 24 Hours** - Daily data export
- **Last 7 Days** - Weekly analytics
- **Last 30 Days** - Monthly reports
- **Custom Range** - Select specific start and end dates/times

### 🎯 Export Options
- ✅ Include/exclude graphs and visualizations
- ✅ Include/exclude raw data tables
- ✅ Automatic timestamping
- ✅ Export history tracking
- ✅ Real-time preview of export summary

---

## 🚀 Installation & Setup

### Dependencies (Optional for Enhanced Features)

For advanced export capabilities, install these optional libraries:

```bash
# For high-quality PNG exports
npm install html2canvas

# For PDF exports with tables
npm install jspdf jspdf-autotable

# For Excel exports (advanced)
npm install xlsx
```

**Note**: The Export Manager works without these libraries using fallback methods!

---

## 💻 Usage

### 1. Basic Usage (Already Integrated)

The Export Manager is already integrated into the **Analytics Dashboard**:

```tsx
import ExportManager from '@/components/ExportManager';

// In your component
<ExportManager 
  data={yourData}
  fileName="analytics-export"
/>
```

### 2. Advanced Usage with Custom Options

```tsx
<ExportManager 
  data={performanceData}
  graphRef={chartContainerRef}
  fileName="performance-metrics"
/>
```

### 3. Using Export Utilities Directly

```tsx
import { exportToCSV, exportToPDF, filterDataByTimeRange } from '@/lib/exportUtils';

// Export to CSV
const data = [
  { timestamp: '2025-01-01', value: 100 },
  { timestamp: '2025-01-02', value: 150 },
];

exportToCSV(data, {
  fileName: 'my-export',
  includeTimestamp: true
});

// Filter by time range then export
const { start, end } = getTimeRangePreset('week');
const filtered = filterDataByTimeRange(data, { start, end });
exportToPDF(filtered, {
  fileName: 'weekly-report',
  title: 'Weekly Performance Report',
  orientation: 'landscape'
});
```

---

## 📖 API Reference

### ExportManager Component Props

```typescript
interface ExportManagerProps {
  data?: any;                          // Data to export (optional, uses mock data if not provided)
  graphRef?: React.RefObject<HTMLDivElement>;  // Reference to graph element for image export
  fileName?: string;                   // Base filename (default: 'thunderbird-export')
}
```

### Export Utility Functions

#### `exportToCSV(data, options)`
Exports data as CSV file.
```typescript
exportToCSV(
  data: any[],
  options: {
    fileName?: string;
    includeTimestamp?: boolean;
  }
);
```

#### `exportToJSON(data, options)`
Exports data as formatted JSON.
```typescript
exportToJSON(
  data: any,
  options: {
    fileName?: string;
    includeTimestamp?: boolean;
  }
);
```

#### `exportToExcel(data, options)`
Exports data as Excel-compatible format.
```typescript
exportToExcel(
  data: any[],
  options: {
    fileName?: string;
    includeTimestamp?: boolean;
  }
);
```

#### `exportToPDF(data, options)`
Exports data as PDF report (requires jspdf).
```typescript
exportToPDF(
  data: any[],
  options: {
    fileName?: string;
    includeTimestamp?: boolean;
    title?: string;
    orientation?: 'portrait' | 'landscape';
    timeRange?: { start: Date; end: Date };
  }
);
```

#### `exportChartToPNG(element, options)`
Exports chart/graph as PNG image (requires html2canvas).
```typescript
exportChartToPNG(
  element: HTMLElement,
  options: {
    fileName?: string;
    includeTimestamp?: boolean;
  }
);
```

#### `exportChartToSVG(svgElement, options)`
Exports SVG chart as file.
```typescript
exportChartToSVG(
  svgElement: SVGElement,
  options: {
    fileName?: string;
    includeTimestamp?: boolean;
  }
);
```

#### `filterDataByTimeRange(data, timeRange, timestampField)`
Filters data array by time range.
```typescript
filterDataByTimeRange(
  data: any[],
  timeRange: { start: Date; end: Date },
  timestampField?: string  // default: 'timestamp'
): any[]
```

#### `getTimeRangePreset(preset)`
Get predefined time ranges.
```typescript
getTimeRangePreset(
  preset: 'hour' | 'day' | 'week' | 'month'
): { start: Date; end: Date }
```

#### `batchExport(datasets, options)`
Export multiple datasets at once.
```typescript
batchExport(
  datasets: Array<{
    data: any[];
    fileName: string;
    format: 'csv' | 'json' | 'excel';
  }>,
  options: ExportOptions
): Promise<void>
```

#### `exportCompressed(data, options)`
Export with gzip compression for large datasets.
```typescript
exportCompressed(
  data: any[],
  options: ExportOptions
): Promise<void>
```

---

## 🎨 UI Components

### Export Button Trigger
Click the **"Export Data"** button in the Analytics Dashboard header.

### Export Modal
Beautiful modal with:
- **Format Selection** - Visual cards for each format
- **Time Range Picker** - Quick presets + custom date range
- **Export Options** - Toggle graphs and data inclusion
- **Export Summary** - Preview before export
- **Export History** - Track recent exports

---

## 📊 Use Cases

### 1. Daily Performance Reports
```typescript
// Analytics Dashboard - automatically includes Export Manager
// User clicks "Export Data" → Selects "Last 24 Hours" → PDF → Download
```

### 2. Scenario Analysis Export
```typescript
// After running scenarios, export results for comparison
<ExportManager 
  data={scenarioResults}
  fileName="scenario-analysis"
/>
```

### 3. Custom Time Range Analysis
```typescript
// Select custom date range for specific incident investigation
// User selects start: 2025-01-15 08:00, end: 2025-01-15 12:00
// Export as CSV for Excel analysis
```

### 4. Graph Export for Presentations
```typescript
// Export charts as PNG for PowerPoint slides
const chartRef = useRef<HTMLDivElement>(null);

<div ref={chartRef}>
  <LineChart data={data} />
</div>

<ExportManager 
  graphRef={chartRef}
  fileName="performance-chart"
/>
```

### 5. Batch Export Multiple Datasets
```typescript
import { batchExport } from '@/lib/exportUtils';

const datasets = [
  { data: performanceData, fileName: 'performance', format: 'csv' },
  { data: securityData, fileName: 'security', format: 'csv' },
  { data: networkData, fileName: 'network', format: 'csv' },
];

await batchExport(datasets, { includeTimestamp: true });
// Downloads 3 CSV files with timestamp
```

---

## 🔧 Integration Examples

### Add to Dashboard Component
```tsx
import ExportManager from '@/components/ExportManager';

const MyDashboard = () => {
  const [chartData, setChartData] = useState([]);
  const chartRef = useRef<HTMLDivElement>(null);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>My Dashboard</CardTitle>
          <ExportManager 
            data={chartData}
            graphRef={chartRef}
            fileName="dashboard-export"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div ref={chartRef}>
          {/* Your charts here */}
        </div>
      </CardContent>
    </Card>
  );
};
```

### Add to Scenario Mode
```tsx
<div className="flex items-center gap-2">
  <ExportManager 
    fileName={`scenario-${scenarioName}`}
  />
  <Badge>Active</Badge>
</div>
```

### Programmatic Export
```tsx
import { exportToCSV, getTimeRangePreset } from '@/lib/exportUtils';

const handleScheduledExport = () => {
  const { start, end } = getTimeRangePreset('day');
  const filtered = filterDataByTimeRange(allData, { start, end });
  
  exportToCSV(filtered, {
    fileName: 'daily-report',
    includeTimestamp: true
  });
};

// Run daily at midnight
useEffect(() => {
  const interval = setInterval(handleScheduledExport, 24 * 60 * 60 * 1000);
  return () => clearInterval(interval);
}, []);
```

---

## 🎯 Best Practices

### 1. **Always Include Timestamp**
```tsx
exportToCSV(data, { includeTimestamp: true });
// Generates: analytics-dashboard_2025-01-25.csv
```

### 2. **Filter Before Export**
```tsx
// Don't export unnecessary data
const recentData = data.filter(d => new Date(d.timestamp) > startDate);
exportToJSON(recentData, options);
```

### 3. **Use Descriptive Filenames**
```tsx
<ExportManager 
  fileName={`satellite-${satelliteId}-performance`}
/>
```

### 4. **Compress Large Datasets**
```tsx
// For datasets > 1MB
import { exportCompressed } from '@/lib/exportUtils';
await exportCompressed(largeDataset, { fileName: 'big-data' });
```

### 5. **Batch Exports for Reports**
```tsx
// Export related datasets together
await batchExport([
  { data: systemLogs, fileName: 'logs', format: 'json' },
  { data: metrics, fileName: 'metrics', format: 'csv' },
  { data: alerts, fileName: 'alerts', format: 'excel' },
]);
```

---

## 📈 Data Format Examples

### CSV Output
```csv
timestamp,performance,security,network,satellites,quantumKeys,threats
2025-01-25T10:00:00.000Z,95.2,98.1,87.5,5,142,0
2025-01-25T10:01:00.000Z,94.8,97.9,88.2,5,145,1
2025-01-25T10:02:00.000Z,96.1,98.5,86.9,5,143,0
```

### JSON Output
```json
[
  {
    "timestamp": "2025-01-25T10:00:00.000Z",
    "performance": 95.2,
    "security": 98.1,
    "network": 87.5,
    "satellites": 5,
    "quantumKeys": 142,
    "threats": 0
  }
]
```

### PDF Output
```
ThunderBird Export Report
Generated: 1/25/2025, 10:30:45 AM
Total Records: 100
Time Range: Last 24 Hours

timestamp              | performance | security | network
2025-01-25T10:00:00Z  | 95.2        | 98.1     | 87.5
...
```

---

## 🔍 Troubleshooting

### Issue: Export button not showing
**Solution**: Ensure ExportManager is imported and used in your component

### Issue: PNG export not working
**Solution**: Install html2canvas: `npm install html2canvas`

### Issue: PDF export shows basic text instead of formatted
**Solution**: Install jspdf: `npm install jspdf jspdf-autotable`

### Issue: Large file exports are slow
**Solution**: Use `exportCompressed()` for files > 1MB

### Issue: Custom date range not working
**Solution**: Ensure dates are in correct format: `YYYY-MM-DDTHH:mm`

---

## 🚀 Roadmap / Future Enhancements

- [ ] **Scheduled Exports** - Cron-like scheduling
- [ ] **Email Reports** - Auto-send exports via email
- [ ] **Cloud Storage** - Upload to S3, Google Drive
- [ ] **Template Library** - Pre-configured export templates
- [ ] **Real-time Streaming Export** - Export as data updates
- [ ] **Advanced Filtering** - Multi-field filter UI
- [ ] **Export Presets** - Save favorite export configurations
- [ ] **Collaborative Exports** - Share exports with team
- [ ] **Data Transformation** - Apply functions before export
- [ ] **Excel Charts** - Include charts in Excel files

---

## 📞 Support

For issues or questions about exports:
1. Check console for error messages
2. Verify data format matches expected structure
3. Ensure optional libraries are installed for advanced features
4. Review export history for previous successful exports

---

## ✅ Quick Checklist

- [x] ExportManager component created
- [x] Integrated in AnalyticsDashboard
- [x] Export utilities library created
- [x] Time-based filtering implemented
- [x] Multiple format support (CSV, JSON, Excel, PDF, PNG, SVG)
- [x] Export history tracking
- [x] Custom date range picker
- [x] Export options (graphs, data)
- [x] Mock data generation
- [x] Fallback methods for missing libraries
- [x] Responsive design
- [x] TypeScript support
- [x] Comprehensive documentation

---

**All export features are now ready to use!** 🎉

The ExportManager is integrated into your Analytics Dashboard and provides powerful time-based export capabilities with multiple format options.
