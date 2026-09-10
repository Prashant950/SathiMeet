import { FaSearch } from "react-icons/fa";

const FAQSearch = () => {
  return (
    <section className="pb-10">
      <div className="mx-auto max-w-5xl px-5">
        <div className="relative">
          <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            placeholder="Search FAQs..."
            className="w-full rounded-xl border border-gray-200 py-4 pl-14 pr-4 outline-none transition focus:border-violet-500"
          />
        </div>
      </div>
    </section>
  );
};

export default FAQSearch;