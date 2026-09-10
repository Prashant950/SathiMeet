
const INTEREST_OPTIONS = [
  { label: "Travel", icon: "✈️" },
  { label: "Music", icon: "🎵" },
  { label: "Movies", icon: "🎬" },
  { label: "Sports", icon: "⚽" },
  { label: "Fitness", icon: "💪" },
  { label: "Reading", icon: "📚" },
  { label: "Cooking", icon: "🍳" },
  { label: "Photography", icon: "📷" },
  { label: "Gaming", icon: "🎮" },
  { label: "Art", icon: "🎨" },
  { label: "Dancing", icon: "💃" },
  { label: "Nature", icon: "🌿" },
  { label: "Technology", icon: "💻" },
  { label: "Fashion", icon: "👗" },
  { label: "Food", icon: "🍕" },
  { label: "Pets", icon: "🐾" },
];

const MIN_REQUIRED = 3;

const InterestsStep = ({ data, onChange }) => {
  const selectedInterests = data.interests || [];
  const count = selectedInterests.length;

  const toggleInterest = (interest) => {
    const updated = selectedInterests.includes(interest)
      ? selectedInterests.filter((item) => item !== interest)
      : [...selectedInterests, interest];

    onChange({
      interests: updated,
    });
  };

  return (
    <div className="space-y-7">
      <div className="relative">
        <span className="pointer-events-none absolute -top-3 right-0 text-4xl opacity-10 select-none sm:text-5xl">
          ✨
        </span>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-violet-700 ring-1 ring-inset ring-violet-100">
          <span>✦</span> Show your vibe
        </span>

        <h3 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          What do you enjoy?
        </h3>

        <p className="mt-1.5 text-sm text-slate-500">
          Pick at least {MIN_REQUIRED} interests so we can tailor recommendations to your style
        </p>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 text-sm font-bold text-white">
          {count}
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-800">
            {count >= MIN_REQUIRED
              ? "Nice mix — your profile is looking strong."
              : `Select ${MIN_REQUIRED - count} more to continue`}
          </p>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 via-cyan-500 to-emerald-400 transition-all duration-500"
              style={{
                width: `${Math.min((count / MIN_REQUIRED) * 100, 100)}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Interest chips */}
      <div className="flex flex-wrap gap-2.5">
        {INTEREST_OPTIONS.map(({ label, icon }) => {
          const selected = selectedInterests.includes(label);

          return (
            <button
              key={label}
              type="button"
              onClick={() => toggleInterest(label)}
              className={[
                "inline-flex items-center gap-1.5 rounded-full border-2 px-4 py-2.5 text-sm font-semibold transition-all duration-200",
                selected
                  ? "border-transparent bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white shadow-[0_8px_22px_rgba(99,102,241,0.28)] scale-[1.03]"
                  : "border-slate-200 bg-white text-slate-600 hover:-translate-y-0.5 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700",
              ].join(" ")}
            >
              <span>{icon}</span>
              {label}
              {selected && <span className="ml-0.5">✓</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default InterestsStep;