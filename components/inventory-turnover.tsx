"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, TrendingUp, TrendingDown } from "lucide-react";
import type { InventoryItem } from "@/lib/types";
import { useState } from "react";

interface InventoryTurnoverProps {
  data: InventoryItem[];
}

interface ITRData {
  itemId: string;
  itemName: string;
  category: string;
  abcClass: string;
  totalConsumption: number;
  avgInventory: number;
  itr: number;
  status: "High" | "Medium" | "Low";
  unitPrice: number;
  inventoryValue: number;
  consumptionValue: number;
  units: string;
  msl: number;
  avgITRFromData: number;
}

export function InventoryTurnover({ data }: InventoryTurnoverProps) {
  const [sortField, setSortField] = useState<keyof ITRData>("itr");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const itrData = data.reduce((acc, item) => {
    const key = item.itemId;
    if (!acc[key]) {
      acc[key] = {
        itemId: item.itemId,
        itemName: item.itemName,
        category: item.category,
        abcClass: item.abcClass,
        totalConsumption: 0,
        totalOpeningStock: 0,
        totalClosingStock: 0,
        count: 0,
        unitPrice: item.unitPrice,
        units: item.units,
        msl: item.msl,
        totalITRFromData: 0,
      };
    }
    acc[key].totalConsumption += item.consumption;
    acc[key].totalOpeningStock += item.openingStock;
    acc[key].totalClosingStock += item.closingStock;
    acc[key].totalITRFromData += item.inventoryTurnoverRatio;
    acc[key].count += 1;
    return acc;
  }, {} as Record<string, any>);

  const processedData: ITRData[] = Object.values(itrData).map((item) => {
    const avgInventory =
      (item.totalOpeningStock + item.totalClosingStock) / (2 * item.count);
    const itr = avgInventory > 0 ? item.totalConsumption / avgInventory : 0;
    const avgITRFromData = item.totalITRFromData / item.count;
    const inventoryValue = avgInventory * item.unitPrice;
    const consumptionValue = item.totalConsumption * item.unitPrice;

    let status: "High" | "Medium" | "Low" = "Medium";
    if (itr > 0.2) status = "High";
    else if (itr < 0.05) status = "Low";

    return {
      itemId: item.itemId,
      itemName: item.itemName,
      category: item.category,
      abcClass: item.abcClass,
      totalConsumption: item.totalConsumption,
      avgInventory: Math.round(avgInventory),
      itr: Number(itr.toFixed(4)),
      status,
      unitPrice: item.unitPrice,
      inventoryValue: Math.round(inventoryValue),
      consumptionValue: Math.round(consumptionValue),
      units: item.units,
      msl: item.msl,
      avgITRFromData: Number(avgITRFromData.toFixed(4)),
    };
  });

  const sortedData = [...processedData].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    const direction = sortDirection === "asc" ? 1 : -1;

    if (typeof aVal === "string" && typeof bVal === "string") {
      return aVal.localeCompare(bVal) * direction;
    }
    return ((aVal as number) - (bVal as number)) * direction;
  });

  const handleSort = (field: keyof ITRData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "High":
        return "bg-green-100 text-green-800";
      case "Low":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "High":
        return <TrendingUp className="h-3 w-3" />;
      case "Low":
        return <TrendingDown className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const avgITR =
    processedData.reduce((sum, item) => sum + item.itr, 0) /
    processedData.length;
  const highTurnoverCount = processedData.filter(
    (item) => item.status === "High"
  ).length;
  const lowTurnoverCount = processedData.filter(
    (item) => item.status === "Low"
  ).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Turnover Ratio (ITR) Analysis</CardTitle>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {avgITR.toFixed(4)}
            </div>
            <div className="text-muted-foreground">Average ITR</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {highTurnoverCount}
            </div>
            <div className="text-muted-foreground">High Turnover Items</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {lowTurnoverCount}
            </div>
            <div className="text-muted-foreground">Low Turnover Items</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("itemName")}
                  >
                    Item Name <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("category")}
                  >
                    Category <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("abcClass")}
                  >
                    ABC Class <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("totalConsumption")}
                  >
                    Total Consumption <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("avgInventory")}
                  >
                    Avg Inventory <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" onClick={() => handleSort("itr")}>
                    Calculated ITR <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("avgITRFromData")}
                  >
                    Avg ITR (Data) <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" onClick={() => handleSort("msl")}>
                    MSL <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.slice(0, 20).map((item) => (
                <TableRow key={item.itemId}>
                  <TableCell className="font-medium">
                    <div>
                      <div>{item.itemName}</div>
                      <div className="text-xs text-muted-foreground">
                        {item.itemId}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.abcClass}</TableCell>
                  <TableCell className="text-right">
                    {item.totalConsumption.toLocaleString()} {item.units}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.avgInventory.toLocaleString()} {item.units}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {item.itr}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {item.avgITRFromData}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.msl} {item.units}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${getStatusColor(
                        item.status
                      )} flex items-center gap-1`}
                    >
                      {getStatusIcon(item.status)}
                      {item.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {sortedData.length > 20 && (
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Showing top 20 items. Total items: {sortedData.length}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
