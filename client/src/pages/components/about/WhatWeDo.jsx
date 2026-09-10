const aboutServices = [
  {
    icon: "👴",
    title: "Elder Care & Senior Assistance",
    bg: "bg-violet-50",
    text: "text-violet-700",
  },
  {
    icon: "🛍️",
    title: "Shopping & Errand Assistance",
    bg: "bg-pink-50",
    text: "text-pink-600",
  },
  {
    icon: "🎉",
    title: "Social Events & Clubbing Companions",
    bg: "bg-indigo-50",
    text: "text-indigo-700",
  },
  {
    icon: "🩺",
    title: "Medical Support & Hospital Visits",
    bg: "bg-violet-50",
    text: "text-violet-700",
  },
  {
    icon: "🎬",
    title: "Movie & Entertainment Partners",
    bg: "bg-fuchsia-50",
    text: "text-fuchsia-700",
  },
  {
    icon: "✈️",
    title: "Travel Partners & Companions",
    bg: "bg-rose-50",
    text: "text-rose-700",
  },
];

const WhatWeDo = () => {
  return (
    <section className="bg-white py-10">
      <div className="mx-auto max-w-6xl px-5">
        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-violet-700">
            What We Do
          </h2>

          <p className="mt-5 text-base leading-relaxed text-slate-700 sm:text-lg sm:leading-9">
            <span className="font-bold text-slate-900">
              Sathi Meet is India&apos;s trusted social and lifestyle support platform.
            </span>{" "}
            We connect individuals who need companionship and assistance with
            verified, professional Sathi Meet Partners who provide safe,
            consent-first, strictly professional services.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {aboutServices.map((service, index) => (
              <div
                key={index}
                className={`${service.bg} flex items-center gap-3 rounded-xl px-5 py-5`}
              >
                <span className="text-2xl">{service.icon}</span>

                <h3 className={`text-lg font-medium ${service.text}`}>
                  {service.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;