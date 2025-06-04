"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import { useInventoryStore } from "@/lib/store";
import {
  calculateCategoryDistribution,
  aggregateMonthlyData,
  getStockStatus,
} from "@/lib/utils";
import { FileUpload } from "./FileUpload";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function Dashboard() {
  const { data, filteredData, filters, setFilters } = useInventoryStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categoryDistribution = calculateCategoryDistribution(filteredData);
  const monthlyData = aggregateMonthlyData(filteredData);

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ [key]: value });
  };

  const handleDateRangeChange = (
    from: Date | undefined,
    to: Date | undefined
  ) => {
    setFilters({ dateRange: { from, to } });
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Inventory Dashboard</h1>
        <FileUpload />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          placeholder="Filter by Item Name"
          value={filters.itemName}
          onChange={(e) => handleFilterChange("itemName", e.target.value)}
        />
        <select
          value={filters.abcClass}
          onChange={(e) => handleFilterChange("abcClass", e.target.value)}
          className="rounded-md border border-input bg-transparent px-3 py-1"
        >
          <option value="">All ABC Classes</option>
          <option value="A">Class A</option>
          <option value="B">Class B</option>
          <option value="C">Class C</option>
        </select>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-md border border-input bg-transparent px-3 py-1"
        >
          <option value="all">All Categories</option>
          {Array.from(new Set(data.map((item) => item.category))).map(
            (category) => (
              <option key={category} value={category}>
                {category}
              </option>
            )
          )}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Category Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Stock Level vs MSL</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="closingStock"
                stroke="#8884d8"
                name="Closing Stock"
              />
              <Line
                type="monotone"
                dataKey="minimumStockLevel"
                stroke="#82ca9d"
                name="MSL"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">
            Monthly Consumption Trend
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="totalConsumption"
                stroke="#8884d8"
                name="Consumption"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">
            Inventory Turnover Ratio
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2">Item</th>
                  <th className="px-4 py-2">ITR</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {Array.from(new Set(data.map((item) => item.itemId))).map(
                  (itemId) => {
                    const itr = useInventoryStore
                      .getState()
                      .calculateITR(itemId);
                    const status =
                      itr < 1 ? "Low" : itr > 3 ? "High" : "Normal";
                    return (
                      <tr key={itemId}>
                        <td className="px-4 py-2">
                          {
                            data.find((item) => item.itemId === itemId)
                              ?.itemName
                          }
                        </td>
                        <td className="px-4 py-2">{itr.toFixed(2)}</td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-2 py-1 rounded ${
                              status === "Low"
                                ? "bg-red-100 text-red-800"
                                : status === "High"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
