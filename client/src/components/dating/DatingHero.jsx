import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Sparkles,
  Heart,
  Flame,
  ShieldCheck,
  MapPin,
  ArrowRight,
  Search,
  Star,
  Zap,
  Users,
  Clock
} from "lucide-react";
import { openAuthModal } from "../auth/AuthModal";

const CITIES = [
  "All Indian Cities",
  "Mumbai",
  "Delhi NCR",
  "Bengaluru",
  "Pune",
  "Hyderabad",
  "Kolkata",
  "Chennai",
  "Jaipur",
  "Ahmedabad",
  "Chandigarh"
];

const VIBES = [
  { label: "☕ Cozy Coffee Date", value: "coffee" },
  { label: "🎬 Cinema & Popcorn", value: "movie" },
  { label: "🍷 Dinner & Drinks", value: "dinner" },
  { label: "✈️ Weekend Getaway", value: "travel" },
  { label: "🎵 Concert & Live Music", value: "concert" },
  { label: "🎳 Bowling & Gaming", value: "gaming" },
];

const DatingHero = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [genderPref, setGenderPref] = useState("all");
  const [selectedCity, setSelectedCity] = useState("All Indian Cities");
  const [selectedVibe, setSelectedVibe] = useState("coffee");

  const handleSearchMatches = () => {
    const el = document.getElementById("featured-matches");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/services");
    }
  };

  const handleCtaClick = () => {
    if (isAuthenticated) {
      navigate("/services");
      return;
    }
    openAuthModal();
  };

  return (
    <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_rgba(244,63,94,0.18),_rgba(168,85,247,0.14),_transparent_70%),linear-gradient(180deg,_#ffffff_0%,_#fff5f7_45%,_#fdf2f8_100%)] pb-16 pt-8 sm:pb-24 sm:pt-14 lg:pb-32 lg:pt-20">
      {/* Glow Orbs */}
      <div className="pointer-events-none absolute -left-28 top-10 h-96 w-96 rounded-full bg-rose-300/30 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute -right-28 top-20 h-96 w-96 rounded-full bg-fuchsia-300/30 blur-3xl" />
      <div className="pointer-events-none absolute left-1/3 bottom-0 h-80 w-80 rounded-full bg-violet-300/20 blur-3xl" />

      {/* Floating Decorative Hearts */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="absolute top-16 left-[10%] text-2xl opacity-40 animate-bounce duration-1000">💖</span>
        <span className="absolute top-36 right-[12%] text-3xl opacity-50 animate-pulse">✨</span>
        <span className="absolute top-2/3 left-[6%] text-xl opacity-30">🔥</span>
        <span className="absolute top-1/2 right-[8%] text-2xl opacity-40">💫</span>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">

          {/* Left Column: Dating Headline & Match Finder */}
          <div className="w-full lg:max-w-2xl text-center lg:text-left">

            {/* Top Trending Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-200/80 bg-white/90 px-4 py-1.5 shadow-[0_4px_20px_rgba(244,63,94,0.12)] backdrop-blur-md">
              <Flame className="h-4 w-4 text-rose-500 fill-rose-500 animate-pulse" />
              <span className="text-xs font-extrabold uppercase tracking-wider bg-gradient-to-r from-rose-600 to-fuchsia-600 bg-clip-text text-transparent sm:text-sm">
                India&apos;s Premier Dating &amp; Social Companion Hub
              </span>
            </div>

            {/* Main Punchy Dating Headline */}
            <h1 className="mt-5 text-3xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Find Your{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-rose-500 via-fuchsia-500 to-violet-600 bg-clip-text text-transparent">
                  Sathi Meet
                </span>
                <span className="absolute -bottom-1 left-0 right-0 h-2 rounded-full bg-gradient-to-r from-rose-400/40 via-fuchsia-400/40 to-violet-400/40 -z-10" />
              </span>
              , Meet Verified Companions
            </h1>

            {/* Subheading */}
            <p className="mt-5 text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Say goodbye to endless texting and fake profiles. Match with 100% ID-verified singles &amp; companions for safe, public dates, movies, coffee chats, and unforgettable memories.
            </p>

            {/* Trust Badges */}
            <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs font-bold text-slate-600">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-emerald-800">
                <ShieldCheck size={14} className="text-emerald-600" />
                100% ID Verified Singles
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 border border-rose-200 px-3 py-1 text-rose-800">
                <Heart size={13} className="text-rose-500 fill-rose-500" />
                Public &amp; Consent First
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 border border-violet-200 px-3 py-1 text-violet-800">
                <Sparkles size={13} className="text-violet-600" />
                Zero Awkward Ghosting
              </span>
            </div>

          </div>

          {/* Right Column: Dynamic Dating Profile Cards & Compatibility Aura */}
          <div className="w-full lg:max-w-md relative flex items-center justify-center">

            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/20 via-fuchsia-500/20 to-violet-500/20 rounded-full blur-2xl transform scale-95 animate-pulse" />

            {/* Main Featured Dating Card */}
            <div className="relative w-full max-w-sm rounded-[32px] border-2 border-white/80 bg-white p-4 shadow-[0_25px_60px_rgba(244,63,94,0.18)] backdrop-blur-xl">

              {/* Image Container with Badges */}
              <div className="relative h-80 w-full overflow-hidden rounded-[26px] bg-slate-100">
                <img
                  src="/images/profiles/aanya.jpg"
                  alt="Aanya Sharma - Dating Match"
                  className="h-full w-full object-cover object-center"
                />

                {/* Dark Gradient Overlay for typography */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                {/* Live Match Badge */}
                <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 rounded-full bg-rose-600/90 px-3 py-1 text-xs font-bold text-white shadow-md backdrop-blur-md">
                  <Flame size={13} className="fill-white" />
                  <span>99% Compatibility</span>
                </div>

                {/* Online Indicator */}
                <div className="absolute top-3.5 right-3.5 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-emerald-700 backdrop-blur-md shadow-xs">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Online Now</span>
                </div>

                {/* Card Profile Info */}
                <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-black tracking-tight">Aanya Sharma, 24</h3>
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-[10px] text-white">✓</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-rose-200 font-semibold mt-0.5">
                    <MapPin size={12} className="text-rose-400" />
                    <span>Bandra West, Mumbai</span>
                    <span className="text-white/40">•</span>
                    <span>₹1,500/hr</span>
                  </div>

                  <p className="text-xs text-white/90 mt-1.5 line-clamp-1">
                    "Coffee addict, indie music lover &amp; weekend cafe explorer ☕🎧"
                  </p>

                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {["☕ Coffee Dates", "🎧 Indie Music", "🎨 Art Walks"].map((tag) => (
                      <span key={tag} className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons below card */}
              <div className="mt-3.5 flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleCtaClick}
                  className="cursor-pointer flex-1 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-rose-500/30 transition hover:brightness-105 active:scale-95"
                >
                  <Heart size={15} className="fill-white" />
                  <span>Connect with Sathi</span>
                </button>

                <button
                  type="button"
                  onClick={handleCtaClick}
                  className="cursor-pointer flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition"
                  aria-label="Favorite profile"
                >
                  <Star size={18} />
                </button>
              </div>

              {/* Floating Match Floating Pill (Left) */}
              <div className="absolute -left-6 top-1/3 hidden sm:flex items-center gap-2 rounded-2xl border border-white/80 bg-white/95 p-2.5 shadow-xl backdrop-blur-md animate-bounce duration-1000">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                  <Heart size={16} className="fill-rose-500 text-rose-500" />
                </div>
                <div className="text-left pr-2">
                  <p className="text-[11px] font-bold text-slate-800">It's a Match! 🎉</p>
                  <p className="text-[10px] text-slate-500 font-medium">Coffee Date booked</p>
                </div>
              </div>

              {/* Floating Verified Partner Pill (Right) */}
              <div className="absolute -right-6 bottom-16 hidden sm:flex items-center gap-2 rounded-2xl border border-white/80 bg-white/95 p-2.5 shadow-xl backdrop-blur-md">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <ShieldCheck size={16} />
                </div>
                <div className="text-left pr-2">
                  <p className="text-[11px] font-bold text-slate-800">100% ID Verified</p>
                  <p className="text-[10px] text-emerald-600 font-semibold">Selfie Confirmed</p>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Dating Stats Bar */}
        <div className="mt-14 sm:mt-18 rounded-3xl border border-rose-100/80 bg-white/80 p-6 sm:p-8 shadow-sm backdrop-blur-md">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                500,000+
              </p>
              <p className="text-xs sm:text-sm font-bold text-slate-600 mt-1">Verified Singles &amp; Companions</p>
            </div>
            <div>
              <p className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-fuchsia-600 to-purple-600 bg-clip-text text-transparent">
                99.4%
              </p>
              <p className="text-xs sm:text-sm font-bold text-slate-600 mt-1">Safe Date Satisfaction Rate</p>
            </div>
            <div>
              <p className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                700+
              </p>
              <p className="text-xs sm:text-sm font-bold text-slate-600 mt-1">Indian Cities Covered</p>
            </div>
            <div>
              <p className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                &lt; 5 Mins
              </p>
              <p className="text-xs sm:text-sm font-bold text-slate-600 mt-1">Instant Match Time</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default DatingHero;
