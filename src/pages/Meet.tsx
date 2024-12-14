import React from 'react';
import { Video } from 'lucide-react';

const Meet = () => {
  return (
    <div className="max-w-7xl mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Videoconferencias
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow flex flex-col items-center justify-center p-12">
        <div className="p-4 bg-purple-100 rounded-full mb-4">
          <Video className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-xl font-medium text-gray-900 mb-2">
          Videoconferencias en Desarrollo
        </h2>
        <p className="text-gray-500 text-center max-w-md">
          El módulo de videoconferencias está actualmente en desarrollo. Pronto podrás realizar reuniones virtuales con otros miembros de la red.
        </p>
      </div>
    </div>
  );
};

export default Meet;