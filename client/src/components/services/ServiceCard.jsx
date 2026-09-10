import { 
  FaFilm, 
  FaUserFriends, 
  FaUserNurse, 
  FaGlassCheers, 
  FaShoppingBag, 
  FaMapMarkedAlt, 
  FaGamepad, 
  FaMusic, 
  FaCoffee, 
  FaUtensils, 
  FaBriefcase, 
  FaHeart,
  FaArrowRight, 
  FaStar, 
  FaShieldAlt 
} from "react-icons/fa";
import { Sparkles } from "lucide-react";

const getServiceIcon = (service) => {
  if (service?.icon && (typeof service.icon === "function" || typeof service.icon === "object")) {
    return service.icon;
  }
  const title = (service?.title || "").toLowerCase();
  const category = (service?.category || "").toLowerCase();

  if (title.includes("movie") || title.includes("cinema")) return FaFilm;
  if (title.includes("elder") || title.includes("nurse") || title.includes("house")) return FaUserNurse;
  if (title.includes("club") || title.includes("party") || title.includes("nightlife")) return FaGlassCheers;
  if (title.includes("shop")) return FaShoppingBag;
  if (title.includes("tour") || title.includes("city") || category === "travel") return FaMapMarkedAlt;
  if (title.includes("game") || title.includes("gaming")) return FaGamepad;
  if (title.includes("concert") || title.includes("music")) return FaMusic;
  if (title.includes("coffee")) return FaCoffee;
  if (title.includes("cafe") || title.includes("food") || title.includes("dining")) return FaUtensils;
  if (title.includes("network") || title.includes("professional") || title.includes("work")) return FaBriefcase;
  if (category === "entertainment") return FaFilm;
  if (category === "care") return FaUserNurse;
  if (category === "travel") return FaMapMarkedAlt;
  return FaUserFriends;
};

const ServiceCard = ({ service, onBook }) => {
  const Icon = getServiceIcon(service);
  const color = service?.color || "from-violet-600 to-indigo-500";

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-2 hover:border-violet-200 hover:shadow-[0_20px_40px_rgba(109,40,217,0.12)]">
      {/* Background Gradient Glow on hover */}
      <div
        className={`pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-gradient-to-br ${color} opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-20`}
      />

      {/* Card Header & Badge */}
      <div className="relative flex items-center justify-between p-5 pb-0 sm:p-6 sm:pb-0">
        {/* Icon */}
        <div className="relative inline-flex">
          <div
            className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${color} opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-40`}
          />
          <div
            className={`relative inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r ${color} shadow-md transition-transform duration-300 group-hover:scale-105 sm:h-14 sm:w-14`}
          >
            <Icon className="text-xl text-white sm:text-2xl" />
          </div>
        </div>

        {/* Rating & Tag */}
        <div className="flex flex-col items-end gap-1.5">
          {service.tag && (
            <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-0.5 text-[11px] font-bold text-violet-700 border border-violet-100/80">
              <Sparkles size={10} className="text-violet-600" />
              {service.tag}
            </span>
          )}
          <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50/80 px-2 py-0.5 rounded-md border border-amber-100">
            <FaStar className="text-[10px]" />
            <span>{service.rating || "4.9"}</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="relative flex-1 p-5 sm:p-6">
        <h3 className="text-lg font-bold text-slate-800 transition-colors duration-300 group-hover:text-violet-700 sm:text-xl">
          {service.title}
        </h3>

        <p className="mt-2 text-xs leading-relaxed text-slate-500 sm:text-sm line-clamp-2">
          {service.description}
        </p>

        {/* Price & Safety Tag */}
        <div className="mt-5 flex items-center justify-between border-t border-slate-100/80 pt-4">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
              Starting from
            </span>
            <span
              className={`bg-gradient-to-r ${color} bg-clip-text text-lg font-black text-transparent sm:text-xl`}
            >
              {service.price}
            </span>
          </div>

          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
            <FaShieldAlt className="text-[10px]" />
            Verified
          </span>
        </div>
      </div>

      {/* Action Button */}
      <div className="p-5 pt-0 sm:p-6 sm:pt-0">
        <button
          type="button"
          onClick={() => onBook(service)}
          className={`cursor-pointer group/btn relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${color} py-3 text-xs font-bold text-white shadow-md shadow-violet-500/10 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/25 hover:brightness-105 active:scale-98 sm:text-sm`}
        >
          <span>Book Sathi</span>
          <FaArrowRight className="text-xs transition-transform duration-300 group-hover/btn:translate-x-1" />
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;