import React, { useEffect, useMemo, useState } from 'react';
import { monthNames, weekDays, API_BASE } from './constants';
import { parseScheduleDays } from './scheduleUtils';
import {
  modalOverlayStyle, modalCardStyle, modalHeaderStyle, modalCloseBtnStyle,
  modalLabelStyle, modalInputStyle, modalActionsStyle, modalCancelBtnStyle, modalPrimaryBtnStyle,
} from './modalStyles';

const now = new Date();
const REAL_TODAY = now.getDate();
const REAL_TODAY_MONTH = now.getMonth();
const REAL_TODAY_YEAR = now.getFullYear();

const pad2 = (n) => String(n).padStart(2, '0');
const dateKeyOf = (year, month, day) => `${year}-${pad2(month + 1)}-${pad2(day)}`;

const buildCalendarGrid = (month, year) => {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
};

// courses = trainer ke live-computed courses (sirf naam/color ke liye).
// trainer = logged-in trainer record — ADMIN NE JO `slotSchedule` diya hai
// wahi is calendar ke din decide karta hai (koi aur aggregation nahi),
// taake sirf wahi din mark hon jo admin ne khud assign kiye hain. Admin
// jab bhi ye schedule badle, trainer.slotSchedule fresh value ke sath
// yahan turant reflect ho jata hai (TrainerPortal har 15s trainer record
// backend se refresh karta hai).
const CalendarPage = ({ calMonth, calYear, changeMonth, courses, trainer }) => {
  const trainerId = trainer?.employeeId || '';

  // Admin-assigned weekdays — sirf trainer.slotSchedule se, kisi aur jagah se nahi.
  const assignedWeekdays = useMemo(() => parseScheduleDays(trainer?.slotSchedule), [trainer?.slotSchedule]);

  // Trainer ko jo courses assign hain unke naam + unke live-card wala color
  // (agar course card mila to uska color, warna default green).
  const assignedCourseLabels = useMemo(() => {
    const titles = (trainer?.courses && trainer.courses.length > 0)
      ? trainer.courses
      : [...new Set((courses || []).map((c) => c.title))];
    return titles.map((title) => {
      const match = (courses || []).find((c) => c.title === title);
      return { title, color: match?.bgHeader || '#dcfce7' };
    });
  }, [trainer?.courses, courses]);

  const [overrides, setOverrides] = useState({}); // dateKey -> { id, label, color }
  const [editingDay, setEditingDay] = useState(null); // day number currently being edited
  const [editLabel, setEditLabel] = useState('');
  const [editColor, setEditColor] = useState('#dbeafe');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    if (!trainerId) return;
    let cancelled = false;
    fetch(`${API_BASE}/api/calendar-overrides?trainerId=${encodeURIComponent(trainerId)}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const map = {};
        (Array.isArray(data) ? data : []).forEach((o) => { map[o.date] = o; });
        setOverrides(map);
      })
      .catch((err) => console.error('Failed to load calendar overrides:', err));
    return () => { cancelled = true; };
  }, [trainerId]);

  const getDayEvents = (day) => {
    if (!day) return [];
    const dateKey = dateKeyOf(calYear, calMonth, day);
    const override = overrides[dateKey];
    if (override) {
      return override.label
        ? [{ label: override.label, color: override.color || '#dbeafe' }]
        : [];
    }
    const weekday = new Date(calYear, calMonth, day).getDay();
    if (!assignedWeekdays.includes(weekday)) return [];
    return assignedCourseLabels.map((c) => ({ label: c.title, color: c.color }));
  };

  const openEditor = (day) => {
    if (!day) return;
    const dateKey = dateKeyOf(calYear, calMonth, day);
    const override = overrides[dateKey];
    setEditingDay(day);
    setEditLabel(override ? override.label : '');
    setEditColor(override ? override.color : '#dbeafe');
    setSaveError('');
  };

  const closeEditor = () => { if (!saving) { setEditingDay(null); setSaveError(''); } };

  const saveEdit = async () => {
    if (!trainerId || !editingDay) return;
    const dateKey = dateKeyOf(calYear, calMonth, editingDay);
    setSaving(true);
    setSaveError('');
    try {
      const res = await fetch(`${API_BASE}/api/calendar-overrides`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trainerId, date: dateKey, label: editLabel.trim(), color: editColor }),
      });
      if (!res.ok) throw new Error('Save failed');
      const saved = await res.json();
      setOverrides((prev) => ({ ...prev, [dateKey]: saved }));
      setEditingDay(null);
    } catch (err) {
      console.error('Save calendar override error:', err);
      setSaveError('Save nahi ho saka, dobara koshish karein.');
    } finally {
      setSaving(false);
    }
  };

  const clearEdit = async () => {
    const dateKey = dateKeyOf(calYear, calMonth, editingDay);
    const existing = overrides[dateKey];
    if (!existing) { setEditingDay(null); return; }
    setSaving(true);
    setSaveError('');
    try {
      await fetch(`${API_BASE}/api/calendar-overrides/${existing.id}`, { method: 'DELETE' });
      setOverrides((prev) => {
        const next = { ...prev };
        delete next[dateKey];
        return next;
      });
      setEditingDay(null);
    } catch (err) {
      console.error('Delete calendar override error:', err);
      setSaveError('Reset nahi ho saka, dobara koshish karein.');
    } finally {
      setSaving(false);
    }
  };

  const editingDateKey = editingDay ? dateKeyOf(calYear, calMonth, editingDay) : null;
  const editingHasOverride = editingDateKey && !!overrides[editingDateKey];

  return (
    <div className="calendar-page-wrapper animated-fade">
      <h1>Calendar</h1>
      <div className="calendar-card-frame">
        <div className="calendar-month-nav-row">
          <button className="cal-nav-btn" onClick={() => changeMonth(-1)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <h3>{monthNames[calMonth]} {calYear}</h3>
          <button className="cal-nav-btn" onClick={() => changeMonth(1)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        </div>
        <div className="calendar-weekday-header-row">
          {weekDays.map(d => <div key={d} className="cal-weekday-cell">{d}</div>)}
        </div>
        <div className="calendar-grid-body">
          {buildCalendarGrid(calMonth, calYear).map((day, idx) => {
            const isToday = day === REAL_TODAY && calMonth === REAL_TODAY_MONTH && calYear === REAL_TODAY_YEAR;
            const events = getDayEvents(day);
            const dateKey = day ? dateKeyOf(calYear, calMonth, day) : null;
            const isEdited = dateKey && !!overrides[dateKey];
            return (
              <div
                key={idx}
                className={`cal-day-cell${isToday ? ' cal-today' : ''}${!day ? ' cal-empty' : ''}`}
                onClick={() => openEditor(day)}
                style={day ? { cursor: 'pointer' } : undefined}
                title={day ? 'Click to edit this day' : undefined}
              >
                {day && (
                  <>
                    <div className="cal-day-number-row">
                      <span>{day}</span>
                      {events.length > 0 && <span className="cal-day-dot" />}
                      {isEdited && <span style={{ fontSize: 9, color: '#4f46e5', marginLeft: 4 }}>✎</span>}
                    </div>
                    <div className="cal-events-stack">
                      {events.slice(0, 2).map((ev, i) => (
                        <div key={i} className="cal-event-pill" style={{ background: ev.color }}>{ev.label}</div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
        {/* Legend */}
        <div style={{ display: 'flex', gap: 16, padding: '12px 4px 4px', flexWrap: 'wrap', fontSize: 12 }}>
          {assignedCourseLabels.map((c) => (
            <span key={c.title} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: c.color, display: 'inline-block' }} />
              {c.title}
            </span>
          ))}
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b' }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: '#dbeafe', display: 'inline-block' }} />
            Manually edited day
          </span>
        </div>
        <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 8 }}>
          Din admin-assigned schedule se auto-mark hote hain — kisi bhi din par click karke apni marzi ka note/label save kar sakte hain.
        </p>
      </div>

      {editingDay && (
        <div style={modalOverlayStyle} onClick={closeEditor}>
          <div style={modalCardStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <h2 style={{ margin: 0, fontSize: '18px' }}>
                {monthNames[calMonth]} {editingDay}, {calYear}
              </h2>
              <button style={modalCloseBtnStyle} onClick={closeEditor}>✕</button>
            </div>
            <p style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>
              Is din ke liye custom label likhein, ya "Reset to auto" se admin-assigned schedule pe wapas jaayein.
            </p>

            <label style={modalLabelStyle}>Label</label>
            <input
              style={modalInputStyle}
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
              placeholder="e.g. Extra Class / Off Day / Exam"
            />

            <label style={modalLabelStyle}>Color</label>
            <input
              type="color"
              value={editColor}
              onChange={(e) => setEditColor(e.target.value)}
              style={{ width: '100%', height: '36px', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer' }}
            />

            {saveError && <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '10px' }}>{saveError}</p>}

            <div style={modalActionsStyle}>
              {editingHasOverride && (
                <button style={modalCancelBtnStyle} onClick={clearEdit} disabled={saving}>Reset to auto</button>
              )}
              <button style={modalCancelBtnStyle} onClick={closeEditor} disabled={saving}>Cancel</button>
              <button style={modalPrimaryBtnStyle} onClick={saveEdit} disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
