import type { NetworkObjective } from '../types/masterRecords';

export const mockODS: NetworkObjective[] = [
  {
    id: 'ods-1',
    code: 'ODS-01',
    name: 'Fin de la pobreza',
    description: 'Poner fin a la pobreza en todas sus formas en todo el mundo',
    priority: 'high',
    isActive: true,
  },
  {
    id: 'ods-2',
    code: 'ODS-02',
    name: 'Hambre cero',
    description: 'Poner fin al hambre, lograr la seguridad alimentaria y la mejora de la nutrición',
    priority: 'high',
    isActive: true,
  },
  // Add more ODS objectives as needed
];