import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { useAuthStore } from './stores/authStore';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AcademicYears from './pages/AcademicYears';
import MasterRecords from './pages/MasterRecords';
import Users from './pages/Users';
import Actions from './pages/Actions';
import Reports from './pages/Reports';
import Observatory from './pages/Observatory';
import Forum from './pages/Forum';
import Chat from './pages/Chat';
import Meet from './pages/Meet';
import Collaboration from './pages/Collaboration';
import Docs from './pages/Docs';
import Admin from './pages/Admin';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <Login />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />
        
        {/* Protected Routes */}
        <Route
          element={
            isAuthenticated ? (
              <Layout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/academic-years" element={<AcademicYears />} />
          <Route path="/master-records" element={<MasterRecords />} />
          <Route path="/users" element={<Users />} />
          <Route path="/actions" element={<Actions />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/observatory" element={<Observatory />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/meet" element={<Meet />} />
          <Route path="/collaboration" element={<Collaboration />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/admin" element={<Admin />} />
        </Route>

        {/* Redirect root to dashboard or login */}
        <Route
          path="/"
          element={
            <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;