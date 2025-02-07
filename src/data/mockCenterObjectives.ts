import type { CenterObjective } from '../types/masterRecords';

export const mockCenterObjectives: CenterObjective[] = [
  {
    id: '1',
    code: 'OBJ-CENTRO-2024-01',
    name: 'Mejora de la empleabilidad',
    description: 'Incrementar la tasa de inserción laboral de los estudiantes',
    priority: 'high',
    isActive: true,
    center: 'CIFP César Manrique',
    category: 'Empleabilidad',
  },
  {
    id: '2',
    code: 'OBJ-CENTRO-2024-02',
    name: 'Transformación digital',
    description: 'Implementar herramientas digitales en todos los módulos',
    priority: 'high',
    isActive: true,
    center: 'CIFP César Manrique',
    category: 'Digitalización',
  },
  // Add more center objectives as needed
];