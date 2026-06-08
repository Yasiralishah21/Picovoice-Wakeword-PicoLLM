import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ACCENT = "#5B6BF8";
const MUTED = "#9095A8";

const INDUSTRIES = [
  "Automotive",
  "Restaurants & QSR",
  "Retail & Commerce",
  "Healthcare",
  "Financial Services",
  "Media & Entertainment",
  "Other",
];

function InputField({ id, label, type = "text", placeholder, value, onChange }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-medium" style={{ color: MUTED }}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        required
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg px-4 py-3 text-[14px] text-white outline-none transition-all duration-200 placeholder:text-[#4a4f65]"
        style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(91,107,248,0.25)" }}
        onFocus={(e) => (e.target.style.borderColor = ACCENT)}
        onBlur={(e) => (e.target.style.borderColor = "rgba(91,107,248,0.25)")}
      />
    </div>
  );
}

export default function TalkToExpert() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", company: "", industry: "", message: "",
  });

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: submit logic
  };

  return (
    <div style={{ backgroundColor: "#0a0c1a", minHeight: "100vh" }}>

      {/* ── Hero section ── */}
      <div className="relative flex items-center justify-center overflow-hidden px-6 py-28 text-center"
        style={{ minHeight: "50vh" }}>

        {/* background glow blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-[120px]"
            style={{ background: "radial-gradient(circle, #5B6BF8 0%, transparent 70%)" }} />
          <div className="absolute right-0 top-0 h-[300px] w-[300px] -translate-y-1/4 translate-x-1/4 rounded-full opacity-10 blur-[80px]"
            style={{ backgroundColor: "#4A5CE8" }} />
        </div>

        <div className="relative z-10 max-w-3xl">
          <span
            className="mb-5 inline-block rounded-full px-4 py-1.5 text-[12px] font-semibold uppercase tracking-widest"
            style={{ color: ACCENT, backgroundColor: "rgba(91,107,248,0.12)", border: "1px solid rgba(91,107,248,0.25)" }}
          >
            Talk to an Expert
          </span>

          <h1 className="mb-5 text-[40px] font-bold leading-tight tracking-tight text-white sm:text-[52px] lg:text-[60px]">
            Let&apos;s Build Something{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #6B7FF0 0%, #4A5CE8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Remarkable
            </span>
          </h1>

          <p className="mx-auto max-w-xl text-[16px] leading-relaxed sm:text-[18px]" style={{ color: MUTED }}>
            Tell us about your project and one of our Voice AI specialists will reach out within one business day.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
            {["Enterprise-ready", "Fast onboarding", "Dedicated support"].map((tag) => (
              <div key={tag} className="flex items-center gap-2 text-[14px]" style={{ color: MUTED }}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: ACCENT }} />
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Form section ── */}
      <div className="mx-auto max-w-2xl px-6 pb-24">
        <div
          className="rounded-2xl p-8 sm:p-10"
          style={{
            background: "linear-gradient(135deg, rgb(11,13,20), rgb(20,26,52), rgb(11,13,20))",
            border: "1px solid rgba(91,107,248,0.2)",
            boxShadow: "0 0 60px rgba(91,107,248,0.07)",
          }}
        >
          <h2 className="mb-1 text-[22px] font-bold text-white">Get in touch</h2>
          <p className="mb-8 text-[14px]" style={{ color: MUTED }}>
            Fill out the form and we'll connect you with the right expert.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <InputField id="firstName" label="First name" placeholder="Jane" value={form.firstName} onChange={set("firstName")} />
              <InputField id="lastName" label="Last name" placeholder="Smith" value={form.lastName} onChange={set("lastName")} />
            </div>

            <InputField id="email" label="Work email" type="email" placeholder="jane@company.com" value={form.email} onChange={set("email")} />
            <InputField id="company" label="Company" placeholder="Acme Corp" value={form.company} onChange={set("company")} />

            {/* Industry select */}
            <div>
              <label htmlFor="industry" className="mb-1.5 block text-[13px] font-medium" style={{ color: MUTED }}>
                Industry
              </label>
              <select
                id="industry"
                required
                value={form.industry}
                onChange={set("industry")}
                className="w-full rounded-lg px-4 py-3 text-[14px] text-white outline-none transition-all duration-200"
                style={{
                  backgroundColor: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(91,107,248,0.25)",
                  color: form.industry ? "#fff" : "#4a4f65",
                }}
                onFocus={(e) => (e.target.style.borderColor = ACCENT)}
                onBlur={(e) => (e.target.style.borderColor = "rgba(91,107,248,0.25)")}
              >
                <option value="" disabled style={{ backgroundColor: "#0e1128" }}>Select your industry</option>
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind} style={{ backgroundColor: "#0e1128" }}>{ind}</option>
                ))}
              </select>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="mb-1.5 block text-[13px] font-medium" style={{ color: MUTED }}>
                How can we help?
              </label>
              <textarea
                id="message"
                rows={4}
                required
                placeholder="Tell us about your use case or project..."
                value={form.message}
                onChange={set("message")}
                className="w-full resize-none rounded-lg px-4 py-3 text-[14px] text-white outline-none transition-all duration-200 placeholder:text-[#4a4f65]"
                style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(91,107,248,0.25)" }}
                onFocus={(e) => (e.target.style.borderColor = ACCENT)}
                onBlur={(e) => (e.target.style.borderColor = "rgba(91,107,248,0.25)")}
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-full py-3.5 text-[15px] font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #6B7FF0 0%, #4A5CE8 100%)",
                boxShadow: "0 4px 24px rgba(91,107,248,0.35)",
              }}
            >
              Talk to an Expert
            </button>
          </form>
        </div>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-6 flex w-full items-center justify-center gap-2 text-[13px] transition-opacity hover:opacity-100"
          style={{ color: MUTED, opacity: 0.7 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Back
        </button>
      </div>
    </div>
  );
}
