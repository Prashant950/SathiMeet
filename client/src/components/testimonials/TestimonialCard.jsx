import { FaQuoteRight, FaStar } from "react-icons/fa";

const TestimonialCard = ({ testimonial }) => {
  const {
    name,
    location,
    duration,
    review,
    rating = 5,
    image,
    badge,
  } = testimonial;

  const initial = name?.charAt(0)?.toUpperCase();

  return (
    <div className="w-full max-w-full overflow-hidden rounded-3xl bg-white p-4 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-7">
      {/* Top row: avatar + name/meta, badge wraps below on mobile */}
      <div className="flex flex-wrap items-start justify-between gap-y-2">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          {image ? (
            <img
              src={image}
              alt={name}
              className="h-11 w-11 flex-shrink-0 rounded-full border-2 border-emerald-300 object-cover sm:h-14 sm:w-14"
            />
          ) : (
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border-2 border-emerald-300 bg-emerald-500 text-base font-bold text-white sm:h-14 sm:w-14 sm:text-xl">
              {initial}
            </div>
          )}

          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-slate-800 sm:text-base">
              {name}
            </h3>
            <p className="truncate text-xs text-slate-500 sm:text-sm">
              {location}
              {duration ? ` • ${duration}` : ""}
            </p>
          </div>
        </div>

        {badge && (
          <span className="ml-[56px] whitespace-nowrap rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 sm:ml-0 sm:text-sm">
            {badge}
          </span>
        )}
      </div>

      {/* Review */}
      <div className="relative mt-4 sm:mt-5">
        <FaQuoteRight className="absolute -left-1 -top-1 text-xl text-emerald-200 sm:text-2xl" />
        <p className="break-words pl-6 text-sm italic leading-6 text-slate-600 sm:pl-7 sm:text-base sm:leading-7">
          {review}
        </p>
      </div>

      {/* Rating */}
      <div className="mt-4 flex gap-1 text-yellow-400 sm:mt-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <FaStar
            key={i}
            className={`text-sm sm:text-base ${
              i < rating ? "" : "text-slate-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialCard;