// ============================================================
// Shared helper: trainer ke real (admin-assigned) course schedule
// strings — jaise "Mon 10:00 AM - 12:00 PM | Wed 10:00 AM - 12:00 PM"
// ya slot codes jaise "MWF" — se weekday numbers nikaalta hai.
// CalendarPage aur CoursesHome dono isi se drive hote hain taake
// dono jagah exact same real data dikhe.
// ============================================================

const DAY_MAP = {
  sun: 0, sunday: 0,
  mon: 1, monday: 1,
  tue: 2, tues: 2, tuesday: 2,
  wed: 3, wednesday: 3,
  thu: 4, thur: 4, thurs: 4, thursday: 4,
  fri: 5, friday: 5,
  sat: 6, saturday: 6,
};

// "Mon 10:00 AM - 12:00 PM | Wed ..." -> [1, 3]
// Fallback: slot code jaise "MWF" -> [1, 3, 5]
export const parseScheduleDays = (scheduleStr) => {
  if (!scheduleStr || typeof scheduleStr !== 'string') return [];
  const days = new Set();

  if (scheduleStr.includes('|') || /^[A-Za-z]+\s/.test(scheduleStr.trim())) {
    scheduleStr.split('|').forEach((seg) => {
      const match = seg.trim().match(/^([A-Za-z]+)/);
      if (match && DAY_MAP[match[1].toLowerCase()] !== undefined) {
        days.add(DAY_MAP[match[1].toLowerCase()]);
      }
    });
  }

  if (days.size === 0) {
    // Slot-code fallback, e.g. "MWF", "TTh", "SatSun"
    const codeMap = { M: 1, T: 2, W: 3, Th: 4, F: 5, Sa: 6, Su: 0 };
    let rest = scheduleStr.trim();
    const codes = Object.keys(codeMap).sort((a, b) => b.length - a.length);
    while (rest.length > 0) {
      const hit = codes.find((c) => rest.startsWith(c));
      if (!hit) break;
      days.add(codeMap[hit]);
      rest = rest.slice(hit.length);
    }
  }

  return [...days];
};

// Trainer ke live courses (Dashboard se aate hain) -> weekday number
// (0=Sun..6=Sat) -> [{ title, campus, batch, color }] jo us din chalte hain.
export const buildWeekdayCourseMap = (courses) => {
  const map = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
  (courses || []).forEach((c) => {
    const days = parseScheduleDays(c.schedule);
    days.forEach((d) => {
      if (!map[d].some((e) => e.title === c.title && e.batch === c.batch)) {
        map[d].push({
          title: c.title,
          campus: c.campus,
          batch: c.batch,
          color: c.bgHeader || '#dcfce7',
          accentColor: c.accentColor || '#10b981',
        });
      }
    });
  });
  return map;
};
