const FeatureCard = ({ feature }) => {
  const Icon = feature.icon;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-transparent hover:shadow-xl sm:rounded-3xl sm:p-8 lg:p-10">
      {/* top accent line, grows in on hover */}
      <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-violet-600 to-pink-600 transition-transform duration-300 group-hover:scale-x-100" />

      {/* icon with glow */}
      <div className="relative mx-auto inline-flex">
        <div className="absolute inset-0 rounded-2xl bg-violet-400 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-40" />
        <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-violet-100 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 sm:h-20 sm:w-20 sm:rounded-2xl">
          <Icon className="text-2xl text-violet-600 sm:text-4xl" />
        </div>
      </div>

      <h3 className="mt-5 text-lg font-bold text-slate-800 transition-colors duration-300 group-hover:text-violet-700 sm:mt-8 sm:text-2xl">
        {feature.title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-600 sm:mt-5 sm:text-lg sm:leading-8">
        {feature.description}
      </p>
    </div>
  );
};

export default FeatureCard;