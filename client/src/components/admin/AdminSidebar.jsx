import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  CalendarCheck,
  Sparkles,
  LogOut,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";

const navItems = [
  { name: "Overview", path: "/admin", icon: LayoutDashboard },
  { name: "Users Management", path: "/admin/users", icon: Users },
  { name: "Bookings", path: "/admin/bookings", icon: CalendarCheck },
  { name: "Services Catalog", path: "/admin/services", icon: Sparkles },
  { name: "Transactions", path: "/admin/payments", icon: CreditCard },
];

const AdminSidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const navigate = useNavigate();
  const { user, signOut, logout } = useAuth();
  const displayName = user?.fullName || user?.name || "Admin";
  const initial = displayName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    setIsMobileOpen?.(false);
    const performSignOut = signOut || logout;
    if (performSignOut) {
      await performSignOut();
    }
    toast.success("👋 Admin signed out successfully!");
    navigate("/", { replace: true });
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity lg:hidden"
        />
      )}

      <aside
        className={`fixed bottom-0 left-0 top-0 z-50 flex w-[85vw] max-w-72 flex-col justify-between border-r border-slate-200 bg-white px-5 py-6 shadow-sm transition-transform duration-300 ease-in-out lg:w-72 lg:max-w-none lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-8">
          {/* Logo & Brand Header */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 font-black text-white shadow-lg shadow-violet-500/30 text-sm">
                SM
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-fuchsia-400" />
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight text-slate-900">
                  Sathi <span className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">Meet</span>
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-600">Admin Portal</span>
              </div>
            </div>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 lg:hidden"
            >
              <X size={20} />
            </button>
          </div>

          {/* Nav Links */}
          <div>
            <div className="mb-3 px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Main menu</div>
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    end={item.path === "/admin"}
                    onClick={() => setIsMobileOpen(false)}
                    className={({ isActive }) =>
                      `group flex cursor-pointer items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-violet-600 to-fuchsia-500 font-semibold text-white shadow-lg shadow-violet-500/25"
                          : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      }`
                    }
                  >
                    <Icon size={19} className="shrink-0 transition-transform duration-200 group-hover:scale-110" />
                    <span className="truncate">{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom User / Logout Card */}
        <div className="space-y-3 border-t border-slate-200 pt-5">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 text-xs font-bold text-white">
              {initial}
            </div>
            <div className="min-w-0">
              <div className="truncate text-xs font-semibold text-slate-900">{displayName}</div>
              <div className="text-[10px] font-medium text-slate-400">Super Administrator</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full cursor-pointer items-center gap-3.5 rounded-xl border border-transparent px-4 py-3 text-sm font-medium text-rose-500 transition-all duration-200 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 active:scale-[0.98]"
          >
            <LogOut size={19} className="shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;