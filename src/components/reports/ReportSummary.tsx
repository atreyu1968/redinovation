import React from 'react';
import { Card } from '@tremor/react';

interface ReportSummaryProps {
  stats: {
    totalActions: number;
    totalStudents: number;
    totalTeachers: number;
    averageRating: number;
  };
}

const ReportSummary: React.FC<ReportSummaryProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <h3 className="text-sm font-medium text-gray-500">Total Acciones</h3>
        <p className="text-2xl font-semibold mt-2">{stats.totalActions}</p>
      </Card>
      <Card>
        <h3 className="text-sm font-medium text-gray-500">Estudiantes</h3>
        <p className="text-2xl font-semibold mt-2">{stats.totalStudents}</p>
      </Card>
      <Card>
        <h3 className="text-sm font-medium text-gray-500">Profesores</h3>
        <p className="text-2xl font-semibold mt-2">{stats.totalTeachers}</p>
      </Card>
      <Card>
        <h3 className="text-sm font-medium text-gray-500">Valoración Media</h3>
        <p className="text-2xl font-semibold mt-2">
          {stats.averageRating.toFixed(1)}
        </p>
      </Card>
    </div>
  );
};

export default ReportSummary;