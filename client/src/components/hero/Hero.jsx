import HeroButtons from "./HeroButtons";
import HeroStats from "./HeroStats";
import { ShieldCheck, Heart, MapPin, Sparkles } from "lucide-react";

const ConstellationBackground = () => {
  const nodes = [
    { x: 90, y: 60, r: 4, delay: "0s" },
    { x: 230, y: 30, r: 3, delay: "0.6s" },
    { x: 340, y: 110, r: 5, delay: "1.2s" },
    { x: 500, y: 45, r: 3, delay: "0.3s" },
    { x: 640, y: 95, r: 4, delay: "1.8s" },
    { x: 780, y: 40, r: 3, delay: "0.9s" },
    { x: 900, y: 100, r: 5, delay: "1.5s" },
    { x: 1030, y: 55, r: 3, delay: "0.4s" },
  ];

  const edges = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [5, 6],
    [6, 7],
    [1, 3],
    [4, 6],
  ];

  return (
    <svg
      className="pointer-events-none absolute inset-x-0 top-8 mx-auto hidden h-[160px] w-full max-w-6xl opacity-30 lg:block"
      viewBox="0 0 1120 160"
      fill="none"
      aria-hidden="true"
    >
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a].x}
          y1={nodes[a].y}
          x2={nodes[b].x}
          y2={nodes[b].y}
          stroke="url(#sathi-line)"
          strokeWidth="1"
        />
      ))}
      {nodes.map((n, i) => (
        <circle
          key={i}
          cx={n.x}
          cy={n.y}
          r={n.r}
          fill={i % 2 === 0 ? "#8b5cf6" : "#ec4899"}
          className="motion-safe:animate-[sathi-pulse_3.5s_ease-in-out_infinite]"
          style={{ animationDelay: n.delay, transformOrigin: `${n.x}px ${n.y}px` }}
        />
      ))}
      <defs>
        <linearGradient id="sathi-line" x1="0" y1="0" x2="1120" y2="0">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#ec4899" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.6" />
        </linearGradient>
      </defs>
    </svg>
  );
};

const Hero = () => {
  return (
    <section
      id="home"
      className="relative scroll-mt-20 overflow-hidden bg-[radial-gradient(ellipse_at_top,_rgba(139,92,246,0.18),_transparent_50%),linear-gradient(180deg,_#ffffff_0%,_#faf5ff_50%,_#f8fafc_100%)] pb-12 pt-6 sm:pb-16 sm:pt-10 lg:pb-24 lg:pt-16"
    >
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-16px); }
        }
        @keyframes sathi-pulse {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
      `}</style>

      {/* Grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.25]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(124,58,237,0.2) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Ambient orbs */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-violet-300/30 blur-3xl motion-safe:animate-[float-slow_8s_ease-in-out_infinite]" />
      <div
        className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-pink-300/25 blur-3xl motion-safe:animate-[float-slow_9s_ease-in-out_infinite]"
        style={{ animationDelay: "2s" }}
      />

      <ConstellationBackground />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
        
        {/* Floating Verified Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-white/90 px-4 py-2 shadow-[0_8px_20px_rgba(124,58,237,0.1)] backdrop-blur-md">
          <Sparkles className="h-4 w-4 text-violet-600 animate-pulse" />
          <p className="text-xs font-bold tracking-wide text-violet-800 uppercase sm:text-sm">
            India&apos;s #1 Social &amp; Lifestyle Support Platform
          </p>
        </div>

        {/* Main Headline */}
        <h1 className="mt-6 max-w-5xl text-4xl font-black leading-[1.1] tracking-tight text-slate-900 sm:mt-8 sm:text-6xl lg:text-7xl">
          Meet Your Verified{" "}
          <span className="relative inline-block">
            <span className="bg-gradient-to-r from-violet-700 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent">
              Sathi
            </span>
            <span className="absolute -bottom-1 left-0 right-0 h-2 rounded-full bg-gradient-to-r from-violet-400/40 via-fuchsia-400/40 to-pink-400/40 -z-10" />
          </span>{" "}
          for Everyday Support &amp; Companionship
        </h1>

        {/* Description */}
        <p className="mt-6 max-w-3xl text-base leading-relaxed text-slate-600 sm:mt-8 sm:text-lg sm:leading-8 lg:text-xl">
          Safe, background-verified, and strictly professional lifestyle companions across Indian cities and pin codes — designed for safety, comfort, and a premium experience.
        </p>

        {/* Floating Features Row */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-slate-700 sm:gap-4 sm:text-sm">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 px-3.5 py-1 text-emerald-800">
            <ShieldCheck size={14} className="text-emerald-600" />
            100% ID Verified Partners
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 border border-violet-200/80 px-3.5 py-1 text-violet-800">
            <Heart size={13} className="text-violet-600" />
            Consent-First & Safe
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-pink-50 border border-pink-200/80 px-3.5 py-1 text-pink-800">
            <MapPin size={13} className="text-pink-600" />
            All Indian Pin Codes
          </span>
        </div>

        {/* CTAs */}
        <HeroButtons />

        {/* Stats Row */}
        <HeroStats />

      </div>
    </section>
  );
};

export default Hero;