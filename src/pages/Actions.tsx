import React, { useState, useEffect } from 'react';
import { Plus, Upload, Filter } from 'lucide-react';
import { useActionsStore } from '../stores/actionsStore';
import { useAcademicYearStore } from '../stores/academicYearStore';
import { useAuthStore } from '../stores/authStore';
import ActionList from '../components/actions/ActionList';
import ActionForm from '../components/actions/ActionForm';
import ImportActions from '../components/actions/ImportActions';
import ActionFilters from '../components/actions/ActionFilters';
import type { Action } from '../types/action';

interface ActionFilters {
  network?: string;
  center?: string;
  quarter?: string;
  department?: string;
  family?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

const Actions = () => {
  const { actions, loading, error, fetchActions, addAction, updateAction, deleteAction } = useActionsStore();
  const { activeYear } = useAcademicYearStore();
  const { user } = useAuthStore();
  const [showForm, setShowForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [editingAction, setEditingAction] = useState<Action | null>(null);
  const [filters, setFilters] = useState<ActionFilters>({});

  useEffect(() => {
    fetchActions(filters);
  }, [fetchActions, filters]);

  const handleEdit = (action: Action) => {
    setEditingAction(action);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Está seguro de que desea eliminar esta acción?')) {
      await deleteAction(id);
    }
  };

  const handleSubmit = async (data: Omit<Action, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingAction) {
      await updateAction(editingAction.id, data);
    } else {
      await addAction(data);
    }
    setShowForm(false);
    setEditingAction(null);
  };

  const handleImport = async (actions: Omit<Action, 'id' | 'createdAt' | 'updatedAt'>[]) => {
    for (const action of actions) {
      await addAction(action);
    }
    setShowImport(false);
  };

  const canEditAction = (action: Action) => {
    if (user?.role === 'admin') return true;
    if (!activeYear) return false;

    const quarter = activeYear.quarters.find(q => q.id === action.quarter);
    if (!quarter?.isActive) return false;

    if (user?.role === 'general_coordinator') return true;
    if (user?.role === 'subnet_coordinator' && action.network === user.network) return true;
    return action.createdBy === user?.id;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Acciones</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => (document.getElementById('filters-dialog') as HTMLDialogElement)?.showModal()}
            className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
          >
            <Filter className="w-5 h-5" />
            <span>Filtros</span>
          </button>
          <button
            onClick={() => setShowImport(true)}
            className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
          >
            <Upload className="w-5 h-5" />
            <span>Importar</span>
          </button>
          <button
            onClick={() => {
              setEditingAction(null);
              setShowForm(true);
            }}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            <span>Nueva Acción</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Actions List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <ActionList
            actions={actions}
            onEdit={handleEdit}
            onDelete={handleDelete}
            canEdit={canEditAction}
          />
        </div>
      </div>

      {/* Forms */}
      {showForm && (
        <ActionForm
          onSubmit={handleSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingAction(null);
          }}
          initialData={editingAction}
        />
      )}

      {showImport && (
        <ImportActions
          onImport={handleImport}
          onClose={() => setShowImport(false)}
        />
      )}

      {/* Filters */}
      <ActionFilters
        filters={filters}
        onFiltersChange={setFilters}
      />
    </div>
  );
};

export default Actions;