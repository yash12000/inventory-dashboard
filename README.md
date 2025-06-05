# Inventory Dashboard

A comprehensive full-stack inventory management dashboard built with Next.js, TypeScript, and modern UI components.

## Features

### 📊 Dashboard Components

- **Category-wise Distribution**: Interactive pie chart showing inventory distribution across categories
- **Stock Trend Analysis**: Line chart comparing closing stock vs MSL (Minimum Stock Level) over time
- **Consumption Trends**: Monthly consumption analysis with aggregated data
- **Inventory Turnover Ratio (ITR)**: Calculated using the formula: Total Consumption ÷ Average Inventory

### 🔍 Interactive Filtering

- Filter by Item Name
- Filter by ABC Class
- Filter by Category
- Date Range filtering with calendar picker

### 📈 Key Metrics & Insights

- Items below MSL highlighting (risk indicators)
- Items significantly above MSL (overstock indicators)
- High/Medium/Low turnover classification
- Monthly consumption aggregation
- Average inventory calculations

## Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **UI Components**: shadcn/ui, Radix UI
- **Charts**: Recharts
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yash12000/inventory-dashboard.git
   cd inventory-dashboard
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   ├── category-distribution.tsx
│   ├── consumption-trends.tsx
│   ├── dashboard-layout.tsx
│   ├── filter-panel.tsx
│   ├── inventory-turnover.tsx
│   └── stock-trend-analysis.tsx
├── lib/
│   ├── mock-data.ts
│   ├── types.ts
│   └── utils.ts
└── README.md
```

## Data Structure

The application uses the following data structure for inventory items:

```typescript
interface InventoryItem {
  itemId: string;
  itemName: string;
  category: string;
  abcClass: "A" | "B" | "C";
  date: string;
  openingStock: number;
  closingStock: number;
  consumption: number;
  msl: number;
}
```

## Key Calculations

### Inventory Turnover Ratio (ITR)

ITR = Total Consumption ÷ Average Inventory  
Average Inventory = (Opening Stock + Closing Stock) ÷ 2

### Classification Thresholds

- **High Turnover**: ITR > 6
- **Medium Turnover**: 2 ≤ ITR ≤ 6
- **Low Turnover**: ITR < 2

### Stock Level Indicators

- **Below MSL**: Closing Stock < MSL (Risk)
- **Above 150% MSL**: Closing Stock > 1.5 × MSL (Overstock)

## Features Implementation

### Q1: Category-wise Distribution

- Interactive pie chart with percentage labels
- Color-coded categories
- Item count display for each category
- Responsive design

### Q2: Stock vs MSL Trend Analysis

- Line chart comparing average closing stock vs MSL
- Risk indicators for items below MSL
- Overstock indicators for items above 150% MSL
- Time-series visualization

### Q3: Consumption Trends

- Monthly aggregation of daily consumption data
- Bar chart visualization
- Total and average consumption metrics
- Category and ABC class filtering

### Q4: Inventory Turnover Ratio

- Accurate ITR calculations per item
- Sortable table with multiple columns
- Status indicators (High/Medium/Low)
- Performance metrics summary

## Sample Data

The application includes given sample data with:

- 25 different inventory items
- 5 categories (Electronics, Packaging, Maintenance, Chemicals, Raw Materials)
- ABC classification (A, B, C)
- Daily data points across 2024
- Realistic stock movements and consumption patterns

## License

This project is licensed under the MIT License.
