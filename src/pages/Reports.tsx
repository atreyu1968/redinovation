import React from 'react';
import ReportWizard from '../components/reports/ReportWizard';

const Reports = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Informes y Estadísticas
        </h1>
      </div>

      <ReportWizard />
    </div>
  );
};

export default Reports;