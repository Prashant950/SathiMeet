import { FaMapMarkedAlt, FaCity, FaMapMarkerAlt, FaBuilding } from "react-icons/fa";

const coverage = [
  {
    title: "All States",
    subtitle: "Every state & UT in India",
    icon: FaMapMarkedAlt,
    titleColor: "text-violet-600",
    bgColor: "bg-violet-50/80 border-violet-100",
    bar: "from-violet-500 to-violet-300",
  },
  {
    title: "All Districts",
    subtitle: "700+ Verified Districts",
    icon: FaCity,
    titleColor: "text-pink-600",
    bgColor: "bg-pink-50/80 border-pink-100",
    bar: "from-pink-500 to-pink-300",
  },
  {
    title: "All Pin Codes",
    subtitle: "Pan-India Local Matching",
    icon: FaMapMarkerAlt,
    titleColor: "text-emerald-600",
    bgColor: "bg-emerald-50/80 border-emerald-100",
    bar: "from-green-500 to-green-300",
  },
  {
    title: "Metro Cities",
    subtitle: "Tier 1, Tier 2 & Tier 3 Hubs",
    icon: FaBuilding,
    titleColor: "text-blue-600",
    bgColor: "bg-blue-50/80 border-blue-100",
    bar: "from-blue-500 to-blue-300",
  },
];

const SupportAcrossIndia = () => {
  return (
    <section className="bg-slate-50/70 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xl sm:p-10 lg:p-14">
          {/* Eyebrow */}
          <div className="text-center">
            <span className="inline-block rounded-full bg-violet-100 px-4 py-1 text-xs font-bold uppercase tracking-wider text-violet-700 sm:text-sm">
              Nationwide Presence
            </span>
          </div>

          {/* Heading */}
          <h2 className="mt-4 text-center text-3xl font-black leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Professional Social Support Service{" "}
            <span className="bg-gradient-to-r from-violet-700 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent">
              Across India
            </span>
          </h2>

          {/* Paragraph 1 */}
          <p className="mt-6 text-center mx-auto max-w-3xl text-sm leading-relaxed text-slate-600 sm:mt-8 sm:text-base sm:leading-8 lg:text-lg">
            Looking for a trusted <strong>social support companion in India?</strong>{" "}
            Sathi Meet is <strong>India&apos;s #1 Social &amp; Lifestyle Support Platform</strong>{" "}
            connecting you with verified professionals across all Indian states, districts, and pin codes.
          </p>

          {/* Cards */}
          <div className="mt-10 grid gap-4 sm:mt-12 sm:gap-5 md:grid-cols-2 lg:grid-cols-4">
            {coverage.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className={`group relative overflow-hidden rounded-3xl border ${item.bgColor} p-6 text-center shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg sm:p-8`}
                >
                  <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${item.bar}`} />

                  <Icon
                    className={`mx-auto text-2xl ${item.titleColor} opacity-80 transition-transform duration-300 group-hover:scale-110 sm:text-3xl`}
                  />

                  <h3 className={`mt-3 text-2xl font-black ${item.titleColor} sm:mt-4 sm:text-3xl`}>
                    {item.title}
                  </h3>

                  <p className="mt-2 text-xs font-semibold text-slate-600 sm:text-sm">
                    {item.subtitle}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Paragraph 2 */}
          <div className="mt-10 rounded-2xl bg-violet-50/60 border border-violet-100 p-5 sm:p-6 text-center sm:text-left">
            <p className="text-sm leading-relaxed text-slate-700 sm:text-base sm:leading-8">
              <strong>Finding a Sathi Meet Partner near you</strong> has never been easier.
              Our platform connects you with verified, professional Sathi Meet partners who provide safe, reliable, and consent-first services. With <strong>millions of registered Sathi Meet Partners</strong> and coverage across <strong>all Indian pin codes</strong>, we ensure premium, trusted support wherever you are.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SupportAcrossIndia;