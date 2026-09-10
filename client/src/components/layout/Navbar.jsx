import { useState, useEffect } from "react";
import { 
  LogOut, 
  UserRound, 
  Sparkles, 
  Home, 
  Info,
  Briefcase, 
  ShieldCheck, 
  Tag, 
  HelpCircle, 
  PhoneCall, 
  ChevronRight,
  Menu,
  X
} from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import showCustomToast from "../../utils/toast";
import Logo from "../ui/Logo";
import AuthModal from "../auth/AuthModal";
import { useAuth } from "../../hooks/useAuth";
import {
  useGetMyProfileQuery,
  useGetMyPurchasedServicesQuery,
} from "../../features/api/apiSlice";

const NAV_ITEMS = [
  { label: "Home", href: "/", to: "/", hash: "home", icon: Home, isPage: true },
  { label: "About", href: "/about", to: "/about", hash: "about", icon: Info, isPage: true },
  { label: "Services", href: "/services", to: "/services", hash: "services", icon: Briefcase, isPage: true },
  { label: "Why Choose Us", href: "/#why-choose-us", to: "/#why-choose-us", hash: "why-choose-us", icon: ShieldCheck },
  { label: "Pricing", href: "/#pricing", to: "/#pricing", hash: "pricing", icon: Tag },
  { label: "Contact", href: "/contact", to: "/contact", hash: "contact", icon: PhoneCall, isPage: true },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();
  const { isAuthenticated, user, role } = useSelector((state) => state.auth);
  const { data: profile } = useGetMyProfileQuery(undefined, {
    skip: !isAuthenticated,
  });
  const { data: purchasedServicesData, isLoading: isLoadingPurchases } =
    useGetMyPurchasedServicesQuery(undefined, {
      skip: !isAuthenticated || role !== "user",
    });
  const [isOpen, setIsOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  // Track header shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle hash scrolling on landing or navigation
  useEffect(() => {
    if (location.pathname === "/") {
      if (location.hash) {
        const id = location.hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth" });
            setActiveSection(id);
          }, 150);
        }
      } else if (window.scrollY < 300) {
        setActiveSection("home");
      }
    }
  }, [location.pathname, location.hash]);

  // Scroll Spy for Home Page Sections
  useEffect(() => {
    if (location.pathname !== "/") return;

    const handleScrollSpy = () => {
      const scrollPos = window.scrollY + 200;
      const sections = ["faq", "pricing", "why-choose-us"];

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            return;
          }
        }
      }

      if (window.scrollY < 400) {
        setActiveSection("home");
      }
    };

    window.addEventListener("scroll", handleScrollSpy, { passive: true });
    handleScrollSpy();
    return () => window.removeEventListener("scroll", handleScrollSpy);
  }, [location.pathname]);

  const profileUser = profile || user;
  const userInitial = profileUser?.fullName?.trim()?.charAt(0)?.toUpperCase?.() || profileUser?.name?.trim()?.charAt(0)?.toUpperCase?.() || "S";
  const purchasedServices = purchasedServicesData?.data || [];
  const profileMenuItems = role === "admin"
    ? ["Dashboard"]
    : [
        "Dashboard",
      ];

  const handleDashboardNavigation = () => {
    if (role === "admin") {
      navigate("/admin");
      return;
    }

    navigate("/dashboard");
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (e) {}
    setProfileMenuOpen(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.clear();
    showCustomToast("You have been logged out successfully! 👋", "success", "Logged Out");
    navigate("/");
  };

  const handleNavClick = (e, item) => {
    e.preventDefault();
    setIsOpen(false);

    if (item.isPage) {
      navigate(item.to);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (item.hash) {
      if (location.pathname === "/") {
        const element = document.getElementById(item.hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          setActiveSection(item.hash);
        }
      } else {
        navigate(item.to);
      }
    }
  };

  const isItemActive = (item) => {
    if (item.to === "/about" && location.pathname === "/about") return true;
    if (item.to === "/services" && location.pathname === "/services") return true;
    if (item.to === "/contact" && location.pathname === "/contact") return true;
    if (location.pathname === "/faq" && (item.hash === "faq" || item.to === "/#faq")) return true;
    if (location.pathname === "/") {
      if (item.hash && item.hash !== "home" && activeSection === item.hash) return true;
      if (item.to === "/" && (!activeSection || activeSection === "home")) return true;
    }
    return false;
  };

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "border-b border-violet-100/60 bg-white/80 shadow-[0_4px_30px_rgba(109,40,217,0.06)] backdrop-blur-xl" 
          : "border-b border-slate-200/40 bg-white/60 backdrop-blur-lg"
      }`}>
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="outline-none">
            <Logo />
          </Link>

          {/* Desktop Navigation Links with Unified Active Styling */}
          <ul className="hidden items-center gap-1 lg:gap-1.5 text-[14px] xl:text-[15px] font-semibold md:flex">
            {NAV_ITEMS.map((item) => {
              const active = isItemActive(item);
              const Icon = item.icon;
              return (
                <li key={item.label}>
                  <a
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item)}
                    className={`group relative flex items-center gap-1.5 rounded-full px-3.5 py-2 transition-all duration-200 ${
                      active
                        ? "bg-gradient-to-r from-violet-600 via-indigo-600 to-fuchsia-600 text-white font-bold shadow-md shadow-violet-500/25"
                        : "text-slate-700 hover:bg-violet-50 hover:text-violet-700"
                    }`}
                  >
                    <Icon size={15} className={active ? "text-white" : "text-slate-400 group-hover:text-violet-600 transition-colors"} />
                    <span>{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Right Actions */}
          <div className="hidden items-center gap-3 md:flex">
            {!isAuthenticated ? (
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setAuthModalOpen(true)}
                  className="cursor-pointer inline-flex items-center justify-center rounded-full bg-gradient-to-r from-violet-700 via-indigo-600 to-fuchsia-600 px-6 py-2.5 text-sm font-bold text-white shadow-[0_8px_25px_rgba(109,40,217,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(109,40,217,0.4)] hover:brightness-105 active:scale-95"
                >
                  <span>Login / Register</span>
                </button>
              </div>
            ) : (
              <div className="cursor-pointer relative flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleDashboardNavigation}
                  className="cursor-pointer inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50/90 px-4 py-2 text-xs font-bold text-violet-700 transition hover:bg-violet-100 shadow-xs"
                >
                  <Sparkles size={13} />
                  <span>Dashboard</span>
                </button>

                <button
                  type="button"
                  onClick={() => setProfileMenuOpen((prev) => !prev)}
                  className="cursor-pointer flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-pink-500 text-sm font-bold text-white shadow-[0_6px_20px_rgba(168,85,247,0.35)] transition hover:scale-105 active:scale-95 ring-2 ring-violet-200"
                  aria-label="Open profile menu"
                >
                  {userInitial}
                </button>

                {profileMenuOpen && (
                  <div className="absolute right-0 top-[calc(100%+14px)] z-50 w-[280px] rounded-2xl border border-slate-100 bg-white p-3 shadow-[0_20px_60px_rgba(15,23,42,0.15)] animate-in fade-in slide-in-from-top-2">
                    <div className="px-3 pb-3 pt-2 text-left border-b border-slate-100">
                      <div className="text-base font-bold text-slate-800 truncate">
                        {profileUser?.fullName || profileUser?.name || "Sathi User"}
                      </div>
                      <div className="text-xs text-slate-500 truncate mt-0.5 font-medium">
                        {role === "admin"
                          ? profileUser?.email || "Admin Account"
                          : profileUser?.contactNumber || profileUser?.email || "Verified Member"}
                      </div>
                    </div>

                    <div className="mt-2 space-y-1">
                      {profileMenuItems.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => {
                            setProfileMenuOpen(false);
                            if (item === "Dashboard") {
                              handleDashboardNavigation();
                              return;
                            }
                            if (item === "Buy Services") {
                              navigate("/services");
                              return;
                            }
                            navigate("/services");
                          }}
                          className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-violet-50 hover:text-violet-700"
                        >
                          <div className="flex items-center gap-2.5">
                            <UserRound size={16} className="text-slate-400" />
                            <span>{item}</span>
                          </div>
                          <ChevronRight size={14} className="text-slate-300" />
                        </button>
                      ))}
                    </div>

                    <div className="mt-2 border-t border-slate-100 pt-2">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-semibold text-rose-500 transition hover:bg-rose-50"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Right: Dashboard Button & Hamburger Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            {isAuthenticated && (
              <button
                type="button"
                onClick={handleDashboardNavigation}
                className="cursor-pointer inline-flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-xs font-bold text-violet-700"
              >
                <Sparkles size={12} />
                <span>Dashboard</span>
              </button>
            )}

            <button
              type="button"
              aria-label="Toggle navigation"
              aria-expanded={isOpen}
              onClick={() => setIsOpen((prev) => !prev)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-violet-300 hover:text-violet-600 active:scale-95"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {/* Mobile Slide-Down Menu */}
        {isOpen && (
          <div className="border-t border-slate-100 bg-white/95 backdrop-blur-xl px-4 py-5 shadow-2xl md:hidden animate-in fade-in slide-in-from-top-2">
            <div className="space-y-1.5">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = isItemActive(item);
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item)}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      active
                        ? "bg-gradient-to-r from-violet-600 via-indigo-600 to-fuchsia-600 text-white font-bold shadow-md shadow-violet-500/20"
                        : "text-slate-700 hover:bg-violet-50 hover:text-violet-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} className={active ? "text-white" : "text-slate-400"} />
                      <span>{item.label}</span>
                    </div>
                    {active ? (
                      <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                        Active
                      </span>
                    ) : (
                      <ChevronRight size={14} className="text-slate-300" />
                    )}
                  </a>
                );
              })}

              <div className="pt-3 border-t border-slate-100">
                {!isAuthenticated ? (
                  <button
                    type="button"
                    onClick={() => {
                      setAuthModalOpen(true);
                      setIsOpen(false);
                    }}
                    className="cursor-pointer flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-700 via-indigo-600 to-fuchsia-600 py-3 text-sm font-bold text-white shadow-md shadow-violet-300"
                  >
                    <Sparkles size={16} />
                    Login / Register
                  </button>
                ) : (
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        handleDashboardNavigation();
                      }}
                      className="cursor-pointer flex w-full items-center justify-center gap-2 rounded-xl bg-violet-50 py-3 text-sm font-bold text-violet-700 border border-violet-200"
                    >
                      <Sparkles size={16} />
                      Go to Dashboard
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        handleLogout();
                      }}
                      className="cursor-pointer flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 py-2.5 text-sm font-bold text-rose-600"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
};

export default Navbar;
