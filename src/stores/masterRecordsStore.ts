import { create } from 'zustand';
import type { Network, Center, ProfessionalFamily, Department, NetworkObjective } from '../types/masterRecords';
import { mockNetworks, mockCenters, mockFamilies, mockDepartments, mockObjectives } from '../data/mockMasterRecords';
import { mockNetworkObjectives } from '../data/mockNetworkObjectives';
import { mockODS } from '../data/mockODS';
import { mockCenterObjectives } from '../data/mockCenterObjectives';
import { db } from '../config/database';

interface MasterRecordsState {
  networks: Network[];
  centers: Center[];
  families: ProfessionalFamily[];
  departments: Department[];
  objectives: NetworkObjective[];
  centerObjectives: CenterObjective[];
  ods: NetworkObjective[];
  loading: boolean;
  error: string | null;
  
  fetchAll: () => Promise<void>;
  toggleObjectiveActive: (id: string) => Promise<void>;
  toggleCenterObjectiveActive: (id: string) => Promise<void>;
  toggleODSActive: (id: string) => Promise<void>;
  
  addNetwork: (network: Omit<Network, 'id'>) => Promise<void>;
  addCenter: (center: Omit<Center, 'id'>) => Promise<void>;
  addFamily: (family: Omit<ProfessionalFamily, 'id'>) => Promise<void>;
  addDepartment: (department: Omit<Department, 'id'>) => Promise<void>;
}

export const useMasterRecordsStore = create<MasterRecordsState>((set, get) => ({
  networks: mockNetworks,
  centers: mockCenters,
  families: mockFamilies,
  departments: mockDepartments,
  objectives: mockObjectives,
  centerObjectives: mockCenterObjectives,
  ods: mockODS,
  loading: false,
  error: null,

  toggleObjectiveActive: async (id) => {
    try {
      const objective = get().objectives.find(o => o.id === id);
      if (!objective) return;

      const updated = { ...objective, isActive: !objective.isActive };
      await db.put('network_objectives', updated);
      
      set(state => ({
        objectives: state.objectives.map(o => o.id === id ? updated : o)
      }));
    } catch (error) {
      console.error('Error toggling objective:', error);
    }
  },

  toggleCenterObjectiveActive: async (id) => {
    try {
      const objective = get().centerObjectives.find(o => o.id === id);
      if (!objective) return;

      const updated = { ...objective, isActive: !objective.isActive };
      await db.put('center_objectives', updated);
      
      set(state => ({
        centerObjectives: state.centerObjectives.map(o => o.id === id ? updated : o)
      }));
    } catch (error) {
      console.error('Error toggling center objective:', error);
    }
  },

  toggleODSActive: async (id) => {
    try {
      const objective = get().ods.find(o => o.id === id);
      if (!objective) return;

      const updated = { ...objective, isActive: !objective.isActive };
      await db.put('ods', updated);
      
      set(state => ({
        ods: state.ods.map(o => o.id === id ? updated : o)
      }));
    } catch (error) {
      console.error('Error toggling ODS:', error);
    }
  },

  fetchAll: async () => {
    set({ loading: true, error: null });
    try {
      // Get data from IndexedDB
      const [networks, centers, families, departments, networkObjectives, centerObjectives, ods] = await Promise.all([
        db.getAll('networks'),
        db.getAll('centers'),
        db.getAll('families'),
        db.getAll('departments'),
        db.getAll('network_objectives'),
        db.getAll('center_objectives'),
        db.getAll('ods')
      ]);

      // If no data in IndexedDB, use mock data
      set({
        networks: networks.length ? networks : mockNetworks,
        centers: centers.length ? centers : mockCenters,
        families: families.length ? families : mockFamilies,
        departments: departments.length ? departments : mockDepartments,
        objectives: networkObjectives.length ? networkObjectives : mockObjectives,
        centerObjectives: centerObjectives.length ? centerObjectives : mockCenterObjectives,
        ods: ods.length ? ods : mockODS,
        loading: false
      });
    } catch (error) {
      console.error('Error fetching master records:', error);
      // Fallback to mock data on error
      set({
        networks: mockNetworks,
        centers: mockCenters,
        families: mockFamilies,
        departments: mockDepartments,
        objectives: mockObjectives,
        loading: false,
        error: 'Error al cargar los datos maestros'
      });
    }
  },

  addNetwork: async (network) => {
    try {
      const id = Date.now().toString();
      const newNetwork = { ...network, id };
      await db.add('networks', newNetwork);
      
      // Refresh data
      const { fetchAll } = useMasterRecordsStore.getState();
      await fetchAll();
    } catch (error) {
      console.error('Error adding network:', error);
      throw error;
    }
  },

  addCenter: async (center) => {
    try {
      const id = Date.now().toString();
      const newCenter = { ...center, id };
      await db.add('centers', newCenter);
      
      const { fetchAll } = useMasterRecordsStore.getState();
      await fetchAll();
    } catch (error) {
      console.error('Error adding center:', error);
      throw error;
    }
  },

  addFamily: async (family) => {
    try {
      const id = Date.now().toString();
      const newFamily = { ...family, id };
      await db.add('families', newFamily);
      
      const { fetchAll } = useMasterRecordsStore.getState();
      await fetchAll();
    } catch (error) {
      console.error('Error adding family:', error);
      throw error;
    }
  },

  addDepartment: async (department) => {
    try {
      const id = Date.now().toString();
      const newDepartment = { ...department, id };
      await db.add('departments', newDepartment);
      
      const { fetchAll } = useMasterRecordsStore.getState();
      await fetchAll();
    } catch (error) {
      console.error('Error adding department:', error);
      throw error;
    }
  },
}));