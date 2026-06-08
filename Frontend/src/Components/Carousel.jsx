import { useState, useRef } from "react";

const CARDS = [
  {
    accent: "#5B6BF8",
    accentLight: "rgba(91,107,248,0.18)",
    logo: "NeuroLink",
    logoSub: "ENTERPRISE",
    stat: "94%",
    statLabel: "of support tickets resolved autonomously by our AI agents.",
    quote:
      "\"Deploying TechelixAI cut our first-response time from hours to seconds. Our team now focuses entirely on high-value work instead of repetitive queries.\"",
    role: "Head of Customer Experience",
    company: "NeuroLink Enterprise",
  },
  {
    accent: "#7C3AED",
    accentLight: "rgba(124,58,237,0.18)",
    logo: "Resorts World",
    logoSub: "LAS VEGAS",
    stat: "59%",
    statLabel: "of all guest inquiries are fully resolved by our AI agents.",
    quote:
      "\"Being able to take care of those easy requests through our digital concierge opens up our ability to take care of guests who truly have the most complicated situations that need a person to take care of.\"",
    role: "VP of Operations",
    company: "Resorts World Las Vegas",
  },
  {
    accent: "#0891B2",
    accentLight: "rgba(8,145,178,0.18)",
    logo: "Cascade",
    logoSub: "FOODS",
    stat: "21M+",
    statLabel: "guest interactions handled with our AI agents, successfully serving millions of food orders.",
    quote:
      "\"TechelixAI handles the volume we could never staff for. Accuracy is outstanding and our customer satisfaction scores have never been higher.\"",
    role: "CTO",
    company: "Cascade Foods",
  },
  {
    accent: "#059669",
    accentLight: "rgba(5,150,105,0.18)",
    logo: "Vantage",
    logoSub: "HEALTH",
    stat: "3.2x",
    statLabel: "increase in patient engagement since launching our Voice AI solution.",
    quote:
      "\"Patients love being able to get answers at 2am without waiting on hold. It has completely changed how we deliver care at scale.\"",
    role: "Director of Digital Health",
    company: "Vantage Health",
  },
  {
    accent: "#EA580C",
    accentLight: "rgba(234,88,12,0.18)",
    logo: "Apex",
    logoSub: "AUTOMOTIVE",
    stat: "40%",
    statLabel: "reduction in call-centre volume within the first 90 days of deployment.",
    quote:
      "\"The in-vehicle assistant feels genuinely natural. Drivers interact with it the same way they would talk to a colleague — and it always knows the answer.\"",
    role: "VP of Connected Services",
    company: "Apex Automotive",
  },
];

function ChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function QuoteIcon({ color }) {
  return (
    <svg width="28" height="22" viewBox="0 0 28 22" fill={color} aria-hidden="true">
      <path d="M0 22V13.364C0 9.697 .97 6.788 2.91 4.636 4.88 2.455 7.727 1.03 11.455 0l1.09 2.182C10.061 2.97 8.394 4.03 7.273 5.364 6.182 6.667 5.576 8.333 5.455 10.364H11V22H0Zm16 0V13.364c0-3.667.97-6.576 2.91-8.728C20.88 2.455 23.727 1.03 27.455 0l1.09 2.182c-2.484.788-4.151 1.848-5.272 3.182-1.091 1.303-1.697 2.97-1.818 4.999H27V22H16Z" />
    </svg>
  );
}

function LogoMark({ name }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <div style={{
        width: "2rem", height: "2rem", borderRadius: "50%",
        border: "2px solid rgba(255,255,255,0.6)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="rgba(255,255,255,0.9)" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247" />
        </svg>
      </div>
      <div>
        <div style={{ fontSize: "1rem", fontWeight: 700, color: "#fff", lineHeight: 1.1,
          fontFamily: "Georgia, serif", fontStyle: "italic" }}>{name}</div>
        <div style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.12em",
          color: "rgba(255,255,255,0.7)", marginTop: "1px" }}>{CARDS.find(c=>c.logo===name)?.logoSub}</div>
      </div>
    </div>
  );
}

