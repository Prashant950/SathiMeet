import { features } from "../../data/features";
import FeatureCard from "./FeatureCard";
import { Sparkles } from "lucide-react";

const WhyChooseUs = () => {
  return (
    <section
      id="why-choose-us"
      className="relative scroll-mt-20 overflow-hidden bg-white py-16 sm:py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 shadow-xs">
            <Sparkles className="h-4 w-4 text-violet-600 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-violet-700 sm:text-sm">
              Why Sathi Meet
            </span>
          </div>

          <h2 className="mt-5 bg-gradient-to-r from-violet-800 via-fuchsia-700 to-pink-600 bg-clip-text text-3xl font-black tracking-tight text-transparent sm:text-5xl lg:text-6xl">
            Why Choose Sathi Meet
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg lg:text-xl">
            India&apos;s #1 Trusted Social &amp; Lifestyle Support Companion Platform
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:mt-16 sm:gap-6 md:grid-cols-2 lg:gap-8 xl:grid-cols-4">
          {features.map((feature) => (
            <FeatureCard
              key={feature.id}
              feature={feature}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;