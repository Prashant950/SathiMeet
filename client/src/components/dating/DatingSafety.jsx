import { ShieldCheck, HeartHandshake, Eye, AlertCircle, PhoneCall, CheckCircle } from "lucide-react";

const SAFETY_POINTS = [
  {
    title: "100% ID & Selfie Verification",
    description: "Every companion on Sathi Meet must upload government ID and real-time selfie verification. Zero catfish, zero fake profiles.",
    icon: ShieldCheck,
    color: "text-emerald-600 bg-emerald-50 border-emerald-200"
  },
  {
    title: "Public Venues Only",
    description: "All dates and meetups strictly happen in public settings (cafes, malls, restaurants, event arenas). We do not support private home sessions.",
    icon: Eye,
    color: "text-rose-600 bg-rose-50 border-rose-200"
  },
  {
    title: "Consent & Respect First",
    description: "Both parties agree to transparent guidelines. Strict zero-tolerance policy against misconduct, harassment, or non-consensual behavior.",
    icon: HeartHandshake,
    color: "text-fuchsia-600 bg-fuchsia-50 border-fuchsia-200"
  },
  {
    title: "24/7 Concierge & Safety Help",
    description: "Our dedicated safety team monitors session check-ins with quick emergency escalation support whenever you need assistance.",
    icon: PhoneCall,
    color: "text-violet-600 bg-violet-50 border-violet-200"
  }
];

const DatingSafety = () => {
  return (
    <section className="bg-gradient-to-b from-slate-900 via-purple-950 to-slate-950 text-white py-16 sm:py-20 lg:py-28 relative overflow-hidden">
      {/* Decorative Glows */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-rose-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-violet-500/15 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-rose-300 backdrop-blur-md">
            <ShieldCheck size={15} className="text-emerald-400" />
            <span>Safety &amp; Trust Assurance</span>
          </div>

          <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl leading-tight">
            Your Safety Is Our{" "}
            <span className="bg-gradient-to-r from-rose-400 via-pink-300 to-amber-300 bg-clip-text text-transparent">
              #1 Priority
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-violet-200/90 leading-relaxed">
            We've built India's most secure dating companion ecosystem with multi-layered verification and clear safety protocols.
          </p>
        </div>

        {/* Safety Points Grid */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SAFETY_POINTS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 hover:border-white/25"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${item.color} mb-5`}>
                  <Icon size={24} />
                </div>

                <h3 className="text-lg font-bold text-white tracking-tight">
                  {item.title}
                </h3>

                <p className="mt-2.5 text-xs sm:text-sm text-violet-200/80 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Safety Callout Box */}
        <div className="mt-12 rounded-3xl border border-rose-500/30 bg-gradient-to-r from-rose-950/40 via-purple-950/40 to-slate-900/60 p-6 sm:p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <CheckCircle size={26} />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-bold text-white">
                100% Consent-First Dating Guarantee
              </h4>
              <p className="text-xs sm:text-sm text-violet-200/80 mt-0.5">
                Every member has the right to end any meetup if comfort boundaries are breached. Full refund protection applies.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default DatingSafety;
