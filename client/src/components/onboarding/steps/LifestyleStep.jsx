import React from "react";

const LIFESTYLE_OPTIONS = {
  drinking: {
    icon: "🍷",
    label: "Drinking",
    options: ["Never", "Occasionally", "Socially", "Regularly"],
  },
  smoking: {
    icon: "🚬",
    label: "Smoking",
    options: ["Never", "Occasionally", "Socially", "Regularly"],
  },
  workout: {
    icon: "🏋️",
    label: "Workout",
    options: ["Never", "Sometimes", "Regularly", "Daily"],
  },
  diet: {
    icon: "🥗",
    label: "Diet",
    options: ["Anything", "Vegetarian", "Vegan", "Non-vegetarian"],
  },
  pets: {
    icon: "🐾",
    label: "Pets",
    options: ["No pets", "Dog", "Cat", "Other", "Love pets"],
  },
};

const LifestyleStep = ({ data, onChange }) => {
  const updateLifestyle = (key, value) => {
    onChange({
      lifestyle: {
        ...(data.lifestyle || {}),
        [key]: value,
      },
    });
  };

  return (
    <div className="space-y-7">
      {/* Heading */}
      <div className="relative">
        <span className="pointer-events-none absolute -top-3 right-0 text-4xl opacity-10 select-none sm:text-5xl">
          🥂
        </span>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-rose-600 ring-1 ring-inset ring-rose-100">
          <span>💗</span> Daily rhythm
        </span>

        <h3 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          Your Lifestyle
        </h3>

        <p className="mt-1.5 text-sm text-slate-500">
          Help others understand your daily habits and vibe
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {Object.entries(LIFESTYLE_OPTIONS).map(([key, { icon, label, options }]) => (
          <div
            key={key}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 text-base">
                {icon}
              </span>
              {label}
            </label>

            <select
              value={data.lifestyle?.[key] || ""}
              onChange={(e) => updateLifestyle(key, e.target.value)}
              className="mt-3 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-500/10"
            >
              <option value="" disabled>
                Select {label.toLowerCase()}
              </option>

              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LifestyleStep;