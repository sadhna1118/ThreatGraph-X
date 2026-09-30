import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

export const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-6 max-w-7xl w-full mx-auto overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/soar" element={<SOARPlaybooks />} />
              <Route path="/collectors" element={<LogCollectors />} />
              <Route path="/hunting" element={<ThreatHunting />} />
              <Route path="/graph" element={<GraphExplorer />} />
              <Route path="/entities" element={<Entities />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/investigations" element={<Investigations />} />
              <Route path="/investigations/:id" element={<InvestigationDetail />} />
              <Route path="/incidents" element={<Incidents />} />
              <Route path="/mitre" element={<MitreMatrix />} />
              <Route path="/scenarios" element={<Scenarios />} />
              <Route path="/training" element={<TrainingMode />} />
              <Route path="/iocs" element={<IOCs />} />
              <Route path="/behavior" element={<Behavior />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;

