import { FaUsers, FaMapMarkedAlt, FaShieldAlt, FaHeadset } from "react-icons/fa";

const stats = [
  {
    title: "10 Lac+",
    subtitle: "Sathi Meet Partners",
    icon: FaUsers,
    color: "text-violet-600",
    bg: "bg-violet-50/80 border-violet-100",
    bar: "from-violet-600 to-indigo-500",
  },
  {
    title: "700+ Districts",
    subtitle: "Pan-India Pin Codes",
    icon: FaMapMarkedAlt,
    color: "text-fuchsia-600",
    bg: "bg-fuchsia-50/80 border-fuchsia-100",
    bar: "from-fuchsia-600 to-pink-500",
  },
  {
    title: "100% Verified",
    subtitle: "Safe & Consent-First",
    icon: FaShieldAlt,
    color: "text-emerald-600",
    bg: "bg-emerald-50/80 border-emerald-100",
    bar: "from-emerald-500 to-teal-400",
  },
  {
    title: "24/7",
    subtitle: "Priority Support",
    icon: FaHeadset,
    color: "text-blue-600",
    bg: "bg-blue-50/80 border-blue-100",
    bar: "from-blue-500 to-cyan-400",
  },
];

const HeroStats = () => {
  return (
    <div className="mt-12 grid w-full max-w-5xl grid-cols-2 gap-3.5 sm:mt-16 sm:gap-5 lg:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.title}
            className={`group relative overflow-hidden rounded-3xl border ${item.bg} p-4 sm:p-6 shadow-xs backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
          >
            {/* top accent bar */}
            <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${item.bar}`} />

            <div className="flex items-center justify-between">
              <Icon
                className={`text-xl ${item.color} opacity-80 transition-transform duration-300 group-hover:scale-110 sm:text-2xl`}
              />
            </div>

            <h3 className={`mt-3 text-2xl font-black ${item.color} sm:mt-4 sm:text-3xl`}>
              {item.title}
            </h3>

            <p className="mt-0.5 text-xs font-semibold text-slate-600 sm:mt-1 sm:text-sm">
              {item.subtitle}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default HeroStats;