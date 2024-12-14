import React from 'react';
import { useAuthStore } from '../stores/authStore';

const Dashboard = () => {
  const { user } = useAuthStore();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">
          Bienvenido, {user?.name}
        </h2>
        <p className="text-gray-600">
          Panel de control de la Red de Innovación FP
        </p>
      </div>
    </div>
  );
};

export default Dashboard;