import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminNavbar from "../../components/admin/AdminNavbar";

const AdminLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="admin-shell min-h-screen bg-slate-50 text-slate-900 antialiased">
      {/* Sidebar Navigation */}
      <AdminSidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      {/* Main Wrapper */}
      <div className="flex min-h-screen flex-col lg:pl-72">
        <AdminNavbar setIsMobileOpen={setIsMobileOpen} />

        {/* Dynamic Nested Content */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;