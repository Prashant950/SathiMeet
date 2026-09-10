import React from "react";

const EDUCATION_OPTIONS = [
  "High School",
  "Diploma",
  "Bachelor's Degree",
  "Master's Degree",
  "Doctorate",
  "Other",
];

const CareerStep = ({ data, onChange }) => {
  const bioLength = (data.bio || "").length;

  return (
    <div className="space-y-7">
      {/* Heading */}
      <div className="relative">
        <span className="pointer-events-none absolute -top-3 right-0 text-4xl opacity-10 select-none sm:text-5xl">
          💼
        </span>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-rose-600 ring-1 ring-inset ring-rose-100">
          <span>💗</span> Life beyond the swipe
        </span>

        <h3 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          Career & About You
        </h3>

        <p className="mt-1.5 text-sm text-slate-500">
          Tell us about your work, education, and personality
        </p>
      </div>

      <div className="space-y-4">
        {/* Job Title */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
          <label
            htmlFor="jobTitle"
            className="flex items-center gap-2 text-sm font-semibold text-slate-700"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 text-base">
              💻
            </span>
            Job Title
          </label>

          <input
            id="jobTitle"
            type="text"
            value={data.jobTitle || ""}
            onChange={(e) =>
              onChange({
                jobTitle: e.target.value,
              })
            }
            placeholder="e.g. Software Developer"
            className="mt-3 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-500/10"
          />
        </div>

        {/* Company */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
          <label
            htmlFor="company"
            className="flex items-center gap-2 text-sm font-semibold text-slate-700"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 text-base">
              🏢
            </span>
            Company
          </label>

          <input
            id="company"
            type="text"
            value={data.company || ""}
            onChange={(e) =>
              onChange({
                company: e.target.value,
              })
            }
            placeholder="e.g. ABC Technologies"
            className="mt-3 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-500/10"
          />
        </div>

        {/* Education */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
          <label
            htmlFor="educationLevel"
            className="flex items-center gap-2 text-sm font-semibold text-slate-700"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 text-base">
              🎓
            </span>
            Education Level
          </label>

          <select
            id="educationLevel"
            value={data.educationLevel || ""}
            onChange={(e) =>
              onChange({
                educationLevel: e.target.value,
              })
            }
            className="mt-3 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-500/10"
          >
            <option value="" disabled>
              Select education level
            </option>

            {EDUCATION_OPTIONS.map((education) => (
              <option key={education} value={education}>
                {education}
              </option>
            ))}
          </select>
        </div>

        {/* University */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
          <label
            htmlFor="university"
            className="flex items-center gap-2 text-sm font-semibold text-slate-700"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 text-base">
              📖
            </span>
            University / Institution
          </label>

          <input
            id="university"
            type="text"
            value={data.university || ""}
            onChange={(e) =>
              onChange({
                university: e.target.value,
              })
            }
            placeholder="Enter your university or institution"
            className="mt-3 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-500/10"
          />
        </div>

        {/* Bio */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <label
              htmlFor="bio"
              className="flex items-center gap-2 text-sm font-semibold text-slate-700"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 text-base">
                💌
              </span>
              About You
            </label>

            <span
              className={[
                "rounded-full px-2.5 py-1 text-xs font-semibold",
                bioLength >= 10
                  ? "bg-green-50 text-green-600"
                  : "bg-slate-100 text-slate-400",
              ].join(" ")}
            >
              {bioLength}/500
            </span>
          </div>

          <textarea
            id="bio"
            rows={6}
            maxLength={500}
            value={data.bio || ""}
            onChange={(e) =>
              onChange({
                bio: e.target.value,
              })
            }
            placeholder="Tell people a little about yourself... what makes you, you? 💫"
            className="mt-3 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-500/10"
          />

          <p className="mt-2 text-xs text-slate-400">
            Write at least 10 characters about yourself.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CareerStep;