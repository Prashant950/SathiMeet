import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { openAuthModal } from "../auth/AuthModal";

const PricingCard = ({ plan }) => {
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
    <div
      className={`rounded-2xl border p-5 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl sm:rounded-3xl sm:p-6 md:p-8 ${
        plan.highlight
          ? "border-violet-600 bg-violet-50"
          : "border-gray-200 bg-white"
      }`}
    >
      {/* Title */}
      <h3 className="text-xl font-bold text-slate-800 sm:text-2xl md:text-3xl">
        {plan.title}
      </h3>

      {/* Price */}
      <p className="mt-3 text-3xl font-extrabold text-violet-600 sm:mt-4 sm:text-4xl md:text-5xl">
        {plan.price}
      </p>

      {/* Subtitle */}
      <p className="mt-2 text-sm text-slate-600 sm:text-base">
        {plan.subtitle}
      </p>

      {/* Features */}
      <div className="mt-5 space-y-3 sm:mt-6 sm:space-y-3.5 md:mt-8 md:space-y-4">
        {plan.features.map((feature, index) => (
          <div
            key={index}
            className="flex items-center gap-3"
          >
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-600 sm:h-6 sm:w-6 sm:text-sm">
              ✓
            </div>

            <span className="text-sm text-slate-700 sm:text-base">
              {feature}
            </span>
          </div>
        ))}
      </div>

      {/* Button */}
      <button
        type="button"
        onClick={handleCtaClick}
        className={`cursor-pointer mt-6 w-full rounded-full py-2.5 text-sm font-semibold text-white transition hover:scale-105 sm:mt-8 sm:py-3 sm:text-base md:mt-10 ${
          plan.highlight
            ? "bg-gradient-to-r from-violet-700 to-pink-600"
            : "bg-emerald-600 hover:bg-emerald-700"
        }`}
      >
        {plan.button}
      </button>
    </div>
  );
};

export default PricingCard;