import { create } from 'zustand';
import type { Action } from '../types/action';

interface ActionsState {
  actions: Action[];
  loading: boolean;
  error: string | null;
  
  fetchActions: (filters?: Record<string, string>) => Promise<void>;
  addAction: (action: Omit<Action, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateAction: (id: string, action: Partial<Action>) => Promise<void>;
  deleteAction: (id: string) => Promise<void>;
}

export const useActionsStore = create<ActionsState>((set, get) => ({
  actions: [],
  loading: false,
  error: null,

  fetchActions: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const queryParams = new URLSearchParams(filters);
      const response = await fetch(`/api/actions?${queryParams}`);
      if (!response.ok) throw new Error('Error fetching actions');
      const actions = await response.json();
      set({ actions, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error fetching actions', loading: false });
    }
  },

  addAction: async (actionData) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(actionData),
      });

      if (!response.ok) throw new Error('Error creating action');
      
      // Refresh actions
      get().fetchActions();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error creating action', loading: false });
      throw error;
    }
  },

  updateAction: async (id, actionData) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/actions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(actionData),
      });

      if (!response.ok) throw new Error('Error updating action');
      
      // Refresh actions
      get().fetchActions();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error updating action', loading: false });
      throw error;
    }
  },

  deleteAction: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/actions/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error deleting action');
      
      // Refresh actions
      get().fetchActions();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error deleting action', loading: false });
      throw error;
    }
  },
}));