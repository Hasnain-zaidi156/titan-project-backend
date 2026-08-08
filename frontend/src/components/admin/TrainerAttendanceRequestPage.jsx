import { useState, useEffect } from "react";
import { Icon, ICONS } from "./Icon";
import { useEscapeKey } from "./hooks";
import { ToastStack } from "./ToastStack";
import { useToasts } from "./hooks";
import { API_URL } from "../../constants/config";
import { TODAY_REF, toYMD } from "../../utils/dateUtils";
import { TrainerAttendanceFiltersModal } from "./TrainerAttendanceModals";

function AttendanceRequestFormModal({ onClose, onSubmit, trainers, submitting }) {
  const [employeeId, setEmployeeId] = useState(trainers?.[0]?.employeeId || "");
  const [date, setDate] = useState(toYMD(TODAY_REF.getFullYear(), TODAY_REF.getMonth(), TODAY_REF.getDate()));
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [reason, setReason] = useState("");
  useEscapeKey(onClose);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trainer = trainers?.find((t) => t.employeeId === employeeId);
    if (!trainer) return;
    onSubmit({ trainer, date, checkIn, checkOut, reason });
  };

  return (
    <div className="ta-modal-overlay" onClick={onClose}>
      <form className="ta-modal" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit} role="dialog" aria-modal="true" aria-label="Attendance request">
        <div className="ta-modal-header">
          <h3>Attendance Request</h3>
          <button type="button" className="ta-modal-close" onClick={onClose} aria-label="Close">
            <Icon path={ICONS.close} size={18} />
          </button>
        </div>
        <div className="ta-modal-body">
          <div className="ta-filter-field">
            <label>Trainer *</label>
            <select className="ta-form-select" required value={employeeId} onChange={(e) => setEmployeeId(e.target.value)}>
              <option value="">Select trainer</option>
              {(trainers || []).map((t) => (
                <option key={t.employeeId} value={t.employeeId}>{t.name} ({t.employeeId})</option>
              ))}
            </select>
          </div>
          <div className="ta-filter-field">
            <label>Date</label>
            <div className="ta-date-range-wrap">
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              <Icon path={ICONS.calendar} size={15} />
            </div>
          </div>
          <div className="ta-filter-field">
            <label>Check In</label>
            <input className="ta-form-input" type="time" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
          </div>
          <div className="ta-filter-field">
            <label>Check Out</label>
            <input className="ta-form-input" type="time" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
          </div>
          <div className="ta-filter-field">
            <label>Reason</label>
            <textarea
              className="ta-updation-textarea"
              style={{ minHeight: 80 }}
              placeholder="Enter reason for correction..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>
        <div className="ta-modal-footer">
          <button type="button" className="ta-btn-outline" onClick={onClose}>Cancel</button>
          <button type="submit" className="ta-btn-primary" disabled={submitting || !trainers?.length}>
            {submitting ? "Submitting…" : "Submit Request"}
          </button>
        </div>
      </form>
    </div>
  );
}

export function TrainerAttendanceRequestPage() {
  const [requests, setRequests] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({});
  const [generateOpen, setGenerateOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toasts, showToast } = useToasts();

  // ---- Correction requests + trainer list MongoDB se load karo ----
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const [reqRes, trainerRes] = await Promise.all([
          fetch(`${API_URL}/api/trainer-attendance-requests`),
          fetch(`${API_URL}/api/trainers`),
        ]);
        const reqData = await reqRes.json();
        const trainerData = await trainerRes.json();
        if (!cancelled) {
          setRequests(reqRes.ok && Array.isArray(reqData) ? reqData : []);
          setTrainers(trainerRes.ok && Array.isArray(trainerData) ? trainerData : []);
        }
      } catch (error) {
        console.error("Failed to load attendance requests", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // ---- Nayi correction request: POST to MongoDB ----
  const handleGenerate = async (vals) => {
    setSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/api/trainer-attendance-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trainerId: vals.trainer.id,
          trainerName: vals.trainer.name,
          campus: vals.trainer.campus,
          schedule: vals.trainer.slotSchedule,
          checkIn: vals.checkIn,
          checkOut: vals.checkOut,
          type: "Correction",
          status: "pending",
          reason: vals.reason,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to submit request");
      }
      setRequests((prev) => [data, ...prev]);
      setGenerateOpen(false);
      showToast("Request submitted");
    } catch (error) {
      console.error("Submit attendance request error:", error);
      showToast(error.message || "Could not submit request", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="ta-students-page">
      <div className="ta-students-toolbar">
        <button className="ta-icon-only-btn" title="View options" aria-label="View options">
          <Icon path={ICONS.sliders} size={16} />
        </button>
        <button className="ta-btn-outline ta-filters-btn" onClick={() => setFiltersOpen(true)}>
          <Icon path={ICONS.filter} size={15} />
          Filters
          {Object.values(appliedFilters).some(Boolean) && <span className="ta-filter-dot" />}
        </button>
        <div style={{ flex: 1 }} />
        <button className="ta-btn-primary" onClick={() => showToast("Searched")}>Search</button>
        <button className="ta-btn-primary ta-generate-request-btn" onClick={() => setGenerateOpen(true)}>
          Generate Request
        </button>
      </div>

      <div className="ta-table-wrap">
        <table className="ta-table">
          <thead>
            <tr>
              <th style={{ width: 32 }}><input type="checkbox" aria-label="Select all requests" /></th>
              <th>Trainer</th>
              <th>Campus</th>
              <th>Schedule</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Type</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9}><div className="ta-empty-state"><p>Loading requests…</p></div></td></tr>
            ) : requests.length === 0 ? (
              <tr><td colSpan={9}><div className="ta-empty-state"><Icon path={ICONS.inbox} size={42} /><p>No data</p></div></td></tr>
            ) : (
              requests.map((r) => (
                <tr key={r.id}>
                  <td><input type="checkbox" aria-label={`Select request for ${r.trainerName}`} /></td>
                  <td>{r.trainerName}</td>
                  <td>{r.campus}</td>
                  <td>{r.schedule}</td>
                  <td>{r.checkIn || "—"}</td>
                  <td>{r.checkOut || "—"}</td>
                  <td>{r.type}</td>
                  <td><span className="ta-badge ta-badge-orange">{r.status}</span></td>
                  <td>—</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filtersOpen && (
        <TrainerAttendanceFiltersModal
          initialValues={appliedFilters}
          onClose={() => setFiltersOpen(false)}
          onApply={setAppliedFilters}
          trainers={trainers}
        />
      )}

      {generateOpen && (
        <AttendanceRequestFormModal
          onClose={() => setGenerateOpen(false)}
          trainers={trainers}
          submitting={submitting}
          onSubmit={handleGenerate}
        />
      )}

      <ToastStack toasts={toasts} />
    </div>
  );
}
