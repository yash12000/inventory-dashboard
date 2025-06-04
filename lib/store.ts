import { create } from 'zustand';
import * as XLSX from 'xlsx';

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
}

interface InventoryStore {
  data: InventoryItem[];
  filteredData: InventoryItem[];
  filters: {
    itemName: string;
    abcClass: string;
    dateRange: { from: Date | undefined; to: Date | undefined };
  };
  setData: (data: InventoryItem[]) => void;
  setFilters: (filters: Partial<InventoryStore['filters']>) => void;
  calculateITR: (itemId: string) => number;
}

export const useInventoryStore = create<InventoryStore>((set, get) => ({
  data: [],
  filteredData: [],
  filters: {
    itemName: '',
    abcClass: '',
    dateRange: { from: undefined, to: undefined },
  },
  setData: (data) => {
    set({ data, filteredData: data });
  },
  setFilters: (newFilters) => {
    const { data, filters } = get();
    const updatedFilters = { ...filters, ...newFilters };
    
    let filtered = data;
    
    if (updatedFilters.itemName) {
      filtered = filtered.filter(item => 
        item.itemName.toLowerCase().includes(updatedFilters.itemName.toLowerCase())
      );
    }
    
    if (updatedFilters.abcClass) {
      filtered = filtered.filter(item => item.abcClass === updatedFilters.abcClass);
    }
    
    if (updatedFilters.dateRange.from && updatedFilters.dateRange.to) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= updatedFilters.dateRange.from! && 
               itemDate <= updatedFilters.dateRange.to!;
      });
    }
    
    set({ filters: updatedFilters, filteredData: filtered });
  },
  calculateITR: (itemId: string) => {
    const { data } = get();
    const itemData = data.filter(item => item.itemId === itemId);
    
    if (itemData.length === 0) return 0;
    
    const totalConsumption = itemData.reduce((sum, item) => sum + item.consumption, 0);
    const averageInventory = itemData.reduce((sum, item) => 
      sum + ((item.openingStock + item.closingStock) / 2), 0) / itemData.length;
    
    return averageInventory === 0 ? 0 : totalConsumption / averageInventory;
  },
})); 