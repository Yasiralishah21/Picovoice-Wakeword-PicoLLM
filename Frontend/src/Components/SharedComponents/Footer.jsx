import { useNavigate } from "react-router-dom";

const MUTED = "#9095A8";
const ACCENT = "#5B6BF8";

const LINKS = {
  PRODUCTS: [
    "Agent platform",
    "Media server",
    "SDKs",
    "Cloud dashboard",
    "Security",
    "Terms of service",
  ],
  RESOURCES: [
    "Documentation",
    "Community",
    "Coding agent support",
    "Brand assets",
    "Video codecs",
    "Codec bitrates",
    "WebRTC browser test",
    "Connection test",
  ],
  COMPANY: ["About", "Blog", "Careers", "Open source"],
};

function GithubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-4.17-1.41-6.84-1.695-6.84-7.455 0-1.65.585-3 1.755-4.05-.165-.405-.72-1.965.165-4.05 0 0 1.44-.465 4.725 1.545 1.38-.39 2.85-.585 4.32-.585 1.47 0 2.94.195 4.32.585 3.285-2.025 4.725-1.545 4.725-1.545.885 2.085.33 3.645.165 4.05 1.17 1.05 1.755 2.4 1.755 4.05 0 5.775-2.67 6.045-6.84 7.455-.51.285-1.095 1.35-1.23 1.695-.24.675-1.02 1.965-4.035 1.41 0 1.005.015 1.95.015 2.235 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function StatusDot() {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "0.4rem",
      fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.08em",
      textTransform: "uppercase", color: "#22d3ee",
    }}>
      <span style={{
        width: "0.45rem", height: "0.45rem", borderRadius: "50%",
        backgroundColor: "#22d3ee",
        boxShadow: "0 0 6px #22d3ee",
        animation: "footer-pulse 2s ease-in-out infinite",
      }} />
      All systems operational
    </span>
  );
}

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="footer-root">
      <div className="footer-inner">

        {/* top grid */}
        <div className="footer-grid">

          {/* brand col */}
          <div className="footer-brand">
            {/* logo */}
            <div className="footer-logo" onClick={() => navigate("/")}>
              <span className="footer-logo-text">Techelix</span>
              <span className="footer-logo-accent">AI</span>
            </div>
            <p className="footer-tagline">
              The open source framework and cloud platform for voice, video, and physical AI agents.
            </p>
            <p className="footer-keep">Keep in touch</p>
            <div className="footer-socials">
              {[
                { icon: <GithubIcon />, label: "GitHub" },
                { icon: <XIcon />, label: "X" },
                { icon: <GlobeIcon />, label: "Website" },
                { icon: <YoutubeIcon />, label: "YouTube" },
              ].map(({ icon, label }) => (
                <button key={label} type="button" className="footer-social-btn"
                  aria-label={label} onClick={() => {}}>
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* link columns */}
          {Object.entries(LINKS).map(([heading, items]) => (
            <div key={heading} className="footer-col">
              <h4 className="footer-col-heading">{heading}</h4>
              <ul className="footer-col-list">
                {items.map((item) => (
                  <li key={item}>
                    <button type="button" className="footer-link" onClick={() => {}}>
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* bottom bar */}
        <div className="footer-bottom">
          <p className="footer-copy">
            © 2026 TechelixAI. Engineered and designed worldwide. All rights reserved.{" "}
            <button type="button" className="footer-link footer-link--inline" onClick={() => {}}>Terms of Service</button>
            {" · "}
            <button type="button" className="footer-link footer-link--inline" onClick={() => {}}>Cookie Policy</button>
            {" · "}
            <button type="button" className="footer-link footer-link--inline" onClick={() => {}}>Privacy Policy</button>
            {" · "}
            <button type="button" className="footer-link footer-link--inline" onClick={() => {}}>Security</button>
          </p>
          <StatusDot />
        </div>

      </div>

      <style>{`
        .footer-root {
          width: 100%;
          background: #07080f;
          border-top: 1px solid rgba(255,255,255,0.07);
          font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
        }

        .footer-inner {
          max-width: 75rem;
          margin: 0 auto;
          padding: clamp(4rem, 9vw, 7rem) clamp(1rem, 4vw, 2.5rem) 0;
        }

        /* grid: brand + 3 link cols */
        .footer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem 3rem;
          margin-bottom: 2.5rem;
        }
        @media (min-width: 540px) {
          .footer-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 900px) {
          .footer-grid {
            grid-template-columns: 1.6fr repeat(3, 1fr);
          }
        }

        /* brand */
        .footer-logo {
          display: flex;
          align-items: baseline;
          gap: 0.1rem;
          cursor: pointer;
          margin-bottom: 0.875rem;
          width: fit-content;
        }
        .footer-logo-text {
          font-size: 1.125rem;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.01em;
        }
        .footer-logo-accent {
          font-size: 1.125rem;
          font-weight: 400;
          background: linear-gradient(135deg, #6B7FF0 0%, #4A5CE8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .footer-tagline {
          margin: 0 0 1.25rem 0;
          font-size: 0.8125rem;
          line-height: 1.65;
          color: ${MUTED};
          max-width: 22rem;
        }

        .footer-keep {
          margin: 0 0 0.625rem 0;
          font-size: 0.6875rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: ${MUTED};
        }

        .footer-socials {
          display: flex;
          align-items: center;
          gap: 0.625rem;
        }

        .footer-social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2rem;
          height: 2rem;
          border-radius: 0.375rem;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          color: ${MUTED};
          cursor: pointer;
          transition: color 180ms, border-color 180ms, background 180ms;
        }
        .footer-social-btn:hover {
          color: #fff;
          border-color: rgba(91,107,248,0.5);
          background: rgba(91,107,248,0.1);
        }

        /* link cols */
        .footer-col-heading {
          margin: 0 0 1rem 0;
          font-size: 0.6875rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: ${MUTED};
        }

        .footer-col-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
        }

        .footer-link {
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          font-size: 0.875rem;
          color: rgba(255,255,255,0.55);
          text-align: left;
          transition: color 180ms;
        }
        .footer-link:hover { color: #ffffff; }
        .footer-link--inline {
          font-size: inherit;
          display: inline;
        }

        /* bottom bar */
        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.07);
          padding: 1.75rem 0 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          align-items: flex-start;
        }
        @media (min-width: 640px) {
          .footer-bottom {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }

        .footer-copy {
          margin: 0;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.35);
          line-height: 1.6;
        }

        @keyframes footer-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </footer>
  );
}
