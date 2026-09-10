import { Sparkles } from "lucide-react";

const AboutHero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-violet-50/60 via-white to-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-100/80 px-5 py-2 shadow-xs">
          <Sparkles size={14} className="text-violet-600 animate-pulse" />
          <span className="text-xs sm:text-sm font-bold text-violet-800">
            🇮🇳 India&apos;s #1 Professional Social Support &amp; Companion Platform
          </span>
        </div>

        {/* Heading */}
        <h1 className="mt-8 bg-gradient-to-r from-violet-800 via-fuchsia-700 to-pink-600 bg-clip-text text-4xl font-black text-transparent sm:text-6xl lg:text-7xl">
          About Sathi Meet
        </h1>

        {/* Quote */}
        <p className="mx-auto mt-8 max-w-4xl text-base leading-relaxed text-slate-600 sm:text-lg sm:leading-9">
          &ldquo;People are extremely active on social media, but disconnected from
          relatives, neighbours and even close friends. When they need help —
          lifestyle assistance, someone to shop with, or even just a trusted movie
          companion — they often have no one to turn to.&rdquo;
        </p>

        {/* Bottom Text */}
        <p className="mt-6 text-base font-bold text-slate-800 sm:text-lg">
          This isn&apos;t just a quote. This is the reality of modern India.
        </p>
      </div>
    </section>
  );
};

export default AboutHero;