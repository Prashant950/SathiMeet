import React from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import SEO from "../components/common/SEO";
import { ShieldCheck, Heart, AlertCircle, CheckCircle } from "lucide-react";

const CodeOfConduct = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-rose-500 selection:text-white">
      <SEO
        title="Code of Conduct & Community Safety - Sathi Meet"
        description="Review Sathi Meet's Code of Conduct. We enforce strict safety, mutual respect, public venue meetings, and zero tolerance for harassment."
        canonical="/code-of-conduct"
      />
      <Header />

      <main className="flex-1 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="bg-white rounded-2xl shadow-xs border border-slate-100 p-6 sm:p-10">
          <div className="flex items-center gap-3 text-rose-500 mb-4">
            <ShieldCheck className="w-8 h-8" />
            <span className="text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-600 px-3 py-1 rounded-full">
              Community Guidelines
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-2">
            Code of Conduct &amp; Safety Standards
          </h1>
          <p className="text-sm text-slate-500 mb-8">
            Published: September 21, 2026 | Sathi Meet (www.sathimeet.com)
          </p>

          <div className="space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base">
            <section>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500" /> 1. Mutual Respect &amp; Dignity
              </h2>
              <p>
                Every interaction on <strong>Sathi Meet</strong> must be grounded in mutual respect, courtesy, and clear communication. Companions and clients must treat each other with professional dignity regardless of background, gender, religion, or ethnicity.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" /> 2. Public Meetup Requirement
              </h2>
              <p>
                All meetups booked through Sathi Meet must take place strictly in public locations (restaurants, cafes, shopping centers, cinemas, public parks, art galleries). Private home or hotel room bookings without prior authorized concierge oversight are strictly prohibited.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" /> 3. Zero Tolerance for Harassment
              </h2>
              <p>
                Sathi Meet enforces a strict zero-tolerance policy against physical, verbal, sexual, or financial harassment. Any report of non-consensual behavior, unsolicited advances, or intimidation will lead to immediate permanent ban and potential legal referral to authorities.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3">
                4. Safety Reporting &amp; SOS
              </h2>
              <p>
                If at any point during a meetup you feel unsafe or uncomfortable, you are encouraged to end the session immediately. Report incidents to <strong>safety@sathimeet.com</strong> for emergency response.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CodeOfConduct;
