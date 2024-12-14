import { create } from 'zustand';
import type { ObservatoryItem, ObservatoryFilters, ImportError } from '../types/observatory';

interface ObservatoryState {
  items: ObservatoryItem[];
  filters: ObservatoryFilters;
  loading: boolean;
  error: string | null;
  importErrors: ImportError[];
  
  fetchItems: (filters?: ObservatoryFilters) => Promise<void>;
  addItem: (item: Omit<ObservatoryItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  importItems: (items: any[]) => Promise<void>;
  setFilters: (filters: ObservatoryFilters) => void;
  clearImportErrors: () => void;
}

export const useObservatoryStore = create<ObservatoryState>((set, get) => ({
  items: [],
  filters: {},
  loading: false,
  error: null,
  importErrors: [],

  fetchItems: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });

      const response = await fetch(`/api/observatory?${queryParams}`);
      if (!response.ok) throw new Error('Error fetching observatory items');
      
      const items = await response.json();
      set({ items, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error fetching items',
        loading: false 
      });
    }
  },

  addItem: async (itemData) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/observatory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) throw new Error('Error creating item');
      
      // Refresh items
      get().fetchItems(get().filters);
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error creating item',
        loading: false 
      });
      throw error;
    }
  },

  importItems: async (items) => {
    set({ loading: true, error: null, importErrors: [] });
    try {
      const response = await fetch('/api/observatory/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });

      if (!response.ok) throw new Error('Error importing items');
      
      const result = await response.json();
      if (result.errors?.length) {
        set({ importErrors: result.errors });
      } else {
        // Refresh items
        get().fetchItems(get().filters);
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error importing items',
        loading: false 
      });
      throw error;
    }
  },

  setFilters: (filters) => set({ filters }),
  
  clearImportErrors: () => set({ importErrors: [] }),
}));