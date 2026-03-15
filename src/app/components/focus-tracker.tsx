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
function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function formatTimeShort(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function sessionDuration(s: Session): number {
  return Math.round((s.end.getTime() - s.start.getTime()) / 1000);
}

function totalSeconds(sessions: Session[]): number {
  return sessions.reduce((sum, s) => sum + sessionDuration(s), 0);
}

function formatHoursShort(seconds: number): string {
  const h = seconds / 3600;
  if (h < 0.05) return "0h";
  return `${h.toFixed(1)}h`;
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────
function generateMockData(): DayData[] {
  const today = new Date(2026, 2, 14); // March 14, 2026 (Saturday)
  const days: DayData[] = [];

  const mockSessions: Session[][] = [
    // March 14 (today) - some sessions
    [
      { start: new Date(2026, 2, 14, 9, 15, 0), end: new Date(2026, 2, 14, 10, 42, 0) },
      { start: new Date(2026, 2, 14, 11, 3, 0), end: new Date(2026, 2, 14, 11, 48, 0) },
      { start: new Date(2026, 2, 14, 14, 10, 0), end: new Date(2026, 2, 14, 15, 35, 0) },
    ],
    // March 13
    [
      { start: new Date(2026, 2, 13, 8, 30, 0), end: new Date(2026, 2, 13, 10, 15, 0) },
      { start: new Date(2026, 2, 13, 10, 45, 0), end: new Date(2026, 2, 13, 12, 30, 0) },
      { start: new Date(2026, 2, 13, 14, 0, 0), end: new Date(2026, 2, 13, 16, 20, 0) },
    ],
    // March 12
    [
      { start: new Date(2026, 2, 12, 21, 1, 0), end: new Date(2026, 2, 12, 21, 1, 3) },
      { start: new Date(2026, 2, 12, 21, 1, 10), end: new Date(2026, 2, 12, 21, 1, 37) },
      { start: new Date(2026, 2, 12, 21, 3, 0), end: new Date(2026, 2, 12, 21, 3, 6) },
      { start: new Date(2026, 2, 12, 23, 44, 0), end: new Date(2026, 2, 12, 23, 53, 46) },
    ],
    // March 11
    [
      { start: new Date(2026, 2, 11, 9, 0, 0), end: new Date(2026, 2, 11, 11, 30, 0) },
      { start: new Date(2026, 2, 11, 13, 15, 0), end: new Date(2026, 2, 11, 14, 45, 0) },
    ],
    // March 10
    [
      { start: new Date(2026, 2, 10, 10, 0, 0), end: new Date(2026, 2, 10, 12, 0, 0) },
      { start: new Date(2026, 2, 10, 14, 30, 0), end: new Date(2026, 2, 10, 16, 0, 0) },
      { start: new Date(2026, 2, 10, 17, 0, 0), end: new Date(2026, 2, 10, 17, 45, 0) },
    ],
    // March 9
    [],
    // March 8
    [
      { start: new Date(2026, 2, 8, 10, 30, 0), end: new Date(2026, 2, 8, 11, 15, 0) },
    ],
  ];

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push({ date: d, sessions: mockSessions[i] || [] });
  }

  return days;
}

// ─── Day Item (sidebar) ────────────────────────────────────────────────────────
function DayItem({
  data,
  isSelected,
  isToday,
  onClick,
}: {
  data: DayData;
  isSelected: boolean;
  isToday: boolean;
  onClick: () => void;
}) {
  const dayNum = data.date.getDate();
  const dayName = data.date.toLocaleDateString("en-US", { weekday: "long" });
  const total = totalSeconds(data.sessions);
  const hrs = formatHoursShort(total);

  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 14px",
        borderRadius: 10,
        border: "none",
        background: isSelected ? "rgba(255,255,255,0.06)" : "transparent",
        cursor: "pointer",
        transition: "background 0.15s",
        fontFamily: "inherit",
      }}
      onMouseEnter={(e) => {
        if (!isSelected) e.currentTarget.style.background = "rgba(255,255,255,0.03)";
      }}
      onMouseLeave={(e) => {
        if (!isSelected) e.currentTarget.style.background = "transparent";
      }}
    >
      <span
        style={{
          color: isSelected ? "#818cf8" : "#8b8fa8",
          fontSize: 13,
          fontWeight: isSelected ? 500 : 400,
        }}
      >
        {dayNum} - {dayName}
        {isToday && (
          <span style={{ color: "#4b5090", fontSize: 11, marginLeft: 6 }}>Today</span>
        )}
      </span>
      <span
        style={{
          color: "#4b5090",
          fontSize: 12,
          fontFamily: "'DM Mono', monospace",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {hrs}
      </span>
    </button>
  );
}

