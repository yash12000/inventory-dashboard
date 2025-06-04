import type { InventoryItem } from "./types"
import inventoryDataJson from "../data/inventory-data.json"

const rawInventoryData = inventoryDataJson.Inventory_Data

export const inventoryData: InventoryItem[] = rawInventoryData.map((item) => ({
  itemId: item["Item ID"],
  itemName: item["Item Name"],
  category: item.Category,
  abcClass: item["ABC Class"] as "A" | "B" | "C",
  date: item.Date.split(" ")[0],
  openingStock: item["Opening Stock"],
  closingStock: item["Closing Stock"],
  consumption: item.Consumption,
  incoming: item.Incoming,
  msl: item.MSL,
  unitPrice: item["Unit Price"],
  units: item.Units,
  inventoryTurnoverRatio: item["Inventory Turnover ratio"],
}))

export const dataStats = {
  totalItems: [...new Set(inventoryData.map((item) => item.itemId))].length,
  totalTransactions: inventoryData.length,
  categories: [...new Set(inventoryData.map((item) => item.category))],
  abcClasses: [...new Set(inventoryData.map((item) => item.abcClass))],
  dateRange: {
    start: inventoryData.reduce((min, item) => (item.date < min ? item.date : min), inventoryData[0]?.date || ""),
    end: inventoryData.reduce((max, item) => (item.date > max ? item.date : max), inventoryData[0]?.date || ""),
  },
  priceRange: {
    min: Math.min(...inventoryData.map((item) => item.unitPrice)),
    max: Math.max(...inventoryData.map((item) => item.unitPrice)),
  },
  mslRange: {
    min: Math.min(...inventoryData.map((item) => item.msl)),
    max: Math.max(...inventoryData.map((item) => item.msl)),
  },
  stockRange: {
    minOpening: Math.min(...inventoryData.map((item) => item.openingStock)),
    maxOpening: Math.max(...inventoryData.map((item) => item.openingStock)),
    minClosing: Math.min(...inventoryData.map((item) => item.closingStock)),
    maxClosing: Math.max(...inventoryData.map((item) => item.closingStock)),
  },
  consumptionRange: {
    min: Math.min(...inventoryData.map((item) => item.consumption)),
    max: Math.max(...inventoryData.map((item) => item.consumption)),
    total: inventoryData.reduce((sum, item) => sum + item.consumption, 0),
  },
}

export const itemMasterDataReference = [
  ...new Set(
    inventoryData.map((item) => ({
      itemId: item.itemId,
      itemName: item.itemName,
      category: item.category,
      abcClass: item.abcClass,
      unitPrice: item.unitPrice,
      msl: item.msl,
      units: item.units,
    })),
  ),
]
