import { Link } from "react-router-dom";

const FAQCTA = () => {
  return (
    <section className="pb-20">
      <div className="mx-auto max-w-6xl px-5">
        <div className="rounded-3xl bg-gradient-to-r from-violet-700 via-purple-700 to-pink-600 px-8 py-14 text-center text-white">
          <h2 className="text-4xl font-extrabold">
            Still Have Questions?
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-violet-100">
            Our support team is here to help you. Contact us for any
            additional information regarding Sathi Meet services or becoming a
            Sathi Meet Partner.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/contact"
              className="rounded-full bg-white px-8 py-4 font-semibold text-violet-700 transition hover:scale-105"
            >
              Contact Support
            </Link>

            <Link
              to="/about"
              className="rounded-full border-2 border-white px-8 py-4 font-semibold text-white transition hover:bg-white hover:text-violet-700"
            >
              Learn More About Sathi Meet
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQCTA;