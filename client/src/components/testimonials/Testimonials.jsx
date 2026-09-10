// import { testimonials } from "../../data/testimonials";
// import TestimonialCard from "./TestimonialCard";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { openAuthModal } from "../auth/AuthModal";
// import { Sparkles, ArrowRight, Heart } from "lucide-react";

// const Testimonials = () => {
//   const navigate = useNavigate();
//   const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

//   const handleCtaClick = () => {
//     if (isAuthenticated) {
//       navigate("/services");
//       return;
//     }

//     openAuthModal();
//   };

//   return (
//     <section className="w-full overflow-x-hidden bg-gradient-to-b from-slate-50 via-rose-50/20 to-violet-50/30 py-16 sm:py-20 lg:py-28">
//       <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
//         {/* Heading */}
//         <div className="text-center max-w-3xl mx-auto">
//           <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-1.5 shadow-xs">
//             <Heart className="h-4 w-4 text-rose-600 fill-rose-600 animate-pulse" />
//             <span className="text-xs font-bold uppercase tracking-wider text-rose-700 sm:text-sm">
//               Real Chemistry &amp; Dates
//             </span>
//           </div>

//           <h2 className="mt-5 bg-gradient-to-r from-rose-600 via-pink-600 to-violet-700 bg-clip-text text-3xl font-black tracking-tight text-transparent sm:text-5xl lg:text-6xl">
//             Real Matches, Real Stories
//           </h2>

//           <p className="mt-4 text-sm text-slate-600 sm:text-base lg:text-lg">
//             Hear from members across India who found safe, memorable dates and verified companions on Sathi Meet
//           </p>
//         </div>

//         {/* Cards */}
//         <div className="mt-12 grid grid-cols-1 gap-6 sm:mt-16 md:grid-cols-2 lg:gap-8">
//           {testimonials.map((testimonial) => (
//             <TestimonialCard key={testimonial.id} testimonial={testimonial} />
//           ))}
//         </div>

//         {/* Button */}
//         <div className="mt-12 text-center sm:mt-16">
//           <button
//             type="button"
//             className="cursor-pointer inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-600 to-violet-600 px-8 py-4 text-sm sm:text-base font-bold text-white shadow-xl shadow-pink-500/25 transition-all duration-300 hover:scale-105 active:scale-95"
//             onClick={handleCtaClick}
//           >
//             <span>Find Your Dating Match</span>
//             <ArrowRight size={16} />
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Testimonials;