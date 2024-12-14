import React, { useState } from 'react';
import { MessageSquare, MessagesSquare, Video, FolderGit2 } from 'lucide-react';
import ForumEmbed from '../components/forum/ForumEmbed';
import CollaborationEmbed from '../components/collaboration/CollaborationEmbed';

type CommunityTab = 'forum' | 'chat' | 'meet' | 'collaboration';

const Community = () => {
  const [activeTab, setActiveTab] = useState<CommunityTab>('forum');

  const tabs = [
    { id: 'forum' as const, label: 'Foro', icon: MessagesSquare },
    { id: 'chat' as const, label: 'Chat', icon: MessageSquare },
    { id: 'meet' as const, label: 'Videoconferencias', icon: Video },
    { id: 'collaboration' as const, label: 'Espacio Colaborativo', icon: FolderGit2 },
  ];

  return (
    <div className="max-w-7xl mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Comunidad
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow">
        {/* Tabs */}
        <div className="border-b">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`
                  flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'forum' && <ForumEmbed />}
          {activeTab === 'chat' && (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <div className="p-4 bg-blue-100 rounded-full mb-4">
                <MessageSquare className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-xl font-medium text-gray-900 mb-2">
                Chat en Desarrollo
              </h2>
              <p className="text-gray-500 text-center max-w-md">
                El módulo de chat está actualmente en desarrollo. Pronto podrás comunicarte en tiempo real con otros miembros de la red.
              </p>
            </div>
          )}
          {activeTab === 'meet' && (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
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
          )}
          {activeTab === 'collaboration' && <CollaborationEmbed />}
        </div>
      </div>
    </div>
  );
};

export default Community;