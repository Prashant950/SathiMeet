import { faqCategories } from "../../../data/faqPage";
import FAQAccordion from "./FAQAccordion";

const colorClasses = {
  violet: "bg-violet-100 text-violet-700",
  green: "bg-emerald-100 text-emerald-700",
  blue: "bg-blue-100 text-blue-700",
  pink: "bg-pink-100 text-pink-700",
  orange: "bg-orange-100 text-orange-700",
  red: "bg-red-100 text-red-700",
};

const FAQCategory = () => {
  return (
    <section className="pb-20">
      <div className="mx-auto max-w-5xl px-5">
        {faqCategories.map((category) => (
          <div key={category.id} className="mb-14">
            {/* Category Heading */}

            <div className="mb-6">
              <span
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  colorClasses[category.color]
                }`}
              >
                {category.title}
              </span>
            </div>

            {/* Accordions */}

            <div className="space-y-4">
              {category.faqs.map((faq) => (
                <FAQAccordion
                  key={faq.id}
                  faq={faq}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQCategory;