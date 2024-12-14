import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, 
  Users, 
  Calendar,
  ClipboardList,
  FileSpreadsheet,
  Settings,
  PlaySquare,
  Telescope,
  Book,
  Users2,
  ChevronDown,
  ChevronRight,
  MessageCircle,
  MessageSquare as MessagesSquare,
  Video,
  FolderGit2
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

const Sidebar = () => {
  const { user } = useAuthStore();
  const [communityOpen, setCommunityOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Calendar, label: 'Cursos Académicos', path: '/academic-years' },
    { icon: ClipboardList, label: 'Registros Maestros', path: '/master-records' },
    { icon: Users, label: 'Usuarios', path: '/users' },
    { icon: PlaySquare, label: 'Acciones', path: '/actions' },
    { icon: FileSpreadsheet, label: 'Informes', path: '/reports' },
    { icon: Telescope, label: 'Observatorio', path: '/observatory' },
    { 
      icon: Users2, 
      label: 'Comunidad', 
      subItems: [
        { label: 'Foro', path: '/forum', icon: MessagesSquare },
        { label: 'Chat', path: '/chat', icon: MessageCircle },
        { label: 'Videoconferencias', path: '/meet', icon: Video },
        { label: 'Espacio Colaborativo', path: '/collaboration', icon: FolderGit2 },
      ]
    },
    { icon: Book, label: 'Documentación', path: '/docs' },
  ];

  // Add admin menu item if user is admin
  if (user?.role === 'admin') {
    menuItems.push({ icon: Settings, label: 'Administración', path: '/admin' });
  }

  return (
    <aside className="bg-gray-800 text-white w-64 flex-shrink-0 flex flex-col h-full">
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path || item.label} className="space-y-1">
              {item.subItems ? (
                <>
                  <button
                    onClick={() => setCommunityOpen(!communityOpen)}
                    className="flex items-center justify-between w-full p-2 text-gray-300 hover:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                    {communityOpen ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  <ul className={`ml-8 space-y-1 ${communityOpen ? 'block' : 'hidden'}`}>
                    {item.subItems.map((subItem) => (
                      <li key={subItem.path}>
                        <NavLink
                          to={subItem.path}
                          className={({ isActive }) =>
                            `flex items-center space-x-2 px-3 py-1.5 text-sm rounded transition-colors ${
                              isActive
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700'
                            }`
                          }
                        >
                          <subItem.icon className="w-4 h-4" />
                          <span>
                          {subItem.label}
                          </span>
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;