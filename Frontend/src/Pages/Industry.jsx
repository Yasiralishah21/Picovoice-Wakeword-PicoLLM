import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ACCENT = "#5B6BF8";
const CYAN = "#22d3ee";
const MUTED = "#9095A8";

const INDUSTRIES = {
  "banking-fintech": {
    title: "Banking & Fintech",
    headingPrefix: "Voice AI built for",
    typingWords: ["secure banking", "fraud prevention", "instant support"],
    heroDesc:
      "Deploy compliant voice assistants that authenticate customers, resolve queries, and streamline transactions — without compromising security.",
    heroImage:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1600&q=80",
    logos: ["VISA", "Stripe", "PayPal", "Chase", "HSBC", "Barclays", "Revolut", "Square"],
    sections: [
      {
        title: "Voice authentication that customers trust",
        desc: "Replace lengthy IVR menus with natural conversations. Verify identity through voice biometrics and reduce call handle time by up to 40%.",
        image:
          "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80",
        imageRight: true,
      },
      {
        title: "Real-time fraud detection & alerts",
        desc: "Flag suspicious activity instantly with AI that listens, understands intent, and escalates high-risk transactions to human agents in seconds.",
        image:
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
        imageRight: false,
      },
      {
        title: "Multilingual support at global scale",
        desc: "Serve customers in 20+ languages across phone, mobile, and web — with consistent brand voice and regulatory compliance built in.",
        image:
          "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=900&q=80",
        imageRight: true,
      },
    ],
  },
  insurance: {
    title: "Insurance",
    headingPrefix: "Smarter claims with",
    typingWords: ["faster intake", "policy clarity", "24/7 assistance"],
    heroDesc:
      "Help policyholders file claims, check coverage, and get answers through voice — reducing wait times and freeing agents for complex cases.",
    heroImage:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=80",
    logos: ["Allianz", "AXA", "MetLife", "Prudential", "Zurich", "AIG", "Liberty", "Hartford"],
    sections: [
      {
        title: "Automated claims from first notice",
        desc: "Guide customers through FNOL with conversational AI that captures details, validates documents, and routes claims to the right adjuster.",
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80",
        imageRight: true,
      },
      {
        title: "Policy lookup without the hold music",
        desc: "Let customers check coverage, renewals, and billing status instantly — across phone, app, or smart speaker interfaces.",
        image:
          "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80",
        imageRight: false,
      },
      {
        title: "Seamless handoff to live agents",
        desc: "When human expertise is needed, transfer full conversation context so agents pick up exactly where the AI left off.",
        image:
          "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=80",
        imageRight: true,
      },
    ],
  },
  manufacturing: {
    title: "Manufacturing",
    headingPrefix: "Hands-free ops for",
    typingWords: ["the factory floor", "safety checks", "live diagnostics"],
    heroDesc:
      "Give technicians voice-activated access to manuals, SOPs, and equipment data — even in loud environments with custom wake words.",
    heroImage:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=80",
    logos: ["Siemens", "Bosch", "ABB", "Honeywell", "3M", "Caterpillar", "Fanuc", "Schneider"],
    sections: [
      {
        title: "Voice-activated equipment diagnostics",
        desc: "Technicians query machine status, error codes, and maintenance history without stopping work or removing gloves.",
        image:
          "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=900&q=80",
        imageRight: true,
      },
      {
        title: "Safety workflows on voice command",
        desc: "Run pre-shift checklists, log incidents, and trigger lockout procedures through wake-word activation built for industrial noise.",
        image:
          "https://images.unsplash.com/photo-1581092160562-40aa08ad7881?auto=format&fit=crop&w=900&q=80",
        imageRight: false,
      },
      {
        title: "Real-time production line alerts",
        desc: "Surface downtime events, quality flags, and throughput anomalies to supervisors before they cascade into costly delays.",
        image:
          "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c3?auto=format&fit=crop&w=900&q=80",
        imageRight: true,
      },
    ],
  },
  healthcare: {
    title: "Healthcare",
    headingPrefix: "Care teams powered by",
    typingWords: ["clinical voice", "HIPAA workflows", "patient access"],
    heroDesc:
      "Streamline documentation, room controls, and patient interactions with voice AI designed for privacy-first healthcare environments.",
    heroImage:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1600&q=80",
    logos: ["GE Health", "Philips", "Siemens Health", "Epic", "Cerner", "Medtronic", "Mayo", "Kaiser"],
    sections: [
      {
        title: "Hands-free clinical documentation",
        desc: "Clinicians dictate notes, orders, and updates while staying focused on patients — with structured data flowing into your EHR.",
        image:
          "https://images.unsplash.com/photo-1631217868264-e5b1b5f2f4b6?auto=format&fit=crop&w=900&q=80",
        imageRight: true,
      },
      {
        title: "Patient room voice controls",
        desc: "Let patients adjust lighting, request assistance, or get discharge instructions through a bedside voice interface.",
        image:
          "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=900&q=80",
        imageRight: false,
      },
      {
        title: "Secure EHR & system integrations",
        desc: "Connect voice workflows to Epic, Cerner, and internal tools with role-based access and audit-ready compliance logging.",
        image:
          "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=900&q=80",
        imageRight: true,
      },
    ],
  },
};

