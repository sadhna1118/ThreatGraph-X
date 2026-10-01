import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { ThreatHunting } from './pages/ThreatHunting';
import { GraphExplorer } from './pages/GraphExplorer';
import { Entities } from './pages/Entities';
import { Alerts } from './pages/Alerts';
import { Investigations } from './pages/Investigations';
import { InvestigationDetail } from './pages/InvestigationDetail';
import { Incidents } from './pages/Incidents';
import { MitreMatrix } from './pages/MitreMatrix';
import { Scenarios } from './pages/Scenarios';
import { TrainingMode } from './pages/TrainingMode';
import { IOCs } from './pages/IOCs';
import { Behavior } from './pages/Behavior';
import { Reports } from './pages/Reports';
import { SOARPlaybooks } from './pages/SOARPlaybooks';
import { LogCollectors } from './pages/LogCollectors';
import { Login } from './pages/Login';
import { Settings } from './pages/Settings';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = !!localStorage.getItem('threatgraph_token');
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};
export const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <Routes>
            <Route path="/login" element={null} />
            <Route path="*" element={<Sidebar />} />
          </Routes>
          <main className="flex-1 p-6 max-w-7xl w-full mx-auto overflow-y-auto">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/soar" element={<ProtectedRoute><SOARPlaybooks /></ProtectedRoute>} />
              <Route path="/collectors" element={<ProtectedRoute><LogCollectors /></ProtectedRoute>} />
              <Route path="/hunting" element={<ProtectedRoute><ThreatHunting /></ProtectedRoute>} />
              <Route path="/graph" element={<ProtectedRoute><GraphExplorer /></ProtectedRoute>} />
              <Route path="/entities" element={<ProtectedRoute><Entities /></ProtectedRoute>} />
              <Route path="/alerts" element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
              <Route path="/investigations" element={<ProtectedRoute><Investigations /></ProtectedRoute>} />
              <Route path="/investigations/:id" element={<ProtectedRoute><InvestigationDetail /></ProtectedRoute>} />
              <Route path="/incidents" element={<ProtectedRoute><Incidents /></ProtectedRoute>} />
              <Route path="/mitre" element={<ProtectedRoute><MitreMatrix /></ProtectedRoute>} />
              <Route path="/scenarios" element={<ProtectedRoute><Scenarios /></ProtectedRoute>} />
              <Route path="/training" element={<ProtectedRoute><TrainingMode /></ProtectedRoute>} />
              <Route path="/iocs" element={<ProtectedRoute><IOCs /></ProtectedRoute>} />
              <Route path="/behavior" element={<ProtectedRoute><Behavior /></ProtectedRoute>} />
              <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;

