import { useState, useRef, useEffect } from "react";
import { Menu, Bell, Search, ChevronDown, Command, User, LogOut, Settings } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import AdminProfileModal from "./AdminProfileModal";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const AdminNavbar = ({ setIsMobileOpen }) => {
  const navigate = useNavigate();
  const { user, signOut, logout } = useAuth();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  const pageName = location.pathname === "/admin"
    ? "Overview"
    : location.pathname.split("/").pop().replace("-", " ");

  const displayName = user?.fullName || user?.name || "Admin";
  const firstName = displayName.split(" ")[0];
  const initial = displayName.charAt(0).toUpperCase();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    if (window.confirm("Sign out of the admin panel?")) {
      const performSignOut = signOut || logout;
      if (performSignOut) {
        await performSignOut();
      }
      toast.success("👋 Admin signed out successfully!");
      navigate("/", { replace: true });
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex min-h-16 w-full items-center justify-between border-b border-slate-200 bg-white/85 px-4 backdrop-blur-xl sm:min-h-20 sm:px-8">
        {/* Left section */}
        <div className="flex min-w-0 items-center gap-4">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="cursor-pointer rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
          >
            <Menu size={22} />
          </button>

          <div className="hidden min-w-0 md:block">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-violet-600">Workspace / {pageName}</p>
            <h1 className="mt-1 truncate text-lg font-bold capitalize tracking-tight text-slate-900">
              {getGreeting()}, {firstName}
            </h1>
          </div>

          <div className="min-w-0 md:hidden">
            <p className="truncate text-sm font-bold capitalize text-slate-900">{firstName}</p>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-violet-600">{pageName}</p>
          </div>

          <div className="relative hidden w-72 lg:block xl:w-96">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search users, payments, orders..."
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-xs text-slate-700 placeholder-slate-400 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            />
            <Command size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        {/* Right section */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          <button
            aria-label="Notifications"
            className="relative cursor-pointer rounded-xl border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-100 sm:p-2.5"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2 sm:top-2 sm:right-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-fuchsia-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-fuchsia-500"></span>
            </span>
          </button>

          {/* Profile dropdown trigger */}
          <div className="relative border-l border-slate-200 pl-2 sm:pl-4" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className="flex cursor-pointer items-center gap-2 rounded-xl px-1.5 py-1 transition hover:bg-slate-100 sm:gap-3 sm:px-2"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 font-bold text-white shadow-md shadow-violet-500/25 sm:h-10 sm:w-10">
                {initial}
              </div>
              <div className="hidden text-left sm:block">
                <div className="max-w-[140px] truncate text-sm font-semibold text-slate-900">{displayName}</div>
                <div className="text-[11px] font-medium text-slate-500">Super Administrator</div>
              </div>
              <ChevronDown size={15} className={`hidden text-slate-400 transition-transform duration-200 sm:block ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div className="absolute right-0 top-full z-40 mt-2 w-64 origin-top-right animate-[dropIn_0.15s_ease-out] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50 px-4 py-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 text-sm font-bold text-white">
                    {initial}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-slate-900">{displayName}</div>
                    <div className="truncate text-xs text-slate-500">{user?.email}</div>
                  </div>
                </div>

                <div className="p-1.5">
                  <button
                    onClick={() => { setDropdownOpen(false); setProfileModalOpen(true); }}
                    className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-violet-50 hover:text-violet-700"
                  >
                    <User size={16} />
                    My Profile
                  </button>
                  <button
                    onClick={() => { setDropdownOpen(false); setProfileModalOpen(true); }}
                    className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-violet-50 hover:text-violet-700"
                  >
                    <Settings size={16} />
                    Account Settings
                  </button>
                </div>

                <div className="border-t border-slate-100 p-1.5">
                  <button
                    onClick={handleLogout}
                    className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-rose-500 transition hover:bg-rose-50 hover:text-rose-600"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {profileModalOpen && <AdminProfileModal onClose={() => setProfileModalOpen(false)} />}

      <style>{`
        @keyframes dropIn { from { opacity: 0; transform: translateY(-6px) scale(0.98) } to { opacity: 1; transform: translateY(0) scale(1) } }
      `}</style>
    </>
  );
};

export default AdminNavbar;