import { useState, useEffect, useCallback, useRef } from "react";

function fmt(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function fmtShort(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

// ─── Timer Screen ──────────────────────────────────────────────────────────────
function TimerScreen({ totalToday, pct, isRunning, onToggle }: {
  totalToday: number; pct: number; isRunning: boolean; onToggle: () => void;
}) {
  const r = 86;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <div style={{
      width: "100%", height: "100%",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      position: "relative",
    }}>
      {/* Progress ring */}
      <div style={{ position: "relative", width: 200, height: 200 }}>
        <svg width="200" height="200" viewBox="0 0 200 200" style={{ position: "absolute", inset: 0 }}>
          <circle cx="100" cy="100" r={r} fill="none" stroke="#1a1c35" strokeWidth="7" />
          <circle
            cx="100" cy="100" r={r}
            fill="none"
            stroke="url(#wGrad)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            transform="rotate(-90 100 100)"
            style={{ transition: "stroke-dashoffset 0.5s ease" }}
          />
          <defs>
            <linearGradient id="wGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center content inside ring */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: 2,
        }}>
          {isRunning && (
            <div style={{
              width: 6, height: 6, borderRadius: "50%",
              background: "#818cf8",
              animation: "watchPulse 1.5s ease infinite",
              marginBottom: 2,
            }} />
          )}
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 36,
            color: "#e2e4f3",
            fontVariantNumeric: "tabular-nums",
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}>
            {fmt(totalToday)}
          </div>
          <div style={{
            fontSize: 13,
            color: "#4b5090",
            letterSpacing: "0.02em",
            marginTop: 4,
          }}>
            {Math.round(pct)}% of goal
          </div>

          {/* Play/Pause button */}
          <button
            onClick={onToggle}
            style={{
              marginTop: 12,
              width: 48, height: 48,
              borderRadius: "50%",
              border: "1.5px solid rgba(129,140,248,0.25)",
              background: "rgba(129,140,248,0.08)",
              color: "#818cf8",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {isRunning ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="5" y="4" width="3.5" height="12" rx="1" fill="currentColor" />
                <rect x="11.5" y="4" width="3.5" height="12" rx="1" fill="currentColor" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7 4L16 10L7 16V4Z" fill="currentColor" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Today label */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        marginTop: 12,
      }}>
        <span style={{
          fontSize: 10, fontWeight: 700,
          letterSpacing: "0.1em",
          color: "#818cf8",
          background: "rgba(129,140,248,0.12)",
          padding: "2px 8px", borderRadius: 4,
          fontFamily: "'DM Mono', monospace",
        }}>TODAY</span>
        <span style={{ fontSize: 12, color: "#3d4270" }}>
          Sat, Mar 14
        </span>
      </div>
    </div>
  );
}

// ─── Sessions Screen ───────────────────────────────────────────────────────────
function SessionsScreen() {
  const sessions = [
    { label: "Deep Work", dur: 3120, color: "#6366f1" },
    { label: "Writing", dur: 1620, color: "#818cf8" },
    { label: "Review", dur: 827, color: "#22d3ee" },
    { label: "Planning", dur: 420, color: "#6ee7b7" },
  ];
  const total = sessions.reduce((a, s) => a + s.dur, 0);

  return (
    <div style={{
      width: "100%", height: "100%",
      display: "flex", flexDirection: "column",
      padding: "28px 24px 16px",
    }}>
      <div style={{
        fontSize: 11, color: "#4b5090",
        letterSpacing: "0.12em", textTransform: "uppercase",
        fontWeight: 600, textAlign: "center", marginBottom: 20,
      }}>Today's Sessions</div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        {sessions.map((s, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "8px 10px", borderRadius: 10,
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.03)",
          }}>
            <div style={{
              width: 7, height: 7, borderRadius: "50%",
              background: s.color, flexShrink: 0,
            }} />
            <span style={{ flex: 1, fontSize: 14, color: "#c0c4e0" }}>{s.label}</span>
            <span style={{
              fontSize: 13, color: "#4b5090",
              fontFamily: "'DM Mono', monospace",
            }}>{fmtShort(s.dur)}</span>
          </div>
        ))}
      </div>

      <div style={{
        textAlign: "center", fontSize: 12, color: "#3d4270",
        fontFamily: "'DM Mono', monospace",
        paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.04)",
        marginTop: 8,
      }}>
        Total: {fmtShort(total)}
      </div>
    </div>
  );
}

// ─── Stats Screen ──────────────────────────────────────────────────────────────
function StatsScreen() {
  const days = [
    { day: "M", hrs: 3.2 },
    { day: "T", hrs: 4.1 },
    { day: "W", hrs: 2.8 },
    { day: "T", hrs: 5.0 },
    { day: "F", hrs: 1.6 },
    { day: "S", hrs: 0.4 },
    { day: "S", hrs: 0 },
  ];
  const maxH = 6;

  return (
    <div style={{
      width: "100%", height: "100%",
      display: "flex", flexDirection: "column",
      padding: "28px 20px 16px",
    }}>
      <div style={{
        fontSize: 11, color: "#4b5090",
        letterSpacing: "0.12em", textTransform: "uppercase",
        fontWeight: 600, textAlign: "center", marginBottom: 20,
      }}>This Week</div>

      <div style={{
        flex: 1, display: "flex", gap: 6,
        alignItems: "flex-end", padding: "0 4px",
      }}>
        {days.map((d, i) => {
          const isToday = i === 3;
          return (
            <div key={i} style={{
              flex: 1, display: "flex", flexDirection: "column",
              alignItems: "center", gap: 6,
            }}>
              <div style={{
                width: "100%", height: 110,
                background: "rgba(255,255,255,0.015)",
                borderRadius: 5,
                display: "flex", flexDirection: "column",
                justifyContent: "flex-end", overflow: "hidden",
              }}>
                <div style={{
                  width: "100%",
                  height: `${Math.max(2, (d.hrs / maxH) * 100)}%`,
                  background: isToday
                    ? "linear-gradient(180deg, #818cf8, #6366f1)"
                    : "#2a2d55",
                  borderRadius: "5px 5px 0 0",
                  transition: "height 0.3s ease",
                  minHeight: d.hrs > 0 ? 4 : 2,
                }} />
              </div>
              <span style={{
                fontSize: 10,
                color: isToday ? "#818cf8" : "#3d4270",
                fontWeight: isToday ? 600 : 400,
              }}>{d.day}</span>
            </div>
          );
        })}
      </div>

      <div style={{
        display: "flex", justifyContent: "space-around",
        paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.04)",
        marginTop: 14,
      }}>
        {[
          { val: "16.7h", lbl: "total" },
          { val: "3.3h", lbl: "avg" },
          { val: "5", lbl: "streak" },
        ].map((s) => (
          <div key={s.lbl} style={{
            display: "flex", flexDirection: "column",
            alignItems: "center", gap: 2,
          }}>
            <span style={{
              fontSize: 16, fontWeight: 600,
              color: "#e2e4f3", fontFamily: "'DM Mono', monospace",
            }}>{s.val}</span>
            <span style={{ fontSize: 9, color: "#3d4270", letterSpacing: "0.05em" }}>{s.lbl}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Watch Component ──────────────────────────────────────────────────────
export function WatchFace() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [currentScreen, setCurrentScreen] = useState(0);
  const screenCount = 3;
  const dailyTarget = 4 * 3600;
  const existingTime = 5567;
  const totalToday = existingTime + elapsed;
  const pct = Math.min(100, (totalToday / dailyTarget) * 100);

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isRunning) return;
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, [isRunning]);

  const toggle = useCallback(() => setIsRunning((r) => !r), []);

  const goTo = (idx: number) => {
    if (idx >= 0 && idx < screenCount) setCurrentScreen(idx);
  };

  // Touch/swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      if (dx < 0) goTo(currentScreen + 1);
      else goTo(currentScreen - 1);
    }
  };

  // Mouse drag for desktop
  const mouseStartX = useRef(0);
  const dragging = useRef(false);
  const handleMouseDown = (e: React.MouseEvent) => {
    mouseStartX.current = e.clientX;
    dragging.current = true;
  };
  const handleMouseUp = (e: React.MouseEvent) => {
    if (!dragging.current) return;
    dragging.current = false;
    const dx = e.clientX - mouseStartX.current;
    if (Math.abs(dx) > 40) {
      if (dx < 0) goTo(currentScreen + 1);
      else goTo(currentScreen - 1);
    }
  };

  // Scroll wheel on desktop
  const wheelTimeout = useRef<ReturnType<typeof setTimeout>>();
  const handleWheel = (e: React.WheelEvent) => {
    if (wheelTimeout.current) return;
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 20) {
      if (e.deltaX > 0) goTo(currentScreen + 1);
      else goTo(currentScreen - 1);
      wheelTimeout.current = setTimeout(() => { wheelTimeout.current = undefined; }, 400);
    }
  };

  const screens = [
    <TimerScreen key="timer" totalToday={totalToday} pct={pct} isRunning={isRunning} onToggle={toggle} />,
    <SessionsScreen key="sessions" />,
    <StatsScreen key="stats" />,
  ];

  return (
    <div style={{
      background: "#080910",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 36,
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      padding: "40px 20px",
      userSelect: "none",
    }}>
      {/* Watch body */}
      <div style={{
        width: 320,
        height: 388,
        borderRadius: 64,
        background: "linear-gradient(145deg, #161828, #0c0d18)",
        border: "2px solid #222540",
        boxShadow: `
          0 0 0 5px #0a0b14,
          0 0 0 7px #1a1d30,
          0 32px 80px rgba(0,0,0,0.7),
          inset 0 1px 0 rgba(255,255,255,0.03)
        `,
        padding: 18,
        position: "relative",
      }}>
        {/* Digital crown */}
        <div style={{
          position: "absolute",
          right: -10,
          top: "44%",
          transform: "translateY(-50%)",
          width: 6,
          height: 36,
          borderRadius: 3,
          background: "linear-gradient(180deg, #2a2d48 0%, #1a1c2e 100%)",
          border: "1px solid #3d4270",
          boxShadow: "1px 0 4px rgba(0,0,0,0.4)",
        }} />
        {/* Side button */}
        <div style={{
          position: "absolute",
          right: -9,
          top: "58%",
          width: 5,
          height: 18,
          borderRadius: 2,
          background: "linear-gradient(180deg, #252840 0%, #181a2a 100%)",
          border: "1px solid #2a2d48",
        }} />

        {/* Screen area */}
        <div
          ref={containerRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onWheel={handleWheel}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 48,
            background: "#0a0b14",
            overflow: "hidden",
            position: "relative",
            cursor: "grab",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Screens container */}
          <div style={{
            flex: 1,
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{
              display: "flex",
              width: `${screenCount * 100}%`,
              height: "100%",
              transform: `translateX(-${currentScreen * (100 / screenCount)}%)`,
              transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
            }}>
              {screens.map((screen, i) => (
                <div key={i} style={{
                  width: `${100 / screenCount}%`,
                  height: "100%",
                  flexShrink: 0,
                }}>
                  {screen}
                </div>
              ))}
            </div>
          </div>

          {/* Navigation dots */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: 8,
            paddingBottom: 14,
            paddingTop: 4,
          }}>
            {Array.from({ length: screenCount }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentScreen(i)}
                style={{
                  width: 8, height: 8,
                  borderRadius: "50%",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  background: i === currentScreen ? "#818cf8" : "#1e2035",
                  boxShadow: i === currentScreen ? "0 0 8px rgba(129,140,248,0.4)" : "none",
                  transition: "all 0.2s ease",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Brand label */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 20 }}>
          <span style={{ color: "#e2e4f3" }}>Adhd</span>
          <span style={{ color: "#818cf8" }}>HD</span>
        </span>
        <span style={{ fontSize: 18, color: "#3d4270", fontWeight: 500 }}>Watch</span>
      </div>

      <style>{`
        @keyframes watchPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.15; }
        }
      `}</style>
    </div>
  );
}
