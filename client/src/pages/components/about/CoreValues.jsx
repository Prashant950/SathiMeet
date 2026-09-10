const values = [
  {
    id: 1,
    emoji: "🤝",
    title: "Trust",
    description:
      "Every Sathi Meet professional is verified to ensure a safe and reliable experience.",
  },
  {
    id: 2,
    emoji: "🛡️",
    title: "Safety",
    description:
      "Consent, respect and professionalism are at the heart of every interaction.",
  },
  {
    id: 3,
    emoji: "⭐",
    title: "Quality",
    description:
      "We focus on delivering exceptional service through trained professionals.",
  },
  {
    id: 4,
    emoji: "❤️",
    title: "Compassion",
    description:
      "We believe genuine care and empathy create meaningful human connections.",
  },
];

const CoreValues = () => {
  return (
    <section className="bg-violet-50 py-20">
      <div className="mx-auto max-w-7xl px-5">
        {/* Heading */}

        <div className="text-center">
          <div className="inline-flex rounded-full bg-violet-100 px-5 py-2">
            <span className="font-medium text-violet-700">
              💜 Core Values
            </span>
          </div>

          <h2 className="mt-6 text-4xl font-bold text-slate-800">
            What Drives Sathi Meet
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            Our values define every interaction and guide everything we build.
          </p>
        </div>

        {/* Cards */}

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => (
            <div
              key={value.id}
              className="rounded-3xl bg-white p-8 text-center shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="text-5xl">
                {value.emoji}
              </div>

              <h3 className="mt-6 text-2xl font-bold text-slate-800">
                {value.title}
              </h3>

              <p className="mt-4 leading-8 text-slate-600">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreValues;