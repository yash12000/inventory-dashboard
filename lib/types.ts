export interface InventoryItem {
  date: string;
  itemId: string;
  itemName: string;
  category: string;
  abcClass: string;
  openingStock: number;
  closingStock: number;
  minimumStockLevel: number;
  consumption: number;
  incoming?: number;
  unitPrice?: number;
  units?: string;
  inventoryTurnoverRatio?: number;
}

export interface InventoryData {
  Inventory_Data: Array<{
    Date: string;
    'Item ID': string;
    'Item Name': string;
    Category: string;
    'ABC Class': string;
    'Opening Stock': number;
    'Closing Stock': number;
    Consumption: number;
    Incoming: number;
    MSL: number;
    'Unit Price': number;
    Units: string;
    'Inventory Turnover ratio': number;
  }>;
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
