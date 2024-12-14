import React from 'react';
import { Download, Filter } from 'lucide-react';
import { useReportsStore } from '../../stores/reportsStore';

const ReportHeader = () => {
  const { actions, exportToExcel } = useReportsStore();

  const handleExport = async () => {
    const timestamp = new Date().toISOString().split('T')[0];
    await exportToExcel(actions, `informe_${timestamp}`);
  };

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-semibold text-gray-900">
        Informes y Estadísticas
      </h1>
      <div className="flex items-center space-x-4">
        <button
          onClick={() => document.getElementById('filters-dialog')?.showModal()}
          className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
        >
          <Filter className="w-5 h-5" />
          <span>Filtros</span>
        </button>
        <button
          onClick={handleExport}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Download className="w-5 h-5" />
          <span>Exportar</span>
        </button>
      </div>
    </div>
  );
};

export default ReportHeader;