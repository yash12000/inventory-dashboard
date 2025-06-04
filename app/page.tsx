"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { CategoryDistribution } from "@/components/category-distribution"
import { StockTrendAnalysis } from "@/components/stock-trend-analysis"
import { ConsumptionTrends } from "@/components/consumption-trends"
import { InventoryTurnover } from "@/components/inventory-turnover"
import { FilterPanel } from "@/components/filter-panel"
import { inventoryData } from "@/lib/mock-data"
import type { FilterState } from "@/lib/types"

export default function Dashboard() {
  const [filters, setFilters] = useState<FilterState>({
    itemName: "",
    abcClass: "",
    category: "",
    dateRange: {
      from: new Date("2024-01-01"),
      to: new Date("2024-12-31"),
    },
  })

  const filteredData = inventoryData.filter((item) => {
    const matchesItemName = !filters.itemName || item.itemName.toLowerCase().includes(filters.itemName.toLowerCase())
    const matchesAbcClass = !filters.abcClass || item.abcClass === filters.abcClass
    const matchesCategory = !filters.category || item.category === filters.category
    const matchesDateRange =
      (!filters.dateRange.from || new Date(item.date) >= filters.dateRange.from) &&
      (!filters.dateRange.to || new Date(item.date) <= filters.dateRange.to)

    return matchesItemName && matchesAbcClass && matchesCategory && matchesDateRange
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl font-bold">Inventory Dashboard</h1>
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
  )
}
