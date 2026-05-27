import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

// Core Application Component Imports
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageAssets from './pages/admin/ManageAssets'; 
import FloorKeeperWatch from './pages/admin/FloorKeeperWatch'; 

import FloorCheckHub from './pages/keeper/FloorCheckHub';
import PlatformReportHub from './pages/incharge/PlatformReportHub';

// Authentication Gateways
import AdminLogin from './pages/auth/AdminLogin';
import KeeperLogin from './pages/auth/KeeperLogin';
import InChargeLogin from './pages/auth/InChargeLogin';

export default function App() {
  return (
    <BrowserRouter>
      {/* 🛠️ DEV ROUTE BAR: Instantly jump between user spaces during engineering testing */}
      <div className="bg-zinc-950 border-b border-zinc-800 p-2 flex flex-wrap gap-4 text-[11px] justify-center font-mono relative z-50">
        <span className="text-zinc-500">⚙️ ACTOR RUNTIME SWITCHER:</span>
        <a href="/admin-login" className="text-brand-neonCyan hover:underline">Admin Login</a>
        <a href="/keeper-login" className="text-brand-neonGreen hover:underline">Keeper Login</a>
        <a href="/incharge-login" className="text-zinc-400 hover:underline">InCharge Login</a>
        <span className="text-zinc-700">|</span>
        <a href="/floors/floor-2-operations" className="text-brand-neonCyan hover:underline font-bold">1. Admin Space</a>
        <a href="/keeper/floor-check" className="text-brand-neonGreen hover:underline font-bold">2. Keeper Space</a>
        <a href="/incharge/report" className="text-brand-neonCyan hover:underline font-bold">3. InCharge Space</a>
      </div>

      <Routes>
        {/* =========================================================
            🔒 PUBLIC PORTALS (Must be processed first)
           ========================================================= */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/keeper-login" element={<KeeperLogin />} />
        <Route path="/incharge-login" element={<InChargeLogin />} />

        {/* Default Landing Behavior: Redirect root to Admin Login */}
        <Route path="/" element={<Navigate to="/admin-login" replace />} />

        {/* =========================================================
            ACTOR 1: ADMIN SPACE (Nested inside Sidebar Layout)
            ========================================================= */}
        <Route element={<Layout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/assets" element={<ManageAssets />} />
          <Route path="/floors/:floorSlug" element={<FloorKeeperWatch />} />
          
          {/* Legacy route fallback */}
          <Route path="/admin/floor-watch" element={<FloorKeeperWatch />} />
        </Route>

        {/* =========================================================
            ACTOR 2: PHONE KEEPER SPACE (Full screen mobile layout)
            ========================================================= */}
        <Route path="/keeper/floor-check" element={<FloorCheckHub />} />

        {/* =========================================================
            ACTOR 3: PLATFORM INCHARGE SPACE (Full screen mobile reporting)
            ========================================================= */}
        <Route path="/incharge/report" element={<PlatformReportHub />} />

        {/* =========================================================
            🛡️ GLOBAL FALLBACKS (Must be at the absolute bottom)
            ========================================================= */}
        {/* Catch-all Wildcard: Safely bounce invalid paths back to login */}
        <Route path="*" element={<Navigate to="/admin-login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}