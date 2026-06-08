import { useNavigate } from "react-router-dom";

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
    color: "#5B6BF8",
    title: "Privacy First",
    desc: "Downloaded models run entirely on-device. No cloud connection needed for inference.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
      </svg>
    ),
    color: "#22d3ee",
    title: "Lightweight & Fast",
    desc: "Sub-100KB models that run in real-time on Raspberry Pi, phones, and browsers.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
      </svg>
    ),
    color: "#f87171",
    title: "100% Open Source",
    desc: "Built on OpenWakeWord. Apache 2.0 licensed. Customize and self-host.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A8.966 8.966 0 0 1 3 12c0-1.264.26-2.467.732-3.553" />
      </svg>
    ),
    color: "#a78bfa",
    title: "Multilingual",
    desc: "Train wake words in 20+ languages: English, Spanish, French, German, Italian, Portuguese, and more.",
  },
];

function MicIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"
      className="herofour-mic-svg">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
    </svg>
  );
}

export default function WhyOpenWakeword() {
  const navigate = useNavigate();

  return (
    <section className="herofour-section">
      <div className="herofour-inner">

        {/* ── Left: feature list ── */}
        <div className="herofour-left">
          <h2 className="herofour-heading">Why OpenWakeWord?</h2>

          <ul className="herofour-list">
            {FEATURES.map((feat) => (
              <li key={feat.title} className="herofour-item">
                <span className="herofour-icon-wrap" style={{ color: feat.color }}>
                  {feat.icon}
                </span>
                <div className="herofour-item-body">
                  <p className="herofour-item-title" style={{ color: feat.color }}>
                    {feat.title}
                  </p>
                  <p className="herofour-item-desc">{feat.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Right: CTA card ── */}
        <div className="herofour-right">
          <div className="herofour-card">
            {/* mic icon bubble */}
            <div className="herofour-mic-bubble">
              <MicIcon />
            </div>

            <h3 className="herofour-card-title">Ready to get started?</h3>
            <p className="herofour-card-desc">
              Create your first custom wake word in under an hour.
            </p>

            <a
              href="/login"
              className="herofour-cta-btn"
              onClick={(e) => { e.preventDefault(); navigate("/login"); }}
            >
              → Sign In to Begin
            </a>
          </div>
        </div>

      </div>

      <style>{`
        .herofour-section {
          width: 100%;
          padding: 0 clamp(1rem, 4vw, 2rem) clamp(3rem, 7vw, 5rem);
          margin-top: -2rem;
          background: transparent;
        }

        .herofour-inner {
          display: flex;
          flex-direction: column;
          gap: clamp(2rem, 5vw, 3rem);
          width: 100%;
          max-width: 75rem;
          margin: 0 auto;
          align-items: center;
        }

        @media (min-width: 768px) {
          .herofour-inner {
            flex-direction: row;
            align-items: center;
            gap: clamp(2.5rem, 6vw, 5rem);
          }
        }

        /* ── Left ── */
        .herofour-left {
          flex: 1 1 0;
          min-width: 0;
          width: 100%;
          padding-top: clamp(1rem, 3vw, 2rem);
        }

        .herofour-heading {
          font-size: clamp(1.625rem, 4vw, 2.125rem);
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 clamp(1.75rem, 4vw, 2.25rem) 0;
          line-height: 1.15;
          letter-spacing: -0.02em;
        }

        .herofour-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: clamp(1.4rem, 3.5vw, 1.875rem);
        }

        .herofour-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }

        .herofour-icon-wrap {
          flex-shrink: 0;
          width: 1.5rem;
          height: 1.5rem;
          margin-top: 0.1rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .herofour-icon-wrap svg {
          width: 100%;
          height: 100%;
        }

        .herofour-item-body {
          min-width: 0;
        }

        .herofour-item-title {
          margin: 0 0 0.3rem 0;
          font-size: clamp(0.9375rem, 2vw, 1.0625rem);
          font-weight: 650;
          line-height: 1.3;
          letter-spacing: -0.01em;
        }

        .herofour-item-desc {
          margin: 0;
          font-size: clamp(0.875rem, 1.8vw, 0.9375rem);
          line-height: 1.6;
          color: rgba(144, 149, 168, 0.9);
        }

        /* ── Right ── */
        .herofour-right {
          flex: 0 0 auto;
          width: 100%;
          display: flex;
          justify-content: center;
        }

        @media (min-width: 768px) {
          .herofour-right {
            width: clamp(340px, 44%, 440px);
          }
        }

        .herofour-card {
          width: 100%;
          max-width: 440px;
          border-radius: 1.25rem;
          padding: clamp(2rem, 5vw, 3rem) clamp(1.75rem, 4vw, 2.5rem);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          background: linear-gradient(
            145deg,
            rgba(26, 31, 78, 0.7) 0%,
            rgba(20, 24, 60, 0.8) 50%,
            rgba(15, 17, 48, 0.85) 100%
          );
          border: 1px solid rgba(91, 107, 248, 0.28);
          box-shadow:
            0 0 40px rgba(91, 107, 248, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.06);
        }

        /* mic bubble */
        .herofour-mic-bubble {
          width: clamp(3.5rem, 8vw, 4.25rem);
          height: clamp(3.5rem, 8vw, 4.25rem);
          border-radius: 1.125rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #6B7FF0 0%, #4A5CE8 60%, #22d3ee 100%);
          box-shadow: 0 4px 24px rgba(91, 107, 248, 0.5);
        }

        .herofour-mic-svg {
          width: 52%;
          height: 52%;
          color: #ffffff;
        }

        .herofour-card-title {
          margin: 0 0 0.625rem 0;
          font-size: clamp(1.125rem, 2.5vw, 1.3125rem);
          font-weight: 700;
          color: #ffffff;
          line-height: 1.25;
          letter-spacing: -0.015em;
        }

        .herofour-card-desc {
          margin: 0 0 1.75rem 0;
          font-size: clamp(0.875rem, 2vw, 0.9375rem);
          line-height: 1.6;
          color: rgba(144, 149, 168, 0.9);
        }

        .herofour-cta-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 0.875rem 1.75rem;
          border-radius: 0.625rem;
          font-size: clamp(0.9375rem, 2vw, 1rem);
          font-weight: 600;
          color: #ffffff;
          text-decoration: none;
          letter-spacing: 0.01em;
          background: linear-gradient(90deg, #22d3ee 0%, #818cf8 100%);
          box-shadow: 0 4px 20px rgba(34, 211, 238, 0.32);
          transition: opacity 200ms ease, transform 200ms ease;
        }

        .herofour-cta-btn:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }

        .herofour-cta-btn:active {
          transform: translateY(0);
        }

        @media (prefers-reduced-motion: reduce) {
          .herofour-cta-btn {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
}
