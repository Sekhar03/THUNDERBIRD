# ⚡ Export Feature - Quick Start Guide

## 🎯 What You Can Do Now

Export **graphs and data** with **time-based filtering** in **6 different formats**!

---

## 🚀 How to Use (3 Simple Steps)

### Step 1: Open the Export Dialog
Click the **"Export Data"** button in the Analytics Dashboard header.

### Step 2: Choose Your Options
1. **Select Format**: CSV, Excel, JSON, PDF, PNG, or SVG
2. **Select Time Range**: Last hour, day, week, month, or custom dates
3. **Toggle Options**: Include graphs and/or data

### Step 3: Export!
Click **"Export Now"** - File downloads instantly!

---

## 📊 Export Formats at a Glance

| Format | Best For | File Extension |
|--------|----------|----------------|
| **CSV** | Excel, Google Sheets, Data Analysis | `.csv` |
| **Excel** | Microsoft Excel, Reports | `.xls` |
| **JSON** | Developers, APIs, Scripts | `.json` |
| **PDF** | Reports, Documentation, Print | `.pdf` |
| **PNG** | Presentations, Images, Slides | `.png` |
| **SVG** | Vector Graphics, Design | `.svg` |

---

## ⏰ Time Range Options

```
┌─────────────────┬──────────────────────────┐
│ Quick Preset    │ What It Exports          │
├─────────────────┼──────────────────────────┤
│ Last Hour       │ Past 60 minutes          │
│ Last 24 Hours   │ Past day                 │
│ Last 7 Days     │ Past week                │
│ Last 30 Days    │ Past month               │
│ Custom Range    │ Your selected dates      │
└─────────────────┴──────────────────────────┘
```

---

## 💡 Common Use Cases

### 1. Daily Report for Manager
```
Format: PDF
Time Range: Last 24 Hours
Options: ✅ Graphs  ✅ Data
Result: Comprehensive daily report
```

### 2. Data Analysis in Excel
```
Format: CSV
Time Range: Last 7 Days
Options: ❌ Graphs  ✅ Data
Result: Raw data for analysis
```

### 3. Presentation Slide
```
Format: PNG
Time Range: Last Hour
Options: ✅ Graphs  ❌ Data
Result: Chart image for PowerPoint
```

### 4. Developer Integration
```
Format: JSON
Time Range: Custom (specific incident time)
Options: ❌ Graphs  ✅ Data
Result: Structured data for scripts
```

### 5. Monthly Compliance Report
```
Format: PDF
Time Range: Last 30 Days
Options: ✅ Graphs  ✅ Data
Result: Full audit trail
```

---

## 🎨 Visual Workflow

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  📊 Analytics Dashboard                             │
│  ┌────────────────────────────────────────────┐   │
│  │  Real-time Analytics    [Export Data] ↓    │   │
│  └────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
                        ↓ Click
┌─────────────────────────────────────────────────────┐
│                 Export Manager                      │
│ ┌─────────────────────────────────────────────────┐│
│ │ SELECT FORMAT:                                  ││
│ │ [CSV] [Excel] [JSON] [PDF] [PNG] [SVG]        ││
│ │                                                 ││
│ │ SELECT TIME RANGE:                              ││
│ │ [Last Hour] [24h] [7d] [30d] [Custom ▼]       ││
│ │                                                 ││
│ │ OPTIONS:                                        ││
│ │ ☑ Include Graphs    ☑ Include Data            ││
│ │                                                 ││
│ │ SUMMARY:                                        ││
│ │ Format: CSV | Range: Last 24h | Size: ~150 KB  ││
│ │                                                 ││
│ │                     [Export Now]                ││
│ └─────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
                        ↓ Download
              analytics-dashboard.csv
```

---

## ⌨️ Keyboard Shortcuts (Coming Soon)

```
Ctrl+E  - Open Export Dialog
Ctrl+1  - CSV Export
Ctrl+2  - JSON Export
Esc     - Close Dialog
```

---

## 📁 File Naming Convention

Files are automatically named with timestamps:

```
analytics-dashboard_2025-01-25.csv
scenario-normal-operations_2025-01-25.json
performance-chart_2025-01-25.png
```

---

## 🔧 Where to Find It

### Current Integration:
✅ **Analytics Dashboard** - Export button in header

### Coming Soon:
- Scenario Mode - Export scenario results
- AI Threat Detection - Export threat logs
- Satellite Visualization - Export orbital data
- Voice Control - Voice commands for export

---

## 💻 For Developers

### Quick Integration:
```tsx
import ExportManager from '@/components/ExportManager';

<ExportManager 
  data={yourData}
  fileName="your-filename"
/>
```

### Programmatic Export:
```tsx
import { exportToCSV } from '@/lib/exportUtils';

exportToCSV(data, {
  fileName: 'my-export',
  includeTimestamp: true
});
```

---

## 🎯 Tips & Tricks

### Tip 1: Use Custom Range for Investigations
When investigating an incident, select the exact time window:
```
Start: 2025-01-25 14:32
End:   2025-01-25 15:45
```

### Tip 2: Export Multiple Formats
Need both data and images? Export twice:
1. PNG for the chart
2. CSV for the data

### Tip 3: Check Export History
Click the **History** button to see recent exports and their details.

### Tip 4: Data-Only Exports
Uncheck "Include Graphs" for smaller file sizes when you only need data.

### Tip 5: Use Descriptive Filenames
The filename automatically updates based on context!

---

## 🚨 Troubleshooting

### Export button not visible?
✅ Make sure you're viewing the Analytics Dashboard

### Custom date range not working?
✅ Ensure end date is after start date
✅ Use format: YYYY-MM-DD HH:mm

### File not downloading?
✅ Check browser pop-up blocker
✅ Check browser download settings

### Want better PDF quality?
✅ Install optional library: `npm install jspdf`

---

## 📊 Sample Exports

### CSV Example:
```csv
timestamp,performance,security,network
2025-01-25T10:00:00Z,95.2,98.1,87.5
2025-01-25T10:01:00Z,94.8,97.9,88.2
```

### JSON Example:
```json
[
  {
    "timestamp": "2025-01-25T10:00:00Z",
    "performance": 95.2,
    "security": 98.1,
    "network": 87.5
  }
]
```

---

## 🎉 That's It!

You're ready to export graphs and data with time-based filtering!

### Next Steps:
1. Try exporting some data
2. Experiment with different formats
3. Use custom time ranges
4. Check the export history
5. Share your exports with your team!

---

## 📚 More Resources

- **Full Guide**: See `EXPORT_FEATURE_GUIDE.md`
- **Implementation**: See `EXPORT_IMPLEMENTATION_SUMMARY.md`
- **Code Reference**: Check `/lib/exportUtils.ts`

---

**Happy Exporting!** 📊✨
