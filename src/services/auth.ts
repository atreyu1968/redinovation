import { ADMIN_CREDENTIALS } from '../config/constants';
import type { User } from '../types/user';
import type { LoginCredentials, RegistrationData } from '../types/auth';
import { db } from '../config/database';
import { useRegistrationCodesStore } from '../stores/registrationCodesStore';

export const authenticateUser = async (credentials: LoginCredentials): Promise<User | null> => {
  try {
    // For demo purposes, check against default admin credentials
    if (credentials.email === ADMIN_CREDENTIALS.email && 
        credentials.password === ADMIN_CREDENTIALS.password) {
      const adminUser = {
        id: 'admin-001',
        name: ADMIN_CREDENTIALS.name,
        lastName: ADMIN_CREDENTIALS.lastName,
        email: ADMIN_CREDENTIALS.email,
        medusaCode: 'ADMIN2024',
        role: ADMIN_CREDENTIALS.role,
        passwordChangeRequired: false,
      };
      
      // Store admin user in IndexedDB
      await db.put('users', adminUser);
      
      return adminUser;
    }
    
    // Check IndexedDB for user
    const users = await db.getAll('users');
    const user = users.find(u => u.email === credentials.email);
    
    if (user && user.medusaCode === credentials.password) {
      return user;
    }
    
    return null;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
};

export const registerUser = async (data: RegistrationData): Promise<User | null> => {
  try {
    // Mock registration for demo
    return {
      id: `user-${Date.now()}`,
      name: data.name,
      lastName: data.lastName,
      email: data.email,
      medusaCode: data.medusaCode,
      phone: data.phone,
      center: data.center,
      network: '',
      role: 'manager',
      passwordChangeRequired: true,
    };
  } catch (error) {
    console.error('Registration error:', error);
    return null;
  }
};

export const getRecoveryCode = async (email: string): Promise<string | null> => {
  // Mock implementation
  return '123456';
};

export const verifyRecoveryCode = async (email: string, code: string): Promise<boolean> => {
  // Mock implementation
  return code === '123456';
};

export const resetPassword = async (email: string, code: string, newPassword: string): Promise<boolean> => {
  // Mock implementation
  return true;
};

export const validateRegistrationCode = async (code: string) => {
  try {
    const store = useRegistrationCodesStore.getState();
    if (!store) {
      console.error('Registration code store not initialized');
      return { valid: false };
    }
    
    const result = store.validateCode(code);
    
    if (result.valid) {
      const used = store.useCode(code);
      if (!used) {
        return { valid: false };
      }
    }
    
    return result;
  } catch (error) {
    console.error('Error validating registration code:', error);
    return { valid: false };
  }
};