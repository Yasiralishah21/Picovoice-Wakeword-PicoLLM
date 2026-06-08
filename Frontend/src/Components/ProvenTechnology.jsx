import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ACCENT = "#5B6BF8";
const MUTED = "#9095A8";

const ITEMS = [
  {
    title: "Customer Service",
    desc: "Deliver instant, accurate answers 24/7 across every channel. Our AI agents handle FAQs, order tracking, refunds, and escalations — freeing your team for complex cases.",
  },
  {
    title: "Sales & Marketing",
    desc: "Qualify leads, nurture prospects, and personalise outreach at scale. Our AI understands intent signals and moves buyers through your funnel faster.",
  },
  {
    title: "Product",
    desc: "Surface insights from user feedback and feature requests automatically. Let AI triage, tag, and route product signals so your team ships what matters most.",
  },
  {
    title: "Operations",
    desc: "Managing an understaffed contact center? Our AI agents quickly resolve issues at scale, keeping operating costs low while boosting capacity.",
  },
  {
    title: "IT Service Management",
    desc: "Automate tier-1 IT support, password resets, and incident triage. Cut mean-time-to-resolution and let your team focus on infrastructure.",
  },
];

export default function ProvenTechnology() {
  const [active, setActive] = useState(3);
  const navigate = useNavigate();

  return (
    <section className="h6-section">
      <div className="h6-inner">

        {/* ── Left: video + button ── */}
        <div className="h6-left">
          <h2 className="h6-heading">Proven technology that drives impact.</h2>
          <div className="h6-video-wrap">
            <video
              className="h6-iframe"
              src="https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4"
              autoPlay
              muted
              loop
              playsInline
            />
          </div>
          <button
            type="button"
            className="h6-cta"
            onClick={() => navigate("/talk-to-expert")}
          >
            Talk to an Expert
          </button>
        </div>

        {/* ── Right: accordion list ── */}
        <div className="h6-right">
          <ul className="h6-list">
            {ITEMS.map((item, i) => {
              const isActive = active === i;
              return (
                <li
                  key={item.title}
                  className={`h6-item ${isActive ? "h6-item--active" : ""}`}
                  onClick={() => setActive(i)}
                >
                  <span className="h6-item-title">{item.title}</span>
                  {isActive && <p className="h6-item-desc">{item.desc}</p>}
                </li>
              );
            })}
          </ul>
        </div>

      </div>

      <style>{`
        .h6-section {
          width: 100%;
          padding: clamp(2rem, 5vw, 4rem) clamp(1rem, 4vw, 2rem);
          background: transparent;
        }

        /* ── same inner as herofour ── */
        .h6-inner {
          display: flex;
          flex-direction: column;
          gap: clamp(2rem, 5vw, 3rem);
          width: 100%;
          max-width: 75rem;
          margin: 0 auto;
          align-items: center;
        }
        @media (min-width: 768px) {
          .h6-inner {
            flex-direction: row;
            align-items: center;
            gap: clamp(2.5rem, 6vw, 5rem);
          }
        }

        /* ── Left ── */
        .h6-left {
          flex: 1 1 0;
          min-width: 0;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .h6-heading {
          margin: 0;
          font-size: clamp(1.125rem, 2.8vw, 1.625rem);
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.02em;
          line-height: 1.2;
          white-space: nowrap;
        }

        .h6-video-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 4/3;
          border-radius: 1.125rem;
          overflow: hidden;
          background: #000;
          box-shadow: 0 8px 40px rgba(0,0,0,0.45);
        }

        .h6-iframe {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border: none;
          display: block;
          object-fit: cover;
        }

        .h6-cta {
          align-self: flex-start;
          padding: 0.8rem 1.875rem;
          border-radius: 0.5rem;
          font-size: 0.9375rem;
          font-weight: 600;
          color: #ffffff;
          border: none;
          cursor: pointer;
          background: linear-gradient(135deg, #6B7FF0 0%, #4A5CE8 100%);
          box-shadow: 0 4px 20px rgba(91,107,248,0.38);
          transition: opacity 200ms, transform 150ms;
        }
        .h6-cta:hover { opacity: 0.88; transform: translateY(-1px); }

        /* ── Right — same sizing as herofour-right card ── */
        .h6-right {
          flex: 0 0 auto;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        @media (min-width: 768px) {
          .h6-right {
            width: clamp(300px, 44%, 460px);
          }
        }

        .h6-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          width: 100%;
          gap: 0.125rem;
        }

        .h6-item {
          padding: clamp(0.75rem, 2vw, 1rem) clamp(0.875rem, 2.5vw, 1.25rem);
          border-radius: 0.5rem;
          cursor: pointer;
          border-left: 3px solid transparent;
          transition: background 200ms, border-color 200ms;
        }
        .h6-item:hover {
          background: rgba(91,107,248,0.06);
          border-left-color: rgba(91,107,248,0.45);
        }
        .h6-item--active {
          background: rgba(91,107,248,0.09);
          border-left-color: ${ACCENT};
        }

        .h6-item-title {
          display: block;
          font-size: clamp(0.9375rem, 2vw, 1.0625rem);
          font-weight: 600;
          color: rgba(255,255,255,0.6);
          transition: color 200ms;
          line-height: 1.3;
        }
        .h6-item:hover .h6-item-title,
        .h6-item--active .h6-item-title { color: #ffffff; }

        .h6-item-desc {
          margin: 0.5rem 0 0.125rem;
          font-size: clamp(0.8125rem, 1.8vw, 0.875rem);
          line-height: 1.65;
          color: ${MUTED};
          animation: h6-fadeIn 200ms ease;
        }

        @keyframes h6-fadeIn {
          from { opacity: 0; transform: translateY(-3px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 767px) {
          .h6-section { padding: 2.5rem 1rem 3rem; }
          .h6-cta { width: 100%; text-align: center; align-self: stretch; }
        }

        @media (prefers-reduced-motion: reduce) {
          .h6-cta, .h6-item { transition: none; }
          .h6-item-desc { animation: none; }
        }
      `}</style>
    </section>
  );
}