function Typewriter({ words }) {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const current = words[wordIndex] ?? "";

    if (isPaused) {
      const pauseTimer = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, 1800);
      return () => clearTimeout(pauseTimer);
    }

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (text.length < current.length) {
          setText(current.slice(0, text.length + 1));
        } else {
          setIsPaused(true);
        }
      } else if (text.length > 0) {
        setText(text.slice(0, -1));
      } else {
        setIsDeleting(false);
        setWordIndex((i) => (i + 1) % words.length);
      }
    }, isDeleting ? 45 : 90);

    return () => clearTimeout(timer);
  }, [text, isDeleting, isPaused, wordIndex, words]);

  return (
    <span className="ind-typewriter">
      {text}
      <span className="ind-cursor" aria-hidden="true">|</span>
    </span>
  );
}

function LogoMarquee({ logos }) {
  const track = [...logos, ...logos];
  return (
    <div className="ind-marquee-band">
      <div className="ind-marquee-outer">
        <div className="ind-marquee-track">
          {track.map((logo, i) => (
            <span key={`${logo}-${i}`} className="ind-marquee-logo">{logo}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function InputField({ id, label, type = "text", placeholder, value, onChange }) {
  return (
    <div>
      <label htmlFor={id} className="ind-label">{label}</label>
      <input
        id={id}
        type={type}
        required
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="ind-input"
      />
    </div>
  );
}

function AlternatingSection({ section, index }) {
  const imageRight = section.imageRight;
  const content = (
    <div className="ind-alt-content">
      <span className="ind-alt-num">0{index + 1}</span>
      <h2 className="ind-alt-title">{section.title}</h2>
      <p className="ind-alt-desc">{section.desc}</p>
    </div>
  );
  const image = (
    <div className="ind-alt-image-wrap">
      <img src={section.image} alt="" className="ind-alt-image" loading="lazy" />
      <div className="ind-alt-image-overlay" aria-hidden="true" />
    </div>
  );

  return (
    <section className={`ind-alt-section ${imageRight ? "ind-alt-section--img-right" : "ind-alt-section--img-left"}`}>
      <div className="ind-alt-inner">
        {imageRight ? (
          <>{content}{image}</>
        ) : (
          <>{image}{content}</>
        )}
      </div>
    </section>
  );
}

export default function Industry() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const formRef = useRef(null);
  const industry = INDUSTRIES[slug];

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    message: "",
  });

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const scrollToForm = useCallback(() => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  if (!industry) {
    return (
      <div className="ind-not-found">
        <h1>Industry not found</h1>
        <button type="button" onClick={() => navigate("/")} className="ind-btn-outline">
          Back to home
        </button>
      </div>
    );
  }

  return (
    <div className="ind-page">
      {/* Hero */}
      <section
        className="ind-hero"
        style={{ backgroundImage: `url(${industry.heroImage})` }}
      >
        <div className="ind-hero-overlay" aria-hidden="true" />
        <div className="ind-hero-inner">
          <h1 className="ind-hero-heading">
            {industry.headingPrefix}
            <br />
            <Typewriter words={industry.typingWords} />
          </h1>
          <p className="ind-hero-desc">{industry.heroDesc}</p>
          <button type="button" className="ind-btn-primary" onClick={scrollToForm}>
            Let&apos;s connect
          </button>
        </div>
      </section>

      <LogoMarquee logos={industry.logos} />

      {/* Alternating sections */}
      {industry.sections.map((section, i) => (
        <AlternatingSection key={section.title} section={section} index={i} />
      ))}

      {/* Form */}
      <section ref={formRef} className="ind-form-section">
        <div className="ind-form-card">
          <h2 className="ind-form-title">Let&apos;s connect</h2>
          <p className="ind-form-sub">
            Tell us about your {industry.title.toLowerCase()} use case and we&apos;ll reach out within one business day.
          </p>
          <form onSubmit={handleSubmit} className="ind-form">
            <div className="ind-form-row">
              <InputField id="firstName" label="First name" placeholder="Jane" value={form.firstName} onChange={set("firstName")} />
              <InputField id="lastName" label="Last name" placeholder="Smith" value={form.lastName} onChange={set("lastName")} />
            </div>
            <InputField id="email" label="Work email" type="email" placeholder="jane@company.com" value={form.email} onChange={set("email")} />
            <InputField id="company" label="Company" placeholder="Acme Corp" value={form.company} onChange={set("company")} />
            <div>
              <label htmlFor="message" className="ind-label">How can we help?</label>
              <textarea
                id="message"
                rows={4}
                required
                placeholder="Describe your project or use case..."
                value={form.message}
                onChange={set("message")}
                className="ind-input ind-textarea"
              />
            </div>
            <button type="submit" className="ind-btn-primary ind-btn-full">
              Let&apos;s connect
            </button>
          </form>
        </div>
      </section>

      <style>{`
        .ind-page {
          background: #0a0c1a;
          min-height: 100vh;
        }

        .ind-not-found {
          display: flex;
          min-height: 60vh;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          background: #0a0c1a;
          color: #fff;
          text-align: center;
          padding: 2rem;
        }

        /* ── Hero ── */
        .ind-hero {
          position: relative;
          min-height: clamp(28rem, 75vh, 40rem);
          display: flex;
          align-items: center;
          background-size: cover;
          background-position: center;
          overflow: hidden;
        }

        .ind-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            105deg,
            rgba(10, 12, 26, 0.92) 0%,
            rgba(10, 12, 26, 0.78) 45%,
            rgba(10, 12, 26, 0.55) 100%
          );
        }

        .ind-hero-inner {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 75rem;
          margin: 0 auto;
          padding: clamp(5rem, 12vh, 7rem) clamp(1.5rem, 5vw, 3rem) clamp(3rem, 8vh, 5rem);
          text-align: left;
        }

        .ind-hero-heading {
          margin: 0;
          max-width: 36rem;
          font-size: clamp(2rem, 6vw, 3.5rem);
          font-weight: 700;
          line-height: 1.15;
          color: #ffffff;
          letter-spacing: -0.02em;
        }

        .ind-typewriter {
          color: ${CYAN};
        }

        .ind-cursor {
          display: inline-block;
          margin-left: 2px;
          color: ${CYAN};
          animation: ind-blink 0.9s step-end infinite;
        }

        @keyframes ind-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        .ind-hero-desc {
          margin: 1.5rem 0 0;
          max-width: 32rem;
          font-size: clamp(0.9375rem, 2vw, 1.0625rem);
          line-height: 1.65;
          color: rgba(255, 255, 255, 0.72);
        }

        .ind-btn-primary {
          margin-top: 2rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.875rem 2rem;
          border: none;
          border-radius: 999px;
          font-size: 0.9375rem;
          font-weight: 600;
          color: #fff;
          cursor: pointer;
          background: linear-gradient(135deg, #6B7FF0 0%, #4A5CE8 100%);
          box-shadow: 0 4px 24px rgba(91, 107, 248, 0.35);
          transition: opacity 200ms ease, transform 200ms ease, box-shadow 200ms ease;
        }

        .ind-btn-primary:hover {
          opacity: 0.92;
          transform: translateY(-2px);
          box-shadow: 0 6px 28px rgba(91, 107, 248, 0.45);
        }

        .ind-btn-outline {
          padding: 0.75rem 1.5rem;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.35);
          background: transparent;
          color: #fff;
          cursor: pointer;
        }

        .ind-btn-full { width: 100%; margin-top: 0.5rem; }

        /* ── Marquee ── */
        .ind-marquee-band {
          width: 100%;
          border-top: 1px solid rgba(255,255,255,0.08);
          border-bottom: 1px solid rgba(255,255,255,0.08);
          background: linear-gradient(180deg, rgba(22,26,58,0.5) 0%, rgba(12,14,32,0.65) 100%);
          padding: 1.25rem 0;
        }

        .ind-marquee-outer {
          overflow: hidden;
          -webkit-mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
          mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
        }

        .ind-marquee-track {
          display: flex;
          width: max-content;
          animation: ind-marquee 30s linear infinite;
        }

        @keyframes ind-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .ind-marquee-logo {
          flex-shrink: 0;
          padding: 0 clamp(2rem, 5vw, 3.5rem);
          font-size: clamp(0.8125rem, 1.8vw, 1rem);
          font-weight: 600;
          letter-spacing: 0.08em;
          color: rgba(255,255,255,0.38);
          white-space: nowrap;
          transition: color 200ms ease;
        }

        .ind-marquee-logo:hover {
          color: rgba(255,255,255,0.75);
        }

        /* ── Alternating sections ── */
        .ind-alt-section {
          padding: clamp(3rem, 8vw, 5.5rem) clamp(1rem, 4vw, 2rem);
        }

        .ind-alt-inner {
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(2rem, 5vw, 3.5rem);
          align-items: center;
          max-width: 75rem;
          margin: 0 auto;
        }

        @media (min-width: 768px) {
          .ind-alt-inner {
            grid-template-columns: 1fr 1fr;
          }
        }

        .ind-alt-content {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .ind-alt-num {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          color: ${ACCENT};
        }

        .ind-alt-title {
          margin: 0;
          font-size: clamp(1.375rem, 3.5vw, 2rem);
          font-weight: 700;
          line-height: 1.25;
          color: #fff;
        }

        .ind-alt-desc {
          margin: 0;
          font-size: clamp(0.9rem, 2vw, 1.05rem);
          line-height: 1.65;
          color: ${MUTED};
        }

        .ind-alt-image-wrap {
          position: relative;
          border-radius: clamp(0.75rem, 2vw, 1rem);
          overflow: hidden;
          aspect-ratio: 4 / 3;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .ind-alt-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 600ms ease;
        }

        .ind-alt-image-wrap:hover .ind-alt-image {
          transform: scale(1.04);
        }

        .ind-alt-image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(91,107,248,0.12) 0%, transparent 60%);
          pointer-events: none;
        }

        /* ── Form ── */
        .ind-form-section {
          padding: clamp(3rem, 8vw, 5rem) clamp(1rem, 4vw, 2rem) clamp(4rem, 10vw, 6rem);
        }

        .ind-form-card {
          max-width: 40rem;
          margin: 0 auto;
          padding: clamp(1.75rem, 4vw, 2.5rem);
          border-radius: 1rem;
          border: 1px solid rgba(91,107,248,0.22);
          background: linear-gradient(135deg, rgb(11,13,20), rgb(20,26,52), rgb(11,13,20));
          box-shadow: 0 0 60px rgba(91,107,248,0.07);
        }

        .ind-form-title {
          margin: 0;
          font-size: clamp(1.5rem, 4vw, 1.75rem);
          font-weight: 700;
          color: #fff;
        }

        .ind-form-sub {
          margin: 0.5rem 0 2rem;
          font-size: 0.875rem;
          line-height: 1.55;
          color: ${MUTED};
        }

        .ind-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .ind-form-row {
          display: grid;
          gap: 1.25rem;
        }

        @media (min-width: 640px) {
          .ind-form-row { grid-template-columns: 1fr 1fr; }
        }

        .ind-label {
          display: block;
          margin-bottom: 0.375rem;
          font-size: 0.8125rem;
          font-weight: 500;
          color: ${MUTED};
        }

        .ind-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          border: 1px solid rgba(91,107,248,0.25);
          background: rgba(255,255,255,0.05);
          font-size: 0.875rem;
          color: #fff;
          outline: none;
          transition: border-color 200ms ease;
        }

        .ind-input::placeholder { color: #4a4f65; }

        .ind-input:focus {
          border-color: ${ACCENT};
        }

        .ind-textarea {
          resize: vertical;
          min-height: 6rem;
        }

        @media (prefers-reduced-motion: reduce) {
          .ind-marquee-track,
          .ind-cursor,
          .ind-alt-image {
            animation: none;
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}
