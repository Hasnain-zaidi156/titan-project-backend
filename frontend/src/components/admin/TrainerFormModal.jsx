import { useState } from "react";
import { Icon, ICONS } from "./Icon";
import { useEscapeKey } from "./hooks";
import { PhotoUploadField } from "./Avatar";
import { DayTimePicker } from "./DayTimePicker";
import { COURSES, CITIES, CAMPUSES } from "../../constants/studentConstants";
import { TRAINER_STATUS_OPTIONS } from "../../constants/trainerConstants";

// mode: "add" | "edit" — add mein password required hai (login ke liye),
// edit mein optional hai (khali chor do to purana password wahi rahega).
export function TrainerFormModal({ title, mode, initialValues, onClose, onSave, saving, serverError }) {
  const [form, setForm] = useState({ ...initialValues, password: "" });
  const [passwordError, setPasswordError] = useState("");
  useEscapeKey(onClose);
  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || (mode === "edit" && !form.employeeId.trim())) return;

    if (mode === "add" && (!form.password || form.password.length < 6)) {
      setPasswordError("Password required hai (kam se kam 6 characters) — yehi trainer ka login password banega.");
      return;
    }
    if (mode === "edit" && form.password && form.password.length < 6) {
      setPasswordError("Password kam se kam 6 characters ka hona chahiye.");
      return;
    }
    setPasswordError("");

    // Edit mode mein agar password khali chora hai to bhejna hi nahi —
    // backend isko "no change" samjhega aur purana password barqarar rahega.
    const payload = { ...form };
    if (mode === "edit" && !form.password) delete payload.password;

    onSave(payload);
  };

  return (
    <div className="ta-modal-overlay" onClick={onClose}>
      <form className="ta-modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit} role="dialog" aria-modal="true" aria-label={title}>
        <div className="ta-modal-header">
          <h3>{title}</h3>
          <button type="button" className="ta-modal-close" onClick={onClose} aria-label="Close">
            <Icon path={ICONS.close} size={18} />
          </button>
        </div>
        <div className="ta-modal-body">
          <PhotoUploadField label="Trainer Photo" value={form.photo} onChange={(val) => set("photo", val)} />

          <div className="ta-filter-field">
            <label>Trainer name *</label>
            <input className="ta-form-input" required value={form.name} onChange={(e) => set("name", e.target.value)} />
          </div>
          <div className="ta-filter-field">
            <label>Email (Gmail) *</label>
            <input className="ta-form-input" type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="trainer@gmail.com" />
          </div>
          <div className="ta-filter-field">
            <label>{mode === "add" ? "Password *" : "Password (naya set karne ke liye likhein)"}</label>
            <input
              className={`ta-form-input ${passwordError ? "ta-form-input-error" : ""}`}
              type="password"
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              placeholder={mode === "edit" ? "Khali chor dein — password change nahi hoga" : "Kam se kam 6 characters"}
            />
            <p className="ta-field-hint" style={{ fontSize: 11, color: "var(--ta-text-muted)", marginTop: 4 }}>
              Trainer isi Email + Password se login karega.
            </p>
            {passwordError && <p className="ta-field-error-msg">{passwordError}</p>}
          </div>
          <div className="ta-filter-field">
            <label>Employee ID (Roll No){mode === "edit" ? " *" : ""}</label>
            {mode === "add" ? (
              <>
                <input className="ta-form-input" value="Auto-assigned on save (starts at 500)" disabled />
                <p className="ta-field-hint" style={{ fontSize: 11, color: "var(--ta-text-muted)", marginTop: 4 }}>
                  Employee ID system khud generate karega — 500 se shuru hoke agla available number.
                </p>
              </>
            ) : (
              <input className="ta-form-input" required value={form.employeeId} onChange={(e) => set("employeeId", e.target.value)} />
            )}
          </div>
          <div className="ta-filter-field">
            <label>Course</label>
            <select className="ta-form-select" value={form.courses} onChange={(e) => set("courses", e.target.value)}>
              {COURSES.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div className="ta-filter-field">
            <label>City</label>
            <select className="ta-form-select" value={form.cities} onChange={(e) => set("cities", e.target.value)}>
              {CITIES.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div className="ta-filter-field">
            <label>Campus</label>
            <select className="ta-form-select" value={form.campus} onChange={(e) => set("campus", e.target.value)}>
              {CAMPUSES.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div className="ta-filter-field" style={{ gridColumn: "1 / -1" }}>
            <label>Slot Schedule (Days + Time)</label>
            <DayTimePicker value={form.slotSchedule} onChange={(val) => set("slotSchedule", val)} />
            <p className="ta-field-hint" style={{ fontSize: 11, color: "var(--ta-text-muted)", marginTop: 4 }}>
              Yehi schedule student ke Timing field se match karke sahi students trainer ke course card mein dikhata hai.
            </p>
          </div>
          <div className="ta-filter-field">
            <label>Status</label>
            <select className="ta-form-select" value={form.status} onChange={(e) => set("status", e.target.value)}>
              {TRAINER_STATUS_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          {serverError && (
            <div className="ta-error" role="alert" style={{ gridColumn: "1 / -1" }}>
              {serverError}
            </div>
          )}
        </div>
        <div className="ta-modal-footer">
          <button type="button" className="ta-btn-outline" onClick={onClose}>Cancel</button>
          <button type="submit" className="ta-btn-primary" disabled={saving}>{saving ? "Saving…" : "Save"}</button>
        </div>
      </form>
    </div>
  );
}
