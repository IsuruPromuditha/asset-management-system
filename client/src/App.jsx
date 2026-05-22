import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

// Core Application Component Imports
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageAssets from './pages/admin/ManageAssets'; 
import FloorKeeperWatch from './pages/admin/FloorKeeperWatch'; 

import FloorCheckHub from './pages/keeper/FloorCheckHub';
import PlatformReportHub from './pages/incharge/PlatformReportHub';

// 💡 COMMENTED OUT UNTIL YOU CREATE THE FILE:
// import Login from './pages/auth/Login';

export default function App() {
  return (
    <BrowserRouter>
      {/* 🛠️ DEV ROUTE BAR: Instantly jump between user spaces during engineering testing */}
      <div className="bg-zinc-950 border-b border-zinc-800 p-2 flex gap-4 text-[11px] justify-center font-mono relative z-50">
        <span className="text-zinc-500">⚙️ ACTOR RUNTIME SWITCHER:</span>
        <a href="/floors/floor-2-operations" className="text-brand-neonCyan hover:underline font-bold">1. Admin Space</a>
        <a href="/keeper/floor-check" className="text-brand-neonGreen hover:underline font-bold">2. Keeper Space</a>
        <a href="/incharge/report" className="text-brand-neonCyan hover:underline font-bold">3. InCharge Space</a>
      </div>

      <Routes>
        {/* Redirect root URL straight to Admin Overview as default fallback */}
        <Route path="/" element={<Navigate to="/admin" replace />} />

        {/* =========================================================
            ACTOR 1: ADMIN SPACE (Renders nested inside Sidebar Layout)
            ========================================================= */}
        <Route element={<Layout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/assets" element={<ManageAssets />} />
          <Route path="/floors/:floorSlug" element={<FloorKeeperWatch />} />
          
          {/* Legacy route fallback */}
          <Route path="/admin/floor-watch" element={<FloorKeeperWatch />} />
        </Route>

        {/* =========================================================
            ACTOR 2: PHONE KEEPER SPACE (Full screen mobile-friendly layout)
            ========================================================= */}
        <Route path="/keeper/floor-check" element={<FloorCheckHub />} />

        {/* =========================================================
            ACTOR 3: PLATFORM INCHARGE SPACE (Full screen mobile reporting)
            ========================================================= */}
        <Route path="/incharge/report" element={<PlatformReportHub />} />

        {/* Catch-all Wildcard Re-routing logic back to admin area for now */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}