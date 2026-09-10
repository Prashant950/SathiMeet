import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";
import Logo from "../ui/Logo";

const footerLinks = {
  Company: [
    { label: "About" },
    { label: "Services" },
    { label: "Contact" },
  ],

  Legal: [
    { label: "Privacy Policy" },
    { label: "Terms of Service" },
    { label: "Refund Policy" },
  ],

  Support: [
    { label: "Help Center" },
    { label: "Code of Conduct" },
    { label: "Safety Tips" },
  ],
};

const socialLinks = [
  {
    icon: FaFacebookF,
    label: "Facebook",
  },
  {
    icon: FaInstagram,
    label: "Instagram",
  },
  {
    icon: FaTwitter,
    label: "Twitter",
  },
  {
    icon: FaLinkedinIn,
    label: "LinkedIn",
  },
  {
    icon: FaWhatsapp,
    label: "WhatsApp",
  },
];

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-b from-[#090d16] via-[#050811] to-[#020408] text-white overflow-hidden border-t border-slate-800/80">
      {/* Ambient background glow orbs */}
      <div className="absolute -top-32 -left-20 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 right-10 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 sm:gap-10">
          {/* Brand Column (Left Side) */}
          <div className="sm:col-span-2 md:col-span-3 lg:col-span-2 space-y-4">
            <div className="flex items-center">
              <Logo light={true} />
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              India&apos;s premier social support &amp; lifestyle companion platform. Connecting verified, trained partners for safe, consent-first assistance across 700+ districts.
            </p>
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/90 border border-slate-800 px-3.5 py-1.5 text-[11px] sm:text-xs text-emerald-400 font-semibold shadow-xs">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                24/7 Verified Support
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/90 border border-slate-800 px-3.5 py-1.5 text-[11px] sm:text-xs text-fuchsia-300 font-semibold shadow-xs">
                100% Encrypted &amp; Safe
              </span>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading} className="space-y-3.5">
              <h3 className="text-xs sm:text-sm font-extrabold tracking-wider uppercase bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                {heading}
              </h3>

              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <span className="cursor-pointer text-xs sm:text-sm text-slate-400 transition-all duration-200 hover:text-white hover:translate-x-0.5 inline-block select-none font-medium">
                      {link.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Bar & Copyright */}
        <div className="mt-12 sm:mt-14 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-slate-800/80 pt-6 sm:pt-8">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Follow Us:</span>
            <div className="flex items-center gap-2">
              {socialLinks.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  aria-label={label}
                  className="cursor-pointer flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/90 border border-slate-800 text-slate-400 transition-all duration-300 hover:bg-gradient-to-r hover:from-violet-600 hover:to-fuchsia-600 hover:border-transparent hover:text-white hover:scale-110 active:scale-95 shadow-xs"
                >
                  <Icon size={14} />
                </div>
              ))}
            </div>
          </div>

          <div className="text-center sm:text-right text-xs text-slate-400 space-y-1">
            <p className="font-medium">© {new Date().getFullYear()} Sathi Meet. All rights reserved.</p>
            <p className="text-slate-500">Made with <span className="text-rose-500">❤️</span> in India • Powered by Nitecore Solutions Pvt Ltd</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;