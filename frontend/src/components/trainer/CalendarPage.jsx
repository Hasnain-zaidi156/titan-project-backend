import React from 'react';
import { monthNames, weekDays } from './constants';

const now = new Date();
const REAL_TODAY = now.getDate();
const REAL_TODAY_MONTH = now.getMonth();
const REAL_TODAY_YEAR = now.getFullYear();

const buildCalendarGrid = (month, year) => {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
};

const getDayEvents = (day, calMonth, calYear) => {
  if (!day) return [];
  const weekday = new Date(calYear, calMonth, day).getDay();
  const events = [];
  // Mon/Wed/Fri → Modern Web Application Development
  if (weekday === 1 || weekday === 3 || weekday === 5) {
    events.push({ label: 'MODERN WEB APPLICATION DEVELO...', color: '#dcfce7' });
    events.push({ label: 'GRAPHIC DESIGNING', color: '#fef9c3' });
  }
  // Sat/Sun → Little Geniuses
  if (weekday === 0 || weekday === 6) {
    events.push({ label: 'LITTLE GENIUSES: CODING, DESIGN...', color: '#dcfce7' });
    events.push({ label: 'LITTLE GENIUSES: CODING, DESIGN...', color: '#dcfce7' });
  }
  return events;
};

const CalendarPage = ({ calMonth, calYear, changeMonth }) => {
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
            const events = getDayEvents(day, calMonth, calYear);
            return (
              <div key={idx} className={`cal-day-cell${isToday ? ' cal-today' : ''}${!day ? ' cal-empty' : ''}`}>
                {day && (
                  <>
                    <div className="cal-day-number-row">
                      <span>{day}</span>
                      {events.length > 0 && <span className="cal-day-dot" />}
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
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: '#dcfce7', display: 'inline-block' }} />
            Modern Web / Little Geniuses
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: '#fef9c3', display: 'inline-block' }} />
            Graphic Designing
          </span>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
