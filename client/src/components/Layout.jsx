import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

function Layout() {
  return (
    <div className="flex min-h-screen bg-[#09090b]">
      {/* Fixed Sidebar on the left */}
      <Sidebar />

      {/* Dynamic page contents scrollable on the right */}
      <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto">
        {/* The Outlet component renders whatever route page is currently active! */}
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;