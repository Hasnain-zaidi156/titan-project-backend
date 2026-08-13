import { useEffect, useState } from "react";
import { API_URL } from "../../constants/config";

function currentMonthValue() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

// Trainer ki salary = hourlyRate * (checkIn -> checkOut) se actual worked
// hours, sab kuch real TrainerAttendance records se calculate hota hai
// (GET /api/trainers/:id/salary), koi manual number nahi.
export function SalaryModal({ trainer, onClose }) {
  const [month, setMonth] = useState(currentMonthValue());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    fetch(`${API_URL}/api/trainers/${trainer.id}/salary?month=${month}`)
      .then((r) => r.json().then((d) => ({ ok: r.ok, d })))
      .then(({ ok, d }) => {
        if (cancelled) return;
        if (!ok) throw new Error(d.message || "Failed to load salary");
        setData(d);
      })
      .catch((err) => { if (!cancelled) setError(err.message || "Could not load salary"); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [trainer.id, month]);

  return (
    <div className="ta-modal-overlay" onClick={onClose}>
      <div className="ta-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Trainer salary">
        <div className="ta-modal-header">
          <h3>Salary — {trainer.name}</h3>
          <button className="ta-modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="ta-modal-body">
          <div className="ta-filter-field" style={{ marginBottom: 16 }}>
            <label>Month</label>
            <input type="month" className="ta-form-input" value={month} onChange={(e) => setMonth(e.target.value)} />
          </div>

          {loading ? (
            <p style={{ fontSize: 13, color: "var(--ta-text-muted)" }}>Calculating…</p>
          ) : error ? (
            <p className="ta-error">{error}</p>
          ) : !trainer.hourlyRate ? (
            <p style={{ fontSize: 13, color: "var(--ta-text-muted)" }}>
              Is trainer ka Hourly Rate set nahi hai — Edit karke rate set karo, phir salary yahan calculate hogi.
            </p>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
                <div className="ta-panel" style={{ padding: 12, textAlign: "center" }}>
                  <div style={{ fontSize: 20, fontWeight: 700 }}>{data.totalHours}</div>
                  <div style={{ fontSize: 11, color: "var(--ta-text-muted)" }}>Total Hours</div>
                </div>
                <div className="ta-panel" style={{ padding: 12, textAlign: "center" }}>
                  <div style={{ fontSize: 20, fontWeight: 700 }}>Rs {data.hourlyRate}</div>
                  <div style={{ fontSize: 11, color: "var(--ta-text-muted)" }}>Rate / Hour</div>
                </div>
                <div className="ta-panel" style={{ padding: 12, textAlign: "center", background: "var(--ta-accent-bg, #eff6ff)" }}>
                  <div style={{ fontSize: 20, fontWeight: 800 }}>Rs {data.totalSalary.toLocaleString()}</div>
                  <div style={{ fontSize: 11, color: "var(--ta-text-muted)" }}>Total Salary</div>
                </div>
              </div>

              <div className="table-responsive-wrapper">
                <table className="ta-table">
                  <thead><tr><th>Date</th><th>Check In</th><th>Check Out</th><th>Hours</th></tr></thead>
                  <tbody>
                    {data.breakdown.length === 0 ? (
                      <tr><td colSpan={4} style={{ textAlign: "center", color: "var(--ta-text-muted)" }}>Is month me koi complete (check-in + check-out) record nahi mila.</td></tr>
                    ) : data.breakdown.map((r, i) => (
                      <tr key={i}>
                        <td>{r.date}</td>
                        <td>{r.checkIn.slice(11, 16)}</td>
                        <td>{r.checkOut.slice(11, 16)}</td>
                        <td>{r.hours}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
        <div className="ta-modal-footer">
          <button className="ta-btn-primary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
