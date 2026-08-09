import { useState, useEffect, useRef } from "react";

// Reusable Days + Time picker. Dono StudentModals.jsx aur TrainerFormModal.jsx
// isko use karte hain taake student ka "timing" field aur trainer ka
// "slotSchedule" field HAMESHA same string format mein bane —
// e.g. "Sat 09:00 AM - 11:00 AM | Sun 09:00 AM - 11:00 AM" — is se
// backend par trainer <-> student matching reliably kaam karti hai.

const DAYS = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

function to12h(hhmm) {
  if (!hhmm) return "";
  const [h0, m] = hhmm.split(":").map(Number);
  const ampm = h0 >= 12 ? "PM" : "AM";
  let h = h0 % 12;
  if (h === 0) h = 12;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")} ${ampm}`;
}

function to24h(t12) {
  const m = String(t12).trim().match(/(\d{1,2}):(\d{2})\s?([AP]M)/i);
  if (!m) return "";
  let h = Number(m[1]);
  const min = m[2];
  const ampm = m[3].toUpperCase();
  if (ampm === "PM" && h !== 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${min}`;
}

// "Sat 09:00 AM - 11:00 AM | Sun 09:00 AM - 11:00 AM" -> { days, start, end }
function parseSchedule(str) {
  if (!str) return { days: [], start: "", end: "" };
  const parts = String(str).split("|").map((p) => p.trim()).filter(Boolean);
  const days = [];
  let start = "";
  let end = "";
  parts.forEach((part) => {
    const m = part.match(/^(\w{3})\s+(\d{1,2}:\d{2}\s?[AP]M)\s*-\s*(\d{1,2}:\d{2}\s?[AP]M)$/i);
    if (m) {
      if (!days.includes(m[1])) days.push(m[1]);
      if (!start) {
        start = to24h(m[2]);
        end = to24h(m[3]);
      }
    }
  });
  return { days, start, end };
}

export function DayTimePicker({ value, onChange }) {
  const initial = useRef(parseSchedule(value));
  const [days, setDays] = useState(initial.current.days);
  const [start, setStart] = useState(initial.current.start);
  const [end, setEnd] = useState(initial.current.end);

  useEffect(() => {
    if (days.length === 0 || !start || !end) {
      onChange("");
      return;
    }
    const str = days.map((d) => `${d} ${to12h(start)} - ${to12h(end)}`).join(" | ");
    onChange(str);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days, start, end]);

  const toggleDay = (d) => {
    setDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));
  };

  return (
    <div className="ta-daytime-picker">
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
        {DAYS.map((d) => {
          const active = days.includes(d);
          return (
            <button
              type="button"
              key={d}
              onClick={() => toggleDay(d)}
              style={{
                padding: "6px 12px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                border: active ? "1px solid #1e40af" : "1px solid #d1d5db",
                background: active ? "#1e40af" : "#fff",
                color: active ? "#fff" : "#333",
                transition: "all 0.15s ease",
              }}
            >
              {d}
            </button>
          );
        })}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input
          type="time"
          className="ta-form-input"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          aria-label="Start time"
        />
        <span style={{ fontSize: 12, color: "#666" }}>to</span>
        <input
          type="time"
          className="ta-form-input"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          aria-label="End time"
        />
      </div>
      {days.length > 0 && start && end && (
        <p style={{ fontSize: 11, color: "#666", marginTop: 6 }}>
          {days.map((d) => `${d} ${to12h(start)} - ${to12h(end)}`).join(" | ")}
        </p>
      )}
    </div>
  );
}
