import { openDB, type DBSchema } from 'idb';
import type { Network, Center, ProfessionalFamily, Department } from '../types/masterRecords';
import type { AcademicYear } from '../types/academicYear';
import { mockNetworks, mockCenters, mockFamilies, mockDepartments, mockObjectives } from '../data/mockMasterRecords';
import { mockODS } from '../data/mockODS';
import { mockCenterObjectives } from '../data/mockCenterObjectives';
import { mockAcademicYears } from '../data/mockAcademicYears';

// Database schema type
interface InnovationDB extends DBSchema {
  academic_years: {
    key: string;
    value: AcademicYear;
  };
  networks: {
    key: string;
    value: Network;
    indexes: { 'by-code': string };
  };
  centers: {
    key: string;
    value: Center;
    indexes: { 'by-network': string };
  };
  families: {
    key: string;
    value: ProfessionalFamily;
  };
  departments: {
    key: string;
    value: Department;
  };
  network_objectives: {
    key: string;
    value: NetworkObjective;
  };
  center_objectives: {
    key: string;
    value: NetworkObjective;
  };
  ods: {
    key: string;
    value: NetworkObjective;
  };
  users: {
    key: string;
    value: {
      id: string;
      name: string;
      lastName: string;
      email: string;
      role: string;
      // Add other user fields as needed
    };
    indexes: { 'by-email': string };
  };
  actions: {
    key: string;
    value: {
      id: string;
      name: string;
      description: string;
      // Add other action fields as needed
    };
    indexes: { 'by-network': string; 'by-center': string };
  };
}

const DB_NAME = 'innovation-network';
const DB_VERSION = 1;

let dbPromise: ReturnType<typeof openDB> | null = null;

export const db = {
  async initialize() {
    try {
      if (dbPromise) return await dbPromise;

      dbPromise = openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
          // Create academic years store
          if (!db.objectStoreNames.contains('academic_years')) {
            const academicYearStore = db.createObjectStore('academic_years', { keyPath: 'id' });
            // Add mock data
            mockAcademicYears.forEach(year => academicYearStore.add(year));
          }

          // Create master records stores
          if (!db.objectStoreNames.contains('networks')) {
            const networkStore = db.createObjectStore('networks', { keyPath: 'id' });
            // Add mock data
            networkStore.createIndex('by-code', 'code', { unique: true });
            mockNetworks.forEach(network => networkStore.add(network));
          }
          if (!db.objectStoreNames.contains('centers')) {
            const centerStore = db.createObjectStore('centers', { keyPath: 'id' });
            mockCenters.forEach(center => centerStore.add(center));
          }
          if (!db.objectStoreNames.contains('families')) {
            const familyStore = db.createObjectStore('families', { keyPath: 'id' });
            mockFamilies.forEach(family => familyStore.add(family));
          }
          if (!db.objectStoreNames.contains('departments')) {
            const departmentStore = db.createObjectStore('departments', { keyPath: 'id' });
            mockDepartments.forEach(department => departmentStore.add(department));
          }
          
          // Create objectives stores
          if (!db.objectStoreNames.contains('network_objectives')) {
            const networkObjectiveStore = db.createObjectStore('network_objectives', { keyPath: 'id' });
            mockObjectives.forEach(objective => networkObjectiveStore.add(objective));
          }
          
          if (!db.objectStoreNames.contains('center_objectives')) {
            const centerObjectiveStore = db.createObjectStore('center_objectives', { keyPath: 'id' });
            mockCenterObjectives.forEach(objective => centerObjectiveStore.add(objective));
          }
          
          if (!db.objectStoreNames.contains('ods')) {
            const odsStore = db.createObjectStore('ods', { keyPath: 'id' });
            mockODS.forEach(ods => odsStore.add(ods));
          }

          // Create users store
          if (!db.objectStoreNames.contains('users')) {
            const userStore = db.createObjectStore('users', { keyPath: 'id' });
            userStore.createIndex('by-email', 'email', { unique: true });
          }

          // Create actions store
          if (!db.objectStoreNames.contains('actions')) {
            const actionStore = db.createObjectStore('actions', { keyPath: 'id' });
            actionStore.createIndex('by-network', 'network');
            actionStore.createIndex('by-center', 'center');
          }
        },
      });
      
      return dbPromise;
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  },
  
  async close() {
    if (dbPromise) {
      const db = await dbPromise;
      db.close();
      dbPromise = null;
    }
  },

  async get(storeName: keyof InnovationDB, key: string) {
    const db = await this.initialize();
    return db.get(storeName, key);
  },

  async getAll(storeName: keyof InnovationDB) {
    const db = await this.initialize();
    return db.getAll(storeName);
  },

  async add(storeName: keyof InnovationDB, value: any) {
    const db = await this.initialize();
    return db.add(storeName, value);
  },

  async put(storeName: keyof InnovationDB, value: any) {
    const db = await this.initialize();
    return db.put(storeName, value);
  },

  async delete(storeName: keyof InnovationDB, key: string) {
    const db = await this.initialize();
    return db.delete(storeName, key);
  },

  async clear(storeName: keyof InnovationDB) {
    const db = await this.initialize();
    return db.clear(storeName);
  },

  async getByIndex(storeName: keyof InnovationDB, indexName: string, key: any) {
    const db = await this.initialize();
    return db.getAllFromIndex(storeName, indexName, key);
  },
};