import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Database, 
  Eye, 
  LogOut, 
  Box,
  X
} from 'lucide-react';

export default function Sidebar({ closeMobileMenu, onSignOut }) {
  
  const getLinkStyles = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-xs font-semibold tracking-wide ${
      isActive 
        ? 'bg-brand-neonGreen/10 text-brand-neonGreen border border-brand-neonGreen/30 shadow-[0_0_15px_rgba(57,255,20,0.05)]' 
        : 'text-zinc-400 hover:text-white hover:bg-zinc-800 border border-transparent'
    }`;

  return (
    <aside className="w-full bg-brand-darkGray border-r border-zinc-800 flex flex-col justify-between h-full shrink-0">
      
      {/* Brand / Logo Area */}
      <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-neonCyan/10 rounded-lg">
            <Box size={24} className="text-brand-neonCyan" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-wide">Nexus<span className="text-brand-neonCyan">Asset</span></h1>
            <p className="text-xs text-zinc-500 font-medium">Admin Portal</p>
          </div>
        </div>
        
        {/* Mobile-Only Close Cross Button */}
        <button 
          onClick={closeMobileMenu}
          className="md:hidden p-1.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-500 hover:text-zinc-200"
        >
          <X size={14} />
        </button>
      </div>
      
      {/* Primary Navigation Links */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider mb-4 px-2">Overview</p>
        
        <NavLink to="/admin" onClick={closeMobileMenu} className={getLinkStyles}>
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/assets" onClick={closeMobileMenu} className={getLinkStyles}>
          <Database size={18} />
          <span>Asset Directory</span>
        </NavLink>

        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider mt-8 mb-4 px-2">Role Views</p>

        <NavLink to="/admin/floor-watch" onClick={closeMobileMenu} className={getLinkStyles}>
          <Eye size={18} />
          <span>Floor Keeper Watch</span>
        </NavLink>
      </nav>
      
      {/* User / Logout Action Area */}
      <div className="p-4 border-t border-zinc-800">
        <button 
          onClick={onSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-brand-neonRed hover:bg-brand-neonRed/10 hover:border-brand-neonRed/30 border border-transparent rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
      
    </aside>
  );
}