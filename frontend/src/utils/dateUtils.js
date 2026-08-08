export const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
export const CLASS_WEEKDAYS = [2, 4]; // Tuesday & Thursday scheduled class days

// "Aaj" ki date — real current date use karta hai taake calendars/stats
// waqt ke sath sahi rahen. Testing ke liye fixed date chahiye ho to yahan
// badal do, lekin hardcoded date ship mat karo.
export function getToday() {
  return new Date();
}
export const TODAY_REF = getToday();

export function pad2(n) { return String(n).padStart(2, "0"); }
export function toYMD(y, m, d) { return `${y}-${pad2(m + 1)}-${pad2(d)}`; }
export function daysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }
export function firstWeekdayOfMonth(y, m) { return new Date(y, m, 1).getDay(); }
export function isSameYMD(a, b) { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
export function toInputDate(d) { return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`; }

export function parseScheduleTimes(schedule) {
  if (!schedule) return [];
  const parts = schedule.split("|").map((p) => p.trim());
  const times = [];
  parts.forEach((part) => {
    const match = part.match(/(\d{1,2}:\d{2}\s?[AP]M)\s*-\s*(\d{1,2}:\d{2}\s?[AP]M)/i);
    if (match) times.push({ start: match[1], end: match[2] });
  });
  return times;
}

export function to24hMinutes(t) {
  const m = t.trim().match(/(\d{1,2}):(\d{2})\s?([AP]M)/i);
  if (!m) return null;
  let h = Number(m[1]);
  const min = Number(m[2]);
  const ampm = m[3].toUpperCase();
  if (ampm === "PM" && h !== 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;
  return h * 60 + min;
}

export function isWithinCheckInWindow(schedule, now = new Date()) {
  const times = parseScheduleTimes(schedule);
  if (times.length === 0) return true;
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  return times.some(({ start }) => {
    const startMin = to24hMinutes(start);
    if (startMin == null) return false;
    // check-in allowed: scheduled start se 30 min pehle to 90 min baad tak
    return nowMinutes >= startMin - 30 && nowMinutes <= startMin + 90;
  });
}

export function formatDateTimeLabel(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()];
  const month = MONTH_NAMES[d.getMonth()].slice(0, 3);
  let h = d.getHours();
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  const min = pad2(d.getMinutes());
  return `${weekday}, ${month} ${d.getDate()}, ${d.getFullYear()}, ${pad2(h)}:${min} ${ampm}`;
}

export function durationLabel(checkIn, checkOut) {
  if (!checkIn || !checkOut) return "0m";
  const diffMs = new Date(checkOut) - new Date(checkIn);
  if (diffMs <= 0) return "0m";
  const totalMin = Math.round(diffMs / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export function attendanceStats(record) {
  const present = record.presentDates.length;
  const leave = record.leaveDates.length;
  const absent = Math.max(0, record.totalClasses - present - leave);
  const percentage = record.totalClasses > 0 ? ((present + leave) / record.totalClasses) * 100 : 0;
  return { present, leave, absent, percentage };
}

export function dayStatus(record, dateStr, dateObj) {
  if (record.presentDates.includes(dateStr)) return "present";
  if (record.leaveDates.includes(dateStr)) return "leave";
  const weekday = dateObj.getDay();
  if (CLASS_WEEKDAYS.includes(weekday) && dateObj <= TODAY_REF) return "absent";
  return "none";
}

export function formatSlotDate(d) {
  if (!d) return "—";
  const dateObj = new Date(d + "T00:00:00");
  return `${String(dateObj.getDate()).padStart(2, "0")} ${MONTH_NAMES[dateObj.getMonth()].slice(0, 3)} ${dateObj.getFullYear()}`;
}
