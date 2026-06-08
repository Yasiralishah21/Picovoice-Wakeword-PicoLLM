const BRAND_LOGOS = [
  { id: "mercedes", content: <>⊙ Mercedes-Benz</> },
  { id: "bmw", content: <span className="italic">BMW</span> },
  { id: "apple", content: <> Apple</> },
  { id: "google", content: <span className="herotwo-google">Google</span> },
  { id: "nike", content: <>NIKE</> },
  { id: "adidas", content: <>adidas</> },
  { id: "samsung", content: <>SAMSUNG</> },
  { id: "sony", content: <>SONY</> },
  { id: "microsoft", content: <span className="font-normal">Microsoft</span> },
  { id: "tesla", content: <span className="herotwo-tesla">TESLA</span> },
];

function LogoItem({ brand }) {
  return (
    <div className="herotwo-logo-item flex h-full shrink-0 items-center">
      {brand.content}
    </div>
  );
}

function LogoTrack() {
  return (
    <>
      {BRAND_LOGOS.map((brand) => (
        <LogoItem key={`track-${brand.id}`} brand={brand} />
      ))}
    </>
  );
}

export default function SingleMarquee() {
  return (
    <section className="herotwo-section w-full overflow-x-hidden">
      <div className="herotwo-header">
        <h2 className="herotwo-heading">
          Trusted by hundreds of leading brands.
        </h2>
      </div>

      <div className="herotwo-marquee-band">
        <div className="herotwo-marquee-outer relative w-full overflow-hidden">
          <div className="herotwo-marquee-inner flex h-full w-max flex-row items-center">
            <LogoTrack />
            <LogoTrack />
          </div>
        </div>
      </div>

      <style>{`
        .herotwo-section {
          width: 100%;
          margin-top: 0;
          padding-bottom: clamp(2.5rem, 6vw, 4rem);
        }

        @media (min-width: 768px) and (max-width: 1279px) {
          .herotwo-section {
            padding-bottom: clamp(4rem, 9vw, 6.5rem);
          }
        }

        @media (min-width: 1280px) {
          .herotwo-section {
            padding-bottom: clamp(3rem, 7vw, 5rem);
          }
        }

        .herotwo-header {
          width: 100%;
          max-width: 75rem;
          margin: 0 auto;
          padding: clamp(2.5rem, 6vw, 4rem) clamp(1rem, 4vw, 2rem) clamp(1rem, 3vw, 1.5rem);
          text-align: center;
        }

        .herotwo-heading {
          margin: 0 auto;
          max-width: 32rem;
          font-size: clamp(0.8125rem, 1.4vw, 0.9375rem);
          font-weight: 500;
          line-height: 1.5;
          letter-spacing: 0.03em;
          color: rgba(255, 255, 255, 0.58);
          text-wrap: balance;
        }

        .herotwo-marquee-band {
          width: 100%;
          min-height: clamp(6.25rem, 16vw, 9.5rem);
          display: flex;
          align-items: center;
          background: linear-gradient(
            180deg,
            rgba(22, 26, 58, 0.5) 0%,
            rgba(12, 14, 32, 0.65) 50%,
            rgba(22, 26, 58, 0.5) 100%
          );
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.07),
            0 0.75rem 2rem rgba(0, 0, 0, 0.22);
        }

        .herotwo-marquee-outer {
          width: 100%;
          height: 100%;
          min-height: inherit;
          -webkit-mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 8%,
            black 92%,
            transparent 100%
          );
          mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 8%,
            black 92%,
            transparent 100%
          );
        }

        .herotwo-marquee-inner {
          min-height: clamp(6.25rem, 16vw, 9.5rem);
          animation: herotwo-marquee 38s linear infinite;
        }

        @keyframes herotwo-marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .herotwo-logo-item {
          padding: 0 clamp(1.75rem, 4.5vw, 3.25rem);
          font-size: clamp(0.875rem, 1.8vw, 1.0625rem);
          font-weight: 600;
          letter-spacing: 0.05em;
          color: rgba(255, 255, 255, 0.42);
          transition: color 200ms ease;
        }

        .herotwo-logo-item:hover {
          color: rgba(255, 255, 255, 0.92);
        }

        .herotwo-google {
          background: linear-gradient(
            90deg,
            #4285f4,
            #ea4335,
            #fbbc05,
            #34a853
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 700;
        }

        .herotwo-tesla {
          letter-spacing: 0.2em;
        }
      `}</style>
    </section>
  );
}
