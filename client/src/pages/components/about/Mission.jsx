const Mission = () => {
  return (
    <section className="bg-violet-50 py-20">
      <div className="mx-auto max-w-6xl px-5">
        <div className="rounded-3xl bg-white p-10 shadow-xl">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
            {/* Left */}
            <div className="lg:w-1/2">
              <div className="inline-flex rounded-full bg-violet-100 px-4 py-2">
                <span className="font-medium text-violet-700">
                  🎯 Our Mission
                </span>
              </div>

              <h2 className="mt-6 text-4xl font-bold text-slate-800">
                Building Meaningful Human Connections
              </h2>

              <p className="mt-6 text-lg leading-8 text-slate-600">
                Our mission is to make trusted social and lifestyle support
                accessible to everyone. We believe nobody should feel alone when
                help, companionship or assistance is needed.
              </p>
            </div>

            {/* Right */}
            <div className="flex-1 rounded-2xl bg-gradient-to-br from-violet-600 to-pink-600 p-8 text-white">
              <h3 className="text-2xl font-bold">
                We Believe
              </h3>

              <p className="mt-5 text-lg leading-8 text-violet-100">
                Technology should bring people together, not pull them apart.
                Sathi Meet creates a safe environment where meaningful, professional
                human connections become possible.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mission;