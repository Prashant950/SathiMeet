import React from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import SEO from "../components/common/SEO";
import { RefreshCw, CheckCircle2, Clock, HelpCircle } from "lucide-react";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-rose-500 selection:text-white">
      <SEO
        title="Refund & Cancellation Policy - Sathi Meet"
        description="Learn about Sathi Meet's transparent refund and cancellation policy for booked companion and lifestyle services."
        canonical="/refund-policy"
      />
      <Header />

      <main className="flex-1 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="bg-white rounded-2xl shadow-xs border border-slate-100 p-6 sm:p-10">
          <div className="flex items-center gap-3 text-rose-500 mb-4">
            <RefreshCw className="w-8 h-8" />
            <span className="text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-600 px-3 py-1 rounded-full">
              Payments &amp; Refunds
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-2">
            Refund &amp; Cancellation Policy
          </h1>
          <p className="text-sm text-slate-500 mb-8">
            Last Updated: September 21, 2026 | Sathi Meet (www.sathimeet.com)
          </p>

          <div className="space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base">
            <section>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-rose-500" /> 1. Booking Cancellations
              </h2>
              <p>
                At <strong>Sathi Meet</strong>, we value the time and commitment of both clients and companions.
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-600">
                <li><strong>Cancellations 24+ hours in advance:</strong> 100% full refund or credit recharge to your wallet.</li>
                <li><strong>Cancellations 6–24 hours in advance:</strong> 80% refund (20% partner preparation compensation).</li>
                <li><strong>Cancellations under 6 hours:</strong> 50% refund.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" /> 2. Partner No-Show / Safety Cancellation
              </h2>
              <p>
                If a partner fails to attend a scheduled booking without prior notice, or if a booking is cancelled due to partner safety violations, the client is issued a <strong>100% immediate full refund</strong> plus priority booking credits.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-rose-500" /> 3. Processing Timeline
              </h2>
              <p>
                Approved refunds are initiated within 24–48 business hours and credited back to the original source method (UPI, Debit/Credit card, Net Banking) within 5–7 business days per banking standards.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3">
                4. Requesting Assistance
              </h2>
              <p>
                For refund queries or status checks, write to <strong>support@sathimeet.com</strong> with your booking ID or submit a ticket on our <a href="/contact" className="text-rose-600 font-semibold underline">Contact page</a>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RefundPolicy;
