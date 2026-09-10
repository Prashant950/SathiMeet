import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Sparkles, ArrowRight, Heart, MapPin } from "lucide-react";
import { dateVibesData } from "../../data/datingProfiles";
import { openAuthModal } from "../auth/AuthModal";

const DateVibes = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const handleBookVibe = (vibe) => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    navigate("/services");
  };

  return (
    <section className="bg-gradient-to-b from-rose-50/40 via-white to-violet-50/40 py-16 sm:py-20 lg:py-28 relative overflow-hidden">
      {/* Decorative ambient blobs */}
      <div className="pointer-events-none absolute -left-20 top-1/3 h-80 w-80 rounded-full bg-pink-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-1/3 h-80 w-80 rounded-full bg-violet-200/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-200 bg-fuchsia-50 px-4 py-1.5 shadow-xs">
            <Sparkles className="h-4 w-4 text-fuchsia-600 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-fuchsia-700 sm:text-sm">
              Tailored Date Experiences
            </span>
          </div>

          <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Choose Your Perfect{" "}
            <span className="bg-gradient-to-r from-fuchsia-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
              Date Vibe
            </span>
          </h2>

          <p className="mt-3 text-base sm:text-lg text-slate-600">
            From relaxed cafe conversations to high-energy concerts and weekend roadtrips — find the right companion for every mood.
          </p>
        </div>

        {/* Date Vibes Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dateVibesData.map((vibe) => (
            <div
              key={vibe.id}
              className="group relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-pink-300 flex flex-col justify-between"
            >
              <div>
                {/* Image Banner */}
                <div className="relative h-44 w-full overflow-hidden rounded-2xl bg-slate-100 mb-4">
                  <img
                    src={vibe.image}
                    alt={vibe.title}
                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  
                  {/* Top Rate Badge */}
                  <div className="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-900 backdrop-blur-md shadow-xs">
                    {vibe.rate}
                  </div>

                  {/* Icon & Title on Image */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white">
                    <span className="text-2xl">{vibe.icon}</span>
                    <h3 className="text-lg font-black tracking-tight">{vibe.title}</h3>
                  </div>
                </div>

                {/* Tagline */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  {vibe.tagline}
                </p>

                {/* Popular Venues */}
                <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <MapPin size={13} className="text-pink-500 shrink-0" />
                  <span className="truncate">Popular at: {vibe.popularVenue}</span>
                </div>
              </div>

              {/* Book Button */}
              <div className="mt-5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleBookVibe(vibe)}
                  className="cursor-pointer w-full flex items-center justify-center gap-2 rounded-xl bg-slate-50 border border-slate-200 py-2.5 text-xs sm:text-sm font-bold text-slate-800 transition hover:bg-gradient-to-r hover:from-rose-500 hover:to-pink-600 hover:text-white hover:border-transparent active:scale-95 group-hover:bg-rose-50 group-hover:text-rose-700 group-hover:border-rose-200"
                >
                  <Heart size={14} className="text-rose-500 group-hover:text-white transition" />
                  <span>Book This Date Vibe</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default DateVibes;
