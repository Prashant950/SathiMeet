import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { openAuthModal } from "../auth/AuthModal";
import { Heart, ArrowRight, Flame, UserPlus } from "lucide-react";

const CTASection = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const handleCtaClick = () => {
    if (isAuthenticated) {
      navigate("/services");
      return;
    }

    openAuthModal();
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-rose-950 via-purple-950 to-indigo-950 py-20 lg:py-28 text-white">
      {/* Decorative glows */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-rose-500/25 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-fuchsia-500/25 blur-3xl" />

      <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-rose-200 backdrop-blur-sm">
          <Flame size={14} className="text-rose-400 fill-rose-400 animate-pulse" />
          <span>Find Your Dating Match in 5 Minutes</span>
        </div>

        <h2 className="mt-6 text-3xl font-black leading-tight sm:text-5xl lg:text-6xl">
          Ready to Connect on Sathi Meet?
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-rose-100 sm:text-lg lg:text-xl">
          Join 500,000+ verified members across India. Book verified companions for coffee dates, movie nights, dinners, and memorable events with 100% consent and safety.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            type="button"
            onClick={handleCtaClick}
            className="cursor-pointer flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 px-8 py-4 text-base font-bold text-white shadow-2xl shadow-rose-500/40 transition-all duration-300 hover:scale-105 hover:brightness-110 active:scale-95"
          >
            <Heart size={18} className="fill-white" />
            <span>Find My Sathi Meet Partner</span>
            <ArrowRight size={16} />
          </button>

         
        </div>
      </div>
    </section>
  );
};

export default CTASection;