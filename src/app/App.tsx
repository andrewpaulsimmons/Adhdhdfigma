import { useState, useEffect, useRef, ReactNode } from "react";
import { createBrowserRouter, RouterProvider, useNavigate } from "react-router";
import { Dashboard } from "./components/dashboard";
import { FocusTracker } from "./components/focus-tracker";
import { FocusTrackerWeb } from "./components/focus-tracker-web";


// ─── Scroll-reveal hook ───────────────────────────────────────────────────────
function useFadeIn(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function FadeIn({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useFadeIn();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Brand name component ────────────────────────────────────────────────────
function Brand({ size = 15, dimColor = "#e2e4f3", accentColor = "#818cf8" }: { size?: number; dimColor?: string; accentColor?: string }) {
  return (
    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: size }}>
      <span style={{ color: dimColor }}>Adhd</span><span style={{ color: accentColor }}>HD</span>
    </span>
  );
}

// ─── Mockup: Hero App UI ──────────────────────────────────────────────────────
function HeroMockup() {
  const [progress, setProgress] = useState(62);
  const [seconds, setSeconds] = useState(5567); // starts at 1:32:47
  useEffect(() => {
    const t = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    // Progress creeps slowly: 90 min = 5400s total, start at 62%
    const t = setInterval(() => setProgress(p => p >= 100 ? 62 : p + (100 / 5400)), 1000);
    return () => clearInterval(t);
  }, []);
  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };
  return (
    <div style={{
      background: "#0a0b12",
      border: "1px solid #1e2035",
      borderRadius: 16,
      padding: "20px",
      fontFamily: "'DM Mono', monospace",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Window chrome */}
      <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }} />
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
        <span style={{ marginLeft: "auto", color: "#3a3d5c", fontSize: 11 }}>AdhdHD — session tracker</span>
      </div>

      {/* Live session block */}
      <div style={{
        background: "#0e0f1f",
        border: "1px solid #1e2240",
        borderRadius: 10,
        padding: "14px 16px",
        marginBottom: 14,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          {/* Pulsing record dot */}
          <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{
              width: 38, height: 38, borderRadius: "50%",
              background: "rgba(129,140,248,0.15)",
              border: "1px solid rgba(129,140,248,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
            }}>
              <div style={{ width: 14, height: 14, borderRadius: 3, background: "#818cf8" }} />
            </div>
            <div style={{
              position: "absolute",
              width: 38, height: 38, borderRadius: "50%",
              border: "1px solid rgba(129,140,248,0.2)",
              animation: "ping 2s cubic-bezier(0,0,0.2,1) infinite",
            }} />
          </div>
          <div>
            <div style={{ color: "#818cf8", fontSize: 10, letterSpacing: "0.1em", marginBottom: 2 }}>● RECORDING</div>
            <div style={{ color: "#e2e4f3", fontSize: 13 }}>Deep Work — Project Alpha</div>
          </div>
          <div style={{ marginLeft: "auto", color: "#818cf8", fontSize: 15 }}>{formatTime(seconds)}</div>
        </div>
        {/* Progress bar */}
        <div style={{ background: "#1a1c35", borderRadius: 4, height: 5, overflow: "hidden" }}>
          <div style={{
            height: "100%",
            width: `${progress}%`,
            background: "linear-gradient(90deg, #6366f1, #818cf8)",
            borderRadius: 4,
            transition: "width 0.1s linear",
          }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
          <span style={{ color: "#3d4270", fontSize: 10 }}>focus time</span>
          <span style={{ color: "#818cf8", fontSize: 10 }}>{Math.round(progress)}% complete</span>
        </div>
      </div>

      {/* Today's focus summary mini-bars */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ color: "#3a3d5c", fontSize: 10, letterSpacing: "0.08em", marginBottom: 8 }}>TODAY'S BLOCKS</div>
        <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 36 }}>
          {[45, 20, 90, 15, 72, 0, 0, 55].map((h, i) => (
            <div key={i} style={{
              flex: 1,
              height: h === 0 ? 4 : `${Math.round((h / 90) * 36)}px`,
              background: h === 0
                ? "#1a1c2e"
                : i === 7
                  ? "rgba(129,140,248,0.4)"
                  : `rgba(99,102,241,${0.4 + h / 180})`,
              borderRadius: 2,
              position: "relative",
            }}>
              {i === 7 && (
                <div style={{
                  position: "absolute", top: -2, left: "50%", transform: "translateX(-50%)",
                  width: 4, height: 4, borderRadius: "50%",
                  background: "#818cf8",
                }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chart lines – ghost sparkline */}
      <svg width="100%" height="44" viewBox="0 0 300 44" preserveAspectRatio="none" style={{ opacity: 0.18 }}>
        <polyline
          points="0,35 38,28 75,15 112,22 150,8 188,18 225,12 262,20 300,10"
          fill="none" stroke="#818cf8" strokeWidth="1.5"
        />
        <polyline
          points="0,40 38,38 75,34 112,36 150,28 188,32 225,30 262,35 300,28"
          fill="none" stroke="#6ee7b7" strokeWidth="1"
        />
      </svg>

      {/* Bottom stat strip */}
      <div style={{
        display: "flex", gap: 16, marginTop: 10,
        borderTop: "1px solid #1a1c2e", paddingTop: 12,
      }}>
        {[["4.2 hrs", "today"], ["↑18%", "vs avg"], ["6", "streak"]].map(([val, lbl]) => (
          <div key={lbl}>
            <div style={{ color: "#e2e4f3", fontSize: 13 }}>{val}</div>
            <div style={{ color: "#3a3d5c", fontSize: 10 }}>{lbl}</div>
          </div>
        ))}
      </div>

      {/* Glow effect */}
      <div style={{
        position: "absolute", top: -60, right: -60,
        width: 200, height: 200, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
    </div>
  );
}

// ─── Mockup: Day Timeline ─────────────────────────────────────────────────────
function TimelineMockup() {
  const blocks = [
    { start: 0, width: 14, color: "#6366f1", label: "Deep Work" },
    { start: 16, width: 8, color: "#3d4270", label: "" },
    { start: 26, width: 18, color: "#818cf8", label: "Project" },
    { start: 46, width: 4, color: "#3d4270", label: "" },
    { start: 52, width: 22, color: "#6366f1", label: "Writing" },
    { start: 76, width: 10, color: "#22d3ee", label: "Review" },
  ];
  const hours = ["9am", "11am", "1pm", "3pm", "5pm"];
  return (
    <div style={{ background: "#0a0b12", borderRadius: 10, padding: "14px", border: "1px solid #1e2035" }}>
      <div style={{ color: "#4b5090", fontSize: 9, letterSpacing: "0.1em", marginBottom: 10 }}>TODAY — FOCUS TIMELINE</div>
      <div style={{ position: "relative", height: 28, background: "#0e0f1f", borderRadius: 4, overflow: "hidden", marginBottom: 8 }}>
        {blocks.map((b, i) => (
          <div key={i} style={{
            position: "absolute", left: `${b.start}%`, width: `${b.width}%`,
            height: "100%", background: b.color, borderRadius: 2,
            opacity: 0.9,
          }} />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {hours.map(h => (
          <span key={h} style={{ color: "#3a3d5c", fontSize: 9 }}>{h}</span>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: "#6366f1" }} />
          <span style={{ color: "#5a5e8a", fontSize: 9 }}>Focused</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: "#3d4270" }} />
          <span style={{ color: "#5a5e8a", fontSize: 9 }}>Unfocused</span>
        </div>
        <div style={{ marginLeft: "auto", color: "#818cf8", fontSize: 9 }}>6.2 hrs total</div>
      </div>
    </div>
  );
}

// ─── Mockup: Heatmap ─────────────────────────────────────────────────────────
function HeatmapMockup() {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const slots = ["6a", "8a", "10a", "12p", "2p", "4p", "6p", "8p"];
  const heat = [
    [1, 0, 3, 2, 4, 1, 0],
    [2, 1, 4, 3, 5, 0, 0],
    [4, 3, 5, 5, 5, 1, 0],
    [2, 1, 3, 2, 2, 0, 0],
    [1, 2, 4, 4, 3, 1, 0],
    [0, 0, 2, 1, 1, 0, 0],
    [0, 0, 1, 2, 2, 0, 0],
    [0, 0, 0, 0, 1, 0, 0],
  ];
  const color = (v: number) => {
    if (v === 0) return "#111220";
    if (v === 1) return "#1e2040";
    if (v === 2) return "#3730a3";
    if (v === 3) return "#4f46e5";
    if (v === 4) return "#6366f1";
    return "#818cf8";
  };
  return (
    <div style={{ background: "#0a0b12", borderRadius: 10, padding: "14px", border: "1px solid #1e2035" }}>
      <div style={{ color: "#4b5090", fontSize: 9, letterSpacing: "0.1em", marginBottom: 10 }}>PEAK FOCUS — TIME × DAY</div>
      <div style={{ display: "flex", gap: 4 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 3, paddingTop: 14 }}>
          {slots.map(s => (
            <div key={s} style={{ height: 12, color: "#2e3060", fontSize: 8, display: "flex", alignItems: "center" }}>{s}</div>
          ))}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 3 }}>
            {days.map((d, i) => <span key={i} style={{ color: "#2e3060", fontSize: 8 }}>{d}</span>)}
          </div>
          {heat.map((row, ri) => (
            <div key={ri} style={{ display: "flex", gap: 3, marginBottom: 3 }}>
              {row.map((v, ci) => (
                <div key={ci} style={{
                  flex: 1, height: 12, borderRadius: 2,
                  background: color(v),
                  boxShadow: v >= 4 ? "0 0 4px rgba(129,140,248,0.4)" : "none",
                }} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Mockup: AI Insight ──────────────────────────────────────────────────────
function AIInsightMockup() {
  return (
    <div style={{ background: "#0a0b12", borderRadius: 10, padding: "14px", border: "1px solid #1e2035" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
        <div style={{
          width: 22, height: 22, borderRadius: "50%",
          background: "linear-gradient(135deg, #6366f1, #22d3ee)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11,
        }}>✦</div>
        <div style={{ color: "#818cf8", fontSize: 10, letterSpacing: "0.08em" }}>AI INSIGHT — THIS WEEK</div>
      </div>
      <div style={{ background: "#0e0f1f", borderRadius: 8, padding: "12px", marginBottom: 10, border: "1px solid #1a1c35" }}>
        <div style={{ color: "#d1d5f0", fontSize: 12, lineHeight: 1.6 }}>
          You average{" "}
          <span style={{ color: "#6ee7b7", fontFamily: "'DM Mono', monospace" }}>4.2 hrs</span>
          {" "}focused on days you exercise before work.
        </div>
        <div style={{ color: "#d1d5f0", fontSize: 12, lineHeight: 1.6, marginTop: 6 }}>
          On rest days: only{" "}
          <span style={{ color: "#f87171", fontFamily: "'DM Mono', monospace" }}>1.8 hrs</span>.
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <div style={{ flex: 1 }}>
          <div style={{ color: "#4b5090", fontSize: 9, marginBottom: 4 }}>workout days</div>
          <div style={{ background: "#1a1c35", borderRadius: 3, height: 6, overflow: "hidden" }}>
            <div style={{ width: "84%", height: "100%", background: "#6ee7b7", borderRadius: 3 }} />
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ color: "#4b5090", fontSize: 9, marginBottom: 4 }}>rest days</div>
          <div style={{ background: "#1a1c35", borderRadius: 3, height: 6, overflow: "hidden" }}>
            <div style={{ width: "36%", height: "100%", background: "#f87171", borderRadius: 3 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Mockup: Trend Chart ─────────────────────────────────────────────────────
function TrendMockup() {
  const pts = [1.2, 1.8, 2.1, 1.6, 2.8, 3.2, 2.9, 3.8, 4.1, 3.9, 4.5, 5.1];
  const max = 6;
  const w = 240, h = 70;
  const x = (i: number) => (i / (pts.length - 1)) * w;
  const y = (v: number) => h - (v / max) * h;
  const polyline = pts.map((v, i) => `${x(i)},${y(v)}`).join(" ");
  const area = `${x(0)},${h} ${polyline} ${x(pts.length - 1)},${h}`;
  return (
    <div style={{ background: "#0a0b12", borderRadius: 10, padding: "14px", border: "1px solid #1e2035" }}>
      <div style={{ color: "#4b5090", fontSize: 9, letterSpacing: "0.1em", marginBottom: 10 }}>WEEKLY FOCUS HOURS — 12 WEEKS</div>
      <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: "block" }}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {[0, 2, 4, 6].map(v => (
          <line key={v} x1="0" y1={y(v)} x2={w} y2={y(v)}
            stroke="#1a1c35" strokeWidth="1" />
        ))}
        {/* Area fill */}
        <polygon points={area} fill="url(#areaGrad)" />
        {/* Line */}
        <polyline points={polyline} fill="none" stroke="#818cf8" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {/* Last dot */}
        <circle cx={x(pts.length - 1)} cy={y(pts[pts.length - 1])} r="4"
          fill="#818cf8" stroke="#0a0b12" strokeWidth="2" />
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
        <span style={{ color: "#3a3d5c", fontSize: 9 }}>Week 1</span>
        <span style={{ color: "#818cf8", fontSize: 9 }}>↑ 325% improvement</span>
        <span style={{ color: "#3a3d5c", fontSize: 9 }}>Now</span>
      </div>
    </div>
  );
}

// ─── Landing Page ─────────────────────────────────────────────────────────────
export function LandingPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authName, setAuthName] = useState("");

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAuth(false);
    setAuthEmail("");
    setAuthName("");
    navigate("/tracker");
  };

  const handleOAuthLogin = (_provider: string) => {
    setShowAuth(false);
    navigate("/tracker");
  };

  const features = [
    {
      title: "Your day in focus blocks",
      body: "Track when you're locked in and when you're not. Hit play, do the work, hit stop. Over time, your day takes shape — a timeline of when you were actually on vs when you weren't.",
      mockup: <TimelineMockup />,
    },
    {
      title: "Patterns you couldn't see before",
      body: "Charts that make the invisible visible. Your best hours by time of day. Your worst days by what preceded them. High definition, not vibes.",
      mockup: <HeatmapMockup />,
    },
    {
      title: "AI that knows YOUR brain",
      body: "The AI doesn't give you generic productivity advice — it reads YOUR data and finds YOUR patterns. Specific. Actionable. Yours.",
      mockup: <AIInsightMockup />,
    },
    {
      title: "The long game",
      body: "Weeks of data become a personal productivity profile. You stop guessing. You start seeing your ADHD not as a random disruption but as a system with patterns you can actually work with.",
      mockup: <TrendMockup />,
    },
  ];

  return (
    <div style={{
      background: "#080910",
      color: "#e2e4f3",
      fontFamily: "'Inter', system-ui, sans-serif",
      minHeight: "100vh",
      overflowX: "hidden",
    }}>

      {/* ── NAV ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "16px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: navScrolled ? "rgba(8,9,16,0.92)" : "transparent",
        backdropFilter: navScrolled ? "blur(12px)" : "none",
        borderBottom: navScrolled ? "1px solid rgba(99,102,241,0.1)" : "1px solid transparent",
        transition: "all 0.3s ease",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 7,
            background: "linear-gradient(135deg, #6366f1, #818cf8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13,
          }}>◈</div>
          <Brand size={15} dimColor="#e2e4f3" accentColor="#818cf8" />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <a
            href="#cta"
            onClick={e => { e.preventDefault(); document.getElementById("cta")?.scrollIntoView({ behavior: "smooth" }); }}
            style={{
              background: "rgba(99,102,241,0.15)",
              border: "1px solid rgba(99,102,241,0.35)",
              color: "#818cf8",
              borderRadius: 8, padding: "8px 18px",
              fontSize: 13, cursor: "pointer",
              textDecoration: "none",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(99,102,241,0.25)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(99,102,241,0.15)";
            }}
          >
            Get early access
          </a>
          <button
            onClick={() => { setAuthMode("login"); setShowAuth(true); }}
            style={{
              background: "transparent",
              border: "1px solid #2a2c45",
              color: "#8b8fb8",
              borderRadius: 8, padding: "8px 18px",
              fontSize: 13, cursor: "pointer",
              transition: "all 0.2s",
              fontFamily: "'Inter', sans-serif",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#818cf8";
              (e.currentTarget as HTMLButtonElement).style.color = "#e2e4f3";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#2a2c45";
              (e.currentTarget as HTMLButtonElement).style.color = "#8b8fb8";
            }}
          >
            Log in
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        minHeight: "100vh",
        display: "flex", alignItems: "center",
        padding: "120px 24px 80px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Background glow blobs */}
        <div style={{
          position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)",
          width: "70vw", height: "60vh",
          background: "radial-gradient(ellipse, rgba(99,102,241,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "20%", right: "10%",
          width: "30vw", height: "30vh",
          background: "radial-gradient(ellipse, rgba(34,211,238,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{
          maxWidth: 1100, margin: "0 auto", width: "100%",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
          gap: "64px",
          alignItems: "center",
        }}
          className="hero-grid"
        >
          {/* Left: copy */}
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)",
              borderRadius: 100, padding: "5px 14px", marginBottom: 28,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#6ee7b7", boxShadow: "0 0 6px #6ee7b7" }} />
              <span style={{ color: "#818cf8", fontSize: 12, letterSpacing: "0.06em" }}>NOW IN EARLY ACCESS</span>
            </div>

            <h1 style={{
              fontSize: "clamp(2.6rem, 5.5vw, 4.2rem)",
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              marginBottom: 24,
              background: "linear-gradient(135deg, #ffffff 30%, #818cf8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              ADHD in HD.
            </h1>

            <p style={{
              fontSize: "clamp(1rem, 1.6vw, 1.15rem)",
              color: "#8b8fb8",
              lineHeight: 1.75,
              marginBottom: 36,
              maxWidth: 500,
            }}>
              A high-definition look at your productivity. Track your focused hours, see what's actually working, and stop guessing why some days you're on fire and some days you can't start.
            </p>

            <a
              href="#cta"
              onClick={e => { e.preventDefault(); document.getElementById("cta")?.scrollIntoView({ behavior: "smooth" }); }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                background: "linear-gradient(135deg, #6366f1, #818cf8)",
                color: "#fff",
                borderRadius: 10, padding: "14px 28px",
                fontSize: 15, fontWeight: 600,
                textDecoration: "none",
                boxShadow: "0 0 32px rgba(99,102,241,0.3)",
                transition: "all 0.2s",
                cursor: "pointer",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 40px rgba(99,102,241,0.4)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 32px rgba(99,102,241,0.3)";
              }}
            >
              Get early access
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>

          {/* Right: mockup */}
          <div style={{ animation: "floatUp 0.8s ease 0.2s both" }}>
            <HeroMockup />
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
          opacity: 0.3, animation: "bounce 2s ease infinite",
        }}>
          <span style={{ fontSize: 10, letterSpacing: "0.12em", color: "#6b7280" }}>SCROLL</span>
          <svg width="14" height="8" viewBox="0 0 14 8" fill="none">
            <path d="M1 1l6 6 6-6" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </section>

      {/* ── THE PROBLEM ── */}
      <section style={{ padding: "96px 24px", position: "relative" }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, transparent 0%, rgba(99,102,241,0.03) 50%, transparent 100%)",
          pointerEvents: "none",
        }} />
        <div style={{ maxWidth: 740, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ color: "#4b5090", fontSize: 11, letterSpacing: "0.15em", marginBottom: 20, textAlign: "center" }}>
              THE PROBLEM
            </div>
          </FadeIn>

          {[
            "You've had great days. Days where you locked in for five hours straight and built something real. And you've had days where you sat at your desk from 9 to 5 and got nothing done and couldn't tell you where the time went.",
            "You KNOW there's a pattern. You can feel it. Something about mornings. Something about meetings. Something about how you slept or when you had coffee or whether you had a clear first task or just opened Slack and let the day happen to you.",
            `But you've never seen it. It's all vibes. And "vibes" isn't a strategy — it's a coin flip that decides whether today is a 6-hour-of-deep-work day or a stare-at-the-screen-and-hate-yourself day.`,
          ].map((para, i) => (
            <FadeIn key={i} delay={i * 80}>
              <p style={{
                fontSize: "clamp(1.05rem, 1.8vw, 1.2rem)",
                lineHeight: 1.8,
                color: i === 2 ? "#c7cae8" : "#8b8fb8",
                marginBottom: 24,
                fontStyle: i === 2 ? "italic" : "normal",
              }}>
                {para}
              </p>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: "80px 24px 96px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ color: "#4b5090", fontSize: 11, letterSpacing: "0.15em", marginBottom: 48, textAlign: "center" }}>
              HOW IT WORKS
            </div>
          </FadeIn>

          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
          }}
            className="before-after-grid"
          >
            {/* BEFORE */}
            <FadeIn delay={0}>
              <div style={{
                background: "#0d0e18",
                border: "1px solid #1e2035",
                borderRadius: 16,
                padding: "28px",
                position: "relative",
                overflow: "hidden",
              }}>
                <div style={{
                  display: "inline-block",
                  background: "rgba(248,113,113,0.1)",
                  border: "1px solid rgba(248,113,113,0.2)",
                  color: "#f87171",
                  borderRadius: 6, padding: "3px 10px",
                  fontSize: 11, letterSpacing: "0.1em",
                  marginBottom: 18,
                }}>Before <Brand size={11} dimColor="#f87171" accentColor="#fca5a5" /></div>
                <p style={{ color: "#6b6f98", fontSize: 15, lineHeight: 1.8 }}>
                  Monday was great but you don't know why. Tuesday was a total loss but you don't know why. Wednesday you white-knuckle through on caffeine and guilt. Repeat for ten years.
                </p>
                {/* Chaos visual */}
                <div style={{ marginTop: 20, display: "flex", gap: 3, alignItems: "flex-end", height: 40 }}>
                  {[18, 42, 8, 35, 12, 48, 6, 30, 22, 45, 10, 38].map((h, i) => (
                    <div key={i} style={{
                      flex: 1, height: h,
                      background: `rgba(248,113,113,${0.2 + Math.random() * 0.3})`,
                      borderRadius: 2,
                    }} />
                  ))}
                </div>
                <div style={{ marginTop: 8, color: "#4b5090", fontSize: 10, fontFamily: "'DM Mono', monospace" }}>
                  pattern: none detected
                </div>
              </div>
            </FadeIn>

            {/* AFTER */}
            <FadeIn delay={100}>
              <div style={{
                background: "#0d0e18",
                border: "1px solid rgba(99,102,241,0.25)",
                borderRadius: 16,
                padding: "28px",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 0 40px rgba(99,102,241,0.06)",
              }}>
                <div style={{
                  display: "inline-block",
                  background: "rgba(99,102,241,0.1)",
                  border: "1px solid rgba(99,102,241,0.25)",
                  color: "#818cf8",
                  borderRadius: 6, padding: "3px 10px",
                  fontSize: 11, letterSpacing: "0.1em",
                  marginBottom: 18,
                }}>After <Brand size={11} dimColor="#818cf8" accentColor="#a5b4fc" /></div>
                <p style={{ color: "#9da0c8", fontSize: 15, lineHeight: 1.8 }}>
                  Monday was great — you started a deep task before 9am, had no meetings until noon, and worked in two 90-minute blocks. Tuesday was a loss — you opened email first, got pulled into three Slack threads, and never recovered a focus block. You can <span style={{ color: "#818cf8" }}>SEE it now</span>. Wednesday, you protect your morning.
                </p>
                {/* Clarity visual */}
                <div style={{ marginTop: 20, display: "flex", gap: 3, alignItems: "flex-end", height: 40 }}>
                  {[40, 42, 8, 10, 44, 46, 6, 8, 42, 44, 46, 48].map((h, i) => (
                    <div key={i} style={{
                      flex: 1, height: h,
                      background: h > 30
                        ? `rgba(99,102,241,${0.5 + (h / 96) * 0.5})`
                        : "rgba(99,102,241,0.1)",
                      borderRadius: 2,
                    }} />
                  ))}
                </div>
                <div style={{ marginTop: 8, color: "#818cf8", fontSize: 10, fontFamily: "'DM Mono', monospace" }}>
                  pattern: morning blocks = 3.8× better
                </div>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={200}>
            <p style={{
              textAlign: "center", marginTop: 40,
              color: "#6b6f98", fontSize: 15, lineHeight: 1.8,
              maxWidth: 620, margin: "40px auto 0",
              fontStyle: "italic",
            }}>
              The data doesn't fix your brain. It shows you how your brain works. Then you make better calls about your day.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── WHAT YOU SEE ── */}
      <section style={{ padding: "80px 24px 96px", background: "linear-gradient(180deg, transparent, rgba(99,102,241,0.03) 50%, transparent)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <div style={{ color: "#4b5090", fontSize: 11, letterSpacing: "0.15em", marginBottom: 16 }}>WHAT YOU SEE</div>
              <h2 style={{
                fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                fontWeight: 700,
                letterSpacing: "-0.025em",
                lineHeight: 1.2,
                color: "#e2e4f3",
              }}>
                Your data. Your patterns.<br />Your edge.
              </h2>
            </div>
          </FadeIn>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 24,
          }}
            className="features-grid"
          >
            {features.map((f, i) => (
              <FadeIn key={i} delay={i * 80}>
                <div style={{
                  background: "#0d0e18",
                  border: "1px solid #1e2035",
                  borderRadius: 16,
                  padding: "28px",
                  transition: "border-color 0.3s, box-shadow 0.3s",
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(99,102,241,0.3)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 0 32px rgba(99,102,241,0.06)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "#1e2035";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                  }}
                >
                  <div style={{ marginBottom: 20 }}>
                    {f.mockup}
                  </div>
                  <div style={{ color: "#6366f1", fontSize: 11, letterSpacing: "0.1em", marginBottom: 8 }}>0{i + 1}</div>
                  <h3 style={{ color: "#e2e4f3", fontSize: 17, fontWeight: 600, lineHeight: 1.3, marginBottom: 12 }}>
                    {f.title}
                  </h3>
                  <p style={{ color: "#6b6f98", fontSize: 14, lineHeight: 1.75 }}>{f.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── POSITIONING ── */}
      <section style={{ padding: "80px 24px 96px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <FadeIn>
            <div style={{
              background: "#0d0e18",
              border: "1px solid #1e2035",
              borderRadius: 20,
              padding: "clamp(32px, 5vw, 60px)",
              position: "relative",
              overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: -80, right: -80,
                width: 300, height: 300, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)",
                pointerEvents: "none",
              }} />
              <div style={{ color: "#4b5090", fontSize: 11, letterSpacing: "0.15em", marginBottom: 20 }}>
                THE DIFFERENCE
              </div>
              <h2 style={{
                fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
                fontWeight: 700,
                letterSpacing: "-0.025em",
                lineHeight: 1.15,
                marginBottom: 32,
                color: "#e2e4f3",
              }}>
                This Isn't a<br />Pomodoro Timer
              </h2>

              {[
                { cross: true, text: "You don't need another app that beeps every 25 minutes." },
                { cross: true, text: "You don't need a todo list you'll abandon in three days." },
                { cross: true, text: "You don't need productivity advice written by people whose brains work fine on default settings." },
              ].map((item, i) => (
                <FadeIn key={i} delay={i * 60}>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 16 }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: 4,
                      background: "rgba(248,113,113,0.1)",
                      border: "1px solid rgba(248,113,113,0.2)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0, marginTop: 2, fontSize: 10, color: "#f87171",
                    }}>✕</div>
                    <span style={{ color: "#6b6f98", fontSize: 15, lineHeight: 1.7 }}>{item.text}</span>
                  </div>
                </FadeIn>
              ))}

              <div style={{ height: 1, background: "#1e2035", margin: "28px 0" }} />

              <FadeIn delay={200}>
                <p style={{ color: "#9da0c8", fontSize: 16, lineHeight: 1.8 }}>
                  You need to <span style={{ color: "#818cf8" }}>SEE</span> what's actually happening. A clear, honest picture of when you focus, when you don't, and what makes the difference.
                </p>
              </FadeIn>
              <FadeIn delay={260}>
                <p style={{ color: "#9da0c8", fontSize: 16, lineHeight: 1.8, marginTop: 16 }}>
                  <Brand size={16} dimColor="#9da0c8" accentColor="#818cf8" /> is a <span style={{ color: "#818cf8" }}>mirror, not a coach</span>. It shows you what's working — you decide what to do about it.
                </p>
              </FadeIn>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── EARLY ACCESS CTA ── */}
      <section id="cta" style={{ padding: "80px 24px 120px", position: "relative" }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 50% 50%, rgba(99,102,241,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
          <FadeIn>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(110,231,183,0.08)",
              border: "1px solid rgba(110,231,183,0.2)",
              borderRadius: 100, padding: "5px 14px", marginBottom: 28,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#6ee7b7", boxShadow: "0 0 6px #6ee7b7" }} />
              <span style={{ color: "#6ee7b7", fontSize: 12, letterSpacing: "0.06em" }}>EARLY ACCESS OPEN</span>
            </div>

            <h2 style={{
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              marginBottom: 20,
              color: "#e2e4f3",
            }}>
              Your best days aren't random.<br />
              <span style={{ color: "#818cf8" }}>You just haven't seen the pattern yet.</span>
            </h2>

            <p style={{ color: "#6b6f98", fontSize: 16, lineHeight: 1.7, marginBottom: 40 }}>
              Join the early access list. See your first weekly report in 7 days.
            </p>
          </FadeIn>

          <FadeIn delay={100}>
            {!submitted ? (
              <form onSubmit={handleSubmit} style={{
                display: "flex",
                gap: 0,
                background: "#0d0e18",
                border: "1px solid #2a2c45",
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: "0 0 40px rgba(99,102,241,0.1)",
              }}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    padding: "16px 20px",
                    color: "#e2e4f3",
                    fontSize: 15,
                    fontFamily: "'Inter', sans-serif",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: "linear-gradient(135deg, #6366f1, #818cf8)",
                    border: "none",
                    color: "#fff",
                    padding: "16px 24px",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    fontFamily: "'Inter', sans-serif",
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "0.9")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                >
                  Get early access
                </button>
              </form>
            ) : (
              <div style={{
                background: "rgba(110,231,183,0.08)",
                border: "1px solid rgba(110,231,183,0.2)",
                borderRadius: 12,
                padding: "24px",
                animation: "fadeInUp 0.4s ease",
              }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>✦</div>
                <div style={{ color: "#6ee7b7", fontSize: 17, fontWeight: 600, marginBottom: 6 }}>
                  You're on the list.
                </div>
                <div style={{ color: "#6b6f98", fontSize: 14 }}>We'll be in touch.</div>
              </div>
            )}
          </FadeIn>

          <FadeIn delay={160}>
            <p style={{ color: "#3a3d5c", fontSize: 13, marginTop: 16, fontFamily: "'DM Mono', monospace" }}>
              No spam. No noise. Just your data.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: "1px solid #12131f",
        padding: "32px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        maxWidth: 1100,
        margin: "0 auto",
        gap: 16,
        flexWrap: "wrap",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 22, height: 22, borderRadius: 6,
            background: "linear-gradient(135deg, #6366f1, #818cf8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11,
          }}>◈</div>
          <Brand size={13} dimColor="#3a3d5c" accentColor="#818cf8" />
        </div>
        <span style={{ color: "#2e3060", fontSize: 12, fontFamily: "'DM Mono', monospace" }}>
          adhdhd.com · © 2026
        </span>
      </footer>

      {/* ── AUTH LIGHTBOX ── */}
      {showAuth && (
        <div
          onClick={() => setShowAuth(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 200,
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            animation: "fadeInUp 0.25s ease",
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: "#0d0e18",
              border: "1px solid #1e2035",
              borderRadius: 20,
              padding: "40px",
              width: "100%",
              maxWidth: 420,
              margin: "0 24px",
              position: "relative",
              boxShadow: "0 0 80px rgba(99,102,241,0.12)",
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setShowAuth(false)}
              style={{
                position: "absolute", top: 16, right: 16,
                background: "transparent", border: "none",
                color: "#3a3d5c", fontSize: 20, cursor: "pointer",
                width: 32, height: 32, display: "flex",
                alignItems: "center", justifyContent: "center",
                borderRadius: 8, transition: "color 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "#e2e4f3")}
              onMouseLeave={e => (e.currentTarget.style.color = "#3a3d5c")}
            >
              ✕
            </button>

            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 7,
                background: "linear-gradient(135deg, #6366f1, #818cf8)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13,
              }}>◈</div>
              <Brand size={15} dimColor="#e2e4f3" accentColor="#818cf8" />
            </div>

            {/* Title */}
            <h2 style={{
              fontSize: 22, fontWeight: 700, color: "#e2e4f3",
              marginBottom: 6, lineHeight: 1.3,
            }}>
              {authMode === "login" ? "Welcome back" : "Create your account"}
            </h2>
            <p style={{ color: "#6b6f98", fontSize: 14, marginBottom: 28, lineHeight: 1.5 }}>
              {authMode === "login"
                ? "Log in to see your focus data."
                : "Start tracking your productivity in HD."
              }
            </p>

            {/* Form */}
            <form onSubmit={handleAuthSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {authMode === "signup" && (
                <div>
                  <label style={{ display: "block", color: "#4b5090", fontSize: 12, letterSpacing: "0.06em", marginBottom: 6 }}>NAME</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={authName}
                    onChange={e => setAuthName(e.target.value)}
                    style={{
                      width: "100%", background: "#0a0b12",
                      border: "1px solid #1e2035", borderRadius: 10,
                      padding: "12px 16px", color: "#e2e4f3", fontSize: 14,
                      outline: "none", fontFamily: "'Inter', sans-serif",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={e => (e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)")}
                    onBlur={e => (e.currentTarget.style.borderColor = "#1e2035")}
                  />
                </div>
              )}
              <div>
                <label style={{ display: "block", color: "#4b5090", fontSize: 12, letterSpacing: "0.06em", marginBottom: 6 }}>EMAIL</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={authEmail}
                  onChange={e => setAuthEmail(e.target.value)}
                  required
                  style={{
                    width: "100%", background: "#0a0b12",
                    border: "1px solid #1e2035", borderRadius: 10,
                    padding: "12px 16px", color: "#e2e4f3", fontSize: 14,
                    outline: "none", fontFamily: "'Inter', sans-serif",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "#1e2035")}
                />
              </div>
              <div>
                <label style={{ display: "block", color: "#4b5090", fontSize: 12, letterSpacing: "0.06em", marginBottom: 6 }}>PASSWORD</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  style={{
                    width: "100%", background: "#0a0b12",
                    border: "1px solid #1e2035", borderRadius: 10,
                    padding: "12px 16px", color: "#e2e4f3", fontSize: 14,
                    outline: "none", fontFamily: "'Inter', sans-serif",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "#1e2035")}
                />
              </div>

              <button
                type="submit"
                style={{
                  marginTop: 6,
                  background: "linear-gradient(135deg, #6366f1, #818cf8)",
                  border: "none", color: "#fff",
                  borderRadius: 10, padding: "14px",
                  fontSize: 15, fontWeight: 600, cursor: "pointer",
                  fontFamily: "'Inter', sans-serif",
                  boxShadow: "0 0 32px rgba(99,102,241,0.2)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 40px rgba(99,102,241,0.35)";
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 32px rgba(99,102,241,0.2)";
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                }}
              >
                {authMode === "login" ? "Log in" : "Create account"}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
              <div style={{ flex: 1, height: 1, background: "#1e2035" }} />
              <span style={{ color: "#3a3d5c", fontSize: 12 }}>or</span>
              <div style={{ flex: 1, height: 1, background: "#1e2035" }} />
            </div>

            {/* Google button */}
            <button
              type="button"
              onClick={() => handleOAuthLogin("Google")}
              style={{
                width: "100%",
                background: "transparent",
                border: "1px solid #1e2035",
                borderRadius: 10, padding: "12px",
                color: "#8b8fb8", fontSize: 14,
                cursor: "pointer", fontFamily: "'Inter', sans-serif",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                transition: "all 0.2s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(99,102,241,0.3)";
                (e.currentTarget as HTMLButtonElement).style.color = "#e2e4f3";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#1e2035";
                (e.currentTarget as HTMLButtonElement).style.color = "#8b8fb8";
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            {/* Apple button */}
            <button
              type="button"
              onClick={() => handleOAuthLogin("Apple")}
              style={{
                width: "100%",
                background: "transparent",
                border: "1px solid #1e2035",
                borderRadius: 10, padding: "12px",
                color: "#8b8fb8", fontSize: 14,
                cursor: "pointer", fontFamily: "'Inter', sans-serif",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                transition: "all 0.2s",
                marginTop: 10,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(99,102,241,0.3)";
                (e.currentTarget as HTMLButtonElement).style.color = "#e2e4f3";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#1e2035";
                (e.currentTarget as HTMLButtonElement).style.color = "#8b8fb8";
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Continue with Apple
            </button>

            {/* Toggle mode */}
            <p style={{ textAlign: "center", marginTop: 20, color: "#6b6f98", fontSize: 13 }}>
              {authMode === "login" ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}
                style={{
                  background: "none", border: "none",
                  color: "#818cf8", fontSize: 13,
                  cursor: "pointer", textDecoration: "none",
                  fontFamily: "'Inter', sans-serif",
                  padding: 0,
                }}
                onMouseEnter={e => (e.currentTarget.style.textDecoration = "underline")}
                onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")}
              >
                {authMode === "login" ? "Sign up" : "Log in"}
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Global styles */}
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        
        @keyframes floatUp {
          from { opacity: 0; transform: translateY(32px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(6px); }
        }
        @keyframes ping {
          75%, 100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        input::placeholder { color: #3a3d5c; }
        
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .before-after-grid {
            grid-template-columns: 1fr !important;
          }
          .features-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

// ─── Tracker Page (web-native, default post-login) ────────────────────────────
function TrackerPage() {
  const navigate = useNavigate();
  return (
    <FocusTrackerWeb
      onLogout={() => navigate("/")}
      onViewStats={() => navigate("/stats")}
    />
  );
}

// ─── App Page (macOS-style focus tracker) ─────────────────────────────────────
function AppPage() {
  const navigate = useNavigate();
  return (
    <FocusTracker
      onLogout={() => navigate("/")}
      onViewStats={() => navigate("/stats")}
    />
  );
}

// ─── Stats Page (detailed analytics) ──────────────────────────────────────────
function StatsPage() {
  const navigate = useNavigate();
  return (
    <Dashboard
      userName="Andrew"
      onLogout={() => navigate("/")}
      onBack={() => navigate("/tracker")}
    />
  );
}

// ─── Router ───────────────────────────────────────────────────────────────────
const router = createBrowserRouter([
  { path: "/", Component: LandingPage },
  { path: "/tracker", Component: TrackerPage },
  { path: "/app", Component: AppPage },
  { path: "/stats", Component: StatsPage },
  { path: "*", Component: LandingPage },
]);

export default function App() {
  return <RouterProvider router={router} />;
}