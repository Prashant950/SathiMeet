import React from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import SEO from "../components/common/SEO";
import { ShieldCheck, Lock, Eye, FileText } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-rose-500 selection:text-white">
      <SEO
        title="Privacy Policy - Sathi Meet"
        description="Read Sathi Meet's Privacy Policy. Learn how we protect your personal data, identity verification records, and communication privacy with highest security."
        canonical="/privacy-policy"
      />
      <Header />

      <main className="flex-1 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="bg-white rounded-2xl shadow-xs border border-slate-100 p-6 sm:p-10">
          <div className="flex items-center gap-3 text-rose-500 mb-4">
            <ShieldCheck className="w-8 h-8" />
            <span className="text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-600 px-3 py-1 rounded-full">
              Legal &amp; Privacy
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-2">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-500 mb-8">
            Last Updated: September 21, 2026 | Sathi Meet (www.sathimeet.com)
          </p>

          <div className="space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base">
            <section>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Lock className="w-5 h-5 text-rose-500" /> 1. Information We Collect
              </h2>
              <p>
                At <strong>Sathi Meet</strong>, your privacy and personal security are our top priorities. When you register or book services on our platform, we collect:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-600">
                <li>Personal identification details (Name, Email, Phone Number, Date of Birth).</li>
                <li>Government ID verification records and selfie verification for partner safety.</li>
                <li>Location and preferred pincode to match you with nearby verified companions.</li>
                <li>Transaction records and booking preferences (payment card details are handled via secure PCI-DSS certified payment gateways).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Eye className="w-5 h-5 text-rose-500" /> 2. How We Use Your Information
              </h2>
              <p>
                We use collected information solely to provide, maintain, and enhance the Sathi Meet platform:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-600">
                <li>To verify accounts and maintain a 100% genuine, safe community.</li>
                <li>To coordinate bookings between users and verified partners for public meetups.</li>
                <li>To process payments, credit packages, and customer service inquiries.</li>
                <li>To prevent fraud, abuse, and enforce our Code of Conduct and Safety Guidelines.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-rose-500" /> 3. Data Protection &amp; Confidentiality
              </h2>
              <p>
                Sathi Meet implements industry-standard 256-bit SSL encryption for data in transit and at rest. We never sell, rent, or trade your personal information to third-party advertisers. All verification documents are stored securely and accessible only to authorized safety personnel.
              </p>
            </section>

            <section>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3">
                4. Contact Us Regarding Privacy
              </h2>
              <p>
                If you have questions about this Privacy Policy or wish to request data modification/deletion, please contact our Privacy Team at <strong>support@sathimeet.com</strong> or visit our <a href="/contact" className="text-rose-600 font-semibold underline">Contact Page</a>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
