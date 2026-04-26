import { useState, useEffect } from "react";

function Brand({ size = 15, dimColor = "#e2e4f3", accentColor = "#818cf8" }: { size?: number; dimColor?: string; accentColor?: string }) {
  return (
    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: size }}>
      <span style={{ color: dimColor }}>Adhd</span><span style={{ color: accentColor }}>HD</span>
    </span>
  );
}

// ─── Day Timeline ──────────────────────────────────────────────────────────────
function DayTimeline() {
  const blocks = [
    { start: 0, width: 14, color: "#6366f1", label: "Deep Work" },
    { start: 16, width: 8, color: "#3d4270", label: "Email" },
    { start: 26, width: 18, color: "#818cf8", label: "Project Alpha" },
    { start: 46, width: 4, color: "#3d4270", label: "Break" },
    { start: 52, width: 22, color: "#6366f1", label: "Writing" },
    { start: 76, width: 10, color: "#22d3ee", label: "Review" },
    { start: 88, width: 8, color: "#818cf8", label: "Planning" },
  ];
  const hours = ["9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm"];
  return (
    <div>
      <div style={{ color: "#4b5090", fontSize: 10, letterSpacing: "0.1em", marginBottom: 14 }}>TODAY — FOCUS TIMELINE</div>
      <div style={{ position: "relative", height: 40, background: "#0e0f1f", borderRadius: 6, overflow: "hidden", marginBottom: 10 }}>
        {blocks.map((b, i) => (
          <div key={i} title={b.label} style={{
            position: "absolute", left: `${b.start}%`, width: `${b.width}%`,
            height: "100%", background: b.color, borderRadius: 3,
            opacity: 0.9, cursor: "pointer", transition: "opacity 0.2s",
          }} />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {hours.map(h => (
          <span key={h} style={{ color: "#3a3d5c", fontSize: 9 }}>{h}</span>
        ))}
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 14, flexWrap: "wrap" }}>
        {[
          { color: "#6366f1", label: "Deep Work", hrs: "3.2h" },
          { color: "#818cf8", label: "Project", hrs: "2.1h" },
          { color: "#22d3ee", label: "Review", hrs: "0.8h" },
          { color: "#3d4270", label: "Unfocused", hrs: "1.0h" },
        ].map(l => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: l.color }} />
            <span style={{ color: "#6b6f98", fontSize: 11 }}>{l.label}</span>
            <span style={{ color: "#818cf8", fontSize: 11, fontFamily: "'DM Mono', monospace" }}>{l.hrs}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Focus Heatmap (expanded) ──────────────────────────────────────────────────
function FocusHeatmap() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const slots = ["6am", "8am", "10am", "12pm", "2pm", "4pm", "6pm", "8pm"];
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
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ color: "#4b5090", fontSize: 10, letterSpacing: "0.1em" }}>PEAK FOCUS — TIME × DAY</div>
        <div style={{ color: "#818cf8", fontSize: 11, fontFamily: "'DM Mono', monospace" }}>Best: Wed 10am</div>
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, paddingTop: 22 }}>
          {slots.map(s => (
            <div key={s} style={{ height: 18, color: "#3a3d5c", fontSize: 9, display: "flex", alignItems: "center", minWidth: 28 }}>{s}</div>
          ))}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 4 }}>
            {days.map(d => <span key={d} style={{ color: "#3a3d5c", fontSize: 9, flex: 1, textAlign: "center" }}>{d}</span>)}
          </div>
          {heat.map((row, ri) => (
            <div key={ri} style={{ display: "flex", gap: 4, marginBottom: 4 }}>
              {row.map((v, ci) => (
                <div key={ci} style={{
                  flex: 1, height: 18, borderRadius: 3,
                  background: color(v),
                  boxShadow: v >= 4 ? "0 0 6px rgba(129,140,248,0.4)" : "none",
                  cursor: "pointer", transition: "transform 0.15s",
                }} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── AI Insights ───────────────────────────────────────────────────────────────
function AIInsights() {
  const insights = [
    {
      text: <>You average <span style={{ color: "#6ee7b7", fontFamily: "'DM Mono', monospace" }}>4.2 hrs</span> focused on days you exercise before work. On rest days: only <span style={{ color: "#f87171", fontFamily: "'DM Mono', monospace" }}>1.8 hrs</span>.</>,
      bars: [{ label: "workout days", pct: 84, color: "#6ee7b7" }, { label: "rest days", pct: 36, color: "#f87171" }],
    },
    {
      text: <>Your focus drops <span style={{ color: "#f87171", fontFamily: "'DM Mono', monospace" }}>62%</span> after meetings longer than 30 min. Protect your morning blocks.</>,
      bars: [{ label: "pre-meeting", pct: 92, color: "#818cf8" }, { label: "post-meeting", pct: 35, color: "#f87171" }],
    },
    {
      text: <>Tuesday is consistently your worst day — <span style={{ color: "#f87171", fontFamily: "'DM Mono', monospace" }}>1.4 hrs</span> avg. Consider restructuring your Tuesday calendar.</>,
      bars: [{ label: "best (Wed)", pct: 90, color: "#6ee7b7" }, { label: "worst (Tue)", pct: 28, color: "#f87171" }],
    },
  ];
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
        <div style={{
          width: 26, height: 26, borderRadius: "50%",
          background: "linear-gradient(135deg, #6366f1, #22d3ee)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13,
        }}>✦</div>
        <div style={{ color: "#818cf8", fontSize: 10, letterSpacing: "0.08em" }}>AI INSIGHTS — THIS WEEK</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {insights.map((ins, i) => (
          <div key={i} style={{
            background: "#0e0f1f", borderRadius: 10, padding: "16px",
            border: "1px solid #1a1c35",
          }}>
            <div style={{ color: "#d1d5f0", fontSize: 13, lineHeight: 1.7, marginBottom: 12 }}>{ins.text}</div>
            <div style={{ display: "flex", gap: 12 }}>
              {ins.bars.map(b => (
                <div key={b.label} style={{ flex: 1 }}>
                  <div style={{ color: "#4b5090", fontSize: 9, marginBottom: 4 }}>{b.label}</div>
                  <div style={{ background: "#1a1c35", borderRadius: 3, height: 6, overflow: "hidden" }}>
                    <div style={{ width: `${b.pct}%`, height: "100%", background: b.color, borderRadius: 3, transition: "width 0.6s ease" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Trend Chart (expanded) ────────────────────────────────────────────────────
function TrendChart() {
  const pts = [1.2, 1.8, 2.1, 1.6, 2.8, 3.2, 2.9, 3.8, 4.1, 3.9, 4.5, 5.1];
  const max = 6;
  const w = 400, h = 120;
  const x = (i: number) => (i / (pts.length - 1)) * w;
  const y = (v: number) => h - (v / max) * h;
  const polyline = pts.map((v, i) => `${x(i)},${y(v)}`).join(" ");
  const area = `${x(0)},${h} ${polyline} ${x(pts.length - 1)},${h}`;
  const weeks = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9", "W10", "W11", "W12"];
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ color: "#4b5090", fontSize: 10, letterSpacing: "0.1em" }}>WEEKLY FOCUS HOURS — 12 WEEKS</div>
        <div style={{ color: "#6ee7b7", fontSize: 11, fontFamily: "'DM Mono', monospace" }}>↑ 325%</div>
      </div>
      <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: "block" }}>
        <defs>
          <linearGradient id="dashAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 2, 4, 6].map(v => (
          <line key={v} x1="0" y1={y(v)} x2={w} y2={y(v)} stroke="#1a1c35" strokeWidth="1" />
        ))}
        <polygon points={area} fill="url(#dashAreaGrad)" />
        <polyline points={polyline} fill="none" stroke="#818cf8" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {pts.map((v, i) => (
          <circle key={i} cx={x(i)} cy={y(v)} r={i === pts.length - 1 ? 5 : 3}
            fill={i === pts.length - 1 ? "#818cf8" : "#6366f1"}
            stroke="#0a0b12" strokeWidth="2"
            style={{ cursor: "pointer" }}
          />
        ))}
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
        {weeks.map(w => (
          <span key={w} style={{ color: "#3a3d5c", fontSize: 8 }}>{w}</span>
        ))}
      </div>
    </div>
  );
}

// ─── Weekly Summary Bar Chart ──────────────────────────────────────────────────
function WeeklyBars() {
  const data = [
    { day: "Mon", hrs: 5.2, focused: 4.1 },
    { day: "Tue", hrs: 3.8, focused: 1.4 },
    { day: "Wed", hrs: 6.1, focused: 5.3 },
    { day: "Thu", hrs: 5.5, focused: 4.0 },
    { day: "Fri", hrs: 4.9, focused: 3.6 },
    { day: "Sat", hrs: 1.2, focused: 0.8 },
    { day: "Sun", hrs: 0.5, focused: 0.2 },
  ];
  const maxH = 7;
  return (
    <div>
      <div style={{ color: "#4b5090", fontSize: 10, letterSpacing: "0.1em", marginBottom: 14 }}>THIS WEEK — DAILY BREAKDOWN</div>
      <div style={{ display: "flex", gap: 8, alignItems: "flex-end", height: 100 }}>
        {data.map(d => (
          <div key={d.day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <span style={{ color: "#818cf8", fontSize: 9, fontFamily: "'DM Mono', monospace" }}>{d.focused.toFixed(1)}</span>
            <div style={{ width: "100%", position: "relative", height: `${(d.hrs / maxH) * 80}px` }}>
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                height: "100%", background: "rgba(99,102,241,0.15)", borderRadius: 4,
              }} />
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                height: `${(d.focused / d.hrs) * 100}%`,
                background: d.focused < 2 ? "rgba(248,113,113,0.6)" : "rgba(99,102,241,0.7)",
                borderRadius: 4,
              }} />
            </div>
            <span style={{ color: "#3a3d5c", fontSize: 9 }}>{d.day}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: "rgba(99,102,241,0.7)" }} />
          <span style={{ color: "#5a5e8a", fontSize: 9 }}>Focused</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: "rgba(99,102,241,0.15)" }} />
          <span style={{ color: "#5a5e8a", fontSize: 9 }}>Total at desk</span>
        </div>
      </div>
    </div>
  );
}

// ─── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, trend }: { label: string; value: string; sub: string; trend?: string }) {
  return (
    <div style={{
      background: "#0d0e18", border: "1px solid #1e2035", borderRadius: 14, padding: "20px",
    }}>
      <div style={{ color: "#4b5090", fontSize: 10, letterSpacing: "0.1em", marginBottom: 10 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <span style={{ color: "#e2e4f3", fontSize: 28, fontWeight: 700, fontFamily: "'DM Mono', monospace" }}>{value}</span>
        {trend && (
          <span style={{
            color: trend.startsWith("↑") ? "#6ee7b7" : "#f87171",
            fontSize: 12, fontFamily: "'DM Mono', monospace",
          }}>{trend}</span>
        )}
      </div>
      <div style={{ color: "#3a3d5c", fontSize: 11, marginTop: 4 }}>{sub}</div>
    </div>
  );
}

// ─── Dashboard ─────────────────────────────────────────────────────────────────
export function Dashboard({ userName, onLogout, onBack, hideHeader = false }: { userName: string; onLogout: () => void; onBack?: () => void; hideHeader?: boolean }) {
  const [activeTab, setActiveTab] = useState<"today" | "week" | "insights">("today");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const greeting = currentTime.getHours() < 12 ? "Good morning" : currentTime.getHours() < 17 ? "Good afternoon" : "Good evening";

  const tabs: { key: typeof activeTab; label: string }[] = [
    { key: "today", label: "Today" },
    { key: "week", label: "This Week" },
    { key: "insights", label: "AI Insights" },
  ];

  return (
    <div style={{
      background: "#080910",
      color: "#e2e4f3",
      fontFamily: "'Inter', system-ui, sans-serif",
      minHeight: "100vh",
    }}>
      {/* Top nav */}
      {!hideHeader && (
      <nav style={{
        padding: "16px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: "1px solid #1e2035",
        background: "rgba(8,9,16,0.95)",
        backdropFilter: "blur(12px)",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {onBack && (
            <button
              onClick={onBack}
              style={{
                background: "transparent", border: "1px solid #2a2c45",
                color: "#6b6f98", borderRadius: 8, padding: "6px 12px",
                fontSize: 12, cursor: "pointer", fontFamily: "'Inter', sans-serif",
                transition: "all 0.2s", display: "flex", alignItems: "center", gap: 6,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#818cf8"; e.currentTarget.style.color = "#e2e4f3"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a2c45"; e.currentTarget.style.color = "#6b6f98"; }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 3L5 7L9 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back
            </button>
          )}
          <div style={{
            width: 28, height: 28, borderRadius: 7,
            background: "linear-gradient(135deg, #6366f1, #818cf8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13,
          }}>◈</div>
          <Brand size={15} dimColor="#e2e4f3" accentColor="#818cf8" />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "linear-gradient(135deg, #6366f1, #818cf8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, color: "#fff", fontWeight: 600,
          }}>
            {userName.charAt(0).toUpperCase()}
          </div>
          <button
            onClick={onLogout}
            style={{
              background: "transparent", border: "1px solid #2a2c45",
              color: "#6b6f98", borderRadius: 8, padding: "6px 14px",
              fontSize: 12, cursor: "pointer", fontFamily: "'Inter', sans-serif",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#818cf8"; e.currentTarget.style.color = "#e2e4f3"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a2c45"; e.currentTarget.style.color = "#6b6f98"; }}
          >
            Log out
          </button>
        </div>
      </nav>
      )}

      {/* Main content */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px 80px" }}>
        {/* Greeting */}
        {!hideHeader && (
        <div style={{ marginBottom: 32 }}>
          <h1 style={{
            fontSize: 28, fontWeight: 700, color: "#e2e4f3",
            marginBottom: 4, lineHeight: 1.3,
          }}>
            {greeting}, {userName}.
          </h1>
          <p style={{ color: "#4b5090", fontSize: 13, fontFamily: "'DM Mono', monospace" }}>
            {currentTime.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            {" · "}
            {currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
        )}

        {/* Stat cards row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }} className="stats-grid">
          <StatCard label="TODAY" value="4.2h" sub="focused time" trend="↑ 18%" />
          <StatCard label="STREAK" value="6" sub="consecutive days" trend="↑ 2" />
          <StatCard label="BEST BLOCK" value="1:48" sub="deep work at 9:15am" />
          <StatCard label="WEEKLY AVG" value="4.8h" sub="per day this week" trend="↑ 32%" />
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 24, background: "#0a0b12", borderRadius: 10, padding: 4, border: "1px solid #1e2035" }}>
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              style={{
                flex: 1, padding: "10px 16px",
                borderRadius: 8, border: "none",
                background: activeTab === t.key ? "rgba(99,102,241,0.15)" : "transparent",
                color: activeTab === t.key ? "#818cf8" : "#4b5090",
                fontSize: 13, cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
                fontWeight: activeTab === t.key ? 600 : 400,
                transition: "all 0.2s",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "today" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="dashboard-grid">
            <div style={{ background: "#0d0e18", border: "1px solid #1e2035", borderRadius: 16, padding: "24px" }}>
              <DayTimeline />
            </div>
            <div style={{ background: "#0d0e18", border: "1px solid #1e2035", borderRadius: 16, padding: "24px" }}>
              <FocusHeatmap />
            </div>
            <div style={{ background: "#0d0e18", border: "1px solid #1e2035", borderRadius: 16, padding: "24px", gridColumn: "1 / -1" }}>
              <TrendChart />
            </div>
          </div>
        )}

        {activeTab === "week" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="dashboard-grid">
            <div style={{ background: "#0d0e18", border: "1px solid #1e2035", borderRadius: 16, padding: "24px" }}>
              <WeeklyBars />
            </div>
            <div style={{ background: "#0d0e18", border: "1px solid #1e2035", borderRadius: 16, padding: "24px" }}>
              <FocusHeatmap />
            </div>
            <div style={{ background: "#0d0e18", border: "1px solid #1e2035", borderRadius: 16, padding: "24px", gridColumn: "1 / -1" }}>
              <TrendChart />
            </div>
          </div>
        )}

        {activeTab === "insights" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="dashboard-grid">
            <div style={{ background: "#0d0e18", border: "1px solid #1e2035", borderRadius: 16, padding: "24px", gridColumn: "1 / -1" }}>
              <AIInsights />
            </div>
            <div style={{ background: "#0d0e18", border: "1px solid #1e2035", borderRadius: 16, padding: "24px" }}>
              <FocusHeatmap />
            </div>
            <div style={{ background: "#0d0e18", border: "1px solid #1e2035", borderRadius: 16, padding: "24px" }}>
              <TrendChart />
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .dashboard-grid { grid-template-columns: 1fr !important; }
          .dashboard-grid > div { grid-column: auto !important; }
        }
      `}</style>
    </div>
  );
}
