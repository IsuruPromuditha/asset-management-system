// src/components/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Database, 
  Eye, // 💡 Swapped ShieldAlert for Eye to represent "Watching/Monitoring"
  LogOut, 
  Box 
} from 'lucide-react';

export default function Sidebar() {
  // A helper function to handle active/inactive states for the navigation links
  const getLinkStyles = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      isActive 
        ? 'bg-brand-neonGreen/10 text-brand-neonGreen border border-brand-neonGreen/30 shadow-[0_0_15px_rgba(57,255,20,0.05)]' 
        : 'text-zinc-400 hover:text-white hover:bg-zinc-800 border border-transparent'
    }`;

  return (
    <aside className="w-64 bg-brand-darkGray border-r border-zinc-800 flex flex-col justify-between h-full shrink-0">
      
      {/* Brand / Logo Area */}
      <div className="p-6 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-neonCyan/10 rounded-lg">
            <Box size={24} className="text-brand-neonCyan" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-wide">Nexus<span className="text-brand-neonCyan">Asset</span></h1>
            <p className="text-xs text-zinc-500 font-medium">Admin Portal</p>
          </div>
        </div>
      </div>
      
      {/* Primary Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <p className="text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-4 px-2">Overview</p>
        
        <NavLink to="/admin" className={getLinkStyles}>
          <LayoutDashboard size={20} />
          <span className="font-medium">Dashboard</span>
        </NavLink>

        {/* 💡 FIXED: Point path to '/assets' instead of '/manage/assets' */}
        <NavLink to="/assets" className={getLinkStyles}>
          <Database size={20} />
          <span className="font-medium">Asset Directory</span>
        </NavLink>

        <p className="text-xs font-semibold text-zinc-600 uppercase tracking-wider mt-8 mb-4 px-2">Role Views</p>

        {/* 💡 FIXED: Linked to '/admin/floor-watch' for live keeper monitoring */}
        <NavLink to="/admin/floor-watch" className={getLinkStyles}>
          <Eye size={20} />
          <span className="font-medium">Floor Keeper Watch</span>
        </NavLink>
      </nav>
      
      {/* User / Logout Area */}
      <div className="p-4 border-t border-zinc-800">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-brand-neonRed hover:bg-brand-neonRed/10 hover:border-brand-neonRed/30 border border-transparent rounded-lg transition-all duration-200">
          <LogOut size={20} />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
      
    </aside>
  );
}