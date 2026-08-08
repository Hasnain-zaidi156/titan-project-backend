import React from 'react';
import { monthNames, weekDays } from './mockData';

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
  if (weekday === 1 || weekday === 3 || weekday === 5) events.push({ label: "MODERN WEB APPLICATION DEVELO...", color: "#dcfce7" });
  if (weekday === 0 || weekday === 6) {
    events.push({ label: "LITTLE GENIUSES: CODING, DESIGN...", color: "#dcfce7" });
    events.push({ label: "LITTLE GENIUSES: CODING, DESIGN...", color: "#dcfce7" });
  }
  return events;
};

const todayMarker = 17;

const CalendarPage = ({ calMonth, calYear, changeMonth }) => {
  return (
    <div className="calendar-page-wrapper animated-fade">
      <h1>Calendar</h1>
      <div className="calendar-card-frame">
        <div className="calendar-month-nav-row">
          <button className="cal-nav-btn" onClick={() => changeMonth(-1)}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg></button>
          <h3>{monthNames[calMonth]} {calYear}</h3>
          <button className="cal-nav-btn" onClick={() => changeMonth(1)}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg></button>
        </div>
        <div className="calendar-weekday-header-row">{weekDays.map(d => <div key={d} className="cal-weekday-cell">{d}</div>)}</div>
        <div className="calendar-grid-body">
          {buildCalendarGrid(calMonth, calYear).map((day, idx) => (
            <div key={idx} className={`cal-day-cell ${day === todayMarker && calMonth === 5 ? 'cal-today' : ''} ${!day ? 'cal-empty' : ''}`}>
              {day && (<>
                <div className="cal-day-number-row"><span>{day}</span>{getDayEvents(day, calMonth, calYear).length > 0 && <span className="cal-day-dot"></span>}</div>
                <div className="cal-events-stack">{getDayEvents(day, calMonth, calYear).slice(0, 2).map((ev, i) => <div key={i} className="cal-event-pill" style={{ background: ev.color }}>{ev.label}</div>)}</div>
              </>)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
