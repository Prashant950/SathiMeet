const RealitySection = () => {
  return (
    <section className="bg-gradient-to-r from-violet-700 via-purple-600 to-pink-600 py-20">
      <div className="mx-auto max-w-7xl px-5">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-white lg:text-5xl">
            The Reality We Address
          </h2>
        </div>

        {/* Cards */}
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm">
            <p className="text-lg leading-8 text-white">
              A nation of{" "}
              <span className="font-bold">1.4 billion people</span> where
              loneliness is becoming an epidemic. Where a senior citizen needs
              someone to accompany them to a hospital but has no one available.
            </p>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm">
            <p className="text-lg leading-8 text-white">
              Where a young professional moves to a new city and doesn't know a
              single person. Where a single parent needs help but doesn't want
              to burden anyone.
            </p>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="mt-14 text-center">
          <h3 className="text-2xl font-bold text-white lg:text-3xl">
            That&apos;s why Sathi Meet exists.
            <br className="hidden sm:block" />
            Not as a luxury. As a necessity.
          </h3>
        </div>
      </div>
    </section>
  );
};

export default RealitySection;