import { useState } from "react";
import { Icon, ICONS } from "./Icon";
import { useEscapeKey } from "./hooks";
import { PhotoUploadField } from "./Avatar";
import { COURSES, CITIES, CAMPUSES } from "../../constants/studentConstants";
import { TRAINER_STATUS_OPTIONS } from "../../constants/trainerConstants";

export function TrainerFormModal({ title, initialValues, onClose, onSave, saving, serverError }) {
  const [form, setForm] = useState(initialValues);
  useEscapeKey(onClose);
  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.employeeId.trim()) return;
    onSave(form);
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
            <label>Email *</label>
            <input className="ta-form-input" type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} />
          </div>
          <div className="ta-filter-field">
            <label>Employee ID (Roll No) *</label>
            <input className="ta-form-input" required value={form.employeeId} onChange={(e) => set("employeeId", e.target.value)} />
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
          <div className="ta-filter-field">
            <label>Slot Schedule</label>
            <input
              className="ta-form-input"
              placeholder="Sat 09:00 AM - 11:00 AM | Sun 09:00 AM - 11:00 AM"
              value={form.slotSchedule}
              onChange={(e) => set("slotSchedule", e.target.value)}
            />
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
