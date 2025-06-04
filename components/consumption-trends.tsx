"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import type { InventoryItem } from "@/lib/types"
import { format } from "date-fns"

interface ConsumptionTrendsProps {
  data: InventoryItem[]
}

export function ConsumptionTrends({ data }: ConsumptionTrendsProps) {
  const monthlyData = data.reduce(
    (acc, item) => {
      const monthKey = format(new Date(item.date), "MMM yyyy")
      if (!acc[monthKey]) {
        acc[monthKey] = {
          month: monthKey,
          totalConsumption: 0,
          itemCount: 0,
          categories: new Set(),
        }
      }
      acc[monthKey].totalConsumption += item.consumption
      acc[monthKey].itemCount += 1
      acc[monthKey].categories.add(item.category)
      return acc
    },
    {} as Record<string, any>,
  )

  const chartData = Object.values(monthlyData)
    .map((item) => ({
      month: item.month,
      consumption: item.totalConsumption,
      avgConsumption: Math.round(item.totalConsumption / item.itemCount),
      categories: item.categories.size,
    }))
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())

  const totalConsumption = chartData.reduce((sum, item) => sum + item.consumption, 0)
  const avgMonthlyConsumption = Math.round(totalConsumption / chartData.length)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Consumption Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{totalConsumption.toLocaleString()}</div>
            <div className="text-muted-foreground">Total Consumption</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{avgMonthlyConsumption.toLocaleString()}</div>
            <div className="text-muted-foreground">Avg Monthly</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{chartData.length}</div>
            <div className="text-muted-foreground">Months Tracked</div>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(value: number, name: string) => [
                  value.toLocaleString(),
                  name === "consumption" ? "Total Consumption" : "Avg Consumption",
                ]}
              />
              <Legend />
              <Bar dataKey="consumption" fill="#8884d8" name="Total Consumption" />
              <Bar dataKey="avgConsumption" fill="#82ca9d" name="Avg Consumption" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
