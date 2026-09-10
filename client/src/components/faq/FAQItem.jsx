import { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

// Parses **bold** and ~~strikethrough~~ inline markers into React nodes.
const parseInline = (text) => {
  const parts = text.split(/(\*\*[^*]+\*\*|~~[^~]+~~)/g).filter(Boolean);

  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-slate-800">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("~~") && part.endsWith("~~")) {
      return (
        <span key={i} className="text-gray-400 line-through">
          {part.slice(2, -2)}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
};

const boxColors = {
  emerald: {
    wrap: "border-emerald-200 bg-emerald-50",
    title: "text-emerald-800",
    text: "text-emerald-700",
    footer: "border-emerald-200 text-emerald-800",
  },
  violet: {
    wrap: "border-violet-200 bg-violet-50",
    title: "text-violet-800",
    text: "text-violet-700",
    footer: "border-violet-200 text-violet-800",
  },
};

const statColors = {
  violet: "bg-violet-100 text-violet-700",
  pink: "bg-pink-100 text-pink-700",
  emerald: "bg-emerald-100 text-emerald-700",
};

const AnswerBlock = ({ block }) => {
  switch (block.type) {
    case "p":
      return (
        <p className="text-sm leading-6 text-slate-600 sm:text-base sm:leading-7 lg:leading-8">
          {parseInline(block.text)}
        </p>
      );

    case "ul":
      return (
        <ul className="list-disc space-y-1.5 pl-5 text-sm leading-6 text-slate-600 sm:space-y-2 sm:text-base sm:leading-7">
          {block.items.map((item, i) => (
            <li key={i}>{parseInline(item)}</li>
          ))}
        </ul>
      );

    case "ol":
      return (
        <ol className="list-decimal space-y-1.5 pl-5 text-sm leading-6 text-slate-600 sm:space-y-2 sm:text-base sm:leading-7">
          {block.items.map((item, i) => (
            <li key={i}>{parseInline(item)}</li>
          ))}
        </ol>
      );

    case "box": {
      const c = boxColors[block.color] || boxColors.violet;
      return (
        <div className={`rounded-xl border p-4 sm:p-5 ${c.wrap}`}>
          {block.title && (
            <p className={`text-sm font-semibold sm:text-base ${c.title}`}>
              {parseInline(block.title)}
            </p>
          )}
          <ul className={`mt-2 space-y-1 text-sm sm:text-base ${c.text}`}>
            {block.items.map((item, i) => (
              <li key={i} className="flex gap-2">
                <span className="select-none">•</span>
                <span>{parseInline(item)}</span>
              </li>
            ))}
          </ul>
          {block.footer && (
            <p className={`mt-3 border-t pt-3 text-sm font-bold sm:text-base ${c.footer}`}>
              {parseInline(block.footer)}
            </p>
          )}
        </div>
      );
    }

    case "stats":
      return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {block.items.map((stat, i) => (
            <div
              key={i}
              className={`rounded-xl p-4 text-center transition-transform duration-300 hover:-translate-y-0.5 ${statColors[stat.color] || statColors.violet}`}
            >
              <p className="text-sm font-bold sm:text-base">{stat.label}</p>
              <p className="mt-1 text-xs sm:text-sm">{stat.sublabel}</p>
            </div>
          ))}
        </div>
      );

    case "note":
      return (
        <p className="text-sm font-medium text-pink-600 sm:text-base">
          {parseInline(block.text)}
        </p>
      );

    default:
      return null;
  }
};

const FAQItem = ({ faq }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:border-violet-200 hover:shadow-md sm:rounded-2xl">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 p-4 text-left sm:p-5 lg:p-6"
      >
        <h3 className="text-sm font-semibold text-slate-800 sm:text-base lg:text-lg">
          {faq.question}
        </h3>

        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-600 transition-transform duration-300 sm:h-7 sm:w-7 ${
            open ? "rotate-180" : ""
          }`}
        >
          {open ? (
            <FaMinus className="text-[10px] sm:text-xs" />
          ) : (
            <FaPlus className="text-[10px] sm:text-xs" />
          )}
        </span>
      </button>

      {/* Smooth expand/collapse via grid-rows trick */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="space-y-3 px-4 pb-4 sm:space-y-4 sm:px-5 sm:pb-5 lg:px-6 lg:pb-6">
            {faq.answer.map((block, i) => (
              <AnswerBlock key={i} block={block} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQItem;