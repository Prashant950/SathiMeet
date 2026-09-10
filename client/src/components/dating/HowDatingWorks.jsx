import { Heart, Search, Calendar, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { openAuthModal } from "../auth/AuthModal";

const STEPS = [
  {
    step: "01",
    title: "Discover Your Match",
    description: "Browse 100% ID-verified profiles in your city. Filter by date vibe, interests, ratings, and compatibility scores.",
    icon: Search,
    color: "from-rose-500 to-pink-500",
    bg: "bg-rose-50 border-rose-200 text-rose-600"
  },
  {
    step: "02",
    title: "Plan Your Safe Date",
    description: "Choose your preferred public venue (cafes, restaurants, cinemas, event gigs) and select the date duration in hours.",
    icon: Calendar,
    color: "from-fuchsia-500 to-purple-500",
    bg: "bg-fuchsia-50 border-fuchsia-200 text-fuchsia-600"
  },
  {
    step: "03",
    title: "Meet & Connect with Sathi",
    description: "Meet up at the scheduled time in a public setting. Enjoy authentic conversation, zero awkwardness, and mutual respect.",
    icon: Sparkles,
    color: "from-violet-500 to-indigo-500",
    bg: "bg-violet-50 border-violet-200 text-violet-600"
  }
];

const HowDatingWorks = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const handleCta = () => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    navigate("/services");
  };

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-28 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 shadow-xs">
            <Heart className="h-4 w-4 text-violet-600 fill-violet-600 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-violet-700 sm:text-sm">
              Simple &amp; Safe Matchmaking
            </span>
          </div>

          <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            How Dating on Sathi Meet{" "}
            <span className="bg-gradient-to-r from-violet-700 via-fuchsia-600 to-rose-600 bg-clip-text text-transparent">
              Works
            </span>
          </h2>

          <p className="mt-3 text-base sm:text-lg text-slate-600">
            Three simple steps to connecting with verified, interesting companions in your city.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3 relative">
          {STEPS.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="group relative rounded-[32px] border border-slate-200/80 bg-slate-50/50 p-8 transition-all duration-300 hover:-translate-y-2 hover:bg-white hover:shadow-xl hover:border-pink-200"
              >
                {/* Step Pill */}
                <div className="flex items-center justify-between">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${item.bg} shadow-xs transition-transform duration-300 group-hover:scale-110`}>
                    <Icon size={26} />
                  </div>
                  <span className="text-4xl font-black text-slate-200 group-hover:text-pink-300 transition">
                    {item.step}
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-extrabold text-slate-900 group-hover:text-rose-600 transition">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm text-slate-600 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={handleCta}
            className="cursor-pointer inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-600 to-violet-600 px-8 py-4 text-sm sm:text-base font-bold text-white shadow-xl shadow-pink-500/25 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <span>Start Finding Matches Today</span>
            <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </section>
  );
};

export default HowDatingWorks;
