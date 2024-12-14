import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useMasterRecordsStore } from '../stores/masterRecordsStore';
import NetworkList from '../components/master-records/NetworkList';
import CenterList from '../components/master-records/CenterList';
import FamilyList from '../components/master-records/FamilyList';
import DepartmentList from '../components/master-records/DepartmentList';
import NetworkObjectiveList from '../components/master-records/NetworkObjectiveList';
import CenterObjectiveList from '../components/master-records/CenterObjectiveList';
import ODSList from '../components/master-records/ODSList';
import NetworkForm from '../components/master-records/NetworkForm';
import CenterForm from '../components/master-records/CenterForm';
import FamilyForm from '../components/master-records/FamilyForm';
import DepartmentForm from '../components/master-records/DepartmentForm';
import NetworkObjectiveForm from '../components/master-records/NetworkObjectiveForm';
import CenterObjectiveForm from '../components/master-records/CenterObjectiveForm';

type TabType = 'networks' | 'centers' | 'families' | 'departments' | 'network-objectives' | 'center-objectives' | 'ods';

const MasterRecords = () => {
  const { 
    networks, 
    centers, 
    families, 
    departments,
    objectives,
    centerObjectives,
    ods,
    fetchAll 
  } = useMasterRecordsStore();
  const [activeTab, setActiveTab] = useState<TabType>('networks');
  const [showForm, setShowForm] = useState(false);
  const [editingObjective, setEditingObjective] = useState(null);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const tabs = [
    { id: 'networks' as const, label: 'Redes' },
    { id: 'centers' as const, label: 'Centros' },
    { id: 'families' as const, label: 'Familias Profesionales' },
    { id: 'departments' as const, label: 'Departamentos' },
    { id: 'network-objectives' as const, label: 'Objetivos de Red' },
    { id: 'center-objectives' as const, label: 'Objetivos de Centro' },
    { id: 'ods' as const, label: 'ODS' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Registros Maestros
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          <span>Nuevo Registro</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'networks' && (
            <NetworkList networks={networks} />
          )}

          {activeTab === 'centers' && (
            <CenterList centers={centers} />
          )}

          {activeTab === 'families' && (
            <FamilyList families={families} />
          )}

          {activeTab === 'departments' && (
            <DepartmentList departments={departments} />
          )}
          {activeTab === 'network-objectives' && (
            <NetworkObjectiveList 
              objectives={objectives}
              onEdit={(objective) => {
                setEditingObjective(objective);
                setShowForm(true);
              }}
              onDelete={async (id) => {
                if (confirm('¿Está seguro de que desea eliminar este objetivo?')) {
                  await useMasterRecordsStore.getState().deleteObjective(id);
                }
              }}
              onToggleActive={async (id) => {
                await useMasterRecordsStore.getState().toggleObjectiveActive(id);
              }}
            />
          )}
          {activeTab === 'center-objectives' && (
            <CenterObjectiveList 
              objectives={centerObjectives}
              onEdit={(objective) => {
                setEditingObjective(objective);
                setShowForm(true);
              }}
              onDelete={async (id) => {
                if (confirm('¿Está seguro de que desea eliminar este objetivo?')) {
                  await useMasterRecordsStore.getState().deleteCenterObjective(id);
                }
              }}
              onToggleActive={async (id) => {
                await useMasterRecordsStore.getState().toggleCenterObjectiveActive(id);
              }}
            />
          )}
          {activeTab === 'ods' && (
            <ODSList 
              ods={ods}
              onToggleActive={async (id) => {
                await useMasterRecordsStore.getState().toggleODSActive(id);
              }}
            />
          )}
        </div>
      </div>

      {showForm && (
        <>
          {activeTab === 'networks' && (
            <NetworkForm
              onClose={() => setShowForm(false)}
              onSubmit={async (data) => {
                await useMasterRecordsStore.getState().addNetwork(data);
                setShowForm(false);
              }}
            />
          )}

          {activeTab === 'centers' && (
            <CenterForm
              onClose={() => setShowForm(false)}
              onSubmit={async (data) => {
                await useMasterRecordsStore.getState().addCenter(data);
                setShowForm(false);
              }}
            />
          )}

          {activeTab === 'families' && (
            <FamilyForm
              onClose={() => setShowForm(false)}
              onSubmit={async (data) => {
                await useMasterRecordsStore.getState().addFamily(data);
                setShowForm(false);
              }}
            />
          )}

          {activeTab === 'departments' && (
            <DepartmentForm
              onClose={() => setShowForm(false)}
              onSubmit={async (data) => {
                await useMasterRecordsStore.getState().addDepartment(data);
                setShowForm(false);
              }}
            />
          )}
          {activeTab === 'network-objectives' && (
            <NetworkObjectiveForm
              initialData={editingObjective}
              onClose={() => {
                setShowForm(false);
                setEditingObjective(null);
              }}
              onSubmit={async (data) => {
                if (editingObjective) {
                  await useMasterRecordsStore.getState().updateObjective(data);
                } else {
                  await useMasterRecordsStore.getState().addObjective(data);
                }
                setShowForm(false);
                setEditingObjective(null);
              }}
            />
          )}
          {activeTab === 'center-objectives' && (
            <CenterObjectiveForm
              initialData={editingObjective}
              onClose={() => {
                setShowForm(false);
                setEditingObjective(null);
              }}
              onSubmit={async (data) => {
                if (editingObjective) {
                  await useMasterRecordsStore.getState().updateCenterObjective(data);
                } else {
                  await useMasterRecordsStore.getState().addCenterObjective(data);
                }
                setShowForm(false);
                setEditingObjective(null);
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default MasterRecords;