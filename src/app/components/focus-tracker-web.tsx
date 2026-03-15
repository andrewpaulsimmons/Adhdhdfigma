import { useState, useEffect, useCallback, useRef } from "react";

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
function fmt(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function fmtTime(date: Date): string {
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

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

// ─── Mock Data ─────────────────────────────────────────────────────────────────
function generateMockData(): DayData[] {
  const today = new Date(2026, 2, 14);
  const days: DayData[] = [];

  // Seeded random for consistent mock data
  const seed = (n: number) => {
    let x = Math.sin(n * 9301 + 49297) * 49297;
    return x - Math.floor(x);
  };

  // Generate 45 days back (covers current month + previous month fully)
  for (let i = 0; i < 45; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);

    // Hand-crafted sessions for first 7 days, procedural for the rest
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
      // Procedural sessions for older days
      const r = seed(i);
      if (r < 0.15) {
        // No sessions ~15% of days
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

// ─── Brand ─────────────────────────────────────────────────────────────────────
function Brand({ size = 15 }: { size?: number }) {
  return (
    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: size }}>
      <span style={{ color: "#e2e4f3" }}>Adhd</span>
      <span style={{ color: "#818cf8" }}>HD</span>
    </span>
  );
}

// ─── Main Export ────────────────────────────────────────────────────────────────
export function FocusTrackerWeb({
  onLogout,
  onViewStats,
}: {
  onLogout: () => void;
  onViewStats: () => void;
}) {
  const [days] = useState<DayData[]>(generateMockData);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [dailyTarget, setDailyTarget] = useState(4);
  const [editingTarget, setEditingTarget] = useState(false);
  const [targetInput, setTargetInput] = useState("4");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Today is always index 0
  const todayData = days[0];
  const todayTotal = totalSec(todayData.sessions) + elapsed;
  const todayPct = Math.min(100, (todayTotal / (dailyTarget * 3600)) * 100);

  // Selected day (for session list)
  const selectedDay = days[selectedIdx];
  const selectedDate = selectedDay.date;
  const selectedTotal = totalSec(selectedDay.sessions);
  const isViewingToday = selectedIdx === 0;
  const selectedDisplayTotal = isViewingToday ? selectedTotal + elapsed : selectedTotal;

  // Group days by month for sidebar
  const monthGroups = days.reduce<{ key: string; label: string; days: { day: DayData; idx: number }[] }[]>((acc, day, i) => {
    const key = `${day.date.getFullYear()}-${day.date.getMonth()}`;
    const label = day.date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    let group = acc.find((g) => g.key === key);
    if (!group) {
      group = { key, label, days: [] };
      acc.push(group);
    }
    group.days.push({ day, idx: i });
    return acc;
  }, []);

  // Current month (first group) is always expanded
  const currentMonthKey = monthGroups[0]?.key;

  const toggleMonth = useCallback((key: string) => {
    setExpandedMonths((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  // Timer
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const toggleTimer = useCallback(() => setIsRunning((r) => !r), []);

  const handleEditTarget = useCallback(() => {
    if (editingTarget) {
      const val = parseFloat(targetInput);
      if (!isNaN(val) && val > 0 && val <= 24) setDailyTarget(val);
      setEditingTarget(false);
    } else {
      setTargetInput(String(dailyTarget));
      setEditingTarget(true);
    }
  }, [editingTarget, targetInput, dailyTarget]);

  return (
    <div className="ftw-root">
      {/* ─── Top Navbar ─── */}
      <nav className="ftw-nav">
        <div className="ftw-nav-inner">
          <div className="ftw-nav-left">
            <div className="ftw-nav-brand">
              <div className="ftw-logo-icon">◈</div>
              <Brand size={16} />
            </div>
            <div className="ftw-nav-links ftw-desktop-only">
              <span className="ftw-nav-link active">Tracker</span>
              <span className="ftw-nav-link" onClick={onViewStats}>
                Stats & Insights
              </span>
            </div>
          </div>

          <div className="ftw-nav-right">
            <button className="ftw-hamburger ftw-mobile-only" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                {mobileMenuOpen ? (
                  <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                ) : (
                  <>
                    <line x1="3" y1="5" x2="17" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="3" y1="10" x2="17" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="3" y1="15" x2="17" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </>
                )}
              </svg>
            </button>

            <div className="ftw-desktop-only" style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="ftw-avatar">A</div>
              <div style={{ minWidth: 0 }}>
                <div className="ftw-avatar-name">Andrew P.</div>
              </div>
              <button className="ftw-btn-ghost" onClick={onLogout}>Log out</button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="ftw-mobile-dropdown ftw-mobile-only">
            <span className="ftw-mobile-link active">Tracker</span>
            <span className="ftw-mobile-link" onClick={() => { onViewStats(); setMobileMenuOpen(false); }}>Stats & Insights</span>
            <div className="ftw-mobile-divider" />
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0" }}>
              <div className="ftw-avatar" style={{ width: 28, height: 28, fontSize: 12 }}>A</div>
              <span style={{ color: "#c0c4e0", fontSize: 13 }}>Andrew P.</span>
            </div>
            <span className="ftw-mobile-link" onClick={() => { onLogout(); setMobileMenuOpen(false); }}>Log out</span>
          </div>
        )}
      </nav>

      {/* ─── Hero Timer Section ─── */}
      <section className="ftw-timer-hero">
        <div className="ftw-timer-hero-inner">
          <div className="ftw-timer-left">
            {/* TODAY label — unmistakable */}
            <div className="ftw-today-header">
              <span className="ftw-today-badge">TODAY</span>
              <span className="ftw-today-date">
                {todayData.date.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            <div className="ftw-timer-status-row">
              <span className={`ftw-status-badge ${isRunning ? "running" : "paused"}`}>
                <span className="ftw-status-dot" />
                {isRunning ? "Running" : "Paused"}
              </span>
              <span className="ftw-session-label">Work Session</span>
            </div>
            <div className="ftw-timer-display">{fmt(todayTotal)}</div>
            <div className="ftw-timer-meta">
              <div className="ftw-progress-track">
                <div className="ftw-progress-fill" style={{ width: `${todayPct}%` }} />
              </div>
              <div className="ftw-progress-labels">
                <span className="ftw-pct">{Math.round(todayPct)}% of daily goal</span>
                {editingTarget ? (
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input
                      type="number"
                      min="0.5"
                      max="24"
                      step="0.5"
                      value={targetInput}
                      onChange={(e) => setTargetInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleEditTarget()}
                      autoFocus
                      className="ftw-target-input"
                    />
                    <button className="ftw-btn-sm" onClick={handleEditTarget}>Save</button>
                    <button className="ftw-btn-sm ghost" onClick={() => setEditingTarget(false)}>Cancel</button>
                  </span>
                ) : (
                  <button className="ftw-target-btn" onClick={handleEditTarget}>
                    Target: {dailyTarget}h
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M7.5 1.25L8.75 2.5L3.125 8.125L1.25 8.75L1.875 6.875L7.5 1.25Z" stroke="currentColor" strokeWidth="0.8" strokeLinejoin="round" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Play/Pause */}
          <button className={`ftw-play-btn ${isRunning ? "active" : ""}`} onClick={toggleTimer}>
            {isRunning ? (
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect x="6" y="4" width="5" height="20" rx="1.5" fill="currentColor" />
                <rect x="17" y="4" width="5" height="20" rx="1.5" fill="currentColor" />
              </svg>
            ) : (
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M7 3.5L24 14L7 24.5V3.5Z" fill="currentColor" />
              </svg>
            )}
          </button>
        </div>
      </section>

      {/* ─── Main Content: Sidebar + Session List ─── */}
      <div className="ftw-body">
        <div className="ftw-body-inner">

          {/* Mobile: sidebar toggle button */}
          <button className="ftw-sidebar-toggle ftw-mobile-only" onClick={() => setSidebarOpen(true)}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 4H14M2 8H14M2 12H14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            {selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            {isViewingToday && <span className="ftw-toggle-today">Today</span>}
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ marginLeft: "auto" }}>
              <path d="M3 4L5 6L7 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Mobile overlay */}
          {sidebarOpen && <div className="ftw-sidebar-overlay ftw-mobile-only" onClick={() => setSidebarOpen(false)} />}

          <div className="ftw-content-grid">
            {/* ─── Left Sidebar ─── */}
            <aside className={`ftw-sidebar ${sidebarOpen ? "open" : ""}`}>
              <div className="ftw-sidebar-top-bar ftw-mobile-only">
                <span className="ftw-sidebar-top-label">Select Day</span>
                <button className="ftw-sidebar-close" onClick={() => setSidebarOpen(false)}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <div className="ftw-sidebar-scroll">
                {monthGroups.map((group, gi) => {
                  const isCurrent = group.key === currentMonthKey;
                  const isExpanded = isCurrent || expandedMonths.has(group.key);
                  const monthTotalSec = group.days.reduce((s, { day }) => s + totalSec(day.sessions), 0);

                  return (
                    <div key={group.key} className="ftw-month-group">
                      {/* Month header — current month is just a label, past months are collapsible */}
                      {isCurrent ? (
                        <div className="ftw-month-header">
                          <h3 className="ftw-sidebar-title">{group.label}</h3>
                        </div>
                      ) : (
                        <button
                          className={`ftw-month-toggle ${isExpanded ? "expanded" : ""}`}
                          onClick={() => toggleMonth(group.key)}
                        >
                          <div className="ftw-month-toggle-left">
                            <h3 className="ftw-sidebar-title">{group.label}</h3>
                            <span className="ftw-month-summary">{group.days.length} days · {fmtH(monthTotalSec)}</span>
                          </div>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="ftw-month-chevron">
                            <path d="M4 5.5L7 8.5L10 5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      )}

                      {/* Day cards */}
                      {isExpanded && (
                        <div className="ftw-sidebar-days">
                          {group.days.map(({ day, idx }) => {
                            const sel = selectedIdx === idx;
                            const dayNum = day.date.getDate();
                            const dayFull = day.date.toLocaleDateString("en-US", { weekday: "long" });
                            const total = totalSec(day.sessions);
                            const isT = idx === 0;
                            return (
                              <button
                                key={idx}
                                className={`ftw-day-card ${sel ? "selected" : ""} ${isT ? "is-today" : ""}`}
                                onClick={() => { setSelectedIdx(idx); setSidebarOpen(false); }}
                              >
                                <div className="ftw-day-card-left">
                                  <span className="ftw-day-card-num">{dayNum}</span>
                                </div>
                                <div className="ftw-day-card-right">
                                  <div className="ftw-day-card-name">
                                    {isT ? (
                                      <>
                                        <span className="ftw-day-today-label">Today</span>
                                        <span className="ftw-day-weekday-dim">{dayFull}</span>
                                      </>
                                    ) : (
                                      <span>{dayFull}</span>
                                    )}
                                  </div>
                                  <div className="ftw-day-card-meta">
                                    <span className="ftw-day-card-sessions">{day.sessions.length} session{day.sessions.length !== 1 ? "s" : ""}</span>
                                    <span className="ftw-day-card-dot">·</span>
                                    <span className="ftw-day-card-hrs">{fmtH(total)}</span>
                                  </div>
                                </div>
                                {sel && <div className="ftw-day-card-indicator" />}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </aside>

            {/* ─── Session List ─── */}
            <main className="ftw-main">
              <div className="ftw-sessions-card">
                <div className="ftw-sessions-header">
                  <div>
                    <div className="ftw-sessions-title-row">
                      <h2 className="ftw-sessions-title">
                        {isViewingToday ? "Today's Sessions" : `${selectedDate.toLocaleDateString("en-US", { weekday: "long" })}'s Sessions`}
                      </h2>
                      {!isViewingToday && (
                        <button className="ftw-back-to-today" onClick={() => setSelectedIdx(0)}>
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M8 5H2M2 5L4.5 2.5M2 5L4.5 7.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          Back to today
                        </button>
                      )}
                    </div>
                    <span className="ftw-sessions-date">
                      {selectedDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                  <div className="ftw-sessions-summary">
                    <div className="ftw-summary-item">
                      <span className="ftw-summary-label">Total</span>
                      <span className="ftw-summary-value">{fmt(selectedDisplayTotal)}</span>
                    </div>
                    <div className="ftw-summary-divider" />
                    <div className="ftw-summary-item">
                      <span className="ftw-summary-label">Sessions</span>
                      <span className="ftw-summary-value">{selectedDay.sessions.length}</span>
                    </div>
                  </div>
                </div>

                {selectedDay.sessions.length === 0 ? (
                  <div className="ftw-empty">
                    <div className="ftw-empty-icon">
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <circle cx="16" cy="16" r="14" stroke="#2a2d48" strokeWidth="1.5" />
                        <path d="M16 8V16L21 19" stroke="#2a2d48" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <p className="ftw-empty-text">No sessions recorded this day</p>
                    <p className="ftw-empty-sub">{isViewingToday ? "Hit the play button to start tracking" : "Nothing was tracked on this day"}</p>
                  </div>
                ) : (
                  <div className="ftw-session-list">
                    {selectedDay.sessions.map((session, i) => {
                      const d = dur(session);
                      return (
                        <div key={i} className="ftw-session-row">
                          <div className="ftw-session-dot" />
                          <div className="ftw-session-times">
                            <span className="ftw-session-range">{fmtTime(session.start)}</span>
                            <svg width="16" height="8" viewBox="0 0 16 8" fill="none" className="ftw-arrow-icon">
                              <path d="M0 4H14M14 4L10 1M14 4L10 7" stroke="#3a3d5c" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="ftw-session-range">{fmtTime(session.end)}</span>
                          </div>
                          <div className="ftw-session-dur">{fmt(d)}</div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* ─── Styles ─── */}
      <style>{`
        .ftw-root {
          background: #080910;
          color: #e2e4f3;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        /* ── Navbar ── */
        .ftw-nav {
          position: sticky; top: 0; z-index: 100;
          background: rgba(8, 9, 16, 0.92);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .ftw-nav-inner {
          max-width: 1280px; margin: 0 auto; padding: 0 32px;
          height: 60px; display: flex; align-items: center; justify-content: space-between;
        }
        .ftw-nav-left { display: flex; align-items: center; gap: 32px; }
        .ftw-nav-brand { display: flex; align-items: center; gap: 10px; }
        .ftw-logo-icon {
          width: 28px; height: 28px; border-radius: 8px;
          background: linear-gradient(135deg, #6366f1, #818cf8);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; color: #fff;
        }
        .ftw-nav-links { display: flex; gap: 4px; }
        .ftw-nav-link {
          padding: 6px 16px; border-radius: 8px; font-size: 13px;
          color: #6b6f98; cursor: pointer; transition: all 0.15s; user-select: none;
        }
        .ftw-nav-link:hover { color: #c0c4e0; background: rgba(255,255,255,0.03); }
        .ftw-nav-link.active { color: #818cf8; background: rgba(129,140,248,0.08); }
        .ftw-nav-right { display: flex; align-items: center; gap: 12px; }
        .ftw-avatar {
          width: 32px; height: 32px; border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #818cf8);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; color: #fff; font-weight: 600; flex-shrink: 0;
        }
        .ftw-avatar-name { color: #c0c4e0; font-size: 13px; font-weight: 500; }
        .ftw-btn-ghost {
          background: none; border: 1px solid #1e2035; color: #6b6f98;
          border-radius: 8px; padding: 6px 14px; font-size: 12px;
          cursor: pointer; font-family: inherit; transition: all 0.15s;
        }
        .ftw-btn-ghost:hover { border-color: #818cf8; color: #e2e4f3; }
        .ftw-hamburger {
          background: none; border: none; color: #6b6f98;
          cursor: pointer; padding: 6px; display: flex;
        }
        .ftw-mobile-dropdown {
          padding: 8px 28px 16px;
          border-top: 1px solid rgba(255,255,255,0.04);
          display: flex; flex-direction: column; gap: 4px;
        }
        .ftw-mobile-link { padding: 10px 0; font-size: 14px; color: #6b6f98; cursor: pointer; user-select: none; }
        .ftw-mobile-link.active { color: #818cf8; }
        .ftw-mobile-divider { height: 1px; background: rgba(255,255,255,0.05); margin: 4px 0; }

        /* ── Timer Hero ── */
        .ftw-timer-hero {
          background: linear-gradient(180deg, rgba(99,102,241,0.06) 0%, transparent 100%);
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .ftw-timer-hero-inner {
          max-width: 1280px; margin: 0 auto; padding: 32px 32px 36px;
          display: flex; align-items: center; justify-content: space-between; gap: 32px;
        }
        .ftw-timer-left { flex: 1; min-width: 0; }

        /* TODAY header */
        .ftw-today-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 16px;
        }
        .ftw-today-badge {
          display: inline-flex;
          align-items: center;
          padding: 5px 14px;
          border-radius: 6px;
          background: rgba(129,140,248,0.12);
          border: 1px solid rgba(129,140,248,0.2);
          color: #818cf8;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          font-family: 'DM Mono', monospace;
        }
        .ftw-today-date {
          color: #6b6f98;
          font-size: 14px;
        }

        .ftw-timer-status-row {
          display: flex; align-items: center; gap: 12px; margin-bottom: 8px;
        }
        .ftw-status-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 4px 12px; border-radius: 100px;
          font-size: 12px; font-weight: 500; letter-spacing: 0.03em;
        }
        .ftw-status-badge.paused { background: rgba(255,255,255,0.04); color: #6b6f98; }
        .ftw-status-badge.running { background: rgba(129,140,248,0.12); color: #818cf8; }
        .ftw-status-dot { width: 6px; height: 6px; border-radius: 50%; }
        .ftw-status-badge.paused .ftw-status-dot { background: #3d4270; }
        .ftw-status-badge.running .ftw-status-dot {
          background: #818cf8; animation: ftw-pulse 1.5s ease infinite;
        }
        @keyframes ftw-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        .ftw-session-label { color: #4b5090; font-size: 13px; }
        .ftw-timer-display {
          font-size: 64px; font-weight: 700; font-family: 'DM Mono', monospace;
          color: #e2e4f3; font-variant-numeric: tabular-nums;
          letter-spacing: -0.03em; line-height: 1; margin-bottom: 16px;
        }
        .ftw-timer-meta { max-width: 560px; }
        .ftw-progress-track {
          height: 4px; background: rgba(255,255,255,0.04);
          border-radius: 2px; overflow: hidden; margin-bottom: 10px;
        }
        .ftw-progress-fill {
          height: 100%; background: linear-gradient(90deg, #6366f1, #818cf8);
          border-radius: 2px; transition: width 0.4s ease;
        }
        .ftw-progress-labels {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 8px;
        }
        .ftw-pct { color: #818cf8; font-size: 12px; font-family: 'DM Mono', monospace; }
        .ftw-target-btn {
          background: none; border: 1px solid rgba(255,255,255,0.06);
          color: #6b6f98; border-radius: 6px; padding: 4px 10px;
          font-size: 12px; cursor: pointer; font-family: inherit;
          display: flex; align-items: center; gap: 5px; transition: all 0.15s;
        }
        .ftw-target-btn:hover { border-color: rgba(129,140,248,0.3); color: #c0c4e0; }
        .ftw-target-input {
          width: 60px; background: rgba(255,255,255,0.05);
          border: 1px solid rgba(129,140,248,0.3); border-radius: 6px;
          padding: 4px 8px; color: #e2e4f3; font-size: 13px;
          font-family: 'DM Mono', monospace; outline: none;
        }
        .ftw-btn-sm {
          background: #818cf8; border: none; border-radius: 6px;
          padding: 4px 12px; color: #080910; font-size: 12px;
          font-weight: 600; cursor: pointer; font-family: inherit;
        }
        .ftw-btn-sm.ghost {
          background: none; border: 1px solid rgba(255,255,255,0.08); color: #6b6f98;
        }
        .ftw-play-btn {
          width: 80px; height: 80px; border-radius: 50%;
          border: 2px solid rgba(129,140,248,0.2);
          background: rgba(129,140,248,0.06); color: #818cf8;
          cursor: pointer; display: flex; align-items: center;
          justify-content: center; flex-shrink: 0; transition: all 0.2s;
        }
        .ftw-play-btn:hover {
          background: rgba(129,140,248,0.12);
          border-color: rgba(129,140,248,0.4); transform: scale(1.04);
        }
        .ftw-play-btn.active {
          border-color: rgba(129,140,248,0.4);
          background: rgba(129,140,248,0.1);
          animation: ftw-glow 2s ease infinite;
        }
        @keyframes ftw-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(129,140,248,0); }
          50% { box-shadow: 0 0 24px 4px rgba(129,140,248,0.12); }
        }

        /* ── Body ── */
        .ftw-body { flex: 1; }
        .ftw-body-inner {
          max-width: 1280px; margin: 0 auto; padding: 32px 32px 80px;
        }

        /* ── Content Grid: sidebar + main ── */
        .ftw-content-grid {
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 24px;
          align-items: start;
        }

        /* ── Sidebar ── */
        .ftw-sidebar {
          position: sticky;
          top: 92px;
          background: rgba(255,255,255,0.015);
          border: 1px solid rgba(255,255,255,0.04);
          border-radius: 16px;
          overflow: hidden;
          max-height: calc(100vh - 108px);
          display: flex;
          flex-direction: column;
        }
        .ftw-sidebar-scroll {
          overflow-y: auto;
          flex: 1;
          padding-bottom: 8px;
        }
        .ftw-sidebar-scroll::-webkit-scrollbar { width: 4px; }
        .ftw-sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
        .ftw-sidebar-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.06); border-radius: 2px; }
        .ftw-sidebar-top-bar {
          padding: 16px 18px 12px;
          display: flex; align-items: center; justify-content: space-between;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .ftw-sidebar-top-label {
          color: #c0c4e0; font-size: 14px; font-weight: 500;
        }
        .ftw-sidebar-header {
          padding: 16px 18px 12px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .ftw-sidebar-title {
          color: #4b5090; font-size: 11px; letter-spacing: 0.1em;
          text-transform: uppercase; font-weight: 600; margin: 0;
        }
        .ftw-sidebar-close {
          background: none; border: none; color: #6b6f98; cursor: pointer;
          padding: 4px; display: flex;
        }
        .ftw-sidebar-days {
          display: flex; flex-direction: column; gap: 2px;
          padding: 0 6px 6px;
        }

        /* Month groups */
        .ftw-month-group {
          border-bottom: 1px solid rgba(255,255,255,0.025);
        }
        .ftw-month-group:last-child { border-bottom: none; }
        .ftw-month-header {
          padding: 16px 18px 8px;
        }
        .ftw-month-toggle {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.12s;
        }
        .ftw-month-toggle:hover { background: rgba(255,255,255,0.02); }
        .ftw-month-toggle-left { text-align: left; }
        .ftw-month-summary {
          display: block;
          color: #2a2d48;
          font-size: 11px;
          margin-top: 3px;
          font-family: 'DM Mono', monospace;
        }
        .ftw-month-toggle.expanded .ftw-month-summary { color: #3d4270; }
        .ftw-month-chevron {
          color: #3d4270;
          transition: transform 0.2s ease;
          flex-shrink: 0;
        }
        .ftw-month-toggle.expanded .ftw-month-chevron {
          transform: rotate(180deg);
          color: #4b5090;
        }

        /* Day card in sidebar */
        .ftw-day-card {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 12px;
          border-radius: 10px;
          border: 1px solid transparent;
          background: transparent;
          cursor: pointer; transition: all 0.15s;
          font-family: inherit; text-align: left;
          position: relative;
          width: 100%;
        }
        .ftw-day-card:hover {
          background: rgba(255,255,255,0.025);
        }
        .ftw-day-card.selected {
          background: rgba(129,140,248,0.06);
          border-color: rgba(129,140,248,0.15);
        }
        .ftw-day-card-left { flex-shrink: 0; }
        .ftw-day-card-num {
          font-size: 24px; font-weight: 700; color: #3d4270;
          font-variant-numeric: tabular-nums; line-height: 1;
          width: 36px; text-align: center; display: block;
        }
        .ftw-day-card.selected .ftw-day-card-num { color: #818cf8; }
        .ftw-day-card.is-today .ftw-day-card-num { color: #6b6f98; }
        .ftw-day-card.is-today.selected .ftw-day-card-num { color: #818cf8; }
        .ftw-day-card-right { flex: 1; min-width: 0; }
        .ftw-day-card-name {
          font-size: 13px; color: #8b8fa8;
          display: flex; align-items: center; gap: 6px;
          line-height: 1.3;
        }
        .ftw-day-card.selected .ftw-day-card-name { color: #c0c4e0; }
        .ftw-day-today-label {
          color: #818cf8;
          font-weight: 600;
          font-size: 12px;
        }
        .ftw-day-weekday-dim {
          color: #4b5090;
          font-size: 12px;
        }
        .ftw-day-card-meta {
          display: flex; align-items: center; gap: 5px;
          font-size: 11px; color: #3d4270; margin-top: 1px;
        }
        .ftw-day-card.selected .ftw-day-card-meta { color: #4b5090; }
        .ftw-day-card-dot { opacity: 0.4; }
        .ftw-day-card-hrs {
          font-family: 'DM Mono', monospace;
          font-variant-numeric: tabular-nums;
        }
        .ftw-day-card-indicator {
          position: absolute; left: 0; top: 50%; transform: translateY(-50%);
          width: 3px; height: 20px; border-radius: 0 3px 3px 0;
          background: #818cf8;
        }

        /* ── Sessions Card ── */
        .ftw-main { min-width: 0; }
        .ftw-sessions-card {
          background: rgba(255,255,255,0.015);
          border: 1px solid rgba(255,255,255,0.04);
          border-radius: 20px; overflow: hidden;
        }
        .ftw-sessions-header {
          padding: 24px 28px;
          display: flex; align-items: flex-start; justify-content: space-between;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          background: rgba(255,255,255,0.01);
          flex-wrap: wrap; gap: 16px;
        }
        .ftw-sessions-title-row {
          display: flex; align-items: center; gap: 14px; flex-wrap: wrap;
        }
        .ftw-sessions-title {
          font-size: 20px; font-weight: 600; color: #e2e4f3; margin: 0; line-height: 1.2;
        }
        .ftw-back-to-today {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 3px 10px; border-radius: 6px;
          background: rgba(129,140,248,0.08);
          border: 1px solid rgba(129,140,248,0.15);
          color: #818cf8; font-size: 11px; font-weight: 500;
          cursor: pointer; font-family: inherit; transition: all 0.15s;
        }
        .ftw-back-to-today:hover {
          background: rgba(129,140,248,0.14);
          border-color: rgba(129,140,248,0.3);
        }
        .ftw-sessions-date {
          color: #4b5090; font-size: 13px; margin-top: 2px; display: block;
        }
        .ftw-sessions-summary { display: flex; align-items: center; gap: 20px; }
        .ftw-summary-item { text-align: right; }
        .ftw-summary-label {
          display: block; color: #4b5090; font-size: 11px;
          letter-spacing: 0.05em; text-transform: uppercase;
        }
        .ftw-summary-value {
          display: block; color: #e2e4f3; font-size: 18px; font-weight: 600;
          font-family: 'DM Mono', monospace; font-variant-numeric: tabular-nums; line-height: 1.3;
        }
        .ftw-summary-divider { width: 1px; height: 32px; background: rgba(255,255,255,0.06); }

        /* Session List */
        .ftw-session-list { padding: 4px 0; }
        .ftw-session-row {
          display: flex; align-items: center;
          padding: 16px 28px; transition: background 0.12s;
        }
        .ftw-session-row:hover { background: rgba(255,255,255,0.015); }
        .ftw-session-row:not(:last-child) {
          border-bottom: 1px solid rgba(255,255,255,0.025);
        }
        .ftw-session-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #818cf8; margin-right: 20px; flex-shrink: 0;
        }
        .ftw-session-times {
          flex: 1; display: flex; align-items: center; gap: 8px; min-width: 0;
        }
        .ftw-session-range {
          color: #8b8fa8; font-size: 14px;
          font-variant-numeric: tabular-nums; white-space: nowrap;
        }
        .ftw-arrow-icon { flex-shrink: 0; opacity: 0.5; }
        .ftw-session-dur {
          color: #e2e4f3; font-size: 15px; font-weight: 600;
          font-family: 'DM Mono', monospace;
          font-variant-numeric: tabular-nums; margin-left: 16px; white-space: nowrap;
        }

        /* Empty State */
        .ftw-empty { padding: 60px 28px; text-align: center; }
        .ftw-empty-icon { margin-bottom: 16px; opacity: 0.5; }
        .ftw-empty-text { color: #3d4270; font-size: 15px; margin: 0 0 4px; }
        .ftw-empty-sub { color: #2a2d48; font-size: 13px; margin: 0; }

        /* Mobile sidebar toggle */
        .ftw-sidebar-toggle {
          display: none;
          width: 100%;
          align-items: center;
          gap: 10px;
          padding: 14px 16px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.02);
          color: #8b8fa8;
          font-size: 14px;
          font-family: inherit;
          cursor: pointer;
          margin-bottom: 16px;
          transition: all 0.15s;
        }
        .ftw-sidebar-toggle:hover {
          border-color: rgba(129,140,248,0.2);
          background: rgba(255,255,255,0.03);
        }
        .ftw-toggle-today {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.06em;
          color: #818cf8;
          background: rgba(129,140,248,0.1);
          padding: 2px 6px;
          border-radius: 4px;
        }
        .ftw-sidebar-overlay { display: none; }

        /* ── Responsive ── */
        .ftw-desktop-only { display: flex; }
        .ftw-mobile-only { display: none !important; }

        @media (max-width: 820px) {
          .ftw-desktop-only { display: none !important; }
          .ftw-mobile-only { display: flex !important; }

          .ftw-nav-inner { padding: 0 16px; }

          .ftw-timer-hero-inner {
            flex-direction: column; text-align: center;
            padding: 24px 20px 28px; gap: 20px;
          }
          .ftw-timer-left { display: flex; flex-direction: column; align-items: center; }
          .ftw-today-header { flex-direction: column; gap: 6px; }
          .ftw-timer-display { font-size: 48px; }
          .ftw-timer-meta { width: 100%; }
          .ftw-progress-labels { justify-content: center; }
          .ftw-play-btn { width: 64px; height: 64px; }

          .ftw-body-inner { padding: 20px 16px 60px; }
          .ftw-content-grid {
            grid-template-columns: 1fr;
          }

          .ftw-sidebar-toggle { display: flex !important; }

          /* Sidebar as slide-out drawer */
          .ftw-sidebar {
            position: fixed;
            top: 0; left: 0; bottom: 0;
            width: 300px;
            z-index: 200;
            border-radius: 0 16px 16px 0;
            border: none;
            border-right: 1px solid rgba(255,255,255,0.06);
            background: #0a0b14;
            transform: translateX(-100%);
            transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
            overflow-y: auto;
          }
          .ftw-sidebar.open {
            transform: translateX(0);
          }
          .ftw-sidebar-overlay {
            display: block !important;
            position: fixed;
            inset: 0;
            z-index: 199;
            background: rgba(0,0,0,0.6);
            backdrop-filter: blur(4px);
            -webkit-backdrop-filter: blur(4px);
          }

          .ftw-sessions-header { padding: 18px 20px; }
          .ftw-session-row { padding: 14px 20px; }
          .ftw-sessions-summary { gap: 14px; }
          .ftw-summary-value { font-size: 15px; }
        }

        @media (min-width: 821px) {
          .ftw-sidebar-close { display: none !important; }
          .ftw-sidebar-toggle { display: none !important; }
          .ftw-sidebar-overlay { display: none !important; }
        }
      `}</style>
    </div>
  );
}