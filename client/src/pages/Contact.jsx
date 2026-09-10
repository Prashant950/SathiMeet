import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Send,
  CheckCircle2,
  Sparkles,
  Headphones,
  Copy,
  Check,
} from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    priority: "Normal",
    message: "",
    consent: true,
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.message) {
      return;
    }

    setSubmitting(true);

    // Simulate fast reliable submission
    setTimeout(() => {
      const generatedTicket = `SM-REQ-${Math.floor(100000 + Math.random() * 900000)}`;
      setTicketId(generatedTicket);
      setSubmitting(false);
      setSubmitted(true);
    }, 1000);
  };

  const handleCopyTicket = () => {
    if (ticketId) {
      navigator.clipboard.writeText(ticketId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      subject: "General Inquiry",
      priority: "Normal",
      message: "",
      consent: true,
    });
    setSubmitted(false);
    setTicketId("");
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-rose-500 selection:text-white flex flex-col justify-between">
      <Header />

      <main className="flex-1 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {/* HEADER / TITLE */}
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 shadow-xs">
              <Sparkles className="h-4 w-4 text-violet-600 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-violet-700 sm:text-sm">
                Get in Touch
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Contact <span className="bg-gradient-to-r from-violet-700 via-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">Sathi Meet</span>
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Have a question, feedback, or need assistance with your booking? Fill out the form below and our team will get back to you shortly.
            </p>
          </div>

          {/* CONTACT FORM CONTAINER */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-xl shadow-slate-200/50">
            {submitted ? (
              /* SUCCESS STATE */
              <div className="text-center py-6 animate-in fade-in zoom-in-95 duration-300">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 size={32} />
                </div>

                <h2 className="mt-5 text-2xl font-bold text-slate-900">
                  Message Sent Successfully!
                </h2>

                <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Thank you for contacting us, <strong>{formData.fullName}</strong>. Our support team will review your inquiry and respond within 15–30 minutes.
                </p>

                <div className="mt-6 inline-flex items-center gap-3 rounded-2xl bg-slate-50 px-5 py-3 border border-slate-200 shadow-xs">
                  <span className="text-xs font-semibold text-slate-500">Ticket Reference:</span>
                  <span className="font-mono text-sm font-black text-violet-700">{ticketId}</span>
                  <button
                    type="button"
                    onClick={handleCopyTicket}
                    className="cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
                    title="Copy Ticket ID"
                  >
                    {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                  </button>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="cursor-pointer w-full sm:w-auto rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-violet-500/20 hover:brightness-105 transition"
                  >
                    Submit Another Message
                  </button>
                  <Link
                    to="/services"
                    className="w-full sm:w-auto rounded-xl border border-slate-300 bg-white px-6 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Browse Services
                  </Link>
                </div>
              </div>
            ) : (
              /* FORM FIELDS */
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      placeholder="Enter your name"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-sm text-slate-900 shadow-xs outline-none transition focus:border-violet-500 focus:bg-white focus:ring-3 focus:ring-violet-500/10"
                    />
                  </div>

                  {/* Email Address */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="you@example.com"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-sm text-slate-900 shadow-xs outline-none transition focus:border-violet-500 focus:bg-white focus:ring-3 focus:ring-violet-500/10"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Phone Number */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Mobile / WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      maxLength={10}
                      value={formData.phone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        setFormData({ ...formData, phone: val });
                      }}
                      placeholder="10-digit mobile number"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-sm text-slate-900 shadow-xs outline-none transition focus:border-violet-500 focus:bg-white focus:ring-3 focus:ring-violet-500/10"
                    />
                  </div>

                  {/* Subject / Topic */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Inquiry Topic <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-sm text-slate-900 shadow-xs outline-none transition focus:border-violet-500 focus:bg-white focus:ring-3 focus:ring-violet-500/10"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Booking Assistance">Companionship / Booking Help</option>
                      <option value="Partner Application">Partner / Sathi Registration</option>
                      <option value="Safety & Trust">Safety, Trust &amp; Verification</option>
                      <option value="Payment & Refunds">Payment &amp; Refund Queries</option>
                      <option value="Feedback / Suggestion">Feedback / Suggestion</option>
                    </select>
                  </div>
                </div>

                {/* Priority Selector */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Priority Level
                  </label>
                  <div className="flex gap-2.5">
                    {["Normal", "High", "Urgent / Safety"].map((lvl) => (
                      <button
                        type="button"
                        key={lvl}
                        onClick={() => setFormData({ ...formData, priority: lvl })}
                        className={`cursor-pointer flex-1 rounded-xl py-2 text-xs font-bold transition border ${
                          formData.priority === lvl
                            ? lvl.includes("Urgent")
                              ? "bg-rose-50 border-rose-400 text-rose-700 shadow-xs"
                              : "bg-violet-50 border-violet-400 text-violet-700 shadow-xs"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message Body */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700">
                      Your Message <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[11px] text-slate-400">
                      {formData.message.length} characters
                    </span>
                  </div>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Please write your question or message in detail..."
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-3.5 text-sm text-slate-900 shadow-xs outline-none transition focus:border-violet-500 focus:bg-white focus:ring-3 focus:ring-violet-500/10"
                  />
                </div>

                {/* Consent checkbox */}
                <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={formData.consent}
                    onChange={(e) =>
                      setFormData({ ...formData, consent: e.target.checked })
                    }
                    required
                    className="mt-0.5 rounded border-slate-300 text-violet-600 focus:ring-violet-500 h-4 w-4"
                  />
                  <span>
                    I agree to Sathi Meet&apos;s{" "}
                    <Link to="/privacy-policy" className="text-violet-600 underline font-semibold">
                      Privacy Policy
                    </Link>{" "}
                    and consent to be contacted regarding this inquiry.
                  </span>
                </label>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submitting || !formData.consent}
                  className="cursor-pointer mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-700 via-indigo-600 to-fuchsia-600 px-6 text-sm font-bold text-white shadow-lg shadow-violet-600/30 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-600/40 active:scale-[0.99] disabled:opacity-50"
                >
                  {submitting ? (
                    <span>Sending Message...</span>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
