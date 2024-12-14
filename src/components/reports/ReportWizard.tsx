import React, { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { Card } from '@tremor/react';
import { FileSpreadsheet, BarChart2, Table, Download } from 'lucide-react';
import ErrorBoundary from '../common/ErrorBoundary';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';
import NoDataMessage from '../common/NoDataMessage';
import ReportFilters from './ReportFilters';
import ReportCharts from './ReportCharts';
import ReportDataTable from './ReportDataTable';
import type { ReportFilters as FilterType } from '../../types/report';

type WizardStep = 'type' | 'filters' | 'preview' | 'charts' | 'export';

const ReportWizard = () => {
  const { user } = useAuthStore();
  const [currentStep, setCurrentStep] = useState<WizardStep>('type');
  const [reportConfig, setReportConfig] = useState({
    type: '',
    filters: {} as FilterType,
    format: 'excel'
  });

  const steps = [
    { id: 'type', title: 'Tipo', description: 'Selecciona el tipo de informe', icon: FileSpreadsheet },
    { id: 'filters', title: 'Filtros', description: 'Configura los filtros', icon: Table },
    { id: 'charts', title: 'Gráficos', description: 'Visualiza los datos', icon: BarChart2 },
    { id: 'export', title: 'Exportar', description: 'Exporta el informe', icon: Download }
  ];

  const handleNext = () => {
    const stepIndex = steps.findIndex(s => s.id === currentStep);
    if (stepIndex < steps.length - 1) {
      setCurrentStep(steps[stepIndex + 1].id as WizardStep);
    }
  };

  const handleBack = () => {
    const stepIndex = steps.findIndex(s => s.id === currentStep);
    if (stepIndex > 0) {
      setCurrentStep(steps[stepIndex - 1].id as WizardStep);
    }
  };

  return (
    <Card className="p-0">
      {/* Progress Steps */}
      <ErrorBoundary>
        <div className="p-6 border-b">
        <div className="flex justify-between">
          {steps.map((step, idx) => (
            <div key={step.id} className="flex flex-col items-center">
              <div className={`
                relative flex items-center justify-center w-10 h-10 rounded-full
                ${currentStep === step.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}
              `}>
                <step.icon className="w-5 h-5" />
                {idx < steps.length - 1 && (
                  <div className={`
                    absolute left-full w-full h-0.5 -translate-y-1/2 top-1/2
                    ${idx < steps.findIndex(s => s.id === currentStep) ? 'bg-blue-600' : 'bg-gray-200'}
                  `} />
                )}
              </div>
              <div className="mt-2 text-sm font-medium text-gray-700">{step.title}</div>
              <div className="text-xs text-gray-500">{step.description}</div>
            </div>
          ))}
        </div>
        </div>
      </ErrorBoundary>

      {/* Content */}
      <div className="p-6">
        <ErrorBoundary>
          {currentStep === 'type' && (
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => {
                setReportConfig(prev => ({ ...prev, type: 'general' }));
                handleNext();
              }}
              className="p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50 text-left"
            >
              <FileSpreadsheet className="w-8 h-8 text-blue-600 mb-2" />
              <h3 className="font-medium">Informe General</h3>
              <p className="text-sm text-gray-500">Resumen completo de todas las acciones</p>
            </button>

            <button
              onClick={() => {
                setReportConfig(prev => ({ ...prev, type: 'network' }));
                handleNext();
              }}
              className="p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50 text-left"
            >
              <BarChart2 className="w-8 h-8 text-blue-600 mb-2" />
              <h3 className="font-medium">Informe por Red</h3>
              <p className="text-sm text-gray-500">Análisis detallado por red</p>
            </button>
          </div>
          )}

          {currentStep === 'filters' && (
          <ReportFilters
            filters={reportConfig.filters}
            onFiltersChange={(filters) => setReportConfig(prev => ({ ...prev, filters }))}
          />
          )}

          {currentStep === 'charts' && (
          <ReportCharts actions={[]} />
          )}

          {currentStep === 'export' && (
          <div className="space-y-4">
            <h3 className="font-medium">Formato de Exportación</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setReportConfig(prev => ({ ...prev, format: 'excel' }))}
                className={`p-4 border rounded-lg text-left ${
                  reportConfig.format === 'excel' ? 'border-blue-500 ring-2 ring-blue-500' : ''
                }`}
              >
                <FileSpreadsheet className="w-6 h-6 text-blue-600 mb-2" />
                <h4 className="font-medium">Excel</h4>
                <p className="text-sm text-gray-500">Exportar a Microsoft Excel</p>
              </button>

              <button
                onClick={() => setReportConfig(prev => ({ ...prev, format: 'pdf' }))}
                className={`p-4 border rounded-lg text-left ${
                  reportConfig.format === 'pdf' ? 'border-blue-500 ring-2 ring-blue-500' : ''
                }`}
              >
                <Download className="w-6 h-6 text-blue-600 mb-2" />
                <h4 className="font-medium">PDF</h4>
                <p className="text-sm text-gray-500">Exportar a PDF con gráficos</p>
              </button>
            </div>
          </div>
          )}
        </ErrorBoundary>
      </div>

      {/* Navigation */}
      <div className="p-6 bg-gray-50 border-t flex justify-between">
        <button
          onClick={handleBack}
          disabled={currentStep === 'type'}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          Anterior
        </button>
        <button
          onClick={handleNext}
          disabled={currentStep === 'export'}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {currentStep === 'export' ? 'Finalizar' : 'Siguiente'}
        </button>
      </div>
    </Card>
  );
};

export default ReportWizard;