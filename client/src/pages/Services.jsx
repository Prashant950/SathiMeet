import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { 
  Search, 
  Sparkles, 
  Filter, 
  X, 
  ShieldCheck, 
  HeartHandshake, 
  Heart, 
  CheckCircle, 
  DollarSign, 
  Package, 
  Calendar, 
  Loader, 
  Star, 
  ArrowRight, 
  Clock, 
  HelpCircle,
  ChevronDown,
  RefreshCw
} from "lucide-react";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import BuyServicesModal from "../components/services/BuyServicesModal";
import ServiceCard from "../components/services/ServiceCard";
import { serviceCategories } from "../data/services";
import { openAuthModal } from "../components/auth/AuthModal";
import { 
  useGetMyProfileQuery, 
  useGetMyPurchasedServicesQuery,
  useGetPublicServicesCatalogQuery
} from "../features/api/apiSlice";

const FAQS = [
  {
    q: "How does booking a Sathi Meet service work?",
    a: "Select your desired companion or lifestyle service from the catalog, purchase credits securely, and our system matches you with a verified partner in your city/pin code for safe public meetups."
  },
  {
    q: "Are all Sathi Meet partners background verified?",
    a: "Yes, 100%! Every partner undergoes government ID verification, address verification, and strict background screening before they can accept bookings."
  },
  {
    q: "Can I choose the meetup location and duration?",
    a: "Absolutely. You can choose public venues (cafes, malls, restaurants, event arenas) and customize the duration in hours based on your purchased credits."
  },
  {
    q: "What if I need to reschedule or cancel?",
    a: "You can reschedule or cancel directly from your Dashboard according to our flexible refund and cancellation policy."
  }
];

