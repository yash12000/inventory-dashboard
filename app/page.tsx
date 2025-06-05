"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { CategoryDistribution } from "@/components/category-distribution";
import { StockTrendAnalysis } from "@/components/stock-trend-analysis";
import { ConsumptionTrends } from "@/components/consumption-trends";
import { InventoryTurnover } from "@/components/inventory-turnover";
import { FilterPanel } from "@/components/filter-panel";
import { inventoryData } from "@/lib/mock-data";
import type { FilterState } from "@/lib/types";
import { dataStats } from "@/lib/mock-data";

export default function Dashboard() {
  const [filters, setFilters] = useState<FilterState>({
    itemName: "",
    abcClass: "",
    category: "",
    dateRange: {
      from: new Date(dataStats.dateRange.start),
      to: new Date(dataStats.dateRange.end),
    },
  });

  const filteredData = inventoryData.filter((item) => {
    const matchesItemName =
      !filters.itemName ||
      item.itemName.toLowerCase().includes(filters.itemName.toLowerCase());
    const matchesAbcClass =
      !filters.abcClass || item.abcClass === filters.abcClass;
    const matchesCategory =
      !filters.category || item.category === filters.category;
    const matchesDateRange =
      (!filters.dateRange.from ||
        new Date(item.date) >= filters.dateRange.from) &&
      (!filters.dateRange.to || new Date(item.date) <= filters.dateRange.to);

    return (
      matchesItemName && matchesAbcClass && matchesCategory && matchesDateRange
    );
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl font-bold">Inventory Dashboard</h1>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {dataStats.totalItems}
              </div>
              <div className="text-sm text-muted-foreground">Total Items</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {dataStats.totalTransactions}
              </div>
              <div className="text-sm text-muted-foreground">
                Total Transactions
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {dataStats.categories.length}
              </div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {dataStats.consumptionRange.total.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                Total Consumption
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {dataStats.dateRange.start} to {dataStats.dateRange.end}
              </div>
              <div className="text-sm text-muted-foreground">Date Range</div>
            </div>
          </div>
          <FilterPanel filters={filters} onFiltersChange={setFilters} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CategoryDistribution data={filteredData} />
          <StockTrendAnalysis data={filteredData} />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <ConsumptionTrends data={filteredData} />
          <InventoryTurnover data={filteredData} />
        </div>
      </div>
    </DashboardLayout>
  );
}
