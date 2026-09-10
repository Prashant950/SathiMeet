// Each faq has a `question` and an `answer` made of content blocks.
// Block types:
//   { type: "p", text }                         -> paragraph (** bold **, ~~strike~~ supported)
//   { type: "ul", items: [text, ...] }           -> bullet list
//   { type: "ol", items: [text, ...] }           -> numbered list
//   { type: "box", color, title, items, footer } -> highlighted callout box
//   { type: "stats", items: [{label, sublabel, color}] } -> 3-up stat cards
//   { type: "note", text }                       -> emphasized closing line

export const faqs = [
  {
    id: 1,
    question: "What is Sathi Meet?",
    answer: [
      {
        type: "p",
        text:
          "**Sathi Meet is India's #1 Social & Lifestyle Support Services Platform.** It's a professional social support service that connects people with verified Sathi Meet Partners for safe, consent-first, professional support services including elder care, hanging out, movie partners, shopping buddies, medical support, and more. Our services help you with daily activities through professional care.",
      },
    ],
  },
  {
    id: 2,
    question: "How do I find a Sathi Meet Partner near me?",
    answer: [
      { type: "p", text: "To find a Sathi Meet Partner near you:" },
      {
        type: "ol",
        items: [
          'Visit Sathi Meet and click "Find a Sathi Meet Partner"',
          "Sign up with your phone number",
          "Enter your pin code - we cover all Indian pin codes",
          "Browse verified Sathi Meet Partners by service, rating, and availability",
          "Book a session - voice call, video call, or in-person",
        ],
      },
      {
        type: "p",
        text:
          "**Coverage:** All Indian states, all districts, all pin codes. Millions of registered Sathi Meet Partners across India.",
      },
    ],
  },
  {
    id: 3,
    question: "What services does Sathi Meet offer?",
    answer: [
      { type: "p", text: "Sathi Meet offers multiple professional social support services:" },
      {
        type: "ul",
        items: [
          "**Elder Care (₹1,000/hour)** - Senior assistance & daily support",
          "**Hanging Out (₹1,500/hour)** - Casual social time together",
          "**Clubbing & Events (₹2,000/hour)** - Nightlife & event companionship",
          "**Movie Partner (₹500/hour)** - Watch movies together, share experiences",
          "**Shopping Buddy (₹200/hour)** - Groceries, errands, shopping companion",
          "**Medical Support (₹200/hour)** - Hospital & appointment assistance",
          "**Travel Partner (₹2,000/hour)** - Explore and travel together",
        ],
      },
    ],
  },
  {
    id: 4,
    question: "Is Sathi Meet safe and trustworthy?",
    answer: [
      {
        type: "p",
        text: "Yes, Sathi Meet is India's most trusted social support platform. We ensure safety through:",
      },
      {
        type: "ul",
        items: [
          "All Sathi Meet Partners are background verified",
          "Trained professionals committed to strict boundaries",
          "Consent-first, strictly professional services only",
          "Clear code of conduct and guidelines",
          "Secure payment processing",
          "24/7 customer support",
        ],
      },
      { type: "note", text: "Sathi Meet is NOT a dating service. All interactions are professional." },
    ],
  },
  {
    id: 5,
    question: "How much can I earn as a Sathi Meet Partner?",
    answer: [
      {
        type: "p",
        text:
          "Sathi Meet Partners can earn up to ₹2,000 per hour based on availability and services offered. You keep 80% of your earnings.",
      },
      {
        type: "box",
        color: "emerald",
        title: "Example Earnings:",
        items: [
          "Elder Care: ₹1,000/hr × 20 hrs = ₹20,000",
          "Hanging Out: ₹1,500/hr × 20 hrs = ₹30,000",
          "Clubbing/Events: ₹2,000/hr × 20 hrs = ₹40,000",
        ],
        footer: "Total: ₹90,000 (you keep ₹72,000)",
      },
      {
        type: "p",
        text:
          "Membership starts at just ₹199 ~~₹500~~ (6 months) - pay once, unlimited earnings! 🎉 Millions Strong Celebration Offer!",
      },
    ],
  },
  {
    id: 6,
    question: "How do I become a Sathi Meet Partner?",
    answer: [
      { type: "p", text: "Becoming a Sathi Meet Partner is easy:" },
      {
        type: "ol",
        items: [
          'Visit Sathi Meet and click "Become a Sathi Meet Partner"',
          "Sign up with your phone number",
          "Complete your profile with photo, bio, services, and rates",
          "Pay membership fee (₹199/6mo, ₹499/yr, or ₹999/lifetime) - 🎉 Celebration Discount!",
          "Get verified and start earning!",
        ],
      },
      {
        type: "p",
        text:
          "**Benefits:** Set your own rates, work flexible hours, keep 80% of earnings, work from anywhere in India.",
      },
    ],
  },
  {
    id: 7,
    question: "Where is Sathi Meet available?",
    answer: [
      { type: "p", text: "Sathi Meet is available across ALL of India:" },
      {
        type: "stats",
        items: [
          { label: "All States", sublabel: "28 States + 8 UTs", color: "violet" },
          { label: "All Districts", sublabel: "700+ Districts", color: "pink" },
          { label: "All Pin Codes", sublabel: "Complete Coverage", color: "emerald" },
        ],
      },
      {
        type: "p",
        text:
          "With millions of registered Sathi Meet Partners, we provide coverage in every corner of India - from metro cities to small towns.",
      },
    ],
  },
  {
    id: 8,
    question: "What is social support service?",
    answer: [
      {
        type: "p",
        text:
          "**Social support service** is a professional service that provides safe assistance for daily activities. Our services focus on:",
      },
      {
        type: "ul",
        items: [
          "Professional assistance for daily activities",
          "Elder care and senior support",
          "Social outings and events",
          "Non-judgmental support and listening",
          "Helping with various lifestyle needs",
        ],
      },
      {
        type: "p",
        text: "Sathi Meet's verified partners maintain strict professional boundaries while providing genuine support.",
      },
    ],
  },
  {
    id: 9,
    question: "Is Sathi Meet a dating or matrimonial service?",
    answer: [
      { type: "p", text: "**No, Sathi Meet is NOT a dating or matrimonial service.**" },
      { type: "p", text: "Sathi Meet is strictly a professional social support platform. Key differences:" },
      {
        type: "ul",
        items: [
          "All interactions are professional",
          "Services are consent-first with clear boundaries",
          "Focus is on support services, not romantic relationships",
          "Sathi Meet Partners are trained professionals",
          "Strict code of conduct enforced",
        ],
      },
      { type: "p", text: "Our mission is to help people with social support - not matchmaking." },
    ],
  },
  {
    id: 10,
    question: "What is the cost of Sathi Meet services?",
    answer: [
      { type: "p", text: "Sathi Meet service pricing:" },
      {
        type: "box",
        color: "violet",
        title: "For Clients:",
        items: [
          "Elder Care: Starting ₹1,000/hour",
          "Hanging Out: Starting ₹1,500/hour",
          "Clubbing & Events: Starting ₹2,000/hour",
        ],
      },
      {
        type: "box",
        color: "emerald",
        title: "For Sathi Meet Partners: 🎉 Celebration Discount!",
        items: [
          "Membership: ~~₹500~~ ₹199 (6mo) / ~~₹1,000~~ ₹499 (1yr) / ~~₹2,000~~ ₹999 (lifetime)",
          "You keep 80% of all earnings",
          "No hidden fees or charges",
        ],
      },
      {
        type: "p",
        text: "Prices may vary by individual Sathi Meet Partner based on their rates and services.",
      },
    ],
  },
];