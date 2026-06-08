import { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";

const STEPS = [
  {
    title: "User speaks to agent via app, browser, or phone call",
    description:
      "Inputs are captured via the platform SDK or SIP trunk.",
  },
  {
    title: "User speech is streamed from device to agent",
    description:
      "Voice, video, and text data travel via WebRTC through a global edge network with less than 100ms latency.",
  },
  {
    title: "Agent receives user speech and runs your custom business logic",
    description:
      "Your agent processes the input, calls your APIs, runs LLM inference, and formulates a response.",
  },
  {
    title: "Agent responds back to the user",
    description:
      "The response is streamed back in real-time as audio, text, or actions inside your app.",
  },
];

const CARD_LABELS = [
  "CLIENT SDKS",
  "GLOBAL EDGE NETWORK",
  "AGENT LOGIC",
  "REAL-TIME RESPONSE",
];

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-4.17-1.41-6.84-1.695-6.84-7.455 0-1.65.585-3 1.755-4.05-.165-.405-.72-1.965.165-4.05 0 0 1.44-.465 4.725 1.545 1.38-.39 2.85-.585 4.32-.585 1.47 0 2.94.195 4.32.585 3.285-2.025 4.725-1.545 4.725-1.545.885 2.085.33 3.645.165 4.05 1.17 1.05 1.755 2.4 1.755 4.05 0 5.775-2.67 6.045-6.84 7.455-.51.285-1.095 1.35-1.23 1.695-.24.675-1.02 1.965-4.035 1.41 0 1.005.015 1.95.015 2.235 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function IsometricStack({ activeStep }) {
  return (
    <div className="herothree-iso-wrap">
      <div className="herothree-iso-scene">
        {[0, 1, 2, 3].map((index) => {
          const cardIndex = 3 - index;
          const isActive = activeStep === 3 - index;
          return (
            <div
              key={cardIndex}
              className={`herothree-iso-card ${isActive ? "herothree-iso-card--active" : ""}`}
              style={{
                transform: `translateY(${index * -18}px) translateZ(${index * 12}px)`,
                zIndex: index + 1,
              }}
            >
              <div className="herothree-iso-card-dots">
                <span />
                <span />
                <span />
              </div>
              <div className="herothree-iso-card-bars">
                <span />
                <span />
              </div>
            </div>
          );
        })}
      </div>
      <div className="herothree-iso-labels">
        {CARD_LABELS.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  );
}

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [lineMetrics, setLineMetrics] = useState({ top: 0, trackHeight: 0 });
  const wrapperRef = useRef(null);
  const stepsWrapRef = useRef(null);
  const badgeRefs = useRef([]);

  const updateLineMetrics = useCallback(() => {
    const wrap = stepsWrapRef.current;
    const firstBadge = badgeRefs.current[0];
    const lastBadge = badgeRefs.current[STEPS.length - 1];
    if (!wrap || !firstBadge || !lastBadge) return;

    const wrapRect = wrap.getBoundingClientRect();
    const firstRect = firstBadge.getBoundingClientRect();
    const lastRect = lastBadge.getBoundingClientRect();
    const top = firstRect.bottom - wrapRect.top;
    const trackHeight = Math.max(lastRect.top - firstRect.bottom, 0);

    setLineMetrics({ top, trackHeight });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!wrapperRef.current) return;
      const rect = wrapperRef.current.getBoundingClientRect();
      const sectionTop = -rect.top;
      const sectionHeight =
        wrapperRef.current.offsetHeight - window.innerHeight;
      const progress = Math.min(
        Math.max(sectionTop / sectionHeight, 0),
        1
      );
      const rawStep = progress * 4;
      const step = Math.min(Math.floor(rawStep), 3);
      setActiveStep(step);
      setScrollProgress(progress);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useLayoutEffect(() => {
    updateLineMetrics();
  }, [activeStep, scrollProgress, updateLineMetrics]);

  useEffect(() => {
    const timer = setTimeout(updateLineMetrics, 420);
    return () => clearTimeout(timer);
  }, [activeStep, updateLineMetrics]);

  useEffect(() => {
    updateLineMetrics();
    const wrap = stepsWrapRef.current;
    if (!wrap) return;

    const observer = new ResizeObserver(() => updateLineMetrics());
    observer.observe(wrap);
    window.addEventListener("resize", updateLineMetrics);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateLineMetrics);
    };
  }, [updateLineMetrics]);

  return (
    <section ref={wrapperRef} className="herothree-wrapper">
      <div className="herothree-sticky">
        <div className="herothree-box">
        <div className="herothree-inner">
          <div className="herothree-left">
            <h2 className="herothree-heading">
              <span className="herothree-heading-cyan">How</span>
              <span className="herothree-heading-white"> it works</span>
            </h2>

            <div className="herothree-steps-wrap" ref={stepsWrapRef}>
              <div
                className="herothree-progress-track"
                style={{
                  top: lineMetrics.top,
                  height: lineMetrics.trackHeight,
                }}
                aria-hidden="true"
              >
                <span
                  className="herothree-progress-fill"
                  style={{ transform: `scaleY(${scrollProgress})` }}
                />
              </div>
              <ol className="herothree-steps">
              {STEPS.map((step, index) => {
                const isActive = activeStep === index;

                return (
                  <li
                    key={index}
                    className={`herothree-step ${isActive ? "herothree-step--active" : ""}`}
                  >
                    <span
                      ref={(el) => {
                        badgeRefs.current[index] = el;
                      }}
                      className="herothree-step-badge"
                    >
                      {index + 1}
                    </span>
                    <div className="herothree-step-body">
                      <p className="herothree-step-title">{step.title}</p>
                      <p
                        className={`herothree-step-desc ${isActive ? "herothree-step-desc--open" : ""}`}
                      >
                        {step.description}
                      </p>
                    </div>
                  </li>
                );
              })}
              </ol>
            </div>

            <div className="herothree-links">
              <a href="#" className="herothree-pill" onClick={(e) => e.preventDefault()}>
                📄 View documentation ↗
              </a>
              <a href="#" className="herothree-pill" onClick={(e) => e.preventDefault()}>
                <GitHubIcon />
                livekit/agents 10.8K ↗
              </a>
            </div>
          </div>

          <div className="herothree-right">
            <IsometricStack activeStep={activeStep} />
          </div>
        </div>
        </div>
      </div>

      <style>{`
        .herothree-wrapper {
          position: relative;
          width: 100%;
          height: 300vh;
          margin-top: clamp(1.5rem, 4vw, 2.5rem);
          padding-top: clamp(1rem, 3vh, 2rem);
          padding-bottom: 0;
          background: transparent;
        }

        @media (min-width: 640px) {
          .herothree-wrapper {
            margin-top: clamp(2rem, 5vw, 3rem);
            padding-top: clamp(1.25rem, 4vh, 2.5rem);
          }
        }

        @media (min-width: 768px) and (max-width: 1279px) {
          .herothree-wrapper {
            margin-top: clamp(4rem, 9vw, 7rem);
            padding-top: clamp(2rem, 5vh, 3.5rem);
            padding-bottom: clamp(2rem, 5vh, 3rem);
          }
        }

        @media (min-width: 1280px) {
          .herothree-wrapper {
            margin-top: clamp(3rem, 6vw, 5rem);
            padding-top: clamp(1.5rem, 4vh, 3rem);
          }
        }

        .herothree-sticky {
          position: sticky;
          top: 0;
          height: 100vh;
          overflow: visible;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: clamp(2.5rem, 8vh, 5rem) clamp(1rem, 4vw, 2rem) 0;
          background: transparent;
        }

        .herothree-box {
          width: 100%;
          max-width: 75rem;
          margin: 0 auto;
          padding: clamp(1.5rem, 4vw, 2.5rem) clamp(1.25rem, 3vw, 2.5rem);
          border-radius: clamp(0.75rem, 2vw, 1rem);
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: linear-gradient(
            145deg,
            rgba(26, 31, 78, 0.45) 0%,
            rgba(20, 24, 55, 0.55) 45%,
            rgba(15, 17, 42, 0.6) 100%
          );
          box-shadow:
            0 0.5rem 2rem rgba(0, 0, 0, 0.25),
            inset 0 1px 0 rgba(255, 255, 255, 0.06);
        }

        .herothree-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          max-width: 75rem;
          margin: 0 auto;
          padding: 0.75rem 1.5rem 1.5rem;
          gap: 2rem;
        }

        @media (min-width: 640px) {
          .herothree-inner {
            flex-direction: row;
            align-items: center;
            padding: 0.5rem 2rem 1.5rem;
            gap: 2.5rem;
          }
        }

        @media (min-width: 1024px) {
          .herothree-inner {
            padding: 0 3rem 1.5rem;
            gap: 3rem;
          }
        }

        .herothree-left {
          width: 100%;
          flex: 0 0 100%;
        }

        @media (min-width: 640px) {
          .herothree-left {
            flex: 0 0 45%;
            max-width: 45%;
          }
        }

        .herothree-right {
          display: none;
          flex: 0 0 55%;
          max-width: 55%;
          justify-content: center;
          align-items: center;
        }

        @media (min-width: 640px) {
          .herothree-right {
            display: flex;
          }
        }

        .herothree-heading {
          margin-bottom: 2.5rem;
          font-size: clamp(1.5rem, 6vw, 2.25rem);
          font-weight: 700;
          line-height: 1.15;
        }

        @media (min-width: 1024px) {
          .herothree-heading {
            font-size: clamp(1.75rem, 4vw, 3rem);
            margin-bottom: 2.5rem;
          }
        }

        .herothree-heading-cyan {
          color: #22d3ee;
        }

        .herothree-heading-white {
          color: #ffffff;
        }

        .herothree-steps-wrap {
          position: relative;
        }

        .herothree-progress-track {
          position: absolute;
          left: 0.6875rem;
          width: 2px;
          pointer-events: none;
          z-index: 0;
        }

        .herothree-progress-fill {
          display: block;
          width: 100%;
          height: 100%;
          background: #22d3ee;
          transform-origin: top center;
          transform: scaleY(0);
        }

        .herothree-steps {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          position: relative;
          z-index: 1;
        }

        @media (min-width: 640px) {
          .herothree-steps {
            gap: 1.75rem;
          }
        }

        .herothree-step {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          transition: opacity 400ms ease;
        }

        .herothree-step-badge {
          position: relative;
          z-index: 2;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.3);
          font-size: 0.75rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.35);
          box-sizing: border-box;
          background: transparent;
          transition: all 400ms ease;
        }

        .herothree-step--active .herothree-step-badge {
          width: 1.75rem;
          height: 1.75rem;
          border: 2px solid #ffffff;
          color: #ffffff;
        }

        .herothree-step-body {
          flex: 1;
          min-width: 0;
        }

        .herothree-step-title {
          margin: 0;
          font-size: clamp(0.9375rem, 2vw, 1.125rem);
          font-weight: 400;
          color: rgba(255, 255, 255, 0.35);
          line-height: 1.4;
          transition: color 400ms ease, font-weight 400ms ease;
        }

        .herothree-step--active .herothree-step-title {
          color: #ffffff;
          font-weight: 700;
        }

        .herothree-step-desc {
          margin: 0;
          margin-top: 0;
          max-height: 0;
          opacity: 0;
          overflow: hidden;
          font-size: 0.875rem;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.6);
          transition: max-height 400ms ease, opacity 300ms ease, margin-top 400ms ease;
        }

        .herothree-step-desc--open {
          margin-top: 0.375rem;
          max-height: 8rem;
          opacity: 1;
        }

        .herothree-links {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-top: 2.5rem;
        }

        .herothree-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(255, 255, 255, 0.06);
          font-size: 0.8125rem;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          transition: background 200ms ease, color 200ms ease;
        }

        .herothree-pill:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
        }

        .herothree-iso-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          filter: drop-shadow(0 0 40px rgba(34, 211, 238, 0.08));
        }

        .herothree-iso-scene {
          position: relative;
          width: 11rem;
          height: 10rem;
          transform-style: preserve-3d;
          perspective: 900px;
          transform: rotateX(50deg) rotateZ(-45deg);
        }

        @media (min-width: 1024px) {
          .herothree-iso-scene {
            width: 14rem;
            height: 12rem;
          }
        }

        .herothree-iso-card {
          position: absolute;
          left: 50%;
          bottom: 0;
          width: 8.5rem;
          height: 5.5rem;
          margin-left: -4.25rem;
          border-radius: 0.75rem;
          background: #1a1d2e;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transform-origin: center bottom;
          transition: border-color 400ms ease, box-shadow 400ms ease, opacity 400ms ease;
          opacity: 0.75;
        }

        @media (min-width: 1024px) {
          .herothree-iso-card {
            width: 10rem;
            height: 6.25rem;
            margin-left: -5rem;
          }
        }

        .herothree-iso-card--active {
          border-color: rgba(34, 211, 238, 0.55);
          box-shadow: 0 0 28px rgba(34, 211, 238, 0.2);
          opacity: 1;
        }

        .herothree-iso-card-dots {
          display: flex;
          gap: 0.35rem;
          padding: 0.75rem 0.75rem 0.35rem;
        }

        .herothree-iso-card-dots span {
          width: 0.4rem;
          height: 0.4rem;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.35);
        }

        .herothree-iso-card-bars {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          padding: 0 0.75rem;
        }

        .herothree-iso-card-bars span {
          display: block;
          height: 0.35rem;
          border-radius: 2px;
          background: rgba(255, 255, 255, 0.12);
        }

        .herothree-iso-card-bars span:first-child {
          width: 70%;
        }

        .herothree-iso-card-bars span:last-child {
          width: 45%;
        }

        .herothree-iso-labels {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.5rem 1rem;
          margin-top: 2rem;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 0.625rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.3);
        }

        @media (prefers-reduced-motion: reduce) {
          .herothree-step,
          .herothree-step-badge,
          .herothree-step-title,
          .herothree-step-desc,
          .herothree-iso-card {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
}