const Services = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, role } = useSelector((state) => state.auth);

  // States
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [selectedServiceForBuy, setSelectedServiceForBuy] = useState(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // User Profile and Purchases
  const { data: profile } = useGetMyProfileQuery(undefined, {
    skip: !isAuthenticated,
  });

  const { 
    data: purchasedServicesData, 
    isLoading: isLoadingPurchases, 
    refetch: refetchServices 
  } = useGetMyPurchasedServicesQuery(undefined, {
    skip: !isAuthenticated || role !== "user",
  });

  // Dynamic MongoDB Services Catalog
  const { 
    data: dbCatalogData, 
    isLoading: isCatalogLoading, 
    refetch: refetchCatalog 
  } = useGetPublicServicesCatalogQuery();

  const profileUser = profile || user;
  const purchasedServices = purchasedServicesData?.data || [];
  const totalSpent = purchasedServicesData?.totalSpent || 0;

  // Transform DB services
  const liveServices = useMemo(() => {
    const raw = dbCatalogData?.data || [];
    return raw.map((s, idx) => ({
      id: s._id || s.slug || idx + 1,
      _id: s._id,
      title: s.title,
      category: s.category || "social",
      tag: s.tag || "Popular",
      rating: s.rating || 4.9,
      description: s.description || "Verified on-demand companionship & lifestyle support.",
      price: `₹${s.rate || 1000}/session`,
      rate: s.rate || 1000,
      button: "Book Sathi",
      color: s.color || "from-violet-600 to-indigo-500",
    }));
  }, [dbCatalogData]);

  // Filtered Services Catalog
  const filteredServices = useMemo(() => {
    return liveServices.filter((service) => {
      // Category match
      const matchesCategory =
        activeCategory === "all" || service.category?.toLowerCase() === activeCategory?.toLowerCase();

      // Search match
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        service.title.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query) ||
        service.price.toLowerCase().includes(query);

      // Tag filter
      const matchesTag =
        selectedTag === "all" ||
        (selectedTag === "popular" && (service.tag === "Popular" || service.tag === "Trending")) ||
        (selectedTag === "top" && service.rating >= 4.9) ||
        (selectedTag === "budget" && parseInt(service.price.replace(/\D/g, "")) <= 1000);

      return matchesCategory && matchesSearch && matchesTag;
    });
  }, [liveServices, activeCategory, searchQuery, selectedTag]);

  const handleBookService = (service) => {
    if (!isAuthenticated) {
      sessionStorage.setItem("sathi_pending_service", JSON.stringify(service));
      openAuthModal();
      return;
    }
    setSelectedServiceForBuy(service);
    setIsBuyModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    setShowSuccessToast(true);
    refetchServices();
    setTimeout(() => setShowSuccessToast(false), 5000);
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    // If returning from onboarding or login with a pending booking
    if (isAuthenticated) {
      const pendingRaw = sessionStorage.getItem("sathi_pending_service");
      if (pendingRaw) {
        try {
          const parsed = JSON.parse(pendingRaw);
          setSelectedServiceForBuy(parsed);
          setIsBuyModalOpen(true);
          sessionStorage.removeItem("sathi_pending_service");
        } catch (e) {
          console.error("Error parsing pending service:", e);
        }
      }
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-[#fcfbfe] flex flex-col selection:bg-fuchsia-500 selection:text-white">
      {/* Global Header */}
      <Header />

      {/* Main Page Container */}
      <main className="flex-1">
        {/* Hero Banner for Services Page */}
        <section className="relative overflow-hidden bg-gradient-to-b from-violet-900 via-indigo-900 to-purple-950 text-white py-16 sm:py-20 lg:py-24">
          {/* Ambient background glows */}
          <div className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-fuchsia-500/25 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-pink-500/20 blur-3xl" />
          
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-violet-200 backdrop-blur-md">
              <Sparkles className="h-4 w-4 text-amber-300 animate-pulse" />
              <span>Verified On-Demand Companionship &amp; Support</span>
            </div>

            <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl max-w-4xl mx-auto leading-tight">
              Explore Sathi Meet{" "}
              <span className="bg-gradient-to-r from-pink-400 via-fuchsia-300 to-amber-300 bg-clip-text text-transparent">
                Services &amp; Packages
              </span>
            </h1>

            <p className="mt-4 max-w-2xl mx-auto text-base text-violet-200 sm:text-lg lg:text-xl leading-relaxed">
              Book verified partners for casual dates, movies, coffee chats, event companions, travel buddies, or personal lifestyle assistance.
            </p>

            {/* Quick stats pills */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm font-semibold text-violet-100">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3.5 py-1.5 backdrop-blur-sm">
                <ShieldCheck size={15} className="text-emerald-400" />
                100% ID Verified Partners
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3.5 py-1.5 backdrop-blur-sm">
                <Heart size={14} className="text-pink-400" />
                Consent &amp; Safety First
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3.5 py-1.5 backdrop-blur-sm">
                <Clock size={14} className="text-amber-400" />
                Transparent Hourly Rates
              </span>
            </div>
          </div>
        </section>

        {/* Success Toast */}
        {showSuccessToast && (
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-6">
            <div className="animate-in fade-in slide-in-from-top-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-lg sm:p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-emerald-950">Payment Successful! 🎉</p>
                  <p className="text-sm text-emerald-800">Your service credits have been activated in your account.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Services Catalog Explorer */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* If Logged In & Has Purchased Services: Show Active Wallet Banner */}
          {isAuthenticated && purchasedServices.length > 0 && (
            <div className="mb-10 rounded-3xl bg-gradient-to-r from-violet-900 via-indigo-900 to-purple-900 p-6 sm:p-8 text-white shadow-xl border border-violet-700/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 px-3 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
                    {purchasedServices.length} Active Services Booked
                  </span>
                  <span className="text-xs text-violet-200">
                    Total Spent: ₹{totalSpent.toLocaleString("en-IN")}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                  Your Companion Service Wallet is Active! ✨
                </h3>
                <p className="text-xs sm:text-sm text-violet-200 leading-relaxed">
                  You have active sessions available. View your complete booking receipts, transaction IDs, and companion match connections directly in your Dashboard.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard?tab=services")}
                  className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-500 px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-pink-500/30 hover:brightness-110 active:scale-95 transition"
                >
                  <Sparkles size={16} />
                  <span>Manage Booked Services in Dashboard</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-violet-600">
                Catalog &amp; Pricing
              </span>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 mt-1">
                Browse All Services
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-1">
                Filter by category or search by activity to find your ideal companion service
              </p>
            </div>
          </div>

          {/* Interactive Controls Bar: Category Tabs + Search + Quick Filters */}
          <div className="mt-8 space-y-4">
            {/* Category Tabs Bar */}
            <div className="flex items-center justify-start overflow-x-auto pb-2 scrollbar-none gap-2 sm:gap-3">
              {serviceCategories.map((category) => {
                const isActive = activeCategory === category.id;
                const count =
                  category.id === "all"
                    ? liveServices.length
                    : liveServices.filter((s) => s.category?.toLowerCase() === category.id?.toLowerCase()).length;

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setActiveCategory(category.id)}
                    className={`cursor-pointer whitespace-nowrap flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-violet-700 via-indigo-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/25 scale-102"
                        : "bg-white text-slate-700 border border-slate-200/80 hover:border-violet-300 hover:bg-violet-50/50 hover:text-violet-700 shadow-xs"
                    }`}
                  >
                    <span className="text-base">{category.icon}</span>
                    <span>{category.label}</span>
                    <span
                      className={`ml-1 rounded-full px-2 py-0.5 text-[11px] font-extrabold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search Bar & Quick Filter Chips */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl border border-slate-200/80 bg-white p-3 sm:p-4 shadow-xs">
              {/* Search input */}
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search services (e.g., Movie Partner, Coffee, Elder Care, Travel Buddy, Dating...)"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 py-2.5 pl-11 pr-10 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-500/20"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="cursor-pointer absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Quick Filter Tags */}
              <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mr-1 shrink-0">
                  <Filter size={13} />
                  <span>Filter:</span>
                </div>

                {[
                  { id: "all", label: "All" },
                  { id: "popular", label: "🔥 Popular" },
                  { id: "top", label: "⭐ Top Rated" },
                  { id: "budget", label: "💰 Under ₹1000" },
                ].map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => setSelectedTag(tag.id)}
                    className={`cursor-pointer whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                      selectedTag === tag.id
                        ? "bg-violet-100 text-violet-800 border border-violet-300"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Info */}
          <div className="mt-6 flex items-center justify-between px-1 text-xs sm:text-sm font-semibold text-slate-500">
            <span>
              Showing <strong className="text-slate-800">{filteredServices.length}</strong> verified services
            </span>
            {(activeCategory !== "all" || searchQuery || selectedTag !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setActiveCategory("all");
                  setSearchQuery("");
                  setSelectedTag("all");
                }}
                className="cursor-pointer text-violet-600 hover:underline font-bold"
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* Services Grid */}
          {filteredServices.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onBook={handleBookService}
                />
              ))}
            </div>
          ) : (
            <div className="mt-12 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-xs">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                <Search size={28} />
              </div>
              <h3 className="mt-4 text-xl font-bold text-slate-800">No Services Found</h3>
              <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
                We couldn't find any services matching "{searchQuery}". Try searching with a different keyword or category.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveCategory("all");
                  setSearchQuery("");
                  setSelectedTag("all");
                }}
                className="cursor-pointer mt-5 inline-flex items-center gap-2 rounded-full bg-violet-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-violet-700"
              >
                View All Services
              </button>
            </div>
          )}
        </section>

        {/* Safety & Trust Guarantees */}
        <section className="bg-gradient-to-b from-slate-50 to-violet-50/50 py-16 sm:py-20 border-t border-slate-200/60">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-700 bg-violet-100 px-3.5 py-1 rounded-full">
                Safe &amp; Secure Guarantee
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mt-3">
                Why Book on Sathi Meet?
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-2">
                We prioritize user safety, transparent prices, and respectful interactions.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xs">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 mb-4">
                  <ShieldCheck size={26} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">100% ID Verified Partners</h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  Every companion undergoes government ID verification, phone screening, and conduct checks before accepting sessions.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xs">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100 text-pink-600 mb-4">
                  <HeartHandshake size={26} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Public &amp; Consent-First</h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  All dates and companion meetups strictly occur in safe, public venues like cafes, malls, restaurants, or events.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xs">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 mb-4">
                  <Clock size={26} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Transparent Hourly Billing</h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  Zero hidden fees or surprise charges. You pay for the exact hours booked with full refund protection for cancellations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services FAQs */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-600 bg-violet-50 px-3.5 py-1 rounded-full">
                Help &amp; Questions
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mt-3">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="mt-10 space-y-4">
              {FAQS.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={faq.q}
                    className="rounded-2xl border border-slate-200 overflow-hidden transition"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="cursor-pointer w-full flex items-center justify-between p-5 text-left font-bold text-slate-800 hover:bg-slate-50 transition"
                    >
                      <span className="text-base sm:text-lg">{faq.q}</span>
                      <ChevronDown
                        size={20}
                        className={`text-slate-400 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-violet-600" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Buy Services Modal */}
      <BuyServicesModal
        isOpen={isBuyModalOpen}
        onClose={() => {
          setIsBuyModalOpen(false);
          setSelectedServiceForBuy(null);
        }}
        preSelectedService={selectedServiceForBuy}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default Services;