export default function Carousel() {
  const [active, setActive] = useState(1);
  const [animDir, setAnimDir] = useState(null);
  const animating = useRef(false);

  const go = (dir) => {
    if (animating.current) return;
    animating.current = true;
    setAnimDir(dir);
    setTimeout(() => {
      setActive((prev) => (prev + dir + CARDS.length) % CARDS.length);
      setAnimDir(null);
      animating.current = false;
    }, 320);
  };

  const prev = (active - 1 + CARDS.length) % CARDS.length;
  const next = (active + 1) % CARDS.length;
  const card = CARDS[active];

  return (
    <section className="h5-section">
      {/* heading */}
      <div className="h5-heading-wrap">
        <h2 className="h5-heading">Our customers see value in every interaction.</h2>
      </div>

      {/* carousel row */}
      <div className="h5-row">

        {/* left ghost */}
        <div className="h5-ghost h5-ghost-left" onClick={() => go(-1)}>
          <div className="h5-ghost-card">
            <div className="h5-ghost-left-panel" style={{ background: CARDS[prev].accent }} />
            <div className="h5-ghost-right-panel">
              <p className="h5-ghost-text">{CARDS[prev].quote.slice(0, 120)}…</p>
            </div>
          </div>
        </div>

        {/* left arrow */}
        <button type="button" className="h5-arrow h5-arrow-left" onClick={() => go(-1)}
          aria-label="Previous">
          <ChevronLeft />
        </button>

        {/* center spotlight card */}
        <div className={`h5-center-wrap ${animDir === -1 ? "h5-exit-right" : animDir === 1 ? "h5-exit-left" : ""}`}>
          <div className="h5-spotlight" />
          <div className="h5-card">
            {/* left accent panel */}
            <div className="h5-card-left" style={{ background: card.accent }}>
              <LogoMark name={card.logo} color={card.accent} />
              <div className="h5-divider" />
              <p className="h5-stat-text">
                <span className="h5-stat-num">{card.stat}</span>{" "}
                {card.statLabel}
              </p>
            </div>
            {/* right content panel */}
            <div className="h5-card-right">
              <QuoteIcon color={card.accent} />
              <p className="h5-quote">{card.quote}</p>
              <div className="h5-attribution">
                <span className="h5-attr-role">{card.role}</span>
                <span className="h5-attr-company">{card.company}</span>
              </div>
            </div>
          </div>
        </div>

        {/* right arrow */}
        <button type="button" className="h5-arrow h5-arrow-right" onClick={() => go(1)}
          aria-label="Next">
          <ChevronRight />
        </button>

        {/* right ghost */}
        <div className="h5-ghost h5-ghost-right" onClick={() => go(1)}>
          <div className="h5-ghost-card">
            <div className="h5-ghost-left-panel" style={{ background: CARDS[next].accent }} />
            <div className="h5-ghost-right-panel">
              <p className="h5-ghost-text">{CARDS[next].quote.slice(0, 120)}…</p>
            </div>
          </div>
        </div>

      </div>

      {/* dots */}
      <div className="h5-dots">
        {CARDS.map((_, i) => (
          <button key={i} type="button"
            className={`h5-dot ${i === active ? "h5-dot-active" : ""}`}
            onClick={() => { if (i !== active) go(i > active ? 1 : -1); }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      <style>{`
        .h5-section {
          width: 100%;
          padding: clamp(3rem, 7vw, 5rem) 0 clamp(3rem, 7vw, 5rem);
          background: transparent;
          overflow: hidden;
        }

        /* heading */
        .h5-heading-wrap {
          text-align: center;
          padding: 0 1rem;
          margin-bottom: clamp(2rem, 5vw, 3.5rem);
        }
        .h5-heading {
          margin: 0;
          font-size: clamp(1.25rem, 3.5vw, 1.875rem);
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }

        /* row */
        .h5-row {
          position: relative;
          display: grid;
          grid-template-columns: 1fr auto auto auto 1fr;
          align-items: center;
          width: 100%;
          min-height: clamp(220px, 40vw, 320px);
        }

        /* center card wrap */
        .h5-center-wrap {
          position: relative;
          z-index: 10;
          flex-shrink: 0;
          width: min(680px, 88vw);
          transition: opacity 320ms ease, transform 320ms ease;
        }
        .h5-exit-left  { opacity: 0; transform: translateX(-40px); }
        .h5-exit-right { opacity: 0; transform: translateX(40px); }

        /* spotlight */
        .h5-spotlight {
          pointer-events: none;
          position: absolute;
          inset: -40px;
          border-radius: 2rem;
          background: radial-gradient(ellipse at 50% 60%,
            rgba(91,107,248,0.22) 0%, transparent 70%);
          filter: blur(18px);
          z-index: 0;
        }

        /* main card */
        .h5-card {
          position: relative;
          z-index: 1;
          display: flex;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 8px 48px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.07);
          min-height: clamp(280px, 48vw, 400px);
        }

        .h5-card-left {
          flex: 0 0 42%;
          padding: clamp(1.25rem, 4vw, 2rem);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 1rem;
        }

        .h5-divider {
          width: 100%;
          height: 1px;
          background: rgba(255,255,255,0.25);
          margin: 0.25rem 0;
        }

        .h5-stat-text {
          margin: 0;
          font-size: clamp(0.8125rem, 1.8vw, 0.9375rem);
          font-weight: 400;
          color: rgba(255,255,255,0.9);
          line-height: 1.55;
        }

        .h5-stat-num {
          font-size: clamp(1.5rem, 4vw, 2.25rem);
          font-weight: 800;
          color: #ffffff;
          display: block;
          line-height: 1.1;
          margin-bottom: 0.25rem;
        }

        .h5-card-right {
          flex: 1 1 0;
          background: rgb(17, 20, 40);
          padding: clamp(1.25rem, 4vw, 2rem);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 1rem;
        }

        .h5-quote {
          margin: 0.5rem 0 0;
          font-size: clamp(0.8125rem, 1.8vw, 0.9375rem);
          line-height: 1.65;
          color: rgba(255,255,255,0.82);
          flex: 1;
        }

        .h5-attribution {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .h5-attr-role {
          font-size: clamp(0.75rem, 1.5vw, 0.8125rem);
          font-weight: 700;
          color: rgba(255,255,255,0.9);
        }

        .h5-attr-company {
          font-size: clamp(0.6875rem, 1.4vw, 0.75rem);
          color: rgba(144,149,168,0.85);
        }

        /* arrows */
        .h5-arrow {
          position: relative;
          z-index: 20;
          flex-shrink: 0;
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          border: 1px solid rgba(91,107,248,0.4);
          background: rgba(91,107,248,0.12);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 200ms, border-color 200ms, transform 150ms;
          margin: 0 clamp(0.5rem, 2vw, 1.25rem);
        }
        .h5-arrow:hover {
          background: rgba(91,107,248,0.28);
          border-color: rgba(91,107,248,0.7);
          transform: scale(1.08);
        }

        /* ghost side cards */
        .h5-ghost {
          opacity: 0.38;
          cursor: pointer;
          transition: opacity 200ms;
          overflow: hidden;
          height: clamp(240px, 44vw, 360px);
          align-self: center;
        }
        .h5-ghost:hover { opacity: 0.55; }

        .h5-ghost-left  {
          border-radius: 0 0.75rem 0.75rem 0;
        }
        .h5-ghost-right {
          border-radius: 0.75rem 0 0 0.75rem;
        }

        .h5-ghost-card {
          display: flex;
          height: 100%;
          width: 100%;
          border-radius: inherit;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(0,0,0,0.3);
        }

        .h5-ghost-left-panel {
          flex: 0 0 40%;
        }

        .h5-ghost-right-panel {
          flex: 1;
          background: rgb(17, 20, 40);
          padding: 1rem;
          overflow: hidden;
        }

        .h5-ghost-text {
          margin: 0;
          font-size: clamp(0.6875rem, 1.4vw, 0.8125rem);
          color: rgba(144,149,168,0.7);
          line-height: 1.55;
          display: -webkit-box;
          -webkit-line-clamp: 6;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* dots */
        .h5-dots {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-top: clamp(1.5rem, 4vw, 2.5rem);
        }

        .h5-dot {
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 50%;
          border: none;
          background: rgba(91,107,248,0.3);
          cursor: pointer;
          transition: background 200ms, transform 200ms;
          padding: 0;
        }

        .h5-dot-active {
          background: #5B6BF8;
          transform: scale(1.35);
        }

        /* hide ghost cards on small screens */
        @media (max-width: 600px) {
          .h5-section {
            padding: 2.5rem 0 2.5rem;
          }

          .h5-row {
            grid-template-columns: auto 1fr auto;
            min-height: unset;
          }

          .h5-ghost { display: none; }

          .h5-arrow {
            margin: 0 0.5rem;
            width: 2.25rem;
            height: 2.25rem;
            flex-shrink: 0;
          }

          .h5-center-wrap {
            width: 100%;
            min-width: 0;
          }

          /* stack card vertically on mobile */
          .h5-card {
            flex-direction: column;
            min-height: unset;
            border-radius: 0.875rem;
          }

          .h5-card-left {
            flex: none;
            width: 100%;
            padding: 1.25rem;
            flex-direction: row;
            align-items: center;
            gap: 1rem;
            flex-wrap: wrap;
          }

          .h5-divider {
            display: none;
          }

          .h5-stat-num {
            font-size: 1.75rem;
          }

          .h5-stat-text {
            font-size: 0.875rem;
          }

          .h5-card-right {
            padding: 1.25rem;
          }

          .h5-quote {
            font-size: 0.9rem;
          }

          .h5-attr-role {
            font-size: 0.8125rem;
          }

          .h5-attr-company {
            font-size: 0.75rem;
          }

          .h5-spotlight {
            inset: -20px;
          }
        }

        /* also handle mid-range tablets that might still feel cramped */
        @media (min-width: 601px) and (max-width: 900px) {
          .h5-center-wrap {
            width: min(580px, 78vw);
          }
          .h5-card-left {
            flex: 0 0 38%;
          }
          .h5-ghost {
            height: clamp(200px, 36vw, 280px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .h5-center-wrap, .h5-arrow { transition: none; }
        }
      `}</style>
    </section>
  );
}
