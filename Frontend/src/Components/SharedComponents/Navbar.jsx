import { useState, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const MOBILE_DRAWER_BG =
  "radial-gradient(ellipse 90% 50% at 50% 0%, rgba(91, 107, 248, 0.18) 0%, transparent 58%), linear-gradient(165deg, #0d0f24 0%, #141a38 45%, #12163a 72%, #0a0c1a 100%)";
const NAV_BG_STICKY = "rgba(18, 20, 28, 0.4)";
const ACCENT = "#5B6BF8";
const MUTED = "#9095A8";

const industriesMenu = {
  label: "Industry",
  heading: "Industries We Serve",
  description:
    "Voice AI solutions tailored for banking, insurance, manufacturing, and healthcare.",
  columns: [
    [
      {
        title: "Banking & Fintech",
        desc: "Secure voice banking, authentication, and customer support at scale",
        path: "/industry/banking-fintech",
      },
      {
        title: "Insurance",
        desc: "Faster claims, policy assistance, and 24/7 policyholder support",
        path: "/industry/insurance",
      },
    ],
    [
      {
        title: "Manufacturing",
        desc: "Hands-free workflows, diagnostics, and safety on the factory floor",
        path: "/industry/manufacturing",
      },
      {
        title: "Healthcare",
        desc: "HIPAA-aware voice interfaces for providers, patients, and care teams",
        path: "/industry/healthcare",
      },
    ],
  ],
};

const MEGA_MENUS = {
  industries: industriesMenu,
};

const MEGA_KEYS = ["industries"];

const MEGA_LABELS = {
  industries: "Industry 🞃",
};

function MenuItem({ title, desc, path, onNavigate }) {
  return (
    <a
      href={path || "#"}
      className="group block rounded-md px-3 py-2.5 transition-colors duration-200 hover:bg-[#F4F5F7]"
      onClick={(e) => {
        e.preventDefault();
        if (path && onNavigate) onNavigate(path);
      }}
    >
      <span className="block text-[14px] font-semibold leading-snug text-[#1A1D26] group-hover:text-[#5B6BF8]">
        {title}
      </span>
      <span className="mt-0.5 block text-[12px] leading-relaxed text-[#6B7280]">
        {desc}
      </span>
    </a>
  );
}

function MegaMenuPanel({ menu, onNavigate }) {
  if (!menu) return null;

  return (
    <div
      className="flex w-full max-w-[1100px] flex-col overflow-hidden rounded-b-lg shadow-2xl md:flex-row"
      style={{ minHeight: 320 }}
    >
      <div
        className="flex w-full shrink-0 flex-col px-6 py-6 md:w-55 lg:w-60 lg:px-8 lg:py-8"
        style={{
          background:
            "linear-gradient(135deg, rgb(11, 13, 20), rgb(20, 26, 52), rgb(11, 13, 20)",
        }}
      >
        <h3 className="text-[22px] font-bold leading-tight text-white">
          {menu.heading}
        </h3>
        <p
          className="mt-3 text-[13px] leading-relaxed"
          style={{ color: MUTED }}
        >
          {menu.description}
        </p>
      </div>

      <div className="flex flex-1 flex-col bg-white lg:flex-row">
        <div className="flex flex-1 flex-col gap-0 px-4 py-4 sm:flex-row sm:px-6 sm:py-6">
          {menu.columns.map((col, ci) => (
            <div key={ci} className="min-w-0 flex-1 space-y-0.5">
              {col.map((item, ii) => (
                <MenuItem
                  key={ii}
                  title={item.title}
                  desc={item.desc}
                  path={item.path}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          ))}
        </div>

        {menu.sidebar && (
          <div className="w-full shrink-0 border-t border-[#E5E7EB] bg-white px-4 py-4 sm:py-6 lg:w-[260px] lg:border-l lg:border-t-0">
            {menu.sidebar.map((section, si) => (
              <div key={si} className={si > 0 ? "mt-6" : ""}>
                <h4 className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-[#9CA3AF]">
                  {section.section}
                </h4>
                {section.items.map((item, ii) => (
                  <MenuItem key={ii} title={item.title} desc={item.desc} />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function NavTextLink({ children, onClick, className = "" }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href="#"
      className={`group relative flex h-[70px] items-center whitespace-nowrap px-2 text-[14px] font-normal transition-opacity duration-200 sm:px-3 sm:text-[15px] lg:px-4 ${className}`}
      style={{ color: "#FFFFFF", opacity: hovered ? 1 : 0.85 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {children}
      <span
        className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full sm:left-3 sm:right-3 lg:left-4 lg:right-4"
        style={{
          backgroundColor: ACCENT,
          transform: hovered ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: "left",
          transition: "transform 300ms ease",
        }}
      />
    </a>
  );
}

function HamburgerIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}

function ChevronIcon({ open }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
    </svg>
  );
}

function getAllMenuLinks(menu) {
  const links = [];
  menu.columns?.forEach((col) => col.forEach((item) => links.push(item)));
  return links;
}

function MobileNavDrawer({
  open,
  onClose,
  mobileAccordion,
  setMobileAccordion,
  onExpert,
  onBlogs,
  onIndustryNavigate,
}) {
  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 top-[70px] z-40 bg-black/50 xl:hidden"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="mobile-nav-drawer fixed left-0 right-0 top-[70px] z-50 max-h-[calc(100dvh-70px)] overflow-y-auto xl:hidden"
        style={{ background: MOBILE_DRAWER_BG }}
      >
        <div
          className="mobile-nav-drawer-header sticky top-0 z-10 flex items-center justify-between border-b px-4 py-3 sm:px-6"
          style={{ background: MOBILE_DRAWER_BG, borderColor: "rgba(255,255,255,0.1)" }}
        >
          <span className="text-[15px] font-semibold text-white">Menu</span>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
            aria-label="Close menu"
          >
            <CloseIcon />
          </button>
        </div>

        <nav className="px-4 py-2 sm:px-6">
          {MEGA_KEYS.map((key) => {
            const menu = MEGA_MENUS[key];
            const expanded = mobileAccordion === key;
            const links = getAllMenuLinks(menu);

            return (
              <div
                key={key}
                className="border-b"
                style={{ borderColor: "rgba(255,255,255,0.08)" }}
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between py-4 text-left text-[16px] text-white"
                  onClick={() => setMobileAccordion(expanded ? null : key)}
                >
                  {MEGA_LABELS[key]}
                  <ChevronIcon open={expanded} />
                </button>

                {expanded && (
                  <div className="pb-4 pl-1">
                    <p className="mb-1 text-[15px] font-bold text-white">{menu.heading}</p>
                    <p className="mb-4 text-[13px] leading-relaxed" style={{ color: MUTED }}>
                      {menu.description}
                    </p>
                    <ul className="space-y-3">
                      {links.map((item, i) => (
                        <li key={i}>
                          <a
                            href={item.path || "#"}
                            className="block rounded-md px-2 py-1 transition-colors hover:bg-white/5"
                            onClick={(e) => {
                              e.preventDefault();
                              if (item.path) onIndustryNavigate(item.path);
                              onClose();
                            }}
                          >
                            <span className="block text-[14px] font-semibold text-white">{item.title}</span>
                            <span className="mt-0.5 block text-[12px] leading-snug" style={{ color: MUTED }}>
                              {item.desc}
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}

          <a
            href="#"
            className="block border-b py-4 text-[16px] text-white transition-opacity hover:opacity-100"
            style={{ borderColor: "rgba(255,255,255,0.08)", opacity: 0.9 }}
            onClick={(e) => {
              e.preventDefault();
              onBlogs();
              onClose();
            }}
          >
            Blogs
          </a>

          <div
            className="mt-4 flex flex-col gap-3 border-t pt-4"
            style={{ borderColor: "rgba(255,255,255,0.08)" }}
          >
            <button
              type="button"
              className="inline-flex w-full items-center justify-center rounded-full border py-3 text-[14px] font-medium text-white"
              style={{
                borderColor: "rgba(255,255,255,0.35)",
                backgroundColor: "rgba(255,255,255,0.06)",
              }}
              onClick={() => {
                onClose();
                onExpert();
              }}
            >
              Talk to an expert
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState(null);
  const closeTimer = useRef(null);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
    setMobileAccordion(null);
  }, []);

  const toggleMobile = useCallback(() => {
    setMobileOpen((prev) => {
      if (!prev) setActiveMenu(null);
      return !prev;
    });
  }, []);

  const openMenu = useCallback((key) => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setActiveMenu(key);
  }, []);

  const scheduleClose = useCallback(() => {
    closeTimer.current = setTimeout(() => setActiveMenu(null), 120);
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const handleBlogs = useCallback(() => {
    setActiveMenu(null);
    if (location.pathname === "/") {
      document.getElementById("blogs")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/#blogs");
    }
  }, [location.pathname, navigate]);

  const handleIndustryNavigate = useCallback(
    (path) => {
      setActiveMenu(null);
      navigate(path);
    },
    [navigate]
  );

  const menuVisible = Boolean(activeMenu);
  const activeMenuData = activeMenu ? MEGA_MENUS[activeMenu] : null;

  return (
    <header
      className="sticky top-0 z-[100] w-full backdrop-blur-md"
      style={{
        fontFamily:
          "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
      }}
      onMouseLeave={() => {
        if (!mobileOpen) scheduleClose();
      }}
    >
      <nav
        className="relative z-50 flex h-17.5 w-full min-w-0 items-center gap-2 px-3 sm:gap-3 sm:px-5 lg:px-8 xl:px-10"
        style={{ backgroundColor: NAV_BG_STICKY }}
      >
        <a
          href="/"
          className="flex shrink-0 items-baseline gap-0.5 no-underline"
          onClick={(e) => {
            e.preventDefault();
            navigate("/");
          }}
        >
          <span className="text-[17px] font-bold tracking-tight text-white sm:text-[18px] lg:text-[20px]">
            Techelix
          </span>
          <span
            className="text-[17px] font-normal tracking-tight sm:text-[18px] lg:text-[20px]"
            style={{
              background:
                "linear-gradient(135deg, #6B7FF0 0%, #4A5CE8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            AI
          </span>
        </a>

        <div className="hidden min-w-0 flex-1 items-center justify-center px-4 xl:flex">
          <div className="flex max-w-full items-stretch">
            {MEGA_KEYS.map((key) => {
              const isActive = activeMenu === key;

              return (
                <button
                  key={key}
                  type="button"
                  className="relative flex h-[70px] items-center whitespace-nowrap px-2 text-[14px] font-normal transition-opacity duration-200 hover:opacity-100 sm:px-3 sm:text-[15px] lg:px-4"
                  style={{
                    color: "#FFFFFF",
                    opacity: isActive ? 1 : 0.85,
                  }}
                  onMouseEnter={() => {
                    cancelClose();
                    openMenu(key);
                  }}
                >
                  {MEGA_LABELS[key]}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full sm:left-3 sm:right-3 lg:left-4 lg:right-4"
                      style={{ backgroundColor: ACCENT }}
                    />
                  )}
                </button>
              );
            })}

            <NavTextLink onClick={(e) => { e.preventDefault(); handleBlogs(); }}>
              Blogs
            </NavTextLink>
          </div>
        </div>

        <div className="flex-1 xl:hidden" aria-hidden="true" />

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            className="nav-action-expert hidden min-h-9 rounded-full border px-3 py-2 text-[12px] font-medium text-white sm:inline-flex sm:min-h-10 sm:items-center sm:px-4 sm:py-2.5 sm:text-[14px] lg:px-5"
            style={{
              borderColor: "rgba(255,255,255,0.35)",
              backgroundColor: "rgba(255,255,255,0.06)",
            }}
            onClick={() => navigate("/talk-to-expert")}
          >
            <span className="hidden lg:inline">Talk to an expert</span>
            <span className="lg:hidden">Expert</span>
          </button>

          <button
            type="button"
            className="ml-1 flex h-10 w-10 items-center justify-center rounded-md text-white transition-colors hover:bg-white/10 xl:hidden"
            onClick={toggleMobile}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <CloseIcon /> : <HamburgerIcon />}
          </button>
        </div>
      </nav>

      <MobileNavDrawer
        open={mobileOpen}
        onClose={closeMobile}
        mobileAccordion={mobileAccordion}
        setMobileAccordion={setMobileAccordion}
        onExpert={() => navigate("/talk-to-expert")}
        onBlogs={handleBlogs}
        onIndustryNavigate={handleIndustryNavigate}
      />

      <div
        className="absolute left-0 right-0 top-full z-50 hidden justify-center px-2 sm:px-4 xl:flex"
        style={{
          opacity: menuVisible && !mobileOpen ? 1 : 0,
          transform: menuVisible && !mobileOpen ? "translateY(0)" : "translateY(-8px)",
          pointerEvents: menuVisible && !mobileOpen ? "auto" : "none",
          transition: "opacity 200ms ease, transform 200ms ease",
        }}
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
      >
        <MegaMenuPanel menu={activeMenuData} onNavigate={handleIndustryNavigate} />
      </div>

      {menuVisible && !mobileOpen && (
        <div
          className="fixed inset-0 top-[70px] z-40 hidden xl:block"
          style={{ backgroundColor: "rgba(0,0,0,0.15)", pointerEvents: "none" }}
        />
      )}

      <style>{`
        .mobile-nav-drawer {
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 1rem 2.5rem rgba(0, 0, 0, 0.45);
        }

        .mobile-nav-drawer-header {
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
        }

        .nav-action-expert {
          transition: border-color 220ms ease, background 220ms ease, transform 220ms ease, box-shadow 220ms ease;
        }

        @media (hover: hover) {
          .nav-action-expert:hover {
            border-color: rgba(255, 255, 255, 0.55) !important;
            background: rgba(255, 255, 255, 0.12) !important;
            transform: translateY(-1px) scale(1.02);
            box-shadow: 0 4px 18px rgba(91, 107, 248, 0.2);
          }
        }

        .nav-action-expert:active {
          transform: scale(0.97);
        }

        @media (prefers-reduced-motion: reduce) {
          .nav-action-expert {
            transition: none;
          }
          .nav-action-expert:hover {
            transform: none;
          }
        }
      `}</style>
    </header>
  );
}
