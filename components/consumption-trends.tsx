"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { InventoryItem } from "@/lib/types";
import { format } from "date-fns";

interface ConsumptionTrendsProps {
  data: InventoryItem[];
}

export function ConsumptionTrends({ data }: ConsumptionTrendsProps) {
  const dailyData = data.reduce((acc, item) => {
    const dateKey = item.date;
    if (!acc[dateKey]) {
      acc[dateKey] = {
        date: dateKey,
        totalConsumption: 0,
        totalIncoming: 0,
        itemCount: 0,
        categories: new Set(),
      };
    }
    acc[dateKey].totalConsumption += item.consumption;
    acc[dateKey].totalIncoming += item.incoming;
    acc[dateKey].itemCount += 1;
    acc[dateKey].categories.add(item.category);
    return acc;
  }, {} as Record<string, any>);

  const chartData = Object.values(dailyData)
    .map((item) => ({
      date: format(new Date(item.date), "MMM dd"),
      fullDate: item.date,
      consumption: item.totalConsumption,
      incoming: item.totalIncoming,
      netMovement: item.totalIncoming - item.totalConsumption,
      avgConsumption: Math.round(item.totalConsumption / item.itemCount),
      categories: item.categories.size,
    }))
    .sort(
      (a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime()
    );

  const totalConsumption = chartData.reduce(
    (sum, item) => sum + item.consumption,
    0
  );
  const totalIncoming = chartData.reduce((sum, item) => sum + item.incoming, 0);
  const avgDailyConsumption = Math.round(totalConsumption / chartData.length);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Consumption & Incoming Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 grid grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {totalConsumption.toLocaleString()}
            </div>
            <div className="text-muted-foreground">Total Consumption</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {totalIncoming.toLocaleString()}
            </div>
            <div className="text-muted-foreground">Total Incoming</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {avgDailyConsumption.toLocaleString()}
            </div>
            <div className="text-muted-foreground">Avg Daily Consumption</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {chartData.length}
            </div>
            <div className="text-muted-foreground">Days Tracked</div>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                formatter={(value: number, name: string) => [
                  value.toLocaleString(),
                  name === "consumption"
                    ? "Consumption"
                    : name === "incoming"
                    ? "Incoming"
                    : name === "netMovement"
                    ? "Net Movement"
                    : "Avg Consumption",
                ]}
              />
              <Legend />
              <Bar dataKey="consumption" fill="#ff6b6b" name="Consumption" />
              <Bar dataKey="incoming" fill="#51cf66" name="Incoming" />
              <Bar dataKey="netMovement" fill="#339af0" name="Net Movement" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
