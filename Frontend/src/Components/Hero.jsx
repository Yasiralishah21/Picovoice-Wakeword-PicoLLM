import { useState, useEffect, useRef, useCallback } from "react";

const STATS = [
  { value: 1288, label: "Models" },
  { value: 4547, label: "Downloads" },
  { value: 809, label: "Wake Words" },
];

const easeOut = (t) => 1 - Math.pow(1 - t, 3);

function formatWithCommas(n) {
  return Math.round(n).toLocaleString("en-US");
}

function useCountUp(target, active, duration = 2000) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!active) return;

    let startTime = null;
    let rafId = null;

    const tick = (timestamp) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOut(progress);
      setDisplay(eased * target);

      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setDisplay(target);
      }
    };

    setDisplay(0);
    rafId = requestAnimationFrame(tick);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [active, target, duration]);

  return formatWithCommas(display);
}

function StatItem({ value, label, animate }) {
  const formatted = useCountUp(value, animate);

  return (
    <div className="flex flex-col items-center text-center">
      <span className="hero-stat-number font-extrabold leading-none text-white">
        {formatted}
      </span>
      <span
        className="mt-2 text-[0.875rem]"
        style={{ color: "#9095A8" }}
      >
        {label}
      </span>
    </div>
  );
}

export default function Hero() {
  const [statsAnimate, setStatsAnimate] = useState(false);
  const statsRef = useRef(null);
  const hasAnimated = useRef(false);

  const triggerAnimation = useCallback(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;
    setStatsAnimate(true);
  }, []);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          triggerAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [triggerAnimation]);

  return (
    <section
      className="relative -mt-[70px] min-h-[100vh] w-full overflow-x-hidden"
      style={{
        fontFamily:
          "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Base gradient — no top glow (keeps navbar area clean) */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(135deg, #0f1135 0%, #0a0c1a 50%, #0d0f2a 100%)",
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div
        className="relative z-10 mx-auto flex min-h-[100vh] w-full max-w-[46.875rem] flex-col items-center justify-center px-4 text-center  sm:px-6"
        style={{ paddingTop: "clamp(5rem, 12vh, 6.25rem)" }}
      >
        <h1 className="hero-heading mx-auto flex w-full flex-col items-center text-center text-white">
          <span className="hero-heading-line">
            Make wake word creation{" "}
            <span className="hero-gradient-simple">simple</span>
          </span>
          <span className="hero-heading-line">
            <span className="hero-gradient-accessible">and accessible</span>
            {" "}for everyone
          </span>
        </h1>

        <div className="hero-content-glow relative mt-5 w-full max-w-[37.5rem] overflow-visible px-2 sm:px-0">
          <div
            className="hero-content-glow-bg pointer-events-none absolute -z-0"
            aria-hidden="true"
          />

          <div className="relative z-10 flex w-full flex-col items-center">
            <p
              className="mx-auto max-w-[37.5rem] leading-[1.6]"
              style={{
                fontSize: "clamp(0.9375rem, 2vw, 1.125rem)",
                color: "rgba(255,255,255,0.6)",
              }}
            >
              Train custom voice activation models in under an hour. No ML
              expertise required. Works with Home Assistant, Rhasspy,
              OpenVoiceOS, and any custom project.
            </p>
          </div>
        </div>

        <div
          ref={statsRef}
          className="mt-[3.75rem] flex w-full flex-col items-center justify-center gap-6 sm:mt-[3.75rem] sm:flex-row sm:gap-10 lg:gap-[4.5rem]"
        >
          {STATS.map((stat) => (
            <StatItem
              key={stat.label}
              value={stat.value}
              label={stat.label}
              animate={statsAnimate}
            />
          ))}
        </div>
      </div>

      <style>{`
        .hero-content-glow {
          overflow: visible;
        }

        .hero-content-glow-bg {
          left: 50%;
          top: 52%;
          width: min(44rem, 120vw);
          height: min(44rem, 120vw);
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background: radial-gradient(
            circle at center,
            rgba(90, 100, 240, 0.45) 0%,
            rgba(34, 211, 238, 0.22) 38%,
            rgba(129, 140, 248, 0.08) 55%,
            transparent 65%
          );
          filter: blur(26px);
          opacity: 0.35;
          animation: hero-glow-pulse 5s ease-in-out infinite;
          will-change: transform, opacity;
        }

        @keyframes hero-glow-pulse {
          0% {
            opacity: 0.12;
            transform: translate(-50%, -50%) scale(0.86);
          }
          45% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.1);
          }
          55% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.1);
          }
          100% {
            opacity: 0.12;
            transform: translate(-50%, -50%) scale(0.86);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-content-glow-bg {
            animation: none;
            opacity: 0.5;
          }
        }

        .hero-heading {
          font-weight: 700;
          font-size: clamp(2rem, 8vw, 3rem);
          line-height: 1.12;
          letter-spacing: -0.025em;
          text-align: center;
        }
        .hero-heading-line {
          display: inline-block;
          text-align: center;
          white-space: nowrap;
        }
        @media (max-width: 480px) {
          .hero-heading-line {
            white-space: normal;
          }
        }
        .hero-gradient-simple {
          background: linear-gradient(90deg, #2dd4bf 0%, #38bdf8 45%, #6b7ff0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-gradient-accessible {
          background: linear-gradient(
            90deg,
            #6b7ff0 0%,
            #8b7cf8 25%,
            #a78bfa 50%,
            #e879a8 75%,
            #f87171 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        @media (min-width: 640px) {
          .hero-heading {
            font-size: clamp(3rem, 6vw, 4rem);
          }
          .hero-stat-number {
            font-size: 2.375rem;
          }
        }
        @media (min-width: 1024px) {
          .hero-heading {
            font-size: clamp(4rem, 5vw, 4.5rem);
          }
          .hero-stat-number {
            font-size: 2.5rem;
          }
        }
        .hero-stat-number {
          font-size: 2.25rem;
        }
      `}</style>
    </section>
  );
}
