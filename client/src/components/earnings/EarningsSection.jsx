import {
  FaRupeeSign,
  FaPercentage,
  FaUsers,
  FaIdCard,
  FaCheckCircle,
  FaArrowRight,
  FaHandshake,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { openAuthModal } from "../auth/AuthModal";
import { stats, earningWays } from "../../data/earnings";

const statIcons = [FaRupeeSign, FaPercentage, FaUsers, FaIdCard];

const EarningsSection = () => {
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
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-700 via-emerald-600 to-emerald-600 py-12 sm:py-16 lg:py-20">
      {/* Ambient decorative glows, same palette */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-emerald-400/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5">
        {/* Heading */}
        <div className="text-center text-white">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold backdrop-blur-sm sm:text-sm">
            <span className="motion-safe:animate-pulse">💰</span>
            Highest Paying Platform
          </span>

          <h2 className="mt-5 text-3xl font-extrabold leading-tight sm:mt-6 sm:text-4xl lg:text-5xl">
            Earn Upto ₹2,000 Per Hour
          </h2>

          <p className="mx-auto mt-3 max-w-3xl text-sm text-emerald-100 sm:mt-4 sm:text-base lg:text-lg">
            Join India's trusted support platform. Set your own rates, choose
            your own schedule and earn while helping people.
          </p>
        </div>

        {/* Stats */}
        <div className="mt-8 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {stats.map((item, i) => {
            const Icon = statIcons[i % statIcons.length];
            return (
              <div
                key={item.label}
                className="group rounded-2xl border border-white/10 bg-white/10 p-5 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-white/30 hover:bg-white/15 sm:p-6"
              >
                <Icon className="mx-auto text-lg text-emerald-100 opacity-80 transition-transform duration-300 group-hover:scale-110 sm:text-xl" />

                <h3 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
                  {item.value}
                </h3>

                <p className="mt-1.5 text-xs text-emerald-100 sm:text-sm">
                  {item.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Community Banner */}
        <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-400 px-6 py-5 text-center shadow-lg sm:mt-8 sm:flex-row sm:justify-center sm:gap-4 sm:text-left">
          <FaHandshake className="text-3xl text-white/90 sm:text-4xl" />
          <div>
            <h3 className="text-lg font-bold text-white sm:text-xl">
              Millions Strong Community
            </h3>
            <p className="text-xs text-white/90 sm:text-sm">
              Trusted by professionals across India
            </p>
          </div>
        </div>

        {/* How Partners Earn */}
        <div className="mx-auto mt-6 max-w-4xl rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-md sm:mt-8 sm:p-8">
          <h3 className="mb-5 text-center text-xl font-bold text-white sm:mb-6 sm:text-2xl">
            How Sathi Meet Partners Earn
          </h3>

          <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
            {earningWays.map((item) => (
              <div
                key={item}
                className="group flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3.5 text-white transition-all duration-300 hover:translate-x-1 hover:bg-white/20 sm:px-5 sm:py-4"
              >
                <FaCheckCircle className="shrink-0 text-emerald-200 transition-transform duration-300 group-hover:scale-110" />
                <span className="text-sm sm:text-base font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Button */}
        <div className="mt-8 text-center sm:mt-10">
          <button className="cursor-pointer group relative inline-flex items-center gap-2 overflow-hidden rounded-2xl bg-white px-8 py-4 text-sm font-bold text-emerald-800 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95 sm:px-10 sm:py-4.5 sm:text-base" onClick={handleCtaClick}>
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-emerald-100/60 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <span className="relative">Start Earning with Sathi Meet</span>
            <FaArrowRight className="relative text-sm transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default EarningsSection;