import { useState, useEffect, useRef, ReactNode } from "react";
import { useNavigate } from "react-router";

function Brand({ size = 15, dimColor = "#e2e4f3", accentColor = "#818cf8" }: { size?: number; dimColor?: string; accentColor?: string }) {
  return (
    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: size }}>
      <span style={{ color: dimColor }}>Adhd</span><span style={{ color: accentColor }}>HD</span>
    </span>
  );
}

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

function FadeIn({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const { ref, visible } = useFadeIn();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function detectOS(): "mac" | "windows" | "other" {
  if (typeof navigator === "undefined") return "other";
  const p = navigator.platform.toLowerCase();
  const ua = navigator.userAgent.toLowerCase();
  if (p.includes("mac") || ua.includes("mac os")) return "mac";
  if (p.includes("win") || ua.includes("windows")) return "windows";
  return "other";
}

function AppleLogo({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
    </svg>
  );
}

function WindowsLogo({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M2 4.5L10.5 3.3v8.2H2V4.5zm0 15l8.5 1.2v-8.1H2v6.9zm9.5 1.3L22 22V12.4H11.5v8.4zm0-17.5v8.2H22V2L11.5 3.3z"/>
    </svg>
  );
}

function DownloadCard({
  icon,
  title,
  subtitle,
  version,
  size,
  requirement,
  recommended,
  comingSoon,
  delay = 0,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
  version: string;
  size: string;
  requirement: string;
  recommended?: boolean;
  comingSoon?: boolean;
  delay?: number;
}) {
  const [downloading, setDownloading] = useState(false);
  const [done, setDone] = useState(false);
  const handleDownload = () => {
    if (comingSoon) return;
    setDownloading(true);
    setTimeout(() => { setDownloading(false); setDone(true); }, 1800);
  };

  const disabled = comingSoon || downloading || done;

  return (
    <FadeIn delay={delay}>
      <div
        style={{
          background: "#0d0e18",
          border: recommended ? "1px solid rgba(99,102,241,0.4)" : "1px solid #1e2035",
          borderRadius: 20,
          padding: "36px 32px",
          position: "relative",
          overflow: "hidden",
          boxShadow: recommended ? "0 0 48px rgba(99,102,241,0.12)" : "none",
          transition: "all 0.3s ease",
          height: "100%",
          opacity: comingSoon ? 0.85 : 1,
        }}
        onMouseEnter={e => {
          if (comingSoon) return;
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)";
          e.currentTarget.style.boxShadow = "0 16px 60px rgba(99,102,241,0.18)";
        }}
        onMouseLeave={e => {
          if (comingSoon) return;
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.borderColor = recommended ? "rgba(99,102,241,0.4)" : "#1e2035";
          e.currentTarget.style.boxShadow = recommended ? "0 0 48px rgba(99,102,241,0.12)" : "none";
        }}
      >
        {/* Glow */}
        <div style={{
          position: "absolute", top: -60, right: -60,
          width: 220, height: 220, borderRadius: "50%",
          background: recommended
            ? "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {recommended && !comingSoon && (
          <div style={{
            position: "absolute", top: 18, right: 18,
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(110,231,183,0.1)",
            border: "1px solid rgba(110,231,183,0.3)",
            borderRadius: 100, padding: "4px 10px",
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#6ee7b7", boxShadow: "0 0 6px #6ee7b7" }} />
            <span style={{ color: "#6ee7b7", fontSize: 10, letterSpacing: "0.08em" }}>DETECTED</span>
          </div>
        )}

        {comingSoon && (
          <div style={{
            position: "absolute", top: 18, right: 18,
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(251,191,36,0.08)",
            border: "1px solid rgba(251,191,36,0.25)",
            borderRadius: 100, padding: "4px 10px",
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fbbf24", boxShadow: "0 0 6px #fbbf24" }} />
            <span style={{ color: "#fbbf24", fontSize: 10, letterSpacing: "0.08em" }}>COMING SOON</span>
          </div>
        )}

        {/* OS Icon */}
        <div style={{
          width: 76, height: 76, borderRadius: 18,
          background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(129,140,248,0.08))",
          border: "1px solid rgba(99,102,241,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#e2e4f3",
          marginBottom: 24,
          position: "relative",
        }}>
          {icon}
        </div>

        {/* Title */}
        <h3 style={{
          color: "#e2e4f3", fontSize: 24, fontWeight: 700,
          letterSpacing: "-0.02em", marginBottom: 8, lineHeight: 1.2,
        }}>
          {title}
        </h3>

        <p style={{ color: "#6b6f98", fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
          {subtitle}
        </p>

        {/* Meta grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          padding: "14px 0",
          borderTop: "1px solid #1a1c2e",
          borderBottom: "1px solid #1a1c2e",
          marginBottom: 24,
        }}>
          <div>
            <div style={{ color: "#3a3d5c", fontSize: 10, letterSpacing: "0.1em", marginBottom: 4 }}>VERSION</div>
            <div style={{ color: "#c7cae8", fontSize: 13, fontFamily: "'DM Mono', monospace" }}>{version}</div>
          </div>
          <div>
            <div style={{ color: "#3a3d5c", fontSize: 10, letterSpacing: "0.1em", marginBottom: 4 }}>SIZE</div>
            <div style={{ color: "#c7cae8", fontSize: 13, fontFamily: "'DM Mono', monospace" }}>{size}</div>
          </div>
        </div>

        <div style={{ color: "#4b5090", fontSize: 12, marginBottom: 20, fontFamily: "'DM Mono', monospace" }}>
          {requirement}
        </div>

        {/* Download button */}
        <button
          onClick={handleDownload}
          disabled={disabled}
          style={{
            width: "100%",
            background: comingSoon
              ? "rgba(255,255,255,0.03)"
              : done
                ? "rgba(110,231,183,0.12)"
                : recommended
                  ? "linear-gradient(135deg, #6366f1, #818cf8)"
                  : "rgba(99,102,241,0.15)",
            border: comingSoon
              ? "1px solid #1e2035"
              : done
                ? "1px solid rgba(110,231,183,0.3)"
                : recommended
                  ? "none"
                  : "1px solid rgba(99,102,241,0.35)",
            color: comingSoon
              ? "#4b5090"
              : done ? "#6ee7b7" : recommended ? "#fff" : "#818cf8",
            borderRadius: 12,
            padding: "15px 20px",
            fontSize: 15, fontWeight: 600,
            cursor: disabled ? "not-allowed" : "pointer",
            fontFamily: "'Inter', sans-serif",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            boxShadow: recommended && !done && !comingSoon ? "0 0 32px rgba(99,102,241,0.25)" : "none",
            transition: "all 0.2s",
          }}
        >
          {comingSoon ? (
            <>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 5v3l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Coming soon
            </>
          ) : done ? (
            <>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Download started
            </>
          ) : downloading ? (
            <>
              <div style={{
                width: 14, height: 14,
                border: "2px solid rgba(255,255,255,0.3)",
                borderTopColor: "#fff",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }} />
              Preparing...
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2v9m0 0l3.5-3.5M8 11L4.5 7.5M2 14h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Download for {title}
            </>
          )}
        </button>
      </div>
    </FadeIn>
  );
}

export function DownloadPage() {
  const navigate = useNavigate();
  const [os] = useState(() => detectOS());
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{
      background: "#080910",
      color: "#e2e4f3",
      fontFamily: "'Inter', system-ui, sans-serif",
      minHeight: "100vh",
      overflowX: "hidden",
    }}>
      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "16px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: navScrolled ? "rgba(8,9,16,0.92)" : "transparent",
        backdropFilter: navScrolled ? "blur(12px)" : "none",
        borderBottom: navScrolled ? "1px solid rgba(99,102,241,0.1)" : "1px solid transparent",
        transition: "all 0.3s ease",
      }}>
        <button
          onClick={() => navigate("/")}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "transparent", border: "none", cursor: "pointer",
          }}
        >
          <div style={{
            width: 28, height: 28, borderRadius: 7,
            background: "linear-gradient(135deg, #6366f1, #818cf8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13,
          }}>◈</div>
          <Brand size={15} />
        </button>
      </nav>

      {/* Background glows */}
      <div style={{
        position: "absolute", top: "8%", left: "50%", transform: "translateX(-50%)",
        width: "80vw", height: "70vh",
        background: "radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", top: "50%", right: "5%",
        width: "40vw", height: "40vh",
        background: "radial-gradient(ellipse, rgba(34,211,238,0.04) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* HERO */}
      <section style={{
        padding: "140px 24px 60px",
        maxWidth: 1100, margin: "0 auto",
        textAlign: "center",
        position: "relative",
      }}>
        <FadeIn>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)",
            borderRadius: 100, padding: "5px 14px", marginBottom: 28,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#6ee7b7", boxShadow: "0 0 6px #6ee7b7" }} />
            <span style={{ color: "#818cf8", fontSize: 12, letterSpacing: "0.06em" }}>DESKTOP APPS — v1.0 BETA</span>
          </div>
        </FadeIn>

        <FadeIn delay={80}>
          <h1 style={{
            fontSize: "clamp(2.4rem, 5.5vw, 4rem)",
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: "-0.03em",
            marginBottom: 22,
            background: "linear-gradient(135deg, #ffffff 30%, #818cf8)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            Download <Brand size={64} dimColor="#ffffff" accentColor="#818cf8" />
          </h1>
        </FadeIn>

        <FadeIn delay={160}>
          <p style={{
            fontSize: "clamp(1rem, 1.5vw, 1.15rem)",
            color: "#8b8fb8",
            lineHeight: 1.7,
            maxWidth: 560,
            margin: "0 auto 8px",
          }}>
            Native desktop apps for MacOS and Windows. Live menubar focus time tracker, zero friction.
          </p>
        </FadeIn>

        <FadeIn delay={220}>
          <p style={{
            color: "#4b5090", fontSize: 13, marginTop: 18,
            fontFamily: "'DM Mono', monospace",
          }}>
            Free while in beta · No credit card · Syncs across devices
          </p>
        </FadeIn>
      </section>

      {/* DOWNLOAD CARDS */}
      <section style={{ padding: "32px 24px 40px", position: "relative" }}>
        <div style={{
          maxWidth: 960, margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
        }}
          className="download-grid"
        >
          <DownloadCard
            icon={<AppleLogo />}
            title="MacOS"
            subtitle="Native app with integrated menubar focus time tracker."
            version="1.0.0-beta.4"
            size="62.4 MB"
            requirement="Requires macOS 14 Sonoma or later."
            recommended={os === "mac"}
            delay={0}
          />
          <DownloadCard
            icon={<WindowsLogo />}
            title="Windows"
            subtitle="Native app with integrated system tray focus time tracker."
            version="1.0.0-beta.0"
            size="50 MB"
            requirement="Windows 10 (build 1903) or later"
            comingSoon
            delay={100}
          />
        </div>
      </section>

      {/* FEATURES ROW */}
      <section style={{ padding: "60px 24px 80px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <FadeIn>
            <div style={{
              textAlign: "center",
              color: "#4b5090", fontSize: 11, letterSpacing: "0.15em", marginBottom: 40,
            }}>
              WHAT YOU GET WITH THE DESKTOP APP
            </div>
          </FadeIn>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
          }}
            className="features-grid"
          >
            {[
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <rect x="3" y="4" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M7 15v2M13 15v2M5 17h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <circle cx="10" cy="9" r="1.5" fill="currentColor"/>
                  </svg>
                ),
                title: "Menubar focus time tracker",
                body: "Your focus session lives in the app and also in the menubar or tray. One click to start, one click to stop.",
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 3v4M10 13v4M3 10h4M13 10h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                ),
                title: "Syncs everywhere",
                body: "Your data shows up instantly on every device you sign in on.",
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 2l2.5 5.1 5.5.8-4 3.9.9 5.5L10 14.7 5.1 17.3l.9-5.5-4-3.9 5.5-.8L10 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                  </svg>
                ),
                title: "Native and fast",
                body: "Feels like it belongs on your machine. No Electron bloat, no laggy tab.",
              },
            ].map((f, i) => (
              <FadeIn key={i} delay={i * 80}>
                <div style={{
                  background: "#0d0e18",
                  border: "1px solid #1e2035",
                  borderRadius: 14,
                  padding: "24px",
                  height: "100%",
                  transition: "border-color 0.3s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e2035"; }}
                >
                  <div style={{
                    width: 38, height: 38, borderRadius: 10,
                    background: "rgba(99,102,241,0.12)",
                    border: "1px solid rgba(99,102,241,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#818cf8",
                    marginBottom: 16,
                  }}>
                    {f.icon}
                  </div>
                  <h4 style={{ color: "#e2e4f3", fontSize: 15, fontWeight: 600, marginBottom: 6 }}>
                    {f.title}
                  </h4>
                  <p style={{ color: "#6b6f98", fontSize: 13, lineHeight: 1.6 }}>{f.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST BADGES */}
      <section style={{ padding: "0 24px 80px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <FadeIn>
            <div style={{
              display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap",
            }}>
              {[
                ["SHA-256", "verified"],
                ["Notarized", "by Apple"],
                ["Signed", "by EV cert"],
                ["Auto-updates", "enabled"],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l2.5 2.5L10 3" stroke="#6ee7b7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span style={{ color: "#4b5090", fontSize: 11, fontFamily: "'DM Mono', monospace" }}>
                    {k} <span style={{ color: "#3a3d5c" }}>· {v}</span>
                  </span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: "1px solid #12131f",
        padding: "32px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        maxWidth: 1100, margin: "0 auto",
        gap: 16, flexWrap: "wrap",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 22, height: 22, borderRadius: 6,
            background: "linear-gradient(135deg, #6366f1, #818cf8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11,
          }}>◈</div>
          <Brand size={13} dimColor="#3a3d5c" />
        </div>
        <span style={{ color: "#2e3060", fontSize: 12, fontFamily: "'DM Mono', monospace" }}>
          adhdhd.com · © 2026
        </span>
      </footer>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          .download-grid { grid-template-columns: 1fr !important; }
          .features-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
