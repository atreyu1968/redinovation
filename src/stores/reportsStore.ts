import { create } from 'zustand';
import type { Action } from '../types/action';
import { db } from '../config/database';

interface ReportStats {
  totalActions: number;
  totalStudents: number;
  totalTeachers: number;
  averageRating: number;
  byNetwork: Record<string, { count: number; students: number; teachers: number }>;
  byCenter: Record<string, { count: number; students: number; teachers: number }>;
  byDepartment: Record<string, { count: number; students: number; teachers: number }>;
  byObjective: Record<string, { count: number; students: number; teachers: number }>;
}

interface ReportsState {
  actions: Action[];
  stats: ReportStats | null;
  loading: boolean;
  error: string | null;
  
  fetchReport: (filters?: Record<string, string>) => Promise<void>;
  exportToExcel: (actions: Action[], filename: string) => Promise<boolean>;
}

export const useReportsStore = create<ReportsState>((set) => ({
  actions: [],
  stats: null,
  loading: false,
  error: null,

  fetchReport: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      // Initialize database if needed
      await db.initialize();
      
      // Get actions from IndexedDB
      const actions = await db.getAll('actions');
      
      // Filter actions based on criteria
      const filteredActions = actions.filter(action => {
        const start = new Date(action.startDate);
        const end = new Date(action.endDate);
        const filterStart = filters.startDate ? new Date(filters.startDate) : null;
        const filterEnd = filters.endDate ? new Date(filters.endDate) : null;
        
        if (filterStart && start < filterStart) return false;
        if (filterEnd && end > filterEnd) return false;
        if (filters.network && action.network !== filters.network) return false;
        if (filters.center && action.center !== filters.center) return false;
        if (filters.quarter && action.quarter !== filters.quarter) return false;
        if (filters.objectives?.length && !action.objectives.some(obj => filters.objectives?.includes(obj))) return false;
        return true;
      });

      // Calculate statistics
      const stats: ReportStats = {
        totalActions: filteredActions.length,
        totalStudents: filteredActions.reduce((sum, a) => sum + a.studentParticipants, 0),
        totalTeachers: filteredActions.reduce((sum, a) => sum + a.teacherParticipants, 0),
        averageRating: filteredActions.reduce((sum, a) => sum + a.rating, 0) / filteredActions.length || 0,
        byNetwork: {},
        byCenter: {},
        byDepartment: {},
        byObjective: {},
      };

      // Group by network
      filteredActions.forEach(action => {
        if (!stats.byNetwork[action.network]) {
          stats.byNetwork[action.network] = { count: 0, students: 0, teachers: 0 };
        }
        stats.byNetwork[action.network].count++;
        stats.byNetwork[action.network].students += action.studentParticipants;
        stats.byNetwork[action.network].teachers += action.teacherParticipants;
      });

      // Group by center
      filteredActions.forEach(action => {
        if (!stats.byCenter[action.center]) {
          stats.byCenter[action.center] = { count: 0, students: 0, teachers: 0 };
        }
        stats.byCenter[action.center].count++;
        stats.byCenter[action.center].students += action.studentParticipants;
        stats.byCenter[action.center].teachers += action.teacherParticipants;
      });

      // Group by department
      filteredActions.forEach(action => {
        action.departments.forEach(dept => {
          if (!stats.byDepartment[dept]) {
            stats.byDepartment[dept] = { count: 0, students: 0, teachers: 0 };
          }
          stats.byDepartment[dept].count++;
          stats.byDepartment[dept].students += action.studentParticipants;
          stats.byDepartment[dept].teachers += action.teacherParticipants;
        });
      });

      // Group by objective
      filteredActions.forEach(action => {
        action.objectives.forEach(obj => {
          if (!stats.byObjective[obj]) {
            stats.byObjective[obj] = { count: 0, students: 0, teachers: 0 };
          }
          stats.byObjective[obj].count++;
          stats.byObjective[obj].students += action.studentParticipants;
          stats.byObjective[obj].teachers += action.teacherParticipants;
        });
      });

      set({ actions: filteredActions, stats, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error fetching report',
        loading: false 
      });
      // Return empty data on error
      set({ actions: [], stats: null });
    }
  },

  exportToExcel: async (actions: Action[], filename: string) => {
    try {
      // Format data for Excel
      const data = actions.map(action => ({
        'Nombre': action.name,
        'Ubicación': action.location,
        'Fecha Inicio': action.startDate,
        'Fecha Fin': action.endDate,
        'Red': action.network,
        'Centro': action.center,
        'Estudiantes': action.studentParticipants,
        'Profesores': action.teacherParticipants,
        'Valoración': action.rating,
        'Departamentos': action.departments.join(', '),
        'Familias Profesionales': action.professionalFamilies.join(', '),
        'Objetivos': action.objectives.join(', '),
      }));

      // Create CSV content
      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map(row => 
          headers.map(header => {
            const value = row[header as keyof typeof row];
            return typeof value === 'string' && value.includes(',') 
              ? `"${value}"`
              : value;
          }).join(',')
        )
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      return false;
    }
  },
}));