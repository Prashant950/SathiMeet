import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { openAuthModal } from "../../../components/auth/AuthModal";

const reasons = [
  {
    id: 1,
    title: "Trusted Professionals",
    description:
      "Every Sathi Meet Partner is verified and committed to delivering safe, respectful and professional services.",
  },
  {
    id: 2,
    title: "Nationwide Coverage",
    description:
      "Available across India with a growing network of professionals in cities, towns and local communities.",
  },
  {
    id: 3,
    title: "Safe & Transparent",
    description:
      "Clear pricing, secure bookings and a consent-first approach make every experience reliable.",
  },
];

const WhyChooseSathiMeet = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const handleCtaClick = () => {
    if (isAuthenticated) {
      navigate("/services");
      return;
    }
    openAuthModal();
  };

  return (
    <section className="bg-gradient-to-r from-violet-700 via-purple-700 to-pink-600 py-20">
      <div className="mx-auto max-w-7xl px-5">
        {/* Heading */}
        <div className="text-center text-white">
          <span className="rounded-full bg-white/20 px-5 py-2 text-sm font-medium">
            ⭐ Why Choose Sathi Meet
          </span>

          <h2 className="mt-6 text-4xl font-extrabold lg:text-5xl">
            Trusted by People Across India
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-violet-100">
            We&apos;re building a safer and more connected future through verified
            professionals and meaningful human support.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {reasons.map((reason) => (
            <div
              key={reason.id}
              className="rounded-3xl bg-white/10 p-8 text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:bg-white/20"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl">
                💜
              </div>

              <h3 className="mt-6 text-2xl font-bold">
                {reason.title}
              </h3>

              <p className="mt-4 leading-8 text-violet-100">
                {reason.description}
              </p>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="mt-14 flex flex-col items-center justify-center gap-5 sm:flex-row">
          <button 
            type="button"
            onClick={() => navigate("/services")}
            className="cursor-pointer rounded-full bg-white px-8 py-4 font-semibold text-violet-700 shadow-lg transition-all duration-300 hover:scale-105"
          >
            Explore Services
          </button>

          <button 
            type="button"
            onClick={handleCtaClick}
            className="cursor-pointer rounded-full border-2 border-white px-8 py-4 font-semibold text-white transition-all duration-300 hover:bg-white hover:text-violet-700"
          >
            Become a Sathi Meet Partner
          </button>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSathiMeet;
