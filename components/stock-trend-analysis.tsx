"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import type { InventoryItem } from "@/lib/types"
import { format } from "date-fns"

interface StockTrendAnalysisProps {
  data: InventoryItem[]
}

export function StockTrendAnalysis({ data }: StockTrendAnalysisProps) {
  const trendData = data.reduce(
    (acc, item) => {
      const dateKey = format(new Date(item.date), "MMM dd")
      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: dateKey,
          closingStock: 0,
          msl: 0,
          count: 0,
          belowMSL: 0,
          aboveMSL: 0,
        }
      }
      acc[dateKey].closingStock += item.closingStock
      acc[dateKey].msl += item.msl
      acc[dateKey].count += 1

      if (item.closingStock < item.msl) {
        acc[dateKey].belowMSL += 1
      } else if (item.closingStock > item.msl * 1.5) {
        acc[dateKey].aboveMSL += 1
      }

      return acc
    },
    {} as Record<string, any>,
  )

  const chartData = Object.values(trendData)
    .map((item) => ({
      ...item,
      avgClosingStock: Math.round(item.closingStock / item.count),
      avgMSL: Math.round(item.msl / item.count),
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock vs MSL Trend Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="avgClosingStock"
                stroke="#8884d8"
                strokeWidth={2}
                name="Avg Closing Stock"
              />
              <Line
                type="monotone"
                dataKey="avgMSL"
                stroke="#ff7300"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Avg MSL"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {chartData.reduce((sum, item) => sum + item.belowMSL, 0)}
            </div>
            <div className="text-muted-foreground">Items Below MSL</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {chartData.reduce((sum, item) => sum + (item.count - item.belowMSL - item.aboveMSL), 0)}
            </div>
            <div className="text-muted-foreground">Items Within Range</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {chartData.reduce((sum, item) => sum + item.aboveMSL, 0)}
            </div>
            <div className="text-muted-foreground">Items Above 150% MSL</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
