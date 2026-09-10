const stats = [
  {
    title: "10 Lac+",
    sub: "Sathi Meet Partners",
    color: "bg-violet-50 text-violet-700",
  },
  {
    title: "All India",
    sub: "Pin Codes Covered",
    color: "bg-blue-50 text-blue-700",
  },
  {
    title: "100% ID",
    sub: "Verified Profiles",
    color: "bg-green-50 text-green-700",
  },
  {
    title: "24/7",
    sub: "Priority Support",
    color: "bg-orange-50 text-orange-600",
  },
];

const FAQStats = () => {
  return (
    <section className="pb-10">
      <div className="mx-auto max-w-5xl px-5">
        <div className="grid gap-4 md:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.title}
              className={`${item.color} rounded-2xl p-6 text-center`}
            >
              <h3 className="text-3xl font-bold">
                {item.title}
              </h3>

              <p className="mt-2">
                {item.sub}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQStats;