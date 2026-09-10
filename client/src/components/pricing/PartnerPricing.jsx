import { FaStar, FaMoneyBillWave } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { openAuthModal } from "../auth/AuthModal";
import { membershipPlans } from "../../data/pricing";

const PartnerPricing = () => {
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
    <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:p-6 lg:p-7">
      {/* Icon */}
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 sm:h-12 sm:w-12 lg:h-14 lg:w-14">
        <FaStar className="text-lg text-emerald-600 sm:text-xl lg:text-2xl" />
      </div>

      {/* Heading */}
      <h3 className="mt-3 text-center text-xl font-bold text-slate-800 sm:mt-4 sm:text-2xl lg:text-3xl">
        For Sathi Meet Partners
      </h3>

      <p className="mt-1.5 text-center text-xs text-gray-500 sm:text-sm">
        Start your earning journey with Sathi Meet
      </p>

      {/* Offer Banner */}
      <div className="mt-4 rounded-lg border border-yellow-300 bg-yellow-100 px-3 py-2 text-center transition-colors duration-300 hover:bg-yellow-200 sm:mt-5">
        <p className="text-xs font-semibold text-yellow-800">
          🎉 Millions Strong Celebration - Up to 60% OFF!
        </p>
      </div>

      {/* Membership Heading */}
      <h4 className="mt-5 text-center text-base font-semibold text-slate-700 sm:mt-6 sm:text-lg">
        Membership Plans
      </h4>

      {/* Plans */}
      <div className="mt-3 space-y-2.5 sm:mt-4 sm:space-y-3">
        {membershipPlans.map((plan) => (
          <div
            key={plan.id}
            className={`flex flex-wrap items-center justify-between gap-1.5 rounded-lg border p-2.5 transition-colors duration-300 sm:p-3 ${
              plan.popular
                ? "border-yellow-400 bg-yellow-50 hover:bg-yellow-100"
                : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700 sm:text-base">{plan.duration}</span>

              {plan.popular && (
                <span className="flex items-center gap-0.5 rounded-full bg-amber-400 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  ⭐ Popular
                </span>
              )}
            </div>

            <div className="text-right">
              <p className="text-[11px] text-gray-400 line-through sm:text-xs">
                {plan.oldPrice}
              </p>

              <p className="text-sm font-bold text-emerald-600 sm:text-base">
                {plan.price}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Earnings Box */}
      <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 sm:mt-6">
        <div className="flex items-center gap-2">
          <FaMoneyBillWave className="text-lg text-emerald-600 sm:text-xl" />

          <h4 className="text-base font-bold text-emerald-700 sm:text-lg">
            Earning Potential
          </h4>
        </div>

        <p className="mt-2.5 text-sm font-medium text-emerald-700 sm:text-base">
          ₹50,000 - ₹1,50,000 Per Month
        </p>

        <p className="mt-1.5 text-xs text-emerald-600">
          Based on your availability & services
        </p>
      </div>

      {/* Button */}
      <button
        type="button"
        onClick={handleCtaClick}
        className="cursor-pointer mt-6 w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-emerald-700 hover:shadow-lg sm:mt-7 sm:py-3"
      >
        Join Now →
      </button>
    </div>
  );
};

export default PartnerPricing;