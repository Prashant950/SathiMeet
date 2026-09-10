import { faqs } from "../../data/faq";
import FAQItem from "./FAQItem";
import { HelpCircle } from "lucide-react";

const FAQ = () => {
  return (
    <section
      id="faq"
      className="scroll-mt-20 bg-gradient-to-b from-white to-violet-50/50 py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 shadow-xs">
            <HelpCircle className="h-4 w-4 text-violet-600 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-violet-700 sm:text-sm">
              Got Questions?
            </span>
          </div>

          <h2 className="mt-5 bg-gradient-to-r from-violet-800 via-fuchsia-700 to-pink-600 bg-clip-text text-3xl font-black tracking-tight text-transparent sm:text-5xl lg:text-6xl">
            Frequently Asked Questions
          </h2>

          <p className="mt-4 text-base text-slate-600 sm:text-lg lg:text-xl">
            Find answers to common questions about Sathi Meet services, safety, and bookings.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="mt-10 space-y-4 sm:mt-12 lg:mt-16">
          {faqs.map((faq) => (
            <FAQItem key={faq.id} faq={faq} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;