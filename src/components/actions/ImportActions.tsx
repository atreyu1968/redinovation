import React, { useRef, useState } from 'react';
import { X, Download, Upload, AlertCircle } from 'lucide-react';
import { importFromExcel, exportToExcel } from '../../utils/excelUtils';
import type { Action } from '../../types/action';

interface ImportActionsProps {
  onImport: (actions: Omit<Action, 'id' | 'createdAt' | 'updatedAt'>[]) => void;
  onClose: () => void;
}

const ImportActions: React.FC<ImportActionsProps> = ({ onImport, onClose }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setError(null);

    try {
      const data = await importFromExcel(file);
      onImport(data);
      onClose();
    } catch (error) {
      console.error('Error importing file:', error);
      setError(error instanceof Error ? error.message : 'Error al importar el archivo');
    } finally {
      setImporting(false);
    }
  };

  const handleDownloadTemplate = async () => {
    const template = [{
      name: 'Nombre de la acción',
      location: 'Ubicación',
      description: 'Descripción detallada',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      departments: 'DEP1,DEP2',
      studentParticipants: 20,
      teacherParticipants: 2,
      rating: 5,
      comments: 'Comentarios opcionales'
    }];

    try {
      await exportToExcel(template, 'plantilla_acciones');
    } catch (error) {
      setError('Error al descargar la plantilla');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Importar Acciones</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex justify-between mb-6">
            <button
              onClick={handleDownloadTemplate}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
            >
              <Download className="w-5 h-5" />
              <span>Descargar Plantilla</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={importing}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Upload className="w-5 h-5" />
              <span>{importing ? 'Importando...' : 'Seleccionar Archivo'}</span>
            </button>
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          <div className="mt-4 text-sm text-gray-500">
            <p>Formatos soportados:</p>
            <ul className="list-disc list-inside mt-1">
              <li>Excel (.xlsx, .xls)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportActions;