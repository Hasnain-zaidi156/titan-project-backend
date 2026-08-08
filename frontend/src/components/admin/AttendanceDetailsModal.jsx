import { useState } from "react";
import { Icon, ICONS } from "./Icon";
import { useEscapeKey } from "./hooks";
import {
  MONTH_NAMES, WEEKDAY_LABELS, TODAY_REF,
  firstWeekdayOfMonth, daysInMonth, toYMD, isSameYMD, attendanceStats, dayStatus,
} from "../../utils/dateUtils";

function LeaveReasonModal({ onCancel, onConfirm }) {
  const [reason, setReason] = useState("");
  useEscapeKey(onCancel);

  return (
    <div className="ta-modal-overlay" onClick={onCancel}>
      <div className="ta-modal" style={{ maxWidth: 380 }} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Reason for leave">
        <div className="ta-modal-header">
          <h3>Reason for leave</h3>
          <button className="ta-modal-close" onClick={onCancel} aria-label="Close">
            <Icon path={ICONS.close} size={18} />
          </button>
        </div>
        <div className="ta-modal-body">
          <input
            className="ta-form-input"
            autoFocus
            placeholder="Enter reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
        <div className="ta-modal-footer">
          <button className="ta-btn-outline" onClick={onCancel}>Cancel</button>
          <button className="ta-btn-primary" onClick={() => onConfirm(reason)}>Ok</button>
        </div>
      </div>
    </div>
  );
}

export function AttendanceDetailsModal({ record, onClose, onMarkLeave }) {
  const [viewMode, setViewMode] = useState("Month");
  const [year, setYear] = useState(TODAY_REF.getFullYear());
  const [month, setMonth] = useState(TODAY_REF.getMonth());
  const [pendingDate, setPendingDate] = useState(null);
  useEscapeKey(onClose);

  const stats = attendanceStats(record);

  const cells = [];
  const firstWeekday = firstWeekdayOfMonth(year, month);
  const totalDays = daysInMonth(year, month);
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) cells.push(d);

  const changeMonth = (delta) => {
    let m = month + delta;
    let y = year;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    setMonth(m);
    setYear(y);
  };

  return (
    <div className="ta-modal-overlay" onClick={onClose}>
      <div className="ta-modal ta-attendance-details-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Attendance details">
        <div className="ta-modal-header">
          <h3>Attendance Details</h3>
          <button className="ta-modal-close" onClick={onClose} aria-label="Close">
            <Icon path={ICONS.close} size={18} />
          </button>
        </div>

        <div className="ta-modal-body ta-attendance-details-body">
          <div className="ta-attendance-identity-row">
            <span><strong>Student Name:</strong> {record.studentName}</span>
            <span><strong>Roll Number:</strong> {record.rollNumber}</span>
          </div>

          <div className="ta-attendance-summary-cards">
            <div className="ta-attendance-summary-card">
              <p className="ta-attendance-summary-label">Total Classes</p>
              <p className="ta-attendance-summary-value">{record.totalClasses}</p>
            </div>
            <div className="ta-attendance-summary-card">
              <p className="ta-attendance-summary-label">Present · Leave · Absent</p>
              <p className="ta-attendance-summary-value ta-attendance-summary-pla">
                <span className="ta-pla-present">{stats.present}</span>
                <span className="ta-pla-sep">/</span>
                <span className="ta-pla-leave">{stats.leave}</span>
                <span className="ta-pla-sep">/</span>
                <span className="ta-pla-absent">{stats.absent}</span>
              </p>
            </div>
            <div className="ta-attendance-summary-card">
              <p className="ta-attendance-summary-label">Attendance %</p>
              <p className="ta-attendance-summary-value">{stats.percentage.toFixed(2)}%</p>
            </div>
          </div>

          <div className="ta-attendance-calendar-toolbar">
            <div className="ta-attendance-month-nav">
              <button className="ta-icon-action" aria-label="Previous month" onClick={() => changeMonth(-1)}>
                <Icon path={ICONS.chevronLeft} size={14} />
              </button>
              <select className="ta-form-select" aria-label="Year" value={year} onChange={(e) => setYear(Number(e.target.value))}>
                {[2024, 2025, 2026].map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
              <select className="ta-form-select" aria-label="Month" value={month} onChange={(e) => setMonth(Number(e.target.value))}>
                {MONTH_NAMES.map((m, i) => <option key={m} value={i}>{m.slice(0, 3)}</option>)}
              </select>
              <button className="ta-icon-action" aria-label="Next month" onClick={() => changeMonth(1)}>
                <Icon path={ICONS.chevronRight} size={14} />
              </button>
            </div>
            <div className="ta-attendance-view-toggle-group">
              <button
                className={`ta-view-toggle-btn ${viewMode === "Month" ? "active" : ""}`}
                onClick={() => setViewMode("Month")}
              >
                Month
              </button>
              <button
                className={`ta-view-toggle-btn ${viewMode === "Year" ? "active" : ""}`}
                onClick={() => setViewMode("Year")}
              >
                Year
              </button>
            </div>
          </div>

          {viewMode === "Month" ? (
            <>
              <div className="ta-cal-grid">
                {WEEKDAY_LABELS.map((w) => (
                  <div key={w} className="ta-cal-weekday-lbl">{w}</div>
                ))}
                {cells.map((d, idx) => {
                  if (!d) return <div key={idx} />;
                  const dateStr = toYMD(year, month, d);
                  const dateObj = new Date(year, month, d);
                  const status = dayStatus(record, dateStr, dateObj);
                  const clickable = status === "absent";
                  const isToday = isSameYMD(dateObj, TODAY_REF);
                  const classNames = [
                    "ta-cal-cell",
                    `ta-cal-cell-${status}`,
                    clickable ? "ta-cal-cell-clickable" : "",
                    isToday ? "ta-cal-cell-today" : "",
                  ].filter(Boolean).join(" ");
                  return (
                    <div
                      key={idx}
                      className={classNames}
                      onClick={() => clickable && setPendingDate(dateStr)}
                      role={clickable ? "button" : undefined}
                      tabIndex={clickable ? 0 : undefined}
                      title={isToday ? "Today" : undefined}
                    >
                      {d}
                    </div>
                  );
                })}
              </div>
              <p className="ta-attendance-cal-hint">Click a red (absent) day to mark it as leave.</p>
            </>
          ) : (
            <div className="ta-table-wrap">
              <table className="ta-table">
                <thead>
                  <tr><th>Month</th><th>Present</th><th>Leave</th></tr>
                </thead>
                <tbody>
                  {MONTH_NAMES.map((m, i) => {
                    const monthPresent = record.presentDates.filter((ds) => Number(ds.split("-")[0]) === year && Number(ds.split("-")[1]) - 1 === i).length;
                    const monthLeave = record.leaveDates.filter((ds) => Number(ds.split("-")[0]) === year && Number(ds.split("-")[1]) - 1 === i).length;
                    if (monthPresent === 0 && monthLeave === 0) return null;
                    return (
                      <tr key={m}>
                        <td>{m}</td>
                        <td>{monthPresent}</td>
                        <td>{monthLeave}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {pendingDate && (
        <LeaveReasonModal
          onCancel={() => setPendingDate(null)}
          onConfirm={(reason) => {
            onMarkLeave(record.rollNumber, pendingDate, reason);
            setPendingDate(null);
          }}
        />
      )}
    </div>
  );
}
