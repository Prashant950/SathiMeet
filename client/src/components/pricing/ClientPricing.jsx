import { FaUsers } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { openAuthModal } from "../auth/AuthModal";
import { clientServices } from "../../data/pricing";

const ClientPricing = () => {
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
    <div className="rounded-2xl bg-white p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:p-6 lg:p-7">
      {/* Icon */}

      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 sm:h-12 sm:w-12 lg:h-14 lg:w-14">
        <FaUsers className="text-lg text-violet-600 sm:text-xl lg:text-2xl" />
      </div>

      {/* Heading */}

      <h3 className="mt-3 text-center text-xl font-bold text-slate-800 sm:mt-4 sm:text-2xl lg:text-3xl">
        For Clients
      </h3>

      <p className="mt-1.5 text-center text-xs text-gray-500 sm:text-sm">
        Find your perfect companion
      </p>

      {/* Pricing */}

      <div className="mt-5 space-y-2.5 sm:mt-6 sm:space-y-3">
        {clientServices.map((item) => (
          <div
            key={item.service}
            className="flex items-center justify-between border-b border-gray-200 pb-2.5 sm:pb-3"
          >
            <span className="text-sm text-slate-700 sm:text-base">
              {item.service}
            </span>

            <span className="text-sm font-bold text-violet-600 sm:text-base lg:text-lg">
              {item.price}
            </span>
          </div>
        ))}
      </div>

      {/* Button */}

      <button
        type="button"
        onClick={handleCtaClick}
        className="cursor-pointer mt-6 w-full rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg sm:mt-7 sm:py-3"
      >
        Get Started →
      </button>
    </div>
  );
};

export default ClientPricing;