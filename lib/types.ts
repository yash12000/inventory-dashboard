export interface InventoryItem {
  itemId: string
  itemName: string
  category: string
  abcClass: "A" | "B" | "C"
  date: string
  openingStock: number
  closingStock: number
  consumption: number
  incoming: number
  msl: number
  unitPrice: number
  units: string
  inventoryTurnoverRatio: number
}

export interface FilterState {
  itemName: string
  abcClass: string
  category: string
  dateRange: {
    from: Date | undefined
    to: Date | undefined
  }
}
