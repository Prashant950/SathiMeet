import React from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import SEO from "../components/common/SEO";
import { Scale, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-rose-500 selection:text-white">
      <SEO
        title="Terms & Conditions - Sathi Meet"
        description="Review Sathi Meet Terms of Service. Understand the rules, safety guidelines, and policies governing our companionship and lifestyle support services."
        canonical="/terms"
      />
      <Header />

      <main className="flex-1 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="bg-white rounded-2xl shadow-xs border border-slate-100 p-6 sm:p-10">
          <div className="flex items-center gap-3 text-rose-500 mb-4">
            <Scale className="w-8 h-8" />
            <span className="text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-600 px-3 py-1 rounded-full">
              Legal Agreement
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-2">
            Terms &amp; Conditions
          </h1>
          <p className="text-sm text-slate-500 mb-8">
            Effective Date: September 21, 2026 | Sathi Meet (www.sathimeet.com)
          </p>

          <div className="space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base">
            <section>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-rose-500" /> 1. Acceptance of Terms
              </h2>
              <p>
                By accessing or using <strong>Sathi Meet</strong> (operated via www.sathimeet.com), you agree to be bound by these Terms and Conditions. Sathi Meet is a verified platform facilitating safe social companionship, dating hangouts, elder support, and lifestyle assistance services across Indian cities.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-rose-500" /> 2. Eligibility &amp; Verification
              </h2>
              <p>
                All users must be at least 18 years of age. All Sathi Meet partners undergo government ID checks and selfie verification. Any falsification of identity or misrepresentation is strictly prohibited and results in immediate account suspension.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" /> 3. Public Venues &amp; Safety Policy
              </h2>
              <p>
                All social hangouts, coffee dates, movie meetups, and dining experiences arranged through Sathi Meet must take place strictly in verified public venues (cafes, malls, theaters, restaurants, public events). Sathi Meet maintains a strict zero-tolerance policy against harassment, illicit activities, and non-consensual behavior.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3">
                4. Payment &amp; Bookings
              </h2>
              <p>
                All bookings and service credits must be processed through the official Sathi Meet payment gateway. Cash payments outside the platform are not supported and forfeit platform safety protections.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3">
                5. Contact &amp; Governance
              </h2>
              <p>
                These terms are governed by the laws of India. For inquiries regarding these terms, please contact <strong>legal@sathimeet.com</strong>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
