"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import type { InventoryItem } from "@/lib/types"

interface CategoryDistributionProps {
  data: InventoryItem[]
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

export function CategoryDistribution({ data }: CategoryDistributionProps) {
  const categoryData = data.reduce(
    (acc, item) => {
      const category = item.category
      if (!acc[category]) {
        acc[category] = { name: category, value: 0, count: 0 }
      }
      acc[category].value += item.closingStock
      acc[category].count += 1
      return acc
    },
    {} as Record<string, { name: string; value: number; count: number }>,
  )

  const chartData = Object.values(categoryData)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category-wise Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [value.toLocaleString(), "Total Stock"]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          {chartData.map((category, index) => (
            <div key={category.name} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
              <span>
                {category.name}: {category.count} items
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
