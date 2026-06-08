import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ACCENT = "#5B6BF8";
const MUTED = "#9095A8";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: handle auth logic
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ backgroundColor: "#0a0c1a" }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-8 sm:p-10"
        style={{
          background: "linear-gradient(135deg, rgb(11, 13, 20), rgb(20, 26, 52), rgb(11, 13, 20))",
          border: "1px solid rgba(91, 107, 248, 0.2)",
          boxShadow: "0 0 40px rgba(91, 107, 248, 0.08)",
        }}
      >
        {/* Logo */}
        <div className="mb-8 text-center">
          <span className="text-[22px] font-bold tracking-tight text-white">
            Techelix
          </span>
          <span
            className="text-[22px] font-normal tracking-tight"
            style={{
              background: "linear-gradient(135deg, #6B7FF0 0%, #4A5CE8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            AI
          </span>
          <p className="mt-2 text-[14px]" style={{ color: MUTED }}>
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-[13px] font-medium"
              style={{ color: MUTED }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg px-4 py-3 text-[14px] text-white outline-none transition-all duration-200 placeholder:text-[#4a4f65]"
              style={{
                backgroundColor: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(91, 107, 248, 0.25)",
              }}
              onFocus={(e) => (e.target.style.borderColor = ACCENT)}
              onBlur={(e) => (e.target.style.borderColor = "rgba(91, 107, 248, 0.25)")}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-[13px] font-medium"
              style={{ color: MUTED }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg px-4 py-3 text-[14px] text-white outline-none transition-all duration-200 placeholder:text-[#4a4f65]"
              style={{
                backgroundColor: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(91, 107, 248, 0.25)",
              }}
              onFocus={(e) => (e.target.style.borderColor = ACCENT)}
              onBlur={(e) => (e.target.style.borderColor = "rgba(91, 107, 248, 0.25)")}
            />
          </div>

          <div className="flex items-center justify-end">
            <a
              href="#"
              className="text-[13px] transition-opacity hover:opacity-100"
              style={{ color: ACCENT, opacity: 0.85 }}
              onClick={(e) => e.preventDefault()}
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full rounded-full py-3 text-[15px] font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, #6B7FF0 0%, #4A5CE8 100%)",
              boxShadow: "0 4px 20px rgba(91, 107, 248, 0.35)",
            }}
          >
            Sign in
          </button>
        </form>

        <p className="mt-6 text-center text-[13px]" style={{ color: MUTED }}>
          Don&apos;t have an account?{" "}
          <a
            href="#"
            className="font-medium transition-opacity hover:opacity-100"
            style={{ color: ACCENT, opacity: 0.85 }}
            onClick={(e) => e.preventDefault()}
          >
            Sign up
          </a>
        </p>

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
