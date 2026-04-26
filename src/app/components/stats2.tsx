import { useState, useEffect, ReactNode } from "react";

function Brand({ size = 15, dimColor = "#e2e4f3", accentColor = "#818cf8" }: { size?: number; dimColor?: string; accentColor?: string }) {
  return (
    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: size }}>
      <span style={{ color: dimColor }}>Adhd</span><span style={{ color: accentColor }}>HD</span>
    </span>
  );
}

// ─── Existing-style: Day Timeline, Heatmap, Trend, Weekly, AI, StatCard ────────
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
            height: "100%", background: b.color, borderRadius: 3, opacity: 0.9,
          }} />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {hours.map(h => <span key={h} style={{ color: "#3a3d5c", fontSize: 9 }}>{h}</span>)}
      </div>
    </div>
  );
}

function FocusHeatmap() {
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
    <div>
      <div style={{ color: "#4b5090", fontSize: 10, letterSpacing: "0.1em", marginBottom: 14 }}>PEAK FOCUS — TIME × DAY</div>
      <div style={{ display: "flex", gap: 4 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 3, paddingTop: 14 }}>
          {slots.map(s => <div key={s} style={{ height: 14, color: "#2e3060", fontSize: 9, display: "flex", alignItems: "center" }}>{s}</div>)}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 3 }}>
            {days.map((d, i) => <span key={i} style={{ color: "#2e3060", fontSize: 9 }}>{d}</span>)}
          </div>
          {heat.map((row, ri) => (
            <div key={ri} style={{ display: "flex", gap: 3, marginBottom: 3 }}>
              {row.map((v, ci) => (
                <div key={ci} style={{
                  flex: 1, height: 14, borderRadius: 2, background: color(v),
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
          <linearGradient id="dash2AreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 2, 4, 6].map(v => (
          <line key={v} x1="0" y1={y(v)} x2={w} y2={y(v)} stroke="#1a1c35" strokeWidth="1" />
        ))}
        <polygon points={area} fill="url(#dash2AreaGrad)" />
        <polyline points={polyline} fill="none" stroke="#818cf8" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {pts.map((v, i) => (
          <circle key={i} cx={x(i)} cy={y(v)} r={i === pts.length - 1 ? 5 : 3}
            fill={i === pts.length - 1 ? "#818cf8" : "#6366f1"}
            stroke="#0a0b12" strokeWidth="2"
          />
        ))}
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
        {weeks.map(wk => <span key={wk} style={{ color: "#3a3d5c", fontSize: 8 }}>{wk}</span>)}
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, trend }: { label: string; value: string; sub: string; trend?: string }) {
  return (
    <div style={{ background: "#0d0e18", border: "1px solid #1e2035", borderRadius: 14, padding: "20px" }}>
      <div style={{ color: "#4b5090", fontSize: 10, letterSpacing: "0.1em", marginBottom: 10 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <span style={{ color: "#e2e4f3", fontSize: 28, fontWeight: 700, fontFamily: "'DM Mono', monospace" }}>{value}</span>
        {trend && (
          <span style={{ color: trend.startsWith("↑") ? "#6ee7b7" : "#f87171", fontSize: 12, fontFamily: "'DM Mono', monospace" }}>{trend}</span>
        )}
      </div>
      <div style={{ color: "#3a3d5c", fontSize: 11, marginTop: 4 }}>{sub}</div>
    </div>
  );
}

// ─── NEW: Data for range-aware charts ─────────────────────────────────────────
type DayRow = [string, string, string, string, number, number]; // [weekday, monthName, monthNum, day, hours, score]

const focusedHourRanges: Record<string, { score: string; copy: string; focusTotalScore: string; rhythmScore: string; days: DayRow[] }> = {
  "7": {
    score: "7-day score 78",
    copy: "Focused hours tracked each day. The left axis is hours, and each bar is labeled by weekday and date.",
    focusTotalScore: "7-day span score 58",
    rhythmScore: "7-day rhythm score 81",
    days: [
      ["W", "April", "4", "15", 2.5, 61],
      ["T", "", "4", "16", 4.9, 88],
      ["F", "", "4", "17", 4.3, 81],
      ["S", "", "4", "18", 0, 12],
      ["S", "", "4", "19", 1.9, 43],
      ["M", "", "4", "20", 3.6, 74],
      ["T", "", "4", "21", 4.1, 78],
    ],
  },
  "30": {
    score: "30-day score 74",
    copy: "Focused hours tracked across the last 30 trailing days. Recent mode, not a calendar month.",
    focusTotalScore: "30-day span score 56",
    rhythmScore: "30-day rhythm score 78",
    days: [
      ["M", "March", "3", "23", 0, 10], ["T", "", "3", "24", 3.2, 68], ["W", "", "3", "25", 4.8, 86], ["T", "", "3", "26", 2.1, 52],
      ["F", "", "3", "27", 3.9, 76], ["S", "", "3", "28", 5.1, 91], ["S", "", "3", "29", 0.8, 28], ["M", "", "3", "30", 0, 9],
      ["T", "", "3", "31", 3.5, 72], ["W", "April", "4", "1", 1.4, 39], ["T", "", "4", "2", 4.3, 81], ["F", "", "4", "3", 0.2, 18],
      ["S", "", "4", "4", 5.6, 94], ["S", "", "4", "5", 1.1, 32], ["M", "", "4", "6", 0, 11], ["T", "", "4", "7", 3.0, 65],
      ["W", "", "4", "8", 4.1, 79], ["T", "", "4", "9", 2.5, 57], ["F", "", "4", "10", 4.9, 88], ["S", "", "4", "11", 4.3, 82],
      ["S", "", "4", "12", 0, 12], ["M", "", "4", "13", 1.9, 43], ["T", "", "4", "14", 3.6, 74], ["W", "", "4", "15", 4.1, 78],
      ["T", "", "4", "16", 2.5, 61], ["F", "", "4", "17", 4.9, 88], ["S", "", "4", "18", 4.3, 81], ["S", "", "4", "19", 0.6, 24],
      ["M", "", "4", "20", 3.6, 74], ["T", "", "4", "21", 4.1, 78],
    ],
  },
  "2026-04": {
    score: "April score 74",
    copy: "Focused hours tracked across April 2026 so far. Calendar month, not a trailing window.",
    focusTotalScore: "April span score 58",
    rhythmScore: "April rhythm score 81",
    days: [
      ["W", "April", "4", "1", 1.4, 39], ["T", "", "4", "2", 4.3, 81], ["F", "", "4", "3", 0.2, 18],
      ["S", "", "4", "4", 5.6, 94], ["S", "", "4", "5", 1.1, 32], ["M", "", "4", "6", 0, 11], ["T", "", "4", "7", 3.0, 65],
      ["W", "", "4", "8", 4.1, 79], ["T", "", "4", "9", 2.5, 57], ["F", "", "4", "10", 4.9, 88], ["S", "", "4", "11", 4.3, 82],
      ["S", "", "4", "12", 0, 12], ["M", "", "4", "13", 1.9, 43], ["T", "", "4", "14", 3.6, 74], ["W", "", "4", "15", 4.1, 78],
      ["T", "", "4", "16", 2.5, 61], ["F", "", "4", "17", 4.9, 88], ["S", "", "4", "18", 4.3, 81], ["S", "", "4", "19", 0.6, 24],
      ["M", "", "4", "20", 3.6, 74], ["T", "", "4", "21", 4.1, 78],
    ],
  },
  "2026-03": {
    score: "March score 69",
    copy: "Focused hours tracked across March 2026. Monthly mode shows a full calendar month.",
    focusTotalScore: "March span score 54",
    rhythmScore: "March rhythm score 73",
    days: [
      ["S", "March", "3", "1", 0.4, 22], ["M", "", "3", "2", 2.8, 61], ["T", "", "3", "3", 4.6, 82], ["W", "", "3", "4", 3.1, 68],
      ["T", "", "3", "5", 4.9, 86], ["F", "", "3", "6", 0.7, 27], ["S", "", "3", "7", 0, 8], ["S", "", "3", "8", 1.6, 41],
      ["M", "", "3", "9", 3.9, 76], ["T", "", "3", "10", 2.2, 55], ["W", "", "3", "11", 4.8, 87], ["T", "", "3", "12", 3.4, 70],
      ["F", "", "3", "13", 0, 9], ["S", "", "3", "14", 2.4, 57], ["S", "", "3", "15", 3.7, 73], ["M", "", "3", "16", 4.2, 80],
      ["T", "", "3", "17", 1.3, 36], ["W", "", "3", "18", 0, 10], ["T", "", "3", "19", 4.5, 84], ["F", "", "3", "20", 3.0, 64],
      ["S", "", "3", "21", 0.6, 25], ["S", "", "3", "22", 0, 8], ["M", "", "3", "23", 0, 10], ["T", "", "3", "24", 3.2, 68],
      ["W", "", "3", "25", 4.8, 86], ["T", "", "3", "26", 2.1, 52], ["F", "", "3", "27", 3.9, 76], ["S", "", "3", "28", 5.1, 91],
      ["S", "", "3", "29", 0.8, 28], ["M", "", "3", "30", 0, 9], ["T", "", "3", "31", 3.5, 72],
    ],
  },
  "2026-02": {
    score: "February score 63",
    copy: "Focused hours tracked across February 2026. Previous months are calendar-month snapshots.",
    focusTotalScore: "February span score 49",
    rhythmScore: "February rhythm score 68",
    days: [
      ["S", "February", "2", "1", 0, 8], ["M", "", "2", "2", 1.9, 44], ["T", "", "2", "3", 2.7, 59], ["W", "", "2", "4", 0.5, 22],
      ["T", "", "2", "5", 3.8, 74], ["F", "", "2", "6", 4.2, 79], ["S", "", "2", "7", 0, 7], ["S", "", "2", "8", 1.1, 32],
      ["M", "", "2", "9", 2.9, 62], ["T", "", "2", "10", 0, 9], ["W", "", "2", "11", 4.4, 83], ["T", "", "2", "12", 3.1, 67],
      ["F", "", "2", "13", 2.0, 49], ["S", "", "2", "14", 0.6, 24], ["S", "", "2", "15", 0, 8], ["M", "", "2", "16", 3.6, 72],
      ["T", "", "2", "17", 1.8, 43], ["W", "", "2", "18", 4.1, 78], ["T", "", "2", "19", 0.9, 29], ["F", "", "2", "20", 3.3, 69],
      ["S", "", "2", "21", 0, 7], ["S", "", "2", "22", 0.4, 18], ["M", "", "2", "23", 2.6, 58], ["T", "", "2", "24", 4.0, 77],
      ["W", "", "2", "25", 3.2, 66], ["T", "", "2", "26", 1.2, 35], ["F", "", "2", "27", 4.5, 84], ["S", "", "2", "28", 0.8, 26],
    ],
  },
};

// ─── NEW: Today Session Timeline card ──────────────────────────────────────────
function TodaySessionTimeline() {
  const blocks = [
    { left: 7, width: 14 },
    { left: 27, width: 9 },
    { left: 45, width: 22 },
    { left: 76, width: 12 },
  ];
  const hours = ["8a", "10a", "12p", "2p", "4p", "6p"];
  return (
    <SectionCard
      title="Today: Session Timeline"
      badge="Today score 84"
      description="A zoomed-in view of the current day. Focus blocks are shown across the clock; gaps stay visible as gaps instead of being interpreted as breaks or drift."
    >
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap: 12, margin: "6px 0 18px",
      }} className="today-dimensions">
        {[
          { score: "88", label: "Total focused time", note: "65% of score. Today is strong on focused output volume." },
          { score: "82", label: "Sustained flow blocks", note: "25% of score. Longer blocks receive more credit than restarts." },
          { score: "64", label: "Time efficiency", note: "10% of score. Focus compared with the elapsed work window." },
        ].map(d => (
          <div key={d.label} style={{
            display: "grid", gap: 6, padding: 14,
            border: "1px solid rgba(129,140,248,0.16)",
            borderRadius: 14, background: "rgba(99,102,241,0.055)",
          }}>
            <div style={{ color: "#e2e4f3", fontSize: 22, fontWeight: 700, fontFamily: "'DM Mono', monospace", lineHeight: 1 }}>{d.score}</div>
            <div style={{ color: "#e2e4f3", fontSize: 11, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase" }}>{d.label}</div>
            <div style={{ color: "#6b6f98", fontSize: 11, lineHeight: 1.45 }}>{d.note}</div>
          </div>
        ))}
      </div>

      <div style={{
        background: "#0e0f1f",
        border: "1px solid rgba(99,102,241,0.16)",
        borderRadius: 12, padding: "18px 14px 12px",
      }}>
        <div style={{
          position: "relative", height: 48, borderRadius: 8, overflow: "hidden",
          background: `repeating-linear-gradient(90deg, rgba(8,9,16,0.34) 0, rgba(8,9,16,0.34) 1px, transparent 1px, transparent 12.5%), rgba(58,61,92,0.8)`,
        }}>
          {blocks.map((b, i) => (
            <div key={i} style={{
              position: "absolute", left: `${b.left}%`, width: `${b.width}%`,
              top: 10, height: 28, borderRadius: 7,
              background: "linear-gradient(90deg, #6366f1, #818cf8)",
              boxShadow: "0 0 18px rgba(129,140,248,0.24)",
            }} />
          ))}
          <div style={{
            position: "absolute", right: 10, top: 8,
            color: "rgba(157,160,200,0.28)",
            fontFamily: "'DM Mono', monospace",
            fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase",
          }}>gaps</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", color: "#3a3d5c", fontFamily: "'DM Mono', monospace", fontSize: 11, marginTop: 10 }}>
          {hours.map(h => <span key={h}>{h}</span>)}
        </div>
      </div>
    </SectionCard>
  );
}

// ─── NEW: Scoreboard ─────────────────────────────────────────────────────────
function Scoreboard() {
  const items = [
    { n: "71", label: "Yesterday", note: "Previous day score for quick context against today." },
    { n: "78", label: "Last 8 days", note: "Recent rolling score including today and the prior week." },
    { n: "74", label: "Last 30 days", note: "Longer recent score showing the broader focus baseline." },
  ];
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
      gap: 14, marginTop: 18,
    }} className="scoreboard-grid">
      {items.map(i => (
        <div key={i.label} style={{
          background: "rgba(13,14,24,0.82)",
          border: "1px solid rgba(99,102,241,0.22)",
          borderRadius: 16, padding: 18,
          display: "grid", gridTemplateColumns: "auto 1fr", gap: 14, alignItems: "center",
          minHeight: 132,
        }}>
          <div style={{
            width: 66, height: 66, borderRadius: 18,
            background: "linear-gradient(135deg, rgba(99,102,241,0.96), rgba(129,140,248,0.72))",
            display: "grid", placeItems: "center",
            color: "#fff", fontFamily: "'DM Mono', monospace",
            fontSize: 25, fontWeight: 600,
            boxShadow: "0 0 30px rgba(99,102,241,0.22)",
          }}>{i.n}</div>
          <div>
            <div style={{ color: "#e2e4f3", fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>{i.label}</div>
            <div style={{ color: "#6b6f98", fontSize: 13, lineHeight: 1.45 }}>{i.note}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Section card (new style, generous & clean) ───────────────────────────────
function SectionCard({ title, badge, description, children }: { title: string; badge?: string; description?: string; children: ReactNode }) {
  return (
    <article style={{
      background: "linear-gradient(180deg, rgba(13,14,24,0.96), rgba(10,11,18,0.96))",
      border: "1px solid #1e2035",
      borderRadius: 18,
      padding: 22,
      boxShadow: "0 24px 80px rgba(0,0,0,0.24)",
      overflow: "hidden",
      position: "relative",
    }}>
      <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between", gap: 16, marginBottom: 6 }}>
        <h2 style={{ margin: 0, fontSize: 18, letterSpacing: "-0.02em", color: "#e2e4f3" }}>{title}</h2>
        {badge && (
          <div style={{
            border: "1px solid rgba(129,140,248,0.28)",
            background: "rgba(99,102,241,0.1)",
            borderRadius: 999, color: "#fff",
            fontFamily: "'DM Mono', monospace",
            fontSize: 11, whiteSpace: "nowrap",
            padding: "6px 10px",
          }}>{badge}</div>
        )}
      </div>
      {description && (
        <p style={{ margin: "0 0 18px", color: "#6b6f98", lineHeight: 1.55, fontSize: 13 }}>{description}</p>
      )}
      {children}
    </article>
  );
}

// ─── NEW: Focused Hours Per Day chart ────────────────────────────────────────
function FocusedHoursPerDay({ viewKey }: { viewKey: string }) {
  const data = focusedHourRanges[viewKey];
  const days = data.days;
  const maxHours = 6;
  const dense = days.length > 7;

  // Build month divider segments
  const monthSegments: { start: number; span: number; name: string }[] = [];
  days.forEach((d, idx) => {
    if (d[1]) {
      const nextIdx = days.findIndex((n, i) => i > idx && n[1]);
      const span = (nextIdx === -1 ? days.length : nextIdx) - idx;
      monthSegments.push({ start: idx, span, name: d[1] });
    }
  });

  return (
    <SectionCard
      title="1. Focused Hours Per Day"
      badge={data.score}
      description={data.copy}
    >
      <div style={{
        display: "grid",
        gridTemplateColumns: "34px 1fr",
        gridTemplateRows: "188px auto",
        columnGap: 12, rowGap: 8,
      }}>
        {/* Y axis */}
        <div style={{
          gridColumn: 1, gridRow: 1,
          display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "end",
          color: "#9da0c8", fontFamily: "'DM Mono', monospace",
          fontSize: 12, fontWeight: 500, paddingBottom: 2,
        }}>
          <span>6h</span><span>4h</span><span>2h</span><span>0h</span>
        </div>
        {/* Plot */}
        <div style={{
          gridColumn: 2, gridRow: 1, position: "relative",
          display: "grid",
          gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))`,
          alignItems: "end",
          gap: dense ? 3 : 7,
          borderLeft: "1px solid rgba(255,255,255,0.04)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          padding: "0 0 0 8px",
          background: "linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px) 0 0 / 100% 25%",
        }}>
          {days.map((d, i) => {
            const hours = d[4];
            const zero = hours === 0;
            const height = Math.max(0, Math.min(100, (hours / maxHours) * 100));
            return (
              <div key={i} style={{ display: "grid", height: "100%", alignItems: "end", position: "relative" }}
                   title={`${d[2]}/${d[3]} · ${hours.toFixed(1)} focused hrs · Score ${d[5]}`}>
                <div style={{
                  width: "100%",
                  minHeight: 5,
                  height: zero ? 5 : `${height}%`,
                  borderRadius: "5px 5px 2px 2px",
                  background: zero ? "#1a1c35" : "linear-gradient(180deg, rgba(129,140,248,0.96), rgba(99,102,241,0.42))",
                  border: zero ? "1px solid rgba(255,255,255,0.03)" : "1px solid rgba(129,140,248,0.16)",
                }} />
              </div>
            );
          })}
        </div>
        {/* X axis */}
        <div style={{ gridColumn: 2, gridRow: 2, paddingLeft: 8, paddingBottom: 22 }}>
          {/* Weekday row */}
          <div style={{
            display: "grid",
            gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))`,
            columnGap: dense ? 3 : 7, marginTop: 8,
          }}>
            {days.map((d, i) => (
              <div key={i} style={{
                color: "#9da0c8", fontFamily: "'DM Mono', monospace",
                fontSize: dense ? 9 : 10, textAlign: "center", fontWeight: 500,
              }}>{d[0]}</div>
            ))}
          </div>
          {/* Date row */}
          <div style={{
            display: "grid",
            gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))`,
            columnGap: dense ? 3 : 7, marginTop: 5,
          }}>
            {days.map((d, i) => (
              <div key={i} style={{
                color: "#3a3d5c", fontFamily: "'DM Mono', monospace",
                fontSize: dense ? 9 : 10, textAlign: "center",
              }}>{d[3]}</div>
            ))}
          </div>
          {/* Month divider row */}
          <div style={{
            display: "grid",
            gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))`,
            columnGap: dense ? 3 : 7, marginTop: 9,
          }}>
            {monthSegments.map((m, i) => (
              <div key={i} style={{
                gridColumn: `${m.start + 1} / span ${m.span}`,
                color: "#6b6f98", fontFamily: "'DM Mono', monospace",
                fontSize: dense ? 9 : 10, textAlign: "left", whiteSpace: "nowrap",
              }}>| {m.name}</div>
            ))}
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

// ─── NEW: Focus / Total Duration (gap chart) ─────────────────────────────────
type GapSeg = { type: "focus" | "gap"; width: number; tone?: string };

const shortRun = (count: number, focusWidth = 2, gapWidth = 3): GapSeg[] =>
  Array.from({ length: count }, (_, idx) => ([
    { type: "focus", width: focusWidth, tone: idx % 3 === 0 ? "short" : "tiny" } as GapSeg,
    { type: "gap", width: gapWidth, tone: "heavy" } as GapSeg,
  ])).flat();

const gapDayStartHours: Record<string, number> = {
  Mon: 8.5, Tue: 8.75, Wed: 8.25, Thu: 8.5, Fri: 8.75, Sat: 10.0, Sun: 10.25,
};
const gapDayMaxFocusedHours = 6.2;

function formatClock(decimalHours: number) {
  const totalMinutes = Math.round(decimalHours * 60);
  const hours24 = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  const period = hours24 >= 12 ? "pm" : "am";
  let hours12 = hours24 % 12;
  if (hours12 === 0) hours12 = 12;
  return `${hours12}:${String(minutes).padStart(2, "0")}${period}`;
}

function summarizeGapRow(day: string, segments: GapSeg[]) {
  const focusWidth = segments.filter(s => s.type === "focus").reduce((s, seg) => s + seg.width, 0);
  const gapWidth = segments.filter(s => s.type === "gap").reduce((s, seg) => s + seg.width, 0);
  const hours = (focusWidth / 100) * gapDayMaxFocusedHours;
  const startHour = gapDayStartHours[day] ?? 8.5;
  const estimatedSpan = Math.max(hours + 0.75, hours + (gapWidth / 100) * 4.8 + 0.45);
  const endHour = Math.min(22, startHour + estimatedSpan);
  const spanHours = Math.max(0.5, endHour - startHour);
  const percent = Math.min(100, Math.round((hours / spanHours) * 100));
  return {
    hoursText: `${hours.toFixed(1)}h`,
    spanText: `${spanHours.toFixed(1)}h`,
    percentText: `${percent}%`,
    startText: formatClock(startHour),
    endText: formatClock(endHour),
  };
}

function GapChart({ badgeText }: { badgeText: string }) {
  const rows: { day: string; segments: GapSeg[] }[] = [
    { day: "Mon", segments: [{ type: "focus", width: 26, tone: "deep" }, { type: "gap", width: 4 }, { type: "focus", width: 4, tone: "tiny" }, { type: "gap", width: 4 }, { type: "focus", width: 7, tone: "short" }, { type: "gap", width: 5 }, { type: "focus", width: 24 }, { type: "gap", width: 7 }, { type: "focus", width: 6, tone: "short" }, { type: "gap", width: 4 }, { type: "focus", width: 9, tone: "short" }] },
    { day: "Tue", segments: [{ type: "focus", width: 4, tone: "short" }, { type: "gap", width: 3 }, { type: "focus", width: 5, tone: "short" }, { type: "gap", width: 4 }, { type: "focus", width: 22, tone: "deep" }, { type: "gap", width: 5 }, ...shortRun(4, 3, 3), { type: "focus", width: 13 }, { type: "gap", width: 5 }, { type: "focus", width: 7, tone: "short" }] },
    { day: "Wed", segments: [{ type: "focus", width: 31, tone: "deep" }, { type: "gap", width: 6 }, { type: "focus", width: 8, tone: "short" }, { type: "gap", width: 4 }, { type: "focus", width: 20 }, { type: "gap", width: 5 }, { type: "focus", width: 22, tone: "deep" }, { type: "gap", width: 2 }, { type: "focus", width: 2, tone: "tiny" }] },
    { day: "Thu", segments: [{ type: "focus", width: 18 }, { type: "gap", width: 5 }, ...shortRun(5, 2, 3), { type: "focus", width: 19, tone: "deep" }, { type: "gap", width: 6 }, { type: "focus", width: 4, tone: "short" }, { type: "gap", width: 5 }, { type: "focus", width: 8, tone: "short" }, { type: "gap", width: 6 }, { type: "focus", width: 4, tone: "short" }] },
    { day: "Fri", segments: [{ type: "focus", width: 23 }, { type: "gap", width: 4 }, { type: "focus", width: 6, tone: "short" }, { type: "gap", width: 4 }, { type: "focus", width: 30, tone: "deep" }, { type: "gap", width: 6 }, { type: "focus", width: 5, tone: "short" }, { type: "gap", width: 4 }, { type: "focus", width: 18 }] },
    { day: "Sat", segments: [...shortRun(5, 2, 3), { type: "focus", width: 28, tone: "deep" }, { type: "gap", width: 6 }, ...shortRun(4, 2, 3), { type: "focus", width: 15 }] },
    { day: "Sun", segments: [{ type: "focus", width: 20 }, { type: "gap", width: 4 }, ...shortRun(4, 2, 3), { type: "focus", width: 23, tone: "deep" }, { type: "gap", width: 6 }, { type: "focus", width: 5, tone: "short" }, { type: "gap", width: 5 }, { type: "focus", width: 10 }, { type: "gap", width: 4 }, { type: "focus", width: 7, tone: "short" }] },
  ];

  return (
    <SectionCard
      title="2. Focus / Total Duration"
      badge={badgeText}
      description="Hours-first view: the same timeline shape is preserved, but the metric stack emphasizes completed focus hours first, then total span and focus percentage."
    >
      <div style={{ display: "grid", gap: 9, marginTop: 4 }}>
        {rows.map(row => {
          const sum = summarizeGapRow(row.day, row.segments);
          return (
            <div key={row.day} style={{
              display: "grid",
              gridTemplateColumns: "34px minmax(0, 1fr) 148px",
              gap: 12, alignItems: "center",
              color: "#9da0c8", fontFamily: "'DM Mono', monospace", fontSize: 10,
            }} className="gap-row">
              <span>{row.day}</span>
              <div style={{
                display: "grid",
                gridTemplateColumns: "46px minmax(0, 1fr) 46px",
                gap: 8, alignItems: "center", minWidth: 0,
              }}>
                <span style={{ color: "#3a3d5c", fontSize: 9, textAlign: "center", whiteSpace: "nowrap" }}>{sum.startText}</span>
                <div style={{
                  display: "flex", height: 14, overflow: "hidden",
                  borderRadius: 999, background: "#1a1c35",
                }} title={`${sum.startText} – ${sum.endText} · ${sum.hoursText} of ${sum.spanText} (${sum.percentText})`}>
                  {row.segments.map((seg, si) => (
                    <i key={si} style={{
                      width: `${seg.width}%`, display: "block",
                      background: seg.type === "gap"
                        ? "rgba(58,61,92,0.8)"
                        : "linear-gradient(90deg, #6366f1, #818cf8)",
                      boxShadow: seg.tone === "deep" ? "inset 0 0 0 1px rgba(255,255,255,0.08)" : "none",
                    }} />
                  ))}
                </div>
                <span style={{ color: "#3a3d5c", fontSize: 9, textAlign: "center", whiteSpace: "nowrap" }}>{sum.endText}</span>
              </div>
              <div style={{
                display: "grid", gridTemplateColumns: "minmax(0,1fr) auto",
                gap: 8, alignItems: "center", justifyItems: "end", width: "100%",
              }}>
                <span style={{ whiteSpace: "nowrap" }}>
                  <span style={{ color: "#818cf8" }}>{sum.hoursText}</span>
                  <span style={{ color: "#3a3d5c" }}> / </span>
                  <span style={{ color: "rgba(90,93,122,0.98)" }}>{sum.spanText}</span>
                </span>
                <span style={{
                  color: "#818cf8", border: "1px solid rgba(129,140,248,0.24)",
                  background: "rgba(99,102,241,0.12)",
                  borderRadius: 999, fontSize: 10, lineHeight: 1,
                  padding: "5px 8px", whiteSpace: "nowrap",
                }}>{sum.percentText}</span>
              </div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}

// ─── NEW: Time-of-Day Rhythm Options ─────────────────────────────────────────
function RhythmOptions({ badgeText }: { badgeText: string }) {
  const timeAxis = (items: string[]) => (
    <div style={{
      display: "flex", justifyContent: "space-between",
      color: "#3a3d5c", fontFamily: "'DM Mono', monospace", fontSize: 9,
    }}>
      {items.map(x => <span key={x}>{x}</span>)}
    </div>
  );

  const strips: { label: string; bg: string }[] = [
    { label: "Mon", bg: "linear-gradient(90deg, rgba(99,102,241,0.16) 0% 8%, rgba(99,102,241,0.54) 8% 18%, rgba(129,140,248,0.92) 18% 30%, rgba(99,102,241,0.48) 30% 39%, rgba(99,102,241,0.18) 39% 48%, rgba(99,102,241,0.34) 48% 61%, rgba(99,102,241,0.22) 61% 70%, #1a1c35 70% 100%)" },
    { label: "Tue", bg: "linear-gradient(90deg, rgba(99,102,241,0.12) 0% 9%, rgba(99,102,241,0.42) 9% 20%, rgba(99,102,241,0.66) 20% 31%, rgba(129,140,248,0.9) 31% 42%, rgba(99,102,241,0.28) 42% 53%, rgba(99,102,241,0.46) 53% 65%, rgba(99,102,241,0.16) 65% 76%, #1a1c35 76% 100%)" },
    { label: "Wed", bg: "linear-gradient(90deg, rgba(99,102,241,0.42) 0% 10%, rgba(129,140,248,0.86) 10% 26%, rgba(129,140,248,0.94) 26% 38%, rgba(99,102,241,0.54) 38% 48%, rgba(99,102,241,0.2) 48% 58%, rgba(99,102,241,0.34) 58% 70%, rgba(99,102,241,0.16) 70% 78%, #1a1c35 78% 100%)" },
    { label: "Thu", bg: "linear-gradient(90deg, rgba(99,102,241,0.2) 0% 10%, rgba(99,102,241,0.6) 10% 24%, rgba(99,102,241,0.68) 24% 36%, rgba(99,102,241,0.32) 36% 47%, rgba(99,102,241,0.18) 47% 56%, rgba(99,102,241,0.46) 56% 68%, rgba(99,102,241,0.2) 68% 78%, #1a1c35 78% 100%)" },
    { label: "Fri", bg: "linear-gradient(90deg, rgba(99,102,241,0.48) 0% 10%, rgba(129,140,248,0.88) 10% 28%, rgba(129,140,248,0.82) 28% 38%, rgba(99,102,241,0.42) 38% 50%, rgba(99,102,241,0.34) 50% 62%, rgba(99,102,241,0.16) 62% 70%, #1a1c35 70% 100%)" },
  ];

  const hourProfile = [42, 70, 92, 64, 24, 38, 54, 22, 12, 8, 4, 2, 6];

  return (
    <SectionCard
      title="3. Time-of-Day Rhythm Options"
      badge={badgeText}
      description="Three alternatives for showing when focus tends to happen across the day. Each option spans 8am to 8pm so the full workday shape is visible."
    >
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap: 14,
      }} className="rhythm-options">
        {/* Daypart */}
        <div style={{
          display: "grid", gap: 14, minHeight: 238, padding: 16,
          border: "1px solid rgba(129,140,248,0.16)",
          borderRadius: 16, background: "rgba(8,9,16,0.28)",
        }}>
          <div>
            <div style={{
              display: "flex", justifyContent: "space-between", gap: 12,
              color: "#e2e4f3", fontSize: 12, fontWeight: 800,
              letterSpacing: "0.06em", textTransform: "uppercase",
            }}>
              <span>Daypart Map</span><span>Best for story</span>
            </div>
            <div style={{ color: "#6b6f98", fontSize: 11, lineHeight: 1.45, marginTop: 8 }}>
              Groups the day into morning, afternoon, and evening so the strongest focus window is obvious.
            </div>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1.4fr 1fr",
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.04)",
            borderRadius: 14, minHeight: 96,
            background: "#0e0f1f",
          }}>
            {[
              { pct: "58%", label: "Morning", time: "8am-12pm", bg: "linear-gradient(180deg, rgba(99,102,241,0.42), rgba(99,102,241,0.1))" },
              { pct: "34%", label: "Afternoon", time: "12pm-5pm", bg: "linear-gradient(180deg, rgba(99,102,241,0.22), rgba(99,102,241,0.06))" },
              { pct: "8%", label: "Evening", time: "5pm-8pm", bg: "rgba(99,102,241,0.055)" },
            ].map((d, i) => (
              <div key={d.label} style={{
                display: "grid", alignContent: "end", gap: 7,
                padding: 12, borderRight: i < 2 ? "1px solid rgba(255,255,255,0.045)" : "none",
                color: "#9da0c8", fontSize: 11, background: d.bg,
              }}>
                <strong style={{ color: "#e2e4f3", fontFamily: "'DM Mono', monospace", fontSize: 16 }}>{d.pct}</strong>
                <span>{d.label}<br />{d.time}</span>
              </div>
            ))}
          </div>
          {timeAxis(["8am", "12pm", "5pm", "8pm"])}
        </div>

        {/* Hourly Profile */}
        <div style={{
          display: "grid", gap: 14, minHeight: 238, padding: 16,
          border: "1px solid rgba(129,140,248,0.16)",
          borderRadius: 16, background: "rgba(8,9,16,0.28)",
        }}>
          <div>
            <div style={{
              display: "flex", justifyContent: "space-between", gap: 12,
              color: "#e2e4f3", fontSize: 12, fontWeight: 800,
              letterSpacing: "0.06em", textTransform: "uppercase",
            }}>
              <span>Hourly Profile</span><span>Best for precision</span>
            </div>
            <div style={{ color: "#6b6f98", fontSize: 11, lineHeight: 1.45, marginTop: 8 }}>
              Shows focused minutes by hour. The peak around 10am is readable without a dense heatmap.
            </div>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(13, minmax(0, 1fr))",
            gap: 4, alignItems: "end", height: 112,
            padding: "10px 0 0",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}>
            {hourProfile.map((h, i) => (
              <div key={i} style={{
                height: `${h}%`, minHeight: 4,
                borderRadius: "6px 6px 2px 2px",
                background: h < 25
                  ? "rgba(99,102,241,0.18)"
                  : "linear-gradient(180deg, rgba(129,140,248,0.95), rgba(99,102,241,0.34))",
              }} />
            ))}
          </div>
          {timeAxis(["8a", "10a", "12p", "2p", "4p", "6p", "8p"])}
        </div>

        {/* Weekday Flow */}
        <div style={{
          display: "grid", gap: 14, minHeight: 238, padding: 16,
          border: "1px solid rgba(129,140,248,0.16)",
          borderRadius: 16, background: "rgba(8,9,16,0.28)",
        }}>
          <div>
            <div style={{
              display: "flex", justifyContent: "space-between", gap: 12,
              color: "#e2e4f3", fontSize: 12, fontWeight: 800,
              letterSpacing: "0.06em", textTransform: "uppercase",
            }}>
              <span>Weekday Flow</span><span>Best for pattern</span>
            </div>
            <div style={{ color: "#6b6f98", fontSize: 11, lineHeight: 1.45, marginTop: 8 }}>
              Continuous 8am–8pm lines. Brighter stretches mean more focused work; fully dark stretches mean no tracked focus.
            </div>
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            {strips.map(s => (
              <div key={s.label} style={{
                display: "grid", gridTemplateColumns: "28px 1fr",
                gap: 10, alignItems: "center",
                color: "#9da0c8", fontFamily: "'DM Mono', monospace", fontSize: 10,
              }}>
                <span>{s.label}</span>
                <div style={{ height: 12, borderRadius: 999, background: s.bg }} />
              </div>
            ))}
          </div>
          {timeAxis(["8a", "10a", "12p", "2p", "4p", "6p", "8p"])}
        </div>
      </div>
    </SectionCard>
  );
}

// ─── NEW: Range control (Recent vs By month + select) ─────────────────────────
function RangeControl({
  mode, setMode, detail, setDetail,
}: {
  mode: "recent" | "month";
  setMode: (m: "recent" | "month") => void;
  detail: string;
  setDetail: (d: string) => void;
}) {
  const options = mode === "recent"
    ? [["7", "Last 7 days"], ["30", "Last 30 days"]]
    : [["2026-04", "April 2026"], ["2026-03", "March 2026"], ["2026-02", "February 2026"]];

  return (
    <div style={{
      display: "grid", gap: 14, marginTop: 22,
      padding: "4px 4px 18px",
      borderBottom: "1px solid rgba(129,140,248,0.16)",
    }}>
      <div style={{ display: "grid", gap: 14, alignItems: "start", justifyItems: "start" }}>
        <div style={{ display: "grid", gap: 4, minWidth: "min(100%, 420px)" }}>
          <div style={{
            color: "#fff", fontSize: 11, fontWeight: 700,
            letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap",
          }}>Your focus view</div>
          <div style={{ color: "#6b6f98", fontSize: 11, lineHeight: 1.45, maxWidth: 460, minHeight: 32 }}>
            {mode === "recent"
              ? "Recent shows your latest focus pattern. Choose the last 7 or 30 days."
              : "By month shows your focus pattern for a calendar month. April 2026 is selected by default."}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <div style={{
            display: "inline-flex", alignItems: "center",
            border: "1px solid rgba(129,140,248,0.22)",
            background: "rgba(10,11,18,0.72)",
            borderRadius: 999, padding: 3, gap: 2,
          }}>
            {(["recent", "month"] as const).map(m => {
              const active = mode === m;
              return (
                <button key={m} type="button"
                  onClick={() => {
                    setMode(m);
                    setDetail(m === "recent" ? "7" : "2026-04");
                  }}
                  style={{
                    borderRadius: 999, padding: "5px 9px",
                    color: active ? "#fff" : "#6b6f98",
                    fontSize: 10, fontWeight: 700,
                    letterSpacing: "0.08em", textTransform: "uppercase",
                    whiteSpace: "nowrap", cursor: "pointer",
                    border: 0,
                    background: active
                      ? "linear-gradient(135deg, rgba(99,102,241,0.92), rgba(129,140,248,0.82))"
                      : "transparent",
                    boxShadow: active ? "inset 0 0 0 1px rgba(255,255,255,0.06)" : "none",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {m === "recent" ? "Recent" : "By month"}
                </button>
              );
            })}
          </div>
          <select
            value={detail}
            onChange={e => setDetail(e.target.value)}
            style={{
              appearance: "none",
              border: "1px solid rgba(129,140,248,0.24)",
              borderRadius: 999,
              background: "linear-gradient(135deg, rgba(99,102,241,0.14), rgba(10,11,18,0.86))",
              color: "#e2e4f3", fontFamily: "inherit",
              fontSize: 10, fontWeight: 700,
              letterSpacing: "0.08em", textTransform: "uppercase",
              padding: "8px 28px 8px 11px", minWidth: 130,
              cursor: "pointer",
            }}
          >
            {options.map(([v, l]) => (
              <option key={v} value={v} style={{ background: "#0d0e18", color: "#e2e4f3" }}>{l}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

// ─── Stats2 Page ──────────────────────────────────────────────────────────────
export function Stats2({ userName, onLogout, onBack }: { userName: string; onLogout: () => void; onBack?: () => void }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mode, setMode] = useState<"recent" | "month">("recent");
  const [detail, setDetail] = useState<string>("7");

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const greeting = currentTime.getHours() < 12 ? "Good morning" : currentTime.getHours() < 17 ? "Good afternoon" : "Good evening";
  const currentData = focusedHourRanges[detail];

  return (
    <div style={{
      background: `
        radial-gradient(circle at 75% 5%, rgba(99,102,241,0.12), transparent 32rem),
        radial-gradient(circle at 15% 35%, rgba(34,211,238,0.06), transparent 28rem),
        #080910`,
      color: "#e2e4f3",
      fontFamily: "'Inter', system-ui, sans-serif",
      minHeight: "100vh",
    }}>
      {/* Top nav */}
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
            <button onClick={onBack} style={{
              background: "transparent", border: "1px solid #2a2c45",
              color: "#6b6f98", borderRadius: 8, padding: "6px 12px",
              fontSize: 12, cursor: "pointer", fontFamily: "'Inter', sans-serif",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 3L5 7L9 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back
            </button>
          )}
          <div style={{
            width: 28, height: 28, borderRadius: 7,
            background: "linear-gradient(135deg, #6366f1, #818cf8)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13,
          }}>◈</div>
          <Brand size={15} />
          <span style={{
            color: "#4b5090", fontSize: 11, fontFamily: "'DM Mono', monospace",
            borderLeft: "1px solid #1e2035", paddingLeft: 12, marginLeft: 4,
          }}>stats · v2</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "linear-gradient(135deg, #6366f1, #818cf8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, color: "#fff", fontWeight: 600,
          }}>{userName.charAt(0).toUpperCase()}</div>
          <button onClick={onLogout} style={{
            background: "transparent", border: "1px solid #2a2c45",
            color: "#6b6f98", borderRadius: 8, padding: "6px 14px",
            fontSize: 12, cursor: "pointer", fontFamily: "'Inter', sans-serif",
          }}>Log out</button>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px 80px" }}>
        {/* Greeting */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{
            fontSize: 28, fontWeight: 700, color: "#e2e4f3",
            marginBottom: 4, lineHeight: 1.3,
          }}>
            {greeting}, {userName}.
          </h1>
          <p style={{ color: "#4b5090", fontSize: 13, fontFamily: "'DM Mono', monospace", marginBottom: 10 }}>
            {currentTime.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            {" · "}
            {currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
          </p>
          <p style={{ color: "#8b8fb8", fontSize: 15, lineHeight: 1.6, margin: 0 }}>
            Here is a high definition look at your productivity.
          </p>
        </div>

        {/* Original stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 20 }} className="stats-grid">
          <StatCard label="TODAY" value="4.2h" sub="focused time" trend="↑ 18%" />
          <StatCard label="STREAK" value="6" sub="consecutive days" trend="↑ 2" />
          <StatCard label="BEST BLOCK" value="1:48" sub="deep work at 9:15am" />
          <StatCard label="WEEKLY AVG" value="4.8h" sub="per day this week" trend="↑ 32%" />
        </div>

        {/* Original charts — kept above the new section */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 32 }} className="dashboard-grid">
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

        {/* ── NEW SECTION: Usage-behavior charts ── */}
        <div style={{ marginTop: 40, display: "grid", gap: 24 }}>
          <TodaySessionTimeline />
          <Scoreboard />

          {/* Dashboard shell with range controls */}
          <div style={{
            marginTop: 8, padding: 18,
            border: "1px solid rgba(129,140,248,0.18)",
            borderRadius: 24,
            background: `
              linear-gradient(180deg, rgba(99,102,241,0.045), rgba(10,11,18,0.12)),
              rgba(8,9,16,0.18)`,
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.025)",
            display: "grid", gap: 18,
          }}>
            <RangeControl mode={mode} setMode={setMode} detail={detail} setDetail={setDetail} />
            <FocusedHoursPerDay viewKey={detail} />
            <GapChart badgeText={currentData.focusTotalScore} />
            <RhythmOptions badgeText={currentData.rhythmScore} />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 820px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .dashboard-grid { grid-template-columns: 1fr !important; }
          .dashboard-grid > div { grid-column: auto !important; }
          .scoreboard-grid { grid-template-columns: 1fr !important; }
          .today-dimensions { grid-template-columns: 1fr !important; }
          .rhythm-options { grid-template-columns: 1fr !important; }
          .gap-row { grid-template-columns: 28px minmax(0,1fr) !important; }
          .gap-row > :last-child { grid-column: 1 / -1 !important; }
        }
      `}</style>
    </div>
  );
}
