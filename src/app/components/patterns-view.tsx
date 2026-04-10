import { useState, useMemo } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface Session {
  start: Date;
  end: Date;
}

interface DayData {
  date: Date;
  sessions: Session[];
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
function dur(s: Session): number {
  return Math.round((s.end.getTime() - s.start.getTime()) / 1000);
}

function totalSec(sessions: Session[]): number {
  return sessions.reduce((sum, s) => sum + dur(s), 0);
}

function fmtH(seconds: number): string {
  const h = seconds / 3600;
  return h < 0.05 ? "0h" : `${h.toFixed(1)}h`;
}

function sameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

// ─── Mock Data (same generator as tracker) ─────────────────────────────────────
function generateMockData(): DayData[] {
  const today = new Date(2026, 2, 14);
  const days: DayData[] = [];
  const seed = (n: number) => {
    let x = Math.sin(n * 9301 + 49297) * 49297;
    return x - Math.floor(x);
  };

  for (let i = 0; i < 45; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    let sessions: Session[] = [];
    if (i === 0) {
      sessions = [
        { start: new Date(2026, 2, 14, 9, 15, 0), end: new Date(2026, 2, 14, 10, 42, 0) },
        { start: new Date(2026, 2, 14, 11, 3, 0), end: new Date(2026, 2, 14, 11, 48, 0) },
        { start: new Date(2026, 2, 14, 14, 10, 0), end: new Date(2026, 2, 14, 15, 35, 0) },
      ];
    } else if (i === 1) {
      sessions = [
        { start: new Date(2026, 2, 13, 8, 30, 0), end: new Date(2026, 2, 13, 10, 15, 0) },
        { start: new Date(2026, 2, 13, 10, 45, 0), end: new Date(2026, 2, 13, 12, 30, 0) },
        { start: new Date(2026, 2, 13, 14, 0, 0), end: new Date(2026, 2, 13, 16, 20, 0) },
      ];
    } else if (i === 2) {
      sessions = [
        { start: new Date(2026, 2, 12, 21, 1, 0), end: new Date(2026, 2, 12, 21, 1, 3) },
        { start: new Date(2026, 2, 12, 21, 1, 10), end: new Date(2026, 2, 12, 21, 1, 37) },
        { start: new Date(2026, 2, 12, 21, 3, 0), end: new Date(2026, 2, 12, 21, 3, 6) },
        { start: new Date(2026, 2, 12, 23, 44, 0), end: new Date(2026, 2, 12, 23, 53, 46) },
      ];
    } else if (i === 3) {
      sessions = [
        { start: new Date(2026, 2, 11, 9, 0, 0), end: new Date(2026, 2, 11, 11, 30, 0) },
        { start: new Date(2026, 2, 11, 13, 15, 0), end: new Date(2026, 2, 11, 14, 45, 0) },
      ];
    } else if (i === 4) {
      sessions = [
        { start: new Date(2026, 2, 10, 10, 0, 0), end: new Date(2026, 2, 10, 12, 0, 0) },
        { start: new Date(2026, 2, 10, 14, 30, 0), end: new Date(2026, 2, 10, 16, 0, 0) },
        { start: new Date(2026, 2, 10, 17, 0, 0), end: new Date(2026, 2, 10, 17, 45, 0) },
      ];
    } else if (i === 5) {
      sessions = [];
    } else if (i === 6) {
      sessions = [{ start: new Date(2026, 2, 8, 10, 30, 0), end: new Date(2026, 2, 8, 11, 15, 0) }];
    } else {
      const r = seed(i);
      if (r < 0.15) {
        sessions = [];
      } else {
        const count = Math.floor(seed(i + 100) * 3) + 1;
        let hour = 8 + Math.floor(seed(i + 200) * 3);
        for (let j = 0; j < count; j++) {
          const startMin = Math.floor(seed(i * 10 + j) * 30);
          const durMin = 25 + Math.floor(seed(i * 10 + j + 50) * 90);
          const sDate = new Date(d.getFullYear(), d.getMonth(), d.getDate(), hour, startMin);
          const eDate = new Date(sDate.getTime() + durMin * 60000);
          sessions.push({ start: sDate, end: eDate });
          hour = eDate.getHours() + 1 + Math.floor(seed(i * 10 + j + 99) * 2);
          if (hour >= 20) break;
        }
      }
    }
    days.push({ date: d, sessions });
  }
  return days;
}

// Goal per day — slight variation over time
function goalForDay(date: Date): number {
  const base = 4; // 4 hours
  // Weekends have lower goal
  const dow = date.getDay();
  if (dow === 0 || dow === 6) return 2;
  return base;
}

// ─── Brand ─────────────────────────────────────────────────────────────────────
function Brand({ size = 15 }: { size?: number }) {
  return (
    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: size }}>
      <span style={{ color: "#e2e4f3" }}>Adhd</span>
      <span style={{ color: "#818cf8" }}>HD</span>
    </span>
  );
}

// ─── 1. Daily Timeline ─────────────────────────────────────────────────────────
function DailyTimeline({ day }: { day: DayData }) {
  const startHour = 6;
  const endHour = 24;
  const totalHours = endHour - startHour;
  const sessions = day.sessions;
  const total = totalSec(sessions);
  const dateStr = day.date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });

  const hourMarks = [];
  for (let h = startHour; h <= endHour; h += 2) {
    hourMarks.push(h);
  }

  return (
    <div className="pat-card">
      <div className="pat-card-header">
        <span className="pat-card-label">DAILY TIMELINE</span>
        <span className="pat-card-sub">{dateStr} · {fmtH(total)}</span>
      </div>
      {sessions.length === 0 ? (
        <div className="pat-empty">No sessions tracked.</div>
      ) : (
        <div className="pat-timeline">
          {/* Hour labels */}
          <div className="pat-tl-labels">
            {hourMarks.map((h) => (
              <span key={h} style={{ left: `${((h - startHour) / totalHours) * 100}%` }}>
                {h === 12 ? "12p" : h < 12 ? `${h}a` : h === 24 ? "12a" : `${h - 12}p`}
              </span>
            ))}
          </div>
          {/* Track */}
          <div className="pat-tl-track">
            {/* Hour gridlines */}
            {hourMarks.map((h) => (
              <div key={h} className="pat-tl-grid" style={{ left: `${((h - startHour) / totalHours) * 100}%` }} />
            ))}
            {/* Session blocks */}
            {sessions.map((s, i) => {
              const sH = s.start.getHours() + s.start.getMinutes() / 60;
              const eH = s.end.getHours() + s.end.getMinutes() / 60;
              const left = Math.max(0, ((sH - startHour) / totalHours) * 100);
              const width = Math.max(0.3, ((eH - sH) / totalHours) * 100);
              return (
                <div
                  key={i}
                  className="pat-tl-block"
                  style={{ left: `${left}%`, width: `${width}%` }}
                  title={`${s.start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })} — ${s.end.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 2. Recent Days Bar Chart ──────────────────────────────────────────────────
function RecentDaysChart({ days }: { days: DayData[] }) {
  const recent = days.slice(0, 14).reverse();
  const today = days[0]?.date;
  const maxSec = Math.max(...recent.map((d) => totalSec(d.sessions)), 1);
  const maxH = Math.max(Math.ceil(maxSec / 3600), 1);

  return (
    <div className="pat-card">
      <div className="pat-card-header">
        <span className="pat-card-label">LAST 14 DAYS</span>
        <span className="pat-card-sub">focused hours per day</span>
      </div>
      <div className="pat-bars-container">
        {/* Y-axis labels */}
        <div className="pat-bars-yaxis">
          {[maxH, Math.round(maxH / 2), 0].map((v) => (
            <span key={v}>{v}h</span>
          ))}
        </div>
        <div className="pat-bars-area">
          {/* Grid lines */}
          <div className="pat-bars-gridline" style={{ bottom: "100%" }} />
          <div className="pat-bars-gridline" style={{ bottom: "50%" }} />
          <div className="pat-bars-gridline" style={{ bottom: "0%" }} />

          {recent.map((d, i) => {
            const sec = totalSec(d.sessions);
            const pct = (sec / (maxH * 3600)) * 100;
            const isToday = sameDay(d.date, today);
            const goal = goalForDay(d.date);
            const hitGoal = sec >= goal * 3600;
            const dayLabel = d.date.toLocaleDateString("en-US", { weekday: "narrow" });
            const dateNum = d.date.getDate();

            return (
              <div key={i} className="pat-bar-col">
                <div className="pat-bar-track">
                  {/* Goal marker line */}
                  <div
                    className="pat-bar-goal"
                    style={{ bottom: `${(goal / maxH) * 100}%` }}
                  />
                  <div
                    className={`pat-bar-fill ${isToday ? "today" : ""} ${hitGoal ? "hit" : ""}`}
                    style={{ height: `${Math.max(pct, sec > 0 ? 2 : 0)}%` }}
                  />
                </div>
                <span className={`pat-bar-day ${isToday ? "today" : ""}`}>
                  {dayLabel}
                </span>
                <span className="pat-bar-date">{dateNum}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="pat-legend-row">
        <span className="pat-legend-item">
          <span className="pat-legend-swatch goal" />
          daily goal
        </span>
        <span className="pat-legend-item">
          <span className="pat-legend-swatch hit" />
          goal met
        </span>
        <span className="pat-legend-item">
          <span className="pat-legend-swatch miss" />
          below goal
        </span>
      </div>
    </div>
  );
}

// ─── 3. Time-of-Day Heatmap ────────────────────────────────────────────────────
function TimeHeatmap({ days }: { days: DayData[] }) {
  const recent = days.slice(0, 28);
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = Array.from({ length: 16 }, (_, i) => i + 6); // 6am to 9pm

  // Build heatmap: [dayOfWeek][hour] = total minutes
  const heatmap: number[][] = Array.from({ length: 7 }, () => Array(16).fill(0));

  recent.forEach((d) => {
    const dow = (d.date.getDay() + 6) % 7; // Mon=0
    d.sessions.forEach((s) => {
      const sH = s.start.getHours();
      const eH = s.end.getHours() + (s.end.getMinutes() > 0 ? 1 : 0);
      for (let h = sH; h < eH; h++) {
        const idx = h - 6;
        if (idx >= 0 && idx < 16) {
          // Approximate: distribute session minutes into hour buckets
          const overlapStart = Math.max(s.start.getTime(), new Date(s.start.getFullYear(), s.start.getMonth(), s.start.getDate(), h).getTime());
          const overlapEnd = Math.min(s.end.getTime(), new Date(s.start.getFullYear(), s.start.getMonth(), s.start.getDate(), h + 1).getTime());
          const mins = Math.max(0, (overlapEnd - overlapStart) / 60000);
          heatmap[dow][idx] += mins;
        }
      }
    });
  });

  const maxVal = Math.max(...heatmap.flat(), 1);

  const color = (v: number): string => {
    if (v === 0) return "#0e0f1a";
    const intensity = v / maxVal;
    if (intensity < 0.2) return "#1a1c35";
    if (intensity < 0.4) return "#2e2a6e";
    if (intensity < 0.6) return "#4338ca";
    if (intensity < 0.8) return "#6366f1";
    return "#818cf8";
  };

  return (
    <div className="pat-card">
      <div className="pat-card-header">
        <span className="pat-card-label">FOCUS BY TIME & DAY</span>
        <span className="pat-card-sub">last 28 days</span>
      </div>
      <div className="pat-heatmap">
        {/* Hour labels (top) */}
        <div className="pat-hm-corner" />
        <div className="pat-hm-hours">
          {hours.filter((_, i) => i % 2 === 0).map((h) => (
            <span key={h} style={{ gridColumn: `span 2` }}>
              {h === 12 ? "12p" : h < 12 ? `${h}a` : `${h - 12}p`}
            </span>
          ))}
        </div>

        {/* Grid rows */}
        {dayNames.map((name, di) => (
          <div key={di} className="pat-hm-row">
            <span className="pat-hm-day">{name}</span>
            <div className="pat-hm-cells">
              {hours.map((_, hi) => (
                <div
                  key={hi}
                  className="pat-hm-cell"
                  style={{ background: color(heatmap[di][hi]) }}
                  title={`${dayNames[di]} ${hours[hi]}:00 — ${Math.round(heatmap[di][hi])}min`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* Scale */}
      <div className="pat-hm-scale">
        <span>less</span>
        <div className="pat-hm-scale-boxes">
          {["#0e0f1a", "#1a1c35", "#2e2a6e", "#4338ca", "#6366f1", "#818cf8"].map((c, i) => (
            <div key={i} style={{ background: c }} />
          ))}
        </div>
        <span>more</span>
      </div>
    </div>
  );
}

// ─── 4. Goal vs Actual Trend ───────────────────────────────────────────────────
function GoalTrend({ days }: { days: DayData[] }) {
  const recent = days.slice(0, 14).reverse();
  const maxH = 6;

  const hitCount = recent.filter((d) => {
    const g = goalForDay(d.date);
    return totalSec(d.sessions) >= g * 3600;
  }).length;

  return (
    <div className="pat-card">
      <div className="pat-card-header">
        <span className="pat-card-label">GOAL VS ACTUAL</span>
        <span className="pat-card-sub">last 14 days · {hitCount}/{recent.length} hit</span>
      </div>
      <div className="pat-goal-chart">
        {recent.map((d, i) => {
          const sec = totalSec(d.sessions);
          const actual = sec / 3600;
          const goal = goalForDay(d.date);
          const actualPct = (actual / maxH) * 100;
          const goalPct = (goal / maxH) * 100;
          const hit = actual >= goal;
          const dateNum = d.date.getDate();

          return (
            <div key={i} className="pat-goal-col">
              <div className="pat-goal-track">
                {/* Goal marker */}
                <div className="pat-goal-line" style={{ bottom: `${goalPct}%` }} />
                {/* Actual bar */}
                <div
                  className={`pat-goal-bar ${hit ? "hit" : "miss"}`}
                  style={{ height: `${Math.max(actualPct, actual > 0 ? 2 : 0)}%` }}
                />
              </div>
              <span className="pat-goal-label">{dateNum}</span>
            </div>
          );
        })}
      </div>
      <div className="pat-legend-row">
        <span className="pat-legend-item">
          <span className="pat-legend-swatch goal" />
          goal
        </span>
        <span className="pat-legend-item">
          <span className="pat-legend-swatch hit" />
          met
        </span>
        <span className="pat-legend-item">
          <span className="pat-legend-swatch miss" />
          missed
        </span>
      </div>
    </div>
  );
}

// ─── Main Export ────────────────────────────────────────────────────────────────
export function PatternsView({
  onBack,
  onLogout,
  onViewStats,
}: {
  onBack: () => void;
  onLogout: () => void;
  onViewStats: () => void;
}) {
  const [days] = useState<DayData[]>(generateMockData);
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const today = days[0]?.date;

  // Summary stats
  const last14 = days.slice(0, 14);
  const totalFocused = last14.reduce((s, d) => s + totalSec(d.sessions), 0);
  const avgDaily = totalFocused / 14;
  const activeDays = last14.filter((d) => d.sessions.length > 0).length;

  // Quick day selector for timeline
  const recentDays = days.slice(0, 14);

  return (
    <div className="pat-root">
      {/* Nav */}
      <nav className="pat-nav">
        <div className="pat-nav-inner">
          <div className="pat-nav-left">
            <div className="pat-nav-brand">
              <div className="pat-logo-icon">◈</div>
              <Brand size={16} />
            </div>
            <div className="pat-nav-links">
              <span className="pat-nav-link" onClick={onBack}>Tracker</span>
              <span className="pat-nav-link" onClick={onViewStats}>Stats & Insights</span>
              <span className="pat-nav-link active">Patterns</span>
            </div>
          </div>
          <div className="pat-nav-right">
            <div className="pat-avatar">A</div>
            <button className="pat-btn-ghost" onClick={onLogout}>Log out</button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="pat-main">
        <div className="pat-header">
          <div>
            <h1 className="pat-title">Patterns</h1>
            <p className="pat-subtitle">What the data shows. Nothing more.</p>
          </div>
          <div className="pat-summary-strip">
            <div className="pat-summary-stat">
              <span className="pat-stat-val">{fmtH(totalFocused)}</span>
              <span className="pat-stat-lbl">14-day total</span>
            </div>
            <div className="pat-summary-stat">
              <span className="pat-stat-val">{fmtH(avgDaily)}</span>
              <span className="pat-stat-lbl">daily avg</span>
            </div>
            <div className="pat-summary-stat">
              <span className="pat-stat-val">{activeDays}/14</span>
              <span className="pat-stat-lbl">active days</span>
            </div>
          </div>
        </div>

        {/* Day selector for timeline */}
        <div className="pat-day-selector">
          {recentDays.map((d, i) => {
            const isToday = sameDay(d.date, today);
            const isSelected = i === selectedDayIdx;
            const hasSessions = d.sessions.length > 0;
            return (
              <button
                key={i}
                className={`pat-day-btn ${isSelected ? "selected" : ""} ${isToday ? "today" : ""} ${!hasSessions ? "empty" : ""}`}
                onClick={() => setSelectedDayIdx(i)}
              >
                <span className="pat-day-btn-weekday">
                  {d.date.toLocaleDateString("en-US", { weekday: "narrow" })}
                </span>
                <span className="pat-day-btn-num">{d.date.getDate()}</span>
                {hasSessions && <span className="pat-day-btn-dot" />}
              </button>
            );
          })}
        </div>

        {/* Charts grid */}
        <div className="pat-grid">
          <div className="pat-grid-full">
            <DailyTimeline day={days[selectedDayIdx]} />
          </div>
          <div className="pat-grid-full">
            <RecentDaysChart days={days} />
          </div>
          <div className="pat-grid-half">
            <TimeHeatmap days={days} />
          </div>
          <div className="pat-grid-half">
            <GoalTrend days={days} />
          </div>
        </div>
      </main>

      <style>{`
        .pat-root {
          background: #080910;
          color: #e2e4f3;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          min-height: 100vh;
        }

        /* ── Nav ── */
        .pat-nav {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(8, 9, 16, 0.92);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(99, 102, 241, 0.08);
        }
        .pat-nav-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 24px;
        }
        .pat-nav-left {
          display: flex;
          align-items: center;
          gap: 28px;
        }
        .pat-nav-brand {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .pat-logo-icon {
          width: 28px;
          height: 28px;
          border-radius: 7px;
          background: linear-gradient(135deg, #6366f1, #818cf8);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          color: white;
        }
        .pat-nav-links {
          display: flex;
          gap: 4px;
        }
        .pat-nav-link {
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 13px;
          color: #5a5e8a;
          cursor: pointer;
          transition: all 0.15s;
        }
        .pat-nav-link:hover {
          color: #c0c4e0;
          background: rgba(255, 255, 255, 0.03);
        }
        .pat-nav-link.active {
          color: #e2e4f3;
          background: rgba(99, 102, 241, 0.1);
        }
        .pat-nav-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .pat-avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #818cf8);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
          color: white;
        }
        .pat-btn-ghost {
          background: none;
          border: 1px solid #1e2035;
          color: #5a5e8a;
          border-radius: 6px;
          padding: 5px 12px;
          font-size: 12px;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s;
        }
        .pat-btn-ghost:hover {
          border-color: #3d4270;
          color: #c0c4e0;
        }

        /* ── Main ── */
        .pat-main {
          max-width: 1200px;
          margin: 0 auto;
          padding: 32px 24px 64px;
        }

        /* ── Header ── */
        .pat-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 28px;
          flex-wrap: wrap;
          gap: 20px;
        }
        .pat-title {
          font-size: 28px;
          font-weight: 700;
          color: #e2e4f3;
          margin: 0 0 4px;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }
        .pat-subtitle {
          font-size: 14px;
          color: #3d4270;
          margin: 0;
          font-style: italic;
        }
        .pat-summary-strip {
          display: flex;
          gap: 24px;
        }
        .pat-summary-stat {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        .pat-stat-val {
          font-family: 'DM Mono', monospace;
          font-size: 20px;
          color: #e2e4f3;
          line-height: 1.2;
        }
        .pat-stat-lbl {
          font-size: 11px;
          color: #3d4270;
          letter-spacing: 0.04em;
        }

        /* ── Day Selector ── */
        .pat-day-selector {
          display: flex;
          gap: 6px;
          margin-bottom: 24px;
          overflow-x: auto;
          padding-bottom: 4px;
          scrollbar-width: none;
        }
        .pat-day-selector::-webkit-scrollbar { display: none; }
        .pat-day-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          padding: 8px 10px 6px;
          border-radius: 10px;
          border: 1px solid transparent;
          background: rgba(255, 255, 255, 0.015);
          cursor: pointer;
          min-width: 44px;
          transition: all 0.15s;
          font-family: inherit;
        }
        .pat-day-btn:hover {
          background: rgba(255, 255, 255, 0.04);
        }
        .pat-day-btn.selected {
          background: rgba(99, 102, 241, 0.12);
          border-color: rgba(99, 102, 241, 0.3);
        }
        .pat-day-btn.today .pat-day-btn-num {
          color: #818cf8;
        }
        .pat-day-btn.empty {
          opacity: 0.4;
        }
        .pat-day-btn-weekday {
          font-size: 10px;
          color: #3d4270;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .pat-day-btn-num {
          font-size: 16px;
          font-weight: 600;
          color: #c0c4e0;
          font-family: 'DM Mono', monospace;
        }
        .pat-day-btn-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #818cf8;
        }

        /* ── Cards ── */
        .pat-card {
          background: #0c0d18;
          border: 1px solid #1a1c30;
          border-radius: 14px;
          padding: 20px;
        }
        .pat-card-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 18px;
        }
        .pat-card-label {
          font-size: 11px;
          color: #4b5090;
          letter-spacing: 0.12em;
          font-weight: 600;
        }
        .pat-card-sub {
          font-size: 12px;
          color: #3d4270;
        }
        .pat-empty {
          color: #2e3060;
          font-size: 13px;
          font-style: italic;
          text-align: center;
          padding: 24px 0;
        }

        /* ── Grid ── */
        .pat-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .pat-grid-full {
          grid-column: 1 / -1;
        }
        .pat-grid-half {
          grid-column: span 1;
        }

        /* ── Daily Timeline ── */
        .pat-timeline {
          position: relative;
        }
        .pat-tl-labels {
          position: relative;
          height: 18px;
          margin-bottom: 6px;
        }
        .pat-tl-labels span {
          position: absolute;
          font-size: 9px;
          color: #2e3060;
          transform: translateX(-50%);
          font-family: 'DM Mono', monospace;
        }
        .pat-tl-track {
          position: relative;
          height: 32px;
          background: #0e0f1a;
          border-radius: 6px;
          overflow: hidden;
        }
        .pat-tl-grid {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 1px;
          background: rgba(255, 255, 255, 0.03);
        }
        .pat-tl-block {
          position: absolute;
          top: 4px;
          bottom: 4px;
          background: linear-gradient(90deg, #6366f1, #818cf8);
          border-radius: 3px;
          opacity: 0.85;
          transition: opacity 0.15s;
        }
        .pat-tl-block:hover {
          opacity: 1;
        }

        /* ── Bars Chart ── */
        .pat-bars-container {
          display: flex;
          gap: 8px;
          height: 160px;
        }
        .pat-bars-yaxis {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 0 2px 20px 0;
        }
        .pat-bars-yaxis span {
          font-size: 9px;
          color: #2e3060;
          font-family: 'DM Mono', monospace;
          text-align: right;
          min-width: 20px;
        }
        .pat-bars-area {
          flex: 1;
          display: flex;
          gap: 4px;
          position: relative;
          padding-bottom: 20px;
        }
        .pat-bars-gridline {
          position: absolute;
          left: 0;
          right: 0;
          height: 1px;
          background: rgba(255, 255, 255, 0.03);
          pointer-events: none;
        }
        .pat-bar-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }
        .pat-bar-track {
          flex: 1;
          width: 100%;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }
        .pat-bar-goal {
          position: absolute;
          left: -1px;
          right: -1px;
          height: 1px;
          background: #4b5090;
          z-index: 2;
          pointer-events: none;
        }
        .pat-bar-fill {
          width: 100%;
          background: #2a2d55;
          border-radius: 3px 3px 0 0;
          transition: height 0.3s ease;
        }
        .pat-bar-fill.today {
          background: linear-gradient(180deg, #818cf8, #6366f1);
        }
        .pat-bar-fill.hit {
          background: linear-gradient(180deg, #6ee7b7, #059669);
        }
        .pat-bar-fill.today.hit {
          background: linear-gradient(180deg, #6ee7b7, #059669);
        }
        .pat-bar-day {
          font-size: 9px;
          color: #3d4270;
        }
        .pat-bar-day.today {
          color: #818cf8;
          font-weight: 600;
        }
        .pat-bar-date {
          font-size: 8px;
          color: #2e3060;
          font-family: 'DM Mono', monospace;
        }

        /* ── Legend ── */
        .pat-legend-row {
          display: flex;
          gap: 16px;
          margin-top: 12px;
        }
        .pat-legend-item {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 10px;
          color: #3d4270;
        }
        .pat-legend-swatch {
          width: 10px;
          height: 3px;
          border-radius: 1px;
        }
        .pat-legend-swatch.goal {
          background: #4b5090;
        }
        .pat-legend-swatch.hit {
          background: #6ee7b7;
        }
        .pat-legend-swatch.miss {
          background: #2a2d55;
        }

        /* ── Heatmap ── */
        .pat-heatmap {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .pat-hm-corner {
          display: none;
        }
        .pat-hm-hours {
          display: flex;
          padding-left: 36px;
          margin-bottom: 4px;
        }
        .pat-hm-hours span {
          flex: 1;
          font-size: 8px;
          color: #2e3060;
          font-family: 'DM Mono', monospace;
          text-align: left;
        }
        .pat-hm-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .pat-hm-day {
          width: 28px;
          font-size: 10px;
          color: #3d4270;
          text-align: right;
          flex-shrink: 0;
        }
        .pat-hm-cells {
          flex: 1;
          display: flex;
          gap: 2px;
        }
        .pat-hm-cell {
          flex: 1;
          aspect-ratio: 1;
          border-radius: 2px;
          min-height: 14px;
          transition: background 0.15s;
        }
        .pat-hm-cell:hover {
          outline: 1px solid rgba(129, 140, 248, 0.3);
        }
        .pat-hm-scale {
          display: flex;
          align-items: center;
          gap: 6px;
          justify-content: flex-end;
          margin-top: 10px;
        }
        .pat-hm-scale span {
          font-size: 9px;
          color: #2e3060;
        }
        .pat-hm-scale-boxes {
          display: flex;
          gap: 2px;
        }
        .pat-hm-scale-boxes div {
          width: 12px;
          height: 12px;
          border-radius: 2px;
        }

        /* ── Goal Trend ── */
        .pat-goal-chart {
          display: flex;
          gap: 4px;
          height: 160px;
          padding-bottom: 22px;
        }
        .pat-goal-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        .pat-goal-track {
          flex: 1;
          width: 100%;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }
        .pat-goal-line {
          position: absolute;
          left: -2px;
          right: -2px;
          height: 1.5px;
          background: #4b5090;
          z-index: 2;
          pointer-events: none;
        }
        .pat-goal-bar {
          width: 100%;
          border-radius: 3px 3px 0 0;
          transition: height 0.3s ease;
        }
        .pat-goal-bar.hit {
          background: linear-gradient(180deg, #6ee7b7, #059669);
        }
        .pat-goal-bar.miss {
          background: linear-gradient(180deg, #f87171, #991b1b);
          opacity: 0.7;
        }
        .pat-goal-label {
          font-size: 9px;
          color: #3d4270;
          font-family: 'DM Mono', monospace;
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .pat-nav-links {
            display: none;
          }
          .pat-grid {
            grid-template-columns: 1fr;
          }
          .pat-grid-half {
            grid-column: 1 / -1;
          }
          .pat-header {
            flex-direction: column;
          }
          .pat-summary-strip {
            gap: 16px;
          }
          .pat-summary-stat {
            align-items: flex-start;
          }
          .pat-nav-right {
            gap: 8px;
          }
          .pat-main {
            padding: 20px 16px 48px;
          }
          .pat-bars-container {
            height: 130px;
          }
          .pat-goal-chart {
            height: 130px;
          }
        }
      `}</style>
    </div>
  );
}
