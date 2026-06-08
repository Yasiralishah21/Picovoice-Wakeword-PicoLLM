import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ACCENT = "#5B6BF8";
const MUTED = "#9095A8";

const FAQS = [
  {
    q: "How do I get started with TechelixAI?",
    a: "Sign up for an account, choose a plan that fits your needs, and follow the quick-start guide in our documentation. Our onboarding team is also available to walk you through the setup.",
  },
  {
    q: "What integrations are supported?",
    a: "We support REST APIs, WebSockets, and SDKs for web, iOS, and Android. Pre-built connectors are available for Salesforce, HubSpot, Zendesk, and more.",
  },
  {
    q: "How is billing handled?",
    a: "Billing is usage-based and invoiced monthly. You can view your usage dashboard at any time and set spending alerts to avoid surprises.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. All data is encrypted in transit and at rest. We are SOC 2 Type II certified and GDPR compliant. You can request a data processing agreement from our legal team.",
  },
  {
    q: "How do I contact a human agent?",
    a: "Enterprise customers have a dedicated Slack channel and CSM. All other customers can reach us via the contact form below or by emailing support@techelixai.com.",
  },
];

const CATEGORIES = [
  { icon: "📖", title: "Documentation", desc: "API references, SDK guides, and quickstarts" },
  { icon: "🎓", title: "Tutorials", desc: "Step-by-step walkthroughs for common use cases" },
  { icon: "🐛", title: "Bug Reports", desc: "Report an issue and track its status" },
  { icon: "💬", title: "Community", desc: "Connect with other developers building on our platform" },
  { icon: "🔐", title: "Security", desc: "Security advisories and responsible disclosure" },
  { icon: "💳", title: "Billing", desc: "Plans, invoices, and payment methods" },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-xl transition-all duration-200"
      style={{
        border: "1px solid rgba(91,107,248,0.18)",
        backgroundColor: open ? "rgba(91,107,248,0.06)" : "rgba(255,255,255,0.03)",
      }}
    >
      <button
        type="button"
        className="flex w-full items-center justify-between px-5 py-4 text-left"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="text-[15px] font-medium text-white pr-4">{q}</span>
        <span
          className="shrink-0 text-[20px] leading-none transition-transform duration-200"
          style={{ color: ACCENT, transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
        >
          +
        </span>
      </button>
      {open && (
        <p className="px-5 pb-4 text-[14px] leading-relaxed" style={{ color: MUTED }}>
          {a}
        </p>
      )}
    </div>
  );
}

export default function Support() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const focusStyle = (e) => (e.target.style.borderColor = ACCENT);
  const blurStyle = (e) => (e.target.style.borderColor = "rgba(91,107,248,0.25)");

  const inputClass =
    "w-full rounded-lg px-4 py-3 text-[14px] text-white outline-none transition-all duration-200 placeholder:text-[#4a4f65]";
  const inputStyle = { backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(91,107,248,0.25)" };

  return (
    <div style={{ backgroundColor: "#0a0c1a", minHeight: "100vh" }}>

      {/* ── Hero ── */}
      <div className="relative flex flex-col items-center justify-center overflow-hidden px-4 py-24 text-center sm:px-6 sm:py-32"
        style={{ minHeight: "48vh" }}>
        {/* glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-[120px]"
            style={{ background: "radial-gradient(circle, #5B6BF8 0%, transparent 70%)" }} />
        </div>

        <div className="relative z-10 w-full max-w-2xl">
          <span
            className="mb-5 inline-block rounded-full px-4 py-1.5 text-[12px] font-semibold uppercase tracking-widest"
            style={{ color: ACCENT, backgroundColor: "rgba(91,107,248,0.12)", border: "1px solid rgba(91,107,248,0.25)" }}
          >
            Support Center
          </span>

          <h1 className="mb-4 text-[36px] font-bold leading-tight tracking-tight text-white sm:text-[48px] lg:text-[56px]">
            How can we{" "}
            <span style={{
              background: "linear-gradient(135deg, #6B7FF0 0%, #4A5CE8 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>
              help you?
            </span>
          </h1>

          <p className="mb-8 text-[15px] leading-relaxed sm:text-[17px]" style={{ color: MUTED }}>
            Search our docs, browse FAQs, or drop us a message — we typically respond within a few hours.
          </p>

          {/* search bar */}
          <div className="relative mx-auto w-full max-w-xl">
            <svg className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
              width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="search"
              placeholder="Search documentation, guides..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full py-3.5 pl-11 pr-5 text-[14px] text-white outline-none transition-all duration-200 placeholder:text-[#4a4f65]"
              style={{
                backgroundColor: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(91,107,248,0.3)",
              }}
              onFocus={focusStyle}
              onBlur={blurStyle}
            />
          </div>
        </div>
      </div>

      {/* ── Categories ── */}
      <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
        <h2 className="mb-8 text-center text-[22px] font-bold text-white sm:text-[26px]">Browse by topic</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.title}
              type="button"
              className="group rounded-xl p-5 text-left transition-all duration-200 hover:scale-[1.02]"
              style={{
                background: "linear-gradient(135deg, rgb(11,13,20), rgb(20,26,52), rgb(11,13,20))",
                border: "1px solid rgba(91,107,248,0.18)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(91,107,248,0.5)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(91,107,248,0.18)")}
            >
              <span className="mb-3 block text-[28px]">{cat.icon}</span>
              <span className="block text-[15px] font-semibold text-white">{cat.title}</span>
              <span className="mt-1 block text-[13px] leading-snug" style={{ color: MUTED }}>{cat.desc}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
        <h2 className="mb-8 text-center text-[22px] font-bold text-white sm:text-[26px]">Frequently asked questions</h2>
        <div className="space-y-3">
          {FAQS.map((faq) => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </section>

      {/* ── Contact form ── */}
      <section className="mx-auto max-w-2xl px-4 pb-24 sm:px-6">
        <div
          className="rounded-2xl p-6 sm:p-10"
          style={{
            background: "linear-gradient(135deg, rgb(11,13,20), rgb(20,26,52), rgb(11,13,20))",
            border: "1px solid rgba(91,107,248,0.2)",
            boxShadow: "0 0 60px rgba(91,107,248,0.07)",
          }}
        >
          <h2 className="mb-1 text-[22px] font-bold text-white">Still need help?</h2>
          <p className="mb-7 text-[14px]" style={{ color: MUTED }}>Send us a message and we'll get back to you shortly.</p>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="space-y-5"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="s-name" className="mb-1.5 block text-[13px] font-medium" style={{ color: MUTED }}>Name</label>
                <input id="s-name" type="text" required placeholder="Jane Smith" value={form.name}
                  onChange={set("name")} className={inputClass} style={inputStyle}
                  onFocus={focusStyle} onBlur={blurStyle} />
              </div>
              <div>
                <label htmlFor="s-email" className="mb-1.5 block text-[13px] font-medium" style={{ color: MUTED }}>Email</label>
                <input id="s-email" type="email" required placeholder="jane@company.com" value={form.email}
                  onChange={set("email")} className={inputClass} style={inputStyle}
                  onFocus={focusStyle} onBlur={blurStyle} />
              </div>
            </div>

            <div>
              <label htmlFor="s-subject" className="mb-1.5 block text-[13px] font-medium" style={{ color: MUTED }}>Subject</label>
              <input id="s-subject" type="text" required placeholder="What's the issue?" value={form.subject}
                onChange={set("subject")} className={inputClass} style={inputStyle}
                onFocus={focusStyle} onBlur={blurStyle} />
            </div>

            <div>
              <label htmlFor="s-message" className="mb-1.5 block text-[13px] font-medium" style={{ color: MUTED }}>Message</label>
              <textarea id="s-message" rows={4} required placeholder="Describe your issue in detail..."
                value={form.message} onChange={set("message")}
                className={`${inputClass} resize-none`} style={inputStyle}
                onFocus={focusStyle} onBlur={blurStyle} />
            </div>

            <button
              type="submit"
              className="w-full rounded-full py-3.5 text-[15px] font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #6B7FF0 0%, #4A5CE8 100%)",
                boxShadow: "0 4px 24px rgba(91,107,248,0.35)",
              }}
            >
              Send message
            </button>
          </form>
        </div>

        <button type="button" onClick={() => navigate(-1)}
          className="mt-6 flex w-full items-center justify-center gap-2 text-[13px] transition-opacity hover:opacity-100"
          style={{ color: MUTED, opacity: 0.7 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Back
        </button>
      </section>
    </div>
  );
}