// ─── Session Row ───────────────────────────────────────────────────────────────
function SessionRow({ session }: { session: Session }) {
  const dur = sessionDuration(session);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "14px 0",
        borderBottom: "1px solid rgba(255,255,255,0.03)",
      }}
    >
      <div
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "#818cf8",
          marginRight: 24,
          flexShrink: 0,
        }}
      />
      <span
        style={{
          color: "#6b6f98",
          fontSize: 14,
          fontVariantNumeric: "tabular-nums",
          flex: 1,
        }}
      >
        {formatTimeShort(session.start)} → {formatTimeShort(session.end)}
      </span>
      <span
        style={{
          color: "#e2e4f3",
          fontSize: 14,
          fontWeight: 600,
          fontFamily: "'DM Mono', monospace",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {formatDuration(dur)}
      </span>
    </div>
  );
}

// ─── Timer Control Card ────────────────────────────────────────────────────────
function TimerCard({
  elapsed,
  isRunning,
  onToggle,
  dailyTarget,
  onEditTarget,
}: {
  elapsed: number;
  isRunning: boolean;
  onToggle: () => void;
  dailyTarget: number;
  onEditTarget: () => void;
}) {
  const pct = Math.min(100, (elapsed / (dailyTarget * 3600)) * 100);

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 22,
        padding: "22px 28px 18px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 18 }}>
        {/* Play/Pause button */}
        <button
          onClick={onToggle}
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            border: "1px solid rgba(129,140,248,0.3)",
            background: "rgba(129,140,248,0.08)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.15s",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(129,140,248,0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(129,140,248,0.08)";
          }}
        >
          {isRunning ? (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="3" y="2" width="4" height="14" rx="1" fill="#818cf8" />
              <rect x="11" y="2" width="4" height="14" rx="1" fill="#818cf8" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 2.5L15 9L4 15.5V2.5Z" fill="#818cf8" />
            </svg>
          )}
        </button>

        {/* Status + session name */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              color: "#6b6f98",
              fontSize: 11,
              letterSpacing: "0.08em",
              marginBottom: 2,
            }}
          >
            {isRunning ? "RUNNING" : "PAUSED"}
          </div>
          <div style={{ color: "#e2e4f3", fontSize: 16, fontWeight: 500 }}>Work Session</div>
        </div>

        {/* Big timer */}
        <div
          style={{
            color: "#e2e4f3",
            fontSize: 38,
            fontWeight: 600,
            fontFamily: "'DM Mono', monospace",
            fontVariantNumeric: "tabular-nums",
            letterSpacing: "-0.02em",
          }}
        >
          {formatDuration(elapsed)}
        </div>
      </div>

      {/* Progress bar */}
      <div
        style={{
          background: "rgba(255,255,255,0.04)",
          borderRadius: 3,
          height: 3,
          overflow: "hidden",
          marginBottom: 10,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: "linear-gradient(90deg, #6366f1, #818cf8)",
            borderRadius: 3,
            transition: "width 0.3s ease",
          }}
        />
      </div>

      {/* Footer row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span
          style={{
            color: "#818cf8",
            fontSize: 12,
            fontFamily: "'DM Mono', monospace",
          }}
        >
          {Math.round(pct)}%
        </span>
        <button
          onClick={onEditTarget}
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 8,
            padding: "5px 12px",
            color: "#6b6f98",
            fontSize: 12,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "'Inter', sans-serif",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(129,140,248,0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
          }}
        >
          Daily Focus Target: {dailyTarget}h
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path
              d="M7.5 1.25L8.75 2.5L3.125 8.125L1.25 8.75L1.875 6.875L7.5 1.25Z"
              stroke="#6b6f98"
              strokeWidth="0.8"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── Profile Footer ────────────────────────────────────────────────────────────
function ProfileFooter({ onLogout }: { onLogout: () => void }) {
  return (
    <div
      style={{
        borderTop: "1px solid rgba(255,255,255,0.05)",
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #6366f1, #818cf8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
          color: "#fff",
          fontWeight: 600,
          flexShrink: 0,
        }}
      >
        A
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            color: "#e2e4f3",
            fontSize: 13,
            fontWeight: 500,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          Andrew Paul Si...
        </div>
        <div
          style={{
            color: "#4b5090",
            fontSize: 11,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          andrewpaulsimmo...
        </div>
      </div>
      <button
        onClick={onLogout}
        title="Log out"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 6,
          display: "flex",
          color: "#4b5090",
          transition: "color 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#818cf8";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "#4b5090";
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M6 2H3.5C2.67 2 2 2.67 2 3.5V12.5C2 13.33 2.67 14 3.5 14H6M6 8H14M14 8L11 5M14 8L11 11"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}

// ─── Main Focus Tracker ────────────────────────────────────────────────────────
export function FocusTracker({ onLogout, onViewStats }: { onLogout: () => void; onViewStats: () => void }) {
  const [days] = useState<DayData[]>(generateMockData);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [dailyTarget, setDailyTarget] = useState(4);
  const [editingTarget, setEditingTarget] = useState(false);
  const [targetInput, setTargetInput] = useState("4");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const selectedDay = days[selectedIdx];
  const dayTotal = totalSeconds(selectedDay.sessions);
  const isToday = selectedIdx === 0;

  // Include current elapsed time in today's total
  const displayTotal = isToday ? dayTotal + elapsed : dayTotal;

  // Timer
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setElapsed((e) => e + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const toggleTimer = useCallback(() => {
    setIsRunning((r) => !r);
  }, []);

  const handleEditTarget = useCallback(() => {
    if (editingTarget) {
      const val = parseFloat(targetInput);
      if (!isNaN(val) && val > 0 && val <= 24) {
        setDailyTarget(val);
      }
      setEditingTarget(false);
    } else {
      setTargetInput(String(dailyTarget));
      setEditingTarget(true);
    }
  }, [editingTarget, targetInput, dailyTarget]);

  const todayDate = selectedDay.date;
  const isSelectedToday =
    todayDate.getDate() === 14 &&
    todayDate.getMonth() === 2 &&
    todayDate.getFullYear() === 2026;

  return (
    <div
      style={{
        background: "#000",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "-apple-system, 'Inter', system-ui, sans-serif",
        padding: 20,
      }}
    >
      {/* App window shell */}
      <div
        style={{
          width: "95vw",
          maxWidth: 1550,
          height: "min(92vh, 1080px)",
          background: "#0d0e16",
          borderRadius: 28,
          border: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          overflow: "hidden",
          boxShadow: "0 40px 120px rgba(0,0,0,0.6)",
          position: "relative",
        }}
      >
        {/* ─── Sidebar ─── */}
        <div
          style={{
            width: sidebarOpen ? 300 : 0,
            minWidth: sidebarOpen ? 300 : 0,
            background: "#0a0b12",
            display: "flex",
            flexDirection: "column",
            transition: "width 0.2s ease, min-width 0.2s ease",
            overflow: "hidden",
            borderRight: sidebarOpen ? "1px solid rgba(255,255,255,0.04)" : "none",
          }}
        >
          {/* Traffic lights + toggle */}
          <div
            style={{
              padding: "20px 20px 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", gap: 7 }}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: "#ff5f57",
                }}
              />
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: "#febc2e",
                }}
              />
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: "#28c840",
                }}
              />
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              style={{
                background: "none",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 6,
                padding: "4px 6px",
                cursor: "pointer",
                color: "#4b5090",
                display: "flex",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#818cf8";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#4b5090";
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="1" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.2" />
                <line x1="5" y1="1" x2="5" y2="13" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </button>
          </div>

          {/* Month label */}
          <div style={{ padding: "20px 20px 8px", color: "#4b5090", fontSize: 13 }}>
            March 2026
          </div>

          {/* Day list */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "0 8px",
            }}
          >
            {days.map((day, i) => (
              <DayItem
                key={i}
                data={day}
                isSelected={selectedIdx === i}
                isToday={i === 0}
                onClick={() => setSelectedIdx(i)}
              />
            ))}
          </div>

          {/* Stats link */}
          <div style={{ padding: "0 14px 4px" }}>
            <button
              onClick={onViewStats}
              style={{
                width: "100%",
                background: "rgba(129,140,248,0.06)",
                border: "1px solid rgba(129,140,248,0.12)",
                borderRadius: 10,
                padding: "10px 14px",
                cursor: "pointer",
                color: "#818cf8",
                fontSize: 12,
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontFamily: "'Inter', sans-serif",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(129,140,248,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(129,140,248,0.06)";
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="8" width="3" height="5" rx="0.5" fill="currentColor" opacity="0.5" />
                <rect x="5.5" y="5" width="3" height="8" rx="0.5" fill="currentColor" opacity="0.7" />
                <rect x="10" y="2" width="3" height="11" rx="0.5" fill="currentColor" />
              </svg>
              View Stats & Insights
            </button>
          </div>

          {/* Profile footer */}
          <ProfileFooter onLogout={onLogout} />
        </div>

        {/* ─── Main content ─── */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Sidebar toggle when collapsed */}
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              style={{
                position: "absolute",
                top: 18,
                left: 18,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 8,
                padding: "6px 8px",
                cursor: "pointer",
                color: "#4b5090",
                display: "flex",
                zIndex: 10,
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#818cf8";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#4b5090";
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="1" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.2" />
                <line x1="5" y1="1" x2="5" y2="13" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </button>
          )}

          {/* Header */}
          <div
            style={{
              padding: "24px 32px",
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              borderBottom: "1px solid rgba(255,255,255,0.04)",
              background: "rgba(255,255,255,0.01)",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: 22,
                  fontWeight: 600,
                  color: "#e2e4f3",
                }}
              >
                {isSelectedToday ? "Today" : todayDate.toLocaleDateString("en-US", { weekday: "long" })}
              </h1>
              <span style={{ color: "#4b5090", fontSize: 14 }}>
                {todayDate.getMonth() + 1}/{todayDate.getDate()}/{String(todayDate.getFullYear()).slice(2)}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
              <span style={{ color: "#4b5090", fontSize: 13 }}>Total:</span>
              <span
                style={{
                  color: "#e2e4f3",
                  fontSize: 16,
                  fontWeight: 600,
                  fontFamily: "'DM Mono', monospace",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {formatDuration(displayTotal)}
              </span>
              <span style={{ color: "#4b5090", fontSize: 13 }}>
                {selectedDay.sessions.length} item{selectedDay.sessions.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Session list */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "8px 32px 32px",
            }}
          >
            {selectedDay.sessions.length === 0 ? (
              <div
                style={{
                  color: "#2a2d48",
                  fontSize: 14,
                  textAlign: "center",
                  marginTop: 80,
                }}
              >
                No sessions recorded this day.
              </div>
            ) : (
              selectedDay.sessions.map((session, i) => (
                <SessionRow key={i} session={session} />
              ))
            )}
          </div>

          {/* Timer card (pinned at bottom) */}
          <div style={{ padding: "0 24px 24px", flexShrink: 0 }}>
            {editingTarget ? (
              <div
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(129,140,248,0.2)",
                  borderRadius: 22,
                  padding: "22px 28px",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <span style={{ color: "#6b6f98", fontSize: 14 }}>Set daily target (hours):</span>
                <input
                  type="number"
                  min="0.5"
                  max="24"
                  step="0.5"
                  value={targetInput}
                  onChange={(e) => setTargetInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleEditTarget();
                  }}
                  autoFocus
                  style={{
                    width: 80,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(129,140,248,0.3)",
                    borderRadius: 8,
                    padding: "8px 12px",
                    color: "#e2e4f3",
                    fontSize: 16,
                    fontFamily: "'DM Mono', monospace",
                    outline: "none",
                  }}
                />
                <button
                  onClick={handleEditTarget}
                  style={{
                    background: "#818cf8",
                    border: "none",
                    borderRadius: 8,
                    padding: "8px 20px",
                    color: "#0a0b12",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingTarget(false)}
                  style={{
                    background: "none",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 8,
                    padding: "8px 16px",
                    color: "#6b6f98",
                    fontSize: 13,
                    cursor: "pointer",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <TimerCard
                elapsed={displayTotal}
                isRunning={isRunning}
                onToggle={toggleTimer}
                dailyTarget={dailyTarget}
                onEditTarget={handleEditTarget}
              />
            )}
          </div>
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          /* Stack sidebar above content on mobile */
        }
      `}</style>
    </div>
  );
}
