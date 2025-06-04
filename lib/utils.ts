import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { InventoryItem } from "./store"
import * as XLSX from "xlsx"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateCategoryDistribution(data: InventoryItem[]) {
  const distribution = data.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(distribution).map(([category, count]) => ({
    category,
    count,
  }));
}

export function aggregateMonthlyData(data: InventoryItem[]) {
  const monthlyData = data.reduce((acc, item) => {
    const date = new Date(item.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!acc[monthKey]) {
      acc[monthKey] = {
        month: monthKey,
        totalConsumption: 0,
      };
    }
    
    acc[monthKey].totalConsumption += item.consumption;
    return acc;
  }, {} as Record<string, { month: string; totalConsumption: number }>);

  return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
}

export function getStockStatus(item: InventoryItem) {
  if (item.closingStock <= item.minimumStockLevel) {
    return "Low";
  } else if (item.closingStock > item.minimumStockLevel * 2) {
    return "High";
  }
  return "Normal";
}

export function processExcelData(file: File): Promise<InventoryItem[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const processedData = jsonData.map((row: any) => ({
          date: row.Date?.split(' ')[0] || '',
          itemId: row['Item ID'] || '',
          itemName: row['Item Name'] || '',
          category: row.Category || '',
          abcClass: row['ABC Class'] || '',
          openingStock: Number(row['Opening Stock']) || 0,
          closingStock: Number(row['Closing Stock']) || 0,
          minimumStockLevel: Number(row.MSL) || 0,
          consumption: Number(row.Consumption) || 0,
        }));

        resolve(processedData);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsBinaryString(file);
  });
}
