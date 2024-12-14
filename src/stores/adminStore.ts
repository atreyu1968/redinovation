import { create } from 'zustand';
import type { SystemStatus, SystemConfig } from '../types/admin';

interface AdminState {
  status: SystemStatus | null;
  config: SystemConfig | null;
  loading: boolean;
  error: string | null;
  
  fetchStatus: () => Promise<void>;
  fetchConfig: () => Promise<void>;
  updateConfig: (config: Partial<SystemConfig>) => Promise<void>;
}

export const useAdminStore = create<AdminState>((set) => ({
  status: null,
  config: null,
  loading: false,
  error: null,

  fetchStatus: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/admin/status');
      if (!response.ok) throw new Error('Error fetching system status');
      const status = await response.json();
      set({ status, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error fetching status',
        loading: false 
      });
    }
  },

  fetchConfig: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/admin/config');
      if (!response.ok) throw new Error('Error fetching system config');
      const config = await response.json();
      set({ config, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error fetching config',
        loading: false 
      });
    }
  },

  updateConfig: async (configData) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/admin/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(configData),
      });

      if (!response.ok) throw new Error('Error updating system config');
      
      // Refresh config after update
      const { fetchConfig } = useAdminStore.getState();
      await fetchConfig();
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error updating config',
        loading: false 
      });
      throw error;
    }
  },
}));