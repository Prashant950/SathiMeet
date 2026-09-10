import { FaArrowRight, FaBolt, FaUserPlus } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { openAuthModal } from "../auth/AuthModal";

const HeroButtons = () => {
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
    <div className="mt-8 flex w-full max-w-md flex-col items-stretch justify-center gap-4 sm:mt-10 sm:max-w-none sm:flex-row sm:items-center">
      <button
        type="button"
        onClick={handleCtaClick}
        className="cursor-pointer group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-violet-700 via-indigo-600 to-fuchsia-600 px-7 py-4 text-base font-bold text-white shadow-[0_16px_36px_rgba(109,40,217,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(109,40,217,0.4)] active:scale-95 sm:w-auto sm:px-9 sm:py-4.5 sm:text-lg"
      >
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        <span className="relative flex items-center justify-center gap-2.5">
          <FaBolt className="text-sm text-yellow-300" />
          Find a Sathi Meet Partner
          <FaArrowRight className="text-sm transition-transform duration-300 group-hover:translate-x-1.5" />
        </span>
      </button>

      <button
        type="button"
        onClick={handleCtaClick}
        className="cursor-pointer group relative w-full rounded-2xl border-2 border-violet-300 bg-white/90 px-7 py-4 text-base font-bold text-violet-800 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-violet-600 hover:bg-violet-600 hover:text-white hover:shadow-lg active:scale-95 sm:w-auto sm:px-9 sm:py-4.5 sm:text-lg"
      >
        <span className="flex items-center justify-center gap-2.5">
          <FaUserPlus className="text-sm" />
          Become a Sathi Meet Partner
          <FaArrowRight className="text-sm transition-transform duration-300 group-hover:translate-x-1.5" />
        </span>
      </button>
    </div>
  );
};

export default HeroButtons;