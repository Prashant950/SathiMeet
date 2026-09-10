import { useState, useMemo } from "react";
import { Search, Sparkles, Filter, X, ShieldCheck, HeartHandshake } from "lucide-react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { serviceCategories } from "../../data/services";
import ServiceCard from "./ServiceCard";
import BuyServicesModal from "./BuyServicesModal";
import { openAuthModal } from "../auth/AuthModal";
import { useGetPublicServicesCatalogQuery } from "../../features/api/apiSlice";

const Services = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [selectedServiceForBuy, setSelectedServiceForBuy] = useState(null);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const { data: dbCatalogData } = useGetPublicServicesCatalogQuery();

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
      openAuthModal();
      return;
    }
    setSelectedServiceForBuy(service);
    setIsBuyModalOpen(true);
  };

  return (
    <section
      id="services"
      className="relative scroll-mt-20 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-violet-50/50 py-16 sm:py-20 lg:py-28"
    >
      {/* Decorative ambient background glows */}
      <div className="pointer-events-none absolute -left-28 top-1/4 h-96 w-96 rounded-full bg-violet-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 bottom-1/4 h-96 w-96 rounded-full bg-fuchsia-200/25 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-4 py-1.5 shadow-xs">
            <Sparkles className="h-4 w-4 text-violet-600 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-violet-700 sm:text-sm">
              Verified On-Demand Services
            </span>
          </div>

          <h2 className="mt-5 bg-gradient-to-r from-violet-800 via-fuchsia-700 to-pink-600 bg-clip-text text-3xl font-black tracking-tight text-transparent sm:text-5xl lg:text-6xl">
            Explore Sathi Meet Services
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg lg:text-xl">
            Choose from our safe, consent-first range of professional lifestyle, companion, and personal support services across India.
          </p>
        </div>

        {/* Interactive Controls Bar: Category Tabs + Search + Quick Filters */}
        <div className="mt-10 sm:mt-14 space-y-5">
          
          {/* Category Tabs Bar */}
          <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-2 scrollbar-none gap-2 sm:gap-3">
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
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl border border-slate-200/80 bg-white/90 p-3 sm:p-4 shadow-sm backdrop-blur-md">
            {/* Search input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services (e.g., Movie Partner, Elder Care, Coffee, Travel...)"
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

        {/* Safety & Trust Banner */}
        <div className="mt-16 sm:mt-20 overflow-hidden rounded-3xl border border-violet-200/80 bg-gradient-to-br from-violet-900 via-indigo-900 to-purple-900 p-8 sm:p-12 text-white shadow-2xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center lg:text-left max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-violet-200 backdrop-blur-sm">
                <ShieldCheck size={14} className="text-emerald-400" />
                100% Verified Sathi Meet Guarantee
              </div>
              <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Safe, Consent-First & Professional Experience
              </h3>
              <p className="text-sm sm:text-base text-violet-200/90 leading-relaxed">
                All Sathi Meet partners undergo background verification and ID screening. You have full control of your session duration, public meetup location, and support preferences.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => handleBookService()}
                className="cursor-pointer flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-violet-950 shadow-xl transition-all duration-300 hover:scale-105 hover:bg-violet-50 active:scale-95"
              >
                <HeartHandshake size={18} className="text-violet-700" />
                <span>Book Service Credit</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Buy Services Modal */}
      <BuyServicesModal
        isOpen={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
        onPaymentSuccess={() => {
          setIsBuyModalOpen(false);
          toast.success("🎉 Payment successful! Your Sathi Meet credits are ready.");
        }}
      />
    </section>
  );
};

export default Services;