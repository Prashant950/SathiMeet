import React from "react";

const HEIGHT_OPTIONS = [
  "4'10\"",
  "5'0\"",
  "5'2\"",
  "5'4\"",
  "5'6\"",
  "5'8\"",
  "5'10\"",
  "6'0\"",
  "6'2\"",
  "6'4\"",
];

const WEIGHT_OPTIONS = [
  "45 kg",
  "50 kg",
  "55 kg",
  "60 kg",
  "65 kg",
  "70 kg",
  "75 kg",
  "80 kg",
  "85 kg",
  "90 kg",
  "95 kg",
  "100+ kg",
];

const LOOKING_FOR_OPTIONS = [
  { label: "Relationship", icon: "💑" },
  { label: "Long-term relationship", icon: "💍" },
  { label: "Marriage", icon: "👰" },
  { label: "Friendship", icon: "🤝" },
  { label: "Casual dating", icon: "😉" },
  { label: "Companionship", icon: "🫶" },
];

const PhysicalStep = ({ data, onChange }) => {
  const toggleLookingFor = (item) => {
    const current = data.lookingFor || [];

    const updated = current.includes(item)
      ? current.filter((value) => value !== item)
      : [...current, item];

    onChange({
      lookingFor: updated,
    });
  };

  return (
    <div className="space-y-7">
      {/* Heading */}
      <div className="relative">
        <span className="pointer-events-none absolute -top-3 right-0 text-4xl opacity-10 select-none sm:text-5xl">
          💫
        </span>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-rose-600 ring-1 ring-inset ring-rose-100">
          <span>💗</span> A little about you
        </span>

        <h3 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          Physical & Preferences
        </h3>

        <p className="mt-1.5 text-sm text-slate-500">
          Share your details and what you&apos;re looking for in a match
        </p>
      </div>

      {/* Height & Weight */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 text-base">
              📏
            </span>
            Height
          </label>

          <select
            value={data.height || ""}
            onChange={(e) =>
              onChange({
                height: e.target.value,
              })
            }
            className="mt-3 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-500/10"
          >
            <option value="" disabled>
              Select height
            </option>

            {HEIGHT_OPTIONS.map((height) => (
              <option key={height} value={height}>
                {height}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 text-base">
              ⚖️
            </span>
            Weight
          </label>

          <select
            value={data.weight || ""}
            onChange={(e) =>
              onChange({
                weight: e.target.value,
              })
            }
            className="mt-3 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-500/10"
          >
            <option value="" disabled>
              Select weight
            </option>

            {WEIGHT_OPTIONS.map((weight) => (
              <option key={weight} value={weight}>
                {weight}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Age Range */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 text-base">
            💘
          </span>
          Partner Age Range
        </label>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1 min-w-[110px]">
            <span className="text-xs font-medium text-slate-400">Min</span>
            <input
              type="number"
              min={18}
              max={99}
              value={data.ageRange?.min ?? 18}
              onChange={(e) =>
                onChange({
                  ageRange: {
                    ...(data.ageRange || {}),
                    min: parseInt(e.target.value, 10) || 18,
                  },
                })
              }
              className="h-10 w-full bg-transparent text-sm font-semibold text-slate-900 outline-none"
            />
          </div>

          <span className="text-lg text-rose-400">❤️</span>

          <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1 min-w-[110px]">
            <span className="text-xs font-medium text-slate-400">Max</span>
            <input
              type="number"
              min={18}
              max={99}
              value={data.ageRange?.max ?? 35}
              onChange={(e) =>
                onChange({
                  ageRange: {
                    ...(data.ageRange || {}),
                    max: parseInt(e.target.value, 10) || 35,
                  },
                })
              }
              className="h-10 w-full bg-transparent text-sm font-semibold text-slate-900 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Looking For */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 text-base">
            🔍
          </span>
          Looking For
        </label>

        <div className="mt-3 flex flex-wrap gap-2">
          {LOOKING_FOR_OPTIONS.map(({ label: item, icon }) => {
            const selected = (data.lookingFor || []).includes(item);

            return (
              <button
                key={item}
                type="button"
                onClick={() => toggleLookingFor(item)}
                className={[
                  "inline-flex items-center gap-1.5 rounded-full border-2 px-4 py-2 text-sm font-semibold transition-all duration-200",
                  selected
                    ? "border-transparent bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 text-white shadow-[0_6px_16px_rgba(236,72,153,0.35)]"
                    : "border-slate-200 bg-white text-slate-700 hover:-translate-y-0.5 hover:border-rose-300 hover:bg-rose-50",
                ].join(" ")}
              >
                <span>{icon}</span>
                {item}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PhysicalStep;