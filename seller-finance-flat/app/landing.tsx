"use client";

import { useState } from "react";
import { signUp, signIn } from "@/lib/auth";

// ═══════════════════════════════════════════
// ICONS
// ═══════════════════════════════════════════

const IconHome = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
  </svg>
);
const IconChart = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 20V10M18 20V4M6 20v-4" />
  </svg>
);
const IconShield = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const IconMail = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M22 7l-10 6L2 7" />
  </svg>
);
const IconZap = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);
const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3D6B50" strokeWidth="2.5" strokeLinecap="round">
    <path d="M5 12l5 5L20 7" />
  </svg>
);
const IconArrow = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

// ═══════════════════════════════════════════
// AUTH FORM
// ═══════════════════════════════════════════

function AuthForm({ onSuccess }: { onSuccess: () => void }) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signupDone, setSignupDone] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    if (!email) { setError("Please enter your email"); return; }
    if (!password) { setError("Please enter your password"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    if (mode === "signup" && password !== confirmPassword) { setError("Passwords do not match"); return; }

    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await signUp(email, password);
        if (error) { setError(error); } else { setSignupDone(true); }
      } else {
        const { error } = await signIn(email, password);
        if (error) { setError(error); } else { onSuccess(); }
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (signupDone) {
    return (
      <div className="text-center py-6 animate-in">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-brand-sage-bg text-brand-sage mb-4">
          <IconMail />
        </div>
        <h3 className="font-serif text-xl mb-2">Check your email</h3>
        <p className="text-[14px] text-brand-text-light max-w-[280px] mx-auto leading-relaxed">
          We sent a confirmation link to <strong className="text-brand-navy">{email}</strong>. Verify your email to get started.
        </p>
        <button className="btn-secondary mt-6" onClick={() => { setSignupDone(false); setMode("signin"); }}>
          Back to sign in
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in">
      {/* Toggle tabs */}
      <div className="flex mb-6">
        {([["signin", "Sign In"], ["signup", "Create Account"]] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => { setMode(key); setError(null); }}
            className="flex-1 py-3 text-[14px] font-semibold transition-all duration-200 border cursor-pointer"
            style={{
              background: mode === key ? "#0A2540" : "transparent",
              color: mode === key ? "#fff" : "#8B95A5",
              borderColor: mode === key ? "#0A2540" : "#E8E3DB",
              borderRadius: key === "signin" ? "10px 0 0 10px" : "0 10px 10px 0",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Fields */}
      <div className="space-y-4">
        <div>
          <label className="label">Email</label>
          <input
            className="input-field"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        </div>
        <div>
          <label className="label">Password</label>
          <input
            className="input-field"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        </div>
        {mode === "signup" && (
          <div>
            <label className="label">Confirm Password</label>
            <input
              className="input-field"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
        )}

        {error && (
          <div className="p-3 rounded-btn bg-brand-red-bg border border-red-200 text-brand-red text-[13px]">
            {error}
          </div>
        )}

        <button
          className="btn-primary w-full !py-3.5 flex items-center justify-center gap-2"
          onClick={handleSubmit}
          disabled={loading}
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          {loading ? (
            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              {mode === "signin" ? "Sign In" : "Create Account"}
              <IconArrow />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// LANDING PAGE
// ═══════════════════════════════════════════

export default function LandingPage({ onAuthenticated }: { onAuthenticated: () => void }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#FAFAF8" }}>
      {/* NAV */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-[1120px] mx-auto w-full">
        <div className="flex items-center gap-2.5">
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-brand-navy">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
          </div>
          <span className="font-serif text-[18px] text-brand-navy">AutoOffer</span>
        </div>
        <a
          href="#auth"
          className="btn-secondary !py-2 !px-4 !text-[12px]"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("auth")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          Sign In
        </a>
      </nav>

      {/* HERO */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 pt-8 pb-0 max-w-[1120px] mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center w-full">
          {/* LEFT — Copy */}
          <div className="animate-in">
            <div className="tag bg-brand-sage-bg text-brand-sage mb-5">
              <IconZap /> Instant Analysis
            </div>
            <h1 className="font-serif text-[44px] leading-[1.1] text-brand-navy mb-4">
              Seller Finance
              <br />
              <span style={{ color: "#C4A265" }}>Auto Offers</span>
            </h1>
            <p className="text-[16px] text-brand-text-med leading-relaxed max-w-[440px] mb-8">
              Paste a Zillow listing, get four intelligent creative financing
              offers in seconds. Score deals, compare scenarios, and draft
              seller outreach — all from one place.
            </p>

            <div className="space-y-3 mb-10">
              {[
                "4 offer scenarios generated instantly",
                "DSCR, cashflow & ROI scoring",
                "10-year projection & comparison",
                "One-click seller email & SMS drafts",
                "Saved history across sessions",
              ].map((f, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 animate-in"
                  style={{ animationDelay: `${0.1 + i * 0.06}s` }}
                >
                  <IconCheck />
                  <span className="text-[14px] text-brand-navy">{f}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-6 text-[12px] text-brand-text-light">
              <span className="flex items-center gap-1.5"><IconShield /> Secure Auth</span>
              <span>·</span>
              <span>Free to start</span>
              <span>·</span>
              <span>No credit card</span>
            </div>
          </div>

          {/* RIGHT — Auth card */}
          <div id="auth" className="animate-in" style={{ animationDelay: "0.15s" }}>
            <div className="card p-8 max-w-[420px] mx-auto lg:mx-0 lg:ml-auto">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-brand-navy mb-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h2 className="font-serif text-[22px] text-brand-navy">Get Started</h2>
                <p className="text-[13px] text-brand-text-light mt-1">Sign in to save your analyses</p>
              </div>
              <AuthForm onSuccess={onAuthenticated} />
            </div>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="px-5 py-16 max-w-[1120px] mx-auto w-full">
        <h3 className="label text-center mb-8">How it works</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { n: "01", icon: <IconHome />, t: "Paste Listing", d: "Drop in any Zillow URL to pull property data automatically" },
            { n: "02", icon: <IconChart />, t: "Get 4 Offers", d: "Creative & conventional scenarios scored and ranked" },
            { n: "03", icon: <IconShield />, t: "Evaluate Deals", d: "Compare cashflow, DSCR, cap rate & 10-year ROI projections" },
            { n: "04", icon: <IconMail />, t: "Send Outreach", d: "Draft tailored emails & SMS to sellers with one click" },
          ].map((s, i) => (
            <div
              key={i}
              className="card card-hover p-6 text-center animate-in"
              style={{ animationDelay: `${0.3 + i * 0.08}s` }}
            >
              <div className="font-serif text-[32px] text-brand-gold mb-2">{s.n}</div>
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-brand-cream text-brand-navy mb-3">
                {s.icon}
              </div>
              <div className="text-[14px] font-semibold text-brand-navy mb-1">{s.t}</div>
              <div className="text-[12px] text-brand-text-light leading-relaxed">{s.d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-brand-border-light px-5 py-6">
        <div className="max-w-[1120px] mx-auto flex items-center justify-between text-[12px] text-brand-text-light">
          <span>© {new Date().getFullYear()} AutoOffer</span>
          <span>Built for creative real estate investors</span>
        </div>
      </footer>
    </div>
  );
}
