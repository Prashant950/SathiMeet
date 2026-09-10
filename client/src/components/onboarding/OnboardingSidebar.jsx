import React from "react";
import { Sparkles, Check, LogOut } from "lucide-react";

const ONBOARDING_STEPS = [
  {
    id: "basic",
    number: 1,
    label: "Basic Information",
    icon: "👤",
  },
  {
    id: "interests",
    number: 2,
    label: "Interests & Hobbies",
    icon: "✨",
  },
  {
    id: "physical",
    number: 3,
    label: "Physical & Preferences",
    icon: "💫",
  },
  {
    id: "lifestyle",
    number: 4,
    label: "Lifestyle Habits",
    icon: "🍸",
  },
  {
    id: "location",
    number: 5,
    label: "Location & City",
    icon: "📍",
  },
  {
    id: "career",
    number: 6,
    label: "Career & Bio",
    icon: "💼",
  },
  {
    id: "photos",
    number: 7,
    label: "Profile Photos",
    icon: "📸",
  },
];

const OnboardingSidebar = ({
  activeStep,
  completedSteps = new Set(),
  progress = 0,
  onStepClick,
  onLogout,
}) => {
  return (
    <aside className="dashboard-sidebar onboarding-sidebar relative flex min-h-screen w-full flex-col overflow-hidden bg-gradient-to-b from-violet-950 via-purple-950 to-indigo-950 p-6 sm:p-7 lg:sticky lg:top-0 lg:w-80 border-r border-violet-800/30">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-60 w-60 rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-20 h-60 w-60 rounded-full bg-violet-600/25 blur-3xl" />

      {/* Mobile Logout */}
      <div className="absolute right-5 top-5 z-20 lg:hidden">
        <button
          type="button"
          onClick={onLogout}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md transition hover:bg-white/20"
        >
          <LogOut size={13} /> Logout
        </button>
      </div>

      {/* Header Info */}
      <div className="relative mb-8">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/30 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-pink-300 backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
          <span>Sathi Meet Profile</span>
        </div>

        <h2 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">
          Build Your <br />
          <span className="bg-gradient-to-r from-pink-300 via-fuchsia-300 to-amber-200 bg-clip-text text-transparent">
            Presence
          </span>
        </h2>

        <p className="mt-2 text-xs font-medium text-violet-200/90 leading-relaxed">
          Complete your 7 steps to unlock verified matches and companion bookings.
        </p>

        {/* Progress Gauge */}
        <div className="mt-6 space-y-2 rounded-2xl bg-white/10 p-3.5 border border-white/15 backdrop-blur-sm shadow-inner">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-violet-100">Setup Progress</span>
            <span className="text-pink-300 font-extrabold">{progress}%</span>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-violet-950/60 p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-400 transition-all duration-500 shadow-sm shadow-pink-500/50"
              style={{
                width: `${Math.min(Math.max(progress, 0), 100)}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Navigation Steps */}
      <nav className="relative flex-1 space-y-2 overflow-y-auto pr-1">
        {ONBOARDING_STEPS.map((step) => {
          const isActive = activeStep === step.id;
          const isCompleted = completedSteps.has(step.id);

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onStepClick?.(step.id)}
              className={[
                "group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-white to-pink-50 text-violet-950 shadow-xl shadow-fuchsia-500/20 scale-[1.02]"
                  : isCompleted
                    ? "bg-white/10 text-white hover:bg-white/15 border border-white/10"
                    : "text-violet-200/80 hover:bg-white/5 hover:text-white",
              ].join(" ")}
            >
              <span
                className={[
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-xs font-black transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-md"
                    : isCompleted
                      ? "bg-emerald-500 text-white shadow-xs"
                      : "bg-white/10 text-violet-300 ring-1 ring-white/15 group-hover:bg-white/20",
                ].join(" ")}
              >
                {isCompleted ? <Check size={14} className="stroke-[3]" /> : step.number}
              </span>

              <span
                className={[
                  "flex-1 text-xs sm:text-sm",
                  isActive
                    ? "font-extrabold text-violet-950"
                    : isCompleted
                      ? "font-medium text-white"
                      : "text-violet-200/90",
                ].join(" ")}
              >
                {step.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="relative mt-6 pt-3 border-t border-white/10">
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-bold text-violet-200 hover:bg-red-500/20 hover:text-white hover:border-red-400/30 transition-all duration-200"
        >
          <LogOut size={14} />
          <span>Exit / Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default OnboardingSidebar;