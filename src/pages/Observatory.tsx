import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useObservatoryStore } from '../stores/observatoryStore';
import ObservatoryList from '../components/observatory/ObservatoryList';
import ObservatoryForm from '../components/observatory/ObservatoryForm';
import type { ObservatoryFormData, ObservatoryItem } from '../types/observatory';

const Observatory = () => {
  const { items, loading, error, addItem, updateItem, deleteItem } = useObservatoryStore();
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ObservatoryItem | null>(null);

  const handleSubmit = async (data: ObservatoryFormData) => {
    if (editingItem) {
      await updateItem(editingItem.id, data);
    } else {
      await addItem(data);
    }
    setShowForm(false);
    setEditingItem(null);
  };

  const handleEdit = (item: ObservatoryItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Está seguro de que desea eliminar este registro?')) {
      await deleteItem(id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Observatorio de Innovación
        </h1>
        <button
          onClick={() => {
            setEditingItem(null);
            setShowForm(true);
          }}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          <span>Nuevo Registro</span>
        </button>
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

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <ObservatoryList
            items={items}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>

      {showForm && (
        <ObservatoryForm
          onSubmit={handleSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
          initialData={editingItem}
        />
      )}
    </div>
  );
};

export default Observatory;