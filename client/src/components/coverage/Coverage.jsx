import { coverage } from "../../data/coverage";
import { Sparkles, MapPin } from "lucide-react";

const Coverage = () => {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 shadow-xs">
            <Sparkles className="h-4 w-4 text-violet-600 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-violet-700 sm:text-sm">
              Nationwide Reach
            </span>
          </div>

          <h2 className="mt-5 bg-gradient-to-r from-violet-800 via-fuchsia-700 to-pink-600 bg-clip-text text-3xl font-black tracking-tight text-transparent sm:text-5xl lg:text-6xl">
            Sathi Meet Available Across All India
          </h2>

          <p className="mt-4 text-base text-slate-600 sm:text-lg lg:text-xl">
            Trusted companions and personal assistance available in every district.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-12 grid gap-6 sm:mt-16 md:grid-cols-3 lg:gap-8">
          {coverage.map((item) => (
            <div
              key={item.id}
              className="group rounded-3xl border border-violet-100 bg-gradient-to-b from-violet-50/70 to-white p-8 text-center shadow-xs transition-all duration-300 hover:-translate-y-2 hover:border-violet-300 hover:shadow-xl"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-md shadow-violet-500/20 mb-4 transition-transform duration-300 group-hover:scale-110">
                <MapPin size={22} />
              </div>
              <h3 className="text-2xl font-black text-slate-800 sm:text-3xl">
                {item.title}
              </h3>

              <p className="mt-3 leading-relaxed text-slate-600 text-sm sm:text-base">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Text */}
        <p className="mx-auto mt-12 max-w-4xl text-center text-sm leading-relaxed text-slate-600 sm:text-base sm:leading-8">
          Whether you&apos;re in a metro city or a smaller town, <strong>Sathi Meet</strong> helps you connect with trusted and verified professionals across India.
        </p>
      </div>
    </section>
  );
};

export default Coverage;