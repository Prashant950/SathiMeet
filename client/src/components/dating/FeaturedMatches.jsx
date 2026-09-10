import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { 
  Flame, 
  Heart, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  Filter
} from "lucide-react";
import { datingProfiles } from "../../data/datingProfiles";
import { openAuthModal } from "../auth/AuthModal";

const TABS = [
  { id: "all", label: "🔥 All Matches" },
  { id: "coffee", label: "☕ Coffee Dates" },
  { id: "movies", label: "🎬 Movie Partners" },
  { id: "events", label: "🎉 Gigs & Events" },
  { id: "travel", label: "✈️ Travel Buddies" },
];

const FeaturedMatches = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [activeTab, setActiveTab] = useState("all");

  const filteredProfiles = activeTab === "all" 
    ? datingProfiles 
    : datingProfiles.filter((p) => p.category === activeTab);

  const handleConnect = (profile) => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    navigate("/services");
  };

  return (
    <section id="featured-matches" className="scroll-mt-24 bg-white py-16 sm:py-20 lg:py-28 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-1.5 shadow-xs">
            <Heart className="h-4 w-4 text-rose-600 fill-rose-600 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700 sm:text-sm">
              Trending Dating Companions
            </span>
          </div>

          <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Featured{" "}
            <span className="bg-gradient-to-r from-rose-600 via-pink-600 to-fuchsia-600 bg-clip-text text-transparent">
              Verified Matches
            </span>{" "}
            Near You
          </h2>

          <p className="mt-3 text-base sm:text-lg text-slate-600">
            Browse genuine, verified singles &amp; friendly companions ready for cafe meetups, movie nights, and weekend hangouts.
          </p>
        </div>

        {/* Tab Filter Pills */}
        <div className="mt-10 flex items-center justify-center overflow-x-auto pb-2 gap-2 sm:gap-3">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`cursor-pointer whitespace-nowrap rounded-2xl px-5 py-3 text-xs sm:text-sm font-bold transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/25 scale-102"
                  : "bg-slate-50 text-slate-700 border border-slate-200 hover:border-rose-300 hover:bg-rose-50/50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Profiles Grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProfiles.map((profile) => (
            <div
              key={profile.id}
              className="group relative overflow-hidden rounded-[30px] border border-slate-200/80 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-rose-200"
            >
              {/* Photo Area */}
              <div className="relative h-72 w-full overflow-hidden rounded-[24px] bg-slate-100">
                <img
                  src={profile.image}
                  alt={profile.name}
                  className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-rose-600/90 px-3 py-1 text-xs font-bold text-white shadow-md backdrop-blur-md">
                  <Flame size={13} className="fill-white" />
                  <span>{profile.compatibility}% Match</span>
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-slate-800 backdrop-blur-md shadow-xs">
                  <Star size={13} className="text-amber-500 fill-amber-500" />
                  <span>{profile.rating}</span>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-extrabold tracking-tight">
                      {profile.name}, {profile.age}
                    </h3>
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[9px] text-white">
                      ✓
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-rose-200 font-semibold mt-0.5">
                    <MapPin size={12} className="text-rose-400" />
                    <span>{profile.area}, {profile.city}</span>
                  </div>
                </div>
              </div>

              {/* Bio & Details */}
              <div className="p-2 pt-4">
                <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 italic">
                  "{profile.tagline}"
                </p>

                {/* Tags / Vibes */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {profile.vibes.map((vibe) => (
                    <span
                      key={vibe}
                      className="rounded-full bg-rose-50 border border-rose-100 px-2.5 py-0.5 text-[11px] font-bold text-rose-700"
                    >
                      {vibe}
                    </span>
                  ))}
                </div>

                {/* Pricing & CTA */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Hourly Rate</span>
                    <p className="text-base font-extrabold text-slate-900">{profile.rate}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleConnect(profile)}
                    className="cursor-pointer flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-rose-500/20 transition hover:brightness-105 active:scale-95"
                  >
                    <Heart size={14} className="fill-white" />
                    <span>Book Date</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Matches Button */}
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={() => navigate("/services")}
            className="cursor-pointer inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-slate-900 to-violet-950 px-8 py-4 text-sm sm:text-base font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <span>Explore All 16+ Sathi Meet Companion Services</span>
            <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </section>
  );
};

export default FeaturedMatches;
