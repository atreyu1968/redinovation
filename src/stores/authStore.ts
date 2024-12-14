import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { db } from '../config/database';
import type { User } from '../types/user';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  resetUserPassword: (userId: string) => Promise<boolean>;
  updateUserPassword: (newPassword: string) => Promise<boolean>;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: (user) => {
        set({ user, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      resetUserPassword: async (userId) => {
        try {
          const user = await db.get('users', userId);
          if (!user) return false;
          
          // Reset to medusaCode
          await db.put('users', { ...user, passwordChangeRequired: true });
          return true;
        } catch (error) {
          console.error('Error resetting password:', error);
          return false;
        }
      },

      updateUserPassword: async (newPassword) => {
        try {
          const { user } = useAuthStore.getState();
          if (!user) return false;
          
          await db.put('users', { 
            ...user, 
            passwordChangeRequired: false 
          });
          return true;
        } catch (error) {
          console.error('Error updating password:', error);
          return false;
        }
      },
    }),
    {
      name: 'auth-storage',
      skipHydration: false,
      onRehydrateStorage: () => (state) => {
        // Re-initialize database if user is logged in
        if (state?.isAuthenticated) {
          db.initialize().catch(console.error);
        }
      },
    }
  )
);