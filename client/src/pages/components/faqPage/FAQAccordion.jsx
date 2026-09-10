import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const FAQAccordion = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-6 py-5 text-left transition hover:bg-gray-50"
      >
        <h3 className="pr-6 text-lg font-semibold text-slate-800">
          {faq.question}
        </h3>

        {isOpen ? (
          <FaChevronUp className="text-violet-600" />
        ) : (
          <FaChevronDown className="text-violet-600" />
        )}
      </button>

      {isOpen && (
        <div className="border-t border-gray-100 px-6 py-5">
          <p className="leading-8 text-slate-600">
            {faq.answer}
          </p>
        </div>
      )}
    </div>
  );
};

export default FAQAccordion;