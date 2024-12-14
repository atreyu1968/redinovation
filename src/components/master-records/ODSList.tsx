import React from 'react';
import { Globe, ToggleLeft, ToggleRight } from 'lucide-react';
import type { NetworkObjective } from '../../types/masterRecords';

interface ODSListProps {
  ods: NetworkObjective[];
  onToggleActive: (id: string) => void;
}

const ODSList: React.FC<ODSListProps> = ({ ods, onToggleActive }) => {
  return (
    <div className="space-y-4">
      {ods.map((objective) => (
        <div key={objective.id} className="bg-white border rounded-lg shadow-sm hover:shadow transition-shadow">
          <div className="grid grid-cols-12 gap-4 p-4">
            <div className="col-span-3">
              <div className="font-medium text-gray-900">{objective.name}</div>
              <div className="text-sm text-blue-600 bg-blue-50 inline-block px-2 py-0.5 rounded mt-1">
                {objective.code}
              </div>
            </div>
            
            <div className="col-span-7">
              <div className="text-sm text-gray-600">{objective.description}</div>
            </div>

            <div className="col-span-2 flex items-center justify-end">
              <button
                onClick={() => onToggleActive(objective.id)}
                className={`p-2 rounded-full hover:bg-gray-50 ${
                  objective.isActive ? 'text-green-600' : 'text-gray-400'
                }`}
                title={objective.isActive ? 'Desactivar ODS' : 'Activar ODS'}
              >
                {objective.isActive ? (
                  <ToggleRight className="w-6 h-6" />
                ) : (
                  <ToggleLeft className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ODSList;