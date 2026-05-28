import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu, X, Box } from 'lucide-react';
import Sidebar from './Sidebar';

export default function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("app_session");
    navigate('/admin-login');
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col md:flex-row">
      
      {/* 1. TOP MOBILE HEADER PANEL (Visible only on screens below md: 768px) */}
      <header className="md:hidden w-full h-16 bg-brand-darkGray border-b border-zinc-800 px-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-brand-neonCyan/10 rounded-lg">
            <Box size={20} className="text-brand-neonCyan" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-wide">Nexus<span className="text-brand-neonCyan">Asset</span></h1>
          </div>
        </div>
        
        {/* Toggle Burger Button */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
          aria-label="Toggle Navigation"
        >
          {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      {/* 2. RESPONSIVE SIDEBAR CONTAINER */}
      {/* Mobile Dark Overlay Backdrop shadow */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Wrapper Drawer shell */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 transform transition-transform duration-200 ease-in-out h-full
        md:relative md:transform-none md:z-auto md:flex shrink-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <Sidebar 
          closeMobileMenu={() => setIsMobileMenuOpen(false)} 
          onSignOut={handleSignOut}
        />
      </aside>

      {/* 3. DYNAMIC SCROLLABLE PAGE CONTENTS */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-8 lg:p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}