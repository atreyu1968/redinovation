import { create } from 'zustand';
import type { AcademicYear, AcademicYearFormData } from '../types/academicYear';
import { db } from '../config/database';
import { mockAcademicYears } from '../data/mockAcademicYears';

interface AcademicYearState {
  years: AcademicYear[];
  activeYear: AcademicYear | null;
  loading: boolean;
  error: string | null;
  fetchYears: () => Promise<void>;
  addYear: (year: AcademicYearFormData) => Promise<void>;
  updateYear: (id: string, year: AcademicYearFormData) => Promise<void>;
}

export const useAcademicYearStore = create<AcademicYearState>((set, get) => ({
  years: [],
  activeYear: null,
  loading: false,
  error: null,

  fetchYears: async () => {
    set({ loading: true, error: null });
    try {
      // Initialize database first
      await db.initialize();

      // Initialize database first
      await db.initialize();

      // Get data from IndexedDB
      const years = await db.getAll('academic_years');
      
      // If no data in IndexedDB, use mock data
      const data = years.length ? years : mockAcademicYears;
      const activeYear = data.find(year => year.isActive) || null;
      
      set({ years: data, activeYear, loading: false });
    } catch (error) {
      console.error('Error fetching academic years:', error);
      // Fallback to mock data on error
      const data = mockAcademicYears;
      const activeYear = data.find(year => year.isActive) || null;
      
      set({ 
        years: data, 
        activeYear,
        loading: false,
        error: 'Error al cargar los cursos académicos'
      });
    }
  },

  addYear: async (yearData) => {
    set({ loading: true, error: null });
    try {
      // Initialize database first
      await db.initialize();

      const id = Date.now().toString();
      const newYear = { ...yearData, id };
      await db.add('academic_years', newYear);
      
      // Refresh years after adding
      get().fetchYears();
    } catch (error) {
      console.error('Error adding academic year:', error);
      set({ 
        error: 'Error al crear el curso académico',
        loading: false 
      });
      throw error;
    }
  },

  updateYear: async (id, yearData) => {
    set({ loading: true, error: null });
    try {
      // Initialize database first  
      await db.initialize();

      await db.put('academic_years', { ...yearData, id });
      
      // Refresh years after updating
      get().fetchYears();
    } catch (error) {
      console.error('Error updating academic year:', error);
      set({ 
        error: 'Error al actualizar el curso académico',
        loading: false 
      });
      throw error;
    }
  },
}));