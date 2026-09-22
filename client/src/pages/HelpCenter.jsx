import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import SEO from "../components/common/SEO";
import { Headphones, Search, ShieldCheck, Heart, CreditCard, Users, ArrowRight } from "lucide-react";

const HelpCenter = () => {
  const topics = [
    {
      icon: ShieldCheck,
      title: "Verification & Safety",
      desc: "Learn about ID verification, selfie validation, and safe public meetup rules.",
      link: "/code-of-conduct",
    },
    {
      icon: Users,
      title: "Booking Companions",
      desc: "How to browse profiles, select date vibes, and book verified partners.",
      link: "/services",
    },
    {
      icon: CreditCard,
      title: "Payments & Credits",
      desc: "Understanding service credits, Razorpay checkout, and refund policies.",
      link: "/refund-policy",
    },
    {
      icon: Heart,
      title: "Becoming a Partner",
      desc: "Earn by offering companionship, elder assistance, or shopping buddy services.",
      link: "/about",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-rose-500 selection:text-white">
      <SEO
        title="Help Center & Knowledge Base - Sathi Meet"
        description="Get help with Sathi Meet account verification, companion bookings, safety policies, and payments."
        canonical="/help-center"
      />
      <Header />

      <main className="flex-1 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 shadow-xs mb-4">
            <Headphones className="h-4 w-4 text-violet-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-violet-700">
              Support Center
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            How can we <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-violet-600 bg-clip-text text-transparent">help you</span> today?
          </h1>
          <p className="mt-3 text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
            Browse our knowledge base or reach out to our dedicated Sathi Meet support team.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {topics.map((t, idx) => {
            const Icon = t.icon;
            return (
              <Link
                key={idx}
                to={t.link}
                className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-violet-200 hover:shadow-md transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-4 group-hover:bg-rose-50 group-hover:text-rose-500 transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 mb-1 flex items-center justify-between">
                  <span>{t.title}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-rose-500 group-hover:translate-x-1 transition-all" />
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {t.desc}
                </p>
              </Link>
            );
          })}
        </div>

        <div className="bg-gradient-to-r from-violet-600 to-indigo-700 text-white rounded-2xl p-8 sm:p-10 text-center">
          <h3 className="text-2xl font-black mb-2">Still need assistance?</h3>
          <p className="text-violet-100 text-sm sm:text-base max-w-lg mx-auto mb-6">
            Our support representatives are available 7 days a week from 9:00 AM to 9:00 PM IST.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-white text-slate-900 font-bold px-6 py-3 rounded-full hover:bg-rose-50 hover:text-rose-600 transition-all shadow-md"
          >
            Contact Customer Support
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HelpCenter;
