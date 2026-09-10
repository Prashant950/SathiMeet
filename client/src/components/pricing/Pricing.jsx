import ClientPricing from "./ClientPricing";
import PartnerPricing from "./PartnerPricing";

const Pricing = () => {
  return (
    <section
      id="pricing"
      className="scroll-mt-24 bg-gradient-to-b from-violet-50 to-white py-20"
    >
      <div className="mx-auto max-w-7xl px-5">
        {/* Heading */}
        <div className="text-center">
          <h2 className="bg-gradient-to-r  from-violet-700 to-pink-600 bg-clip-text text-5xl font-extrabold text-transparent">
            Transparent Pricing
          </h2>

          <p className="mt-3 text-base text-slate-600 sm:mt-4 sm:text-lg lg:text-xl">
            Clear and upfront pricing with no hidden fees
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mt-10 grid gap-6 sm:mt-12 md:grid-cols-1 lg:mt-16 lg:grid-cols-2 lg:gap-8">
          <ClientPricing />
          <PartnerPricing />
        </div>
      </div>
    </section>
  );
};

export default Pricing;