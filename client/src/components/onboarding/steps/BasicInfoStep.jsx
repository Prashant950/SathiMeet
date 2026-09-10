
const BasicInfoStep = ({ data, onChange }) => {
  return (
    <div className="space-y-7">
      <div className="relative">
        <span className="pointer-events-none absolute -top-3 right-0 text-4xl opacity-10 select-none sm:text-5xl">
          ✦
        </span>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-violet-700 ring-1 ring-inset ring-violet-100">
          <span>✦</span> Let&apos;s get started
        </span>

        <h3 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          Your basics
        </h3>

        <p className="mt-1.5 text-sm text-slate-500">
          A few quick details so we can tailor your profile experience
        </p>
      </div>

      {/* Fields */}
      <div className="space-y-5">
        {/* Age */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
          <label
            htmlFor="age"
            className="flex items-center gap-2 text-sm font-semibold text-slate-700"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 text-base">
              🎂
            </span>
            How old are you?
          </label>

          <input
            id="age"
            type="number"
            min={18}
            max={99}
            value={data.age}
            onChange={(e) =>
              onChange({
                age: parseInt(e.target.value, 10) || 18,
              })
            }
            className="mt-3 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-base font-semibold text-slate-900 outline-none transition focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-500/10"
          />
        </div>

        {/* Gender */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 text-base">
              ✨
            </span>
            I identify as
          </label>

          <div className="mt-3 grid grid-cols-2 gap-3">
            {[
              { value: "Male", label: "Male", icon: "🙋‍♂️" },
              { value: "Female", label: "Female", icon: "🙋‍♀️" },
            ].map((option) => {
              const selected = data.gender === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onChange({ gender: option.value })}
                  className={[
                    "group relative flex flex-col items-center gap-2 rounded-2xl border-2 px-4 py-5 text-sm font-semibold transition-all",
                    selected
                      ? "border-rose-500 bg-gradient-to-br from-rose-50 to-pink-50 text-rose-700 shadow-[0_8px_20px_rgba(244,63,94,0.15)]"
                      : "border-slate-200 bg-white text-slate-600 hover:border-rose-200 hover:bg-rose-50/40",
                  ].join(" ")}
                >
                  {selected && (
                    <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-xs text-white shadow-md">
                      ❤️
                    </span>
                  )}
                  <span className="text-2xl">{option.icon}</span>
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoStep;