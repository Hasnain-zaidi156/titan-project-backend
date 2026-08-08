import { useState } from "react";
import { Icon, ICONS } from "./Icon";
import { useEscapeKey } from "./hooks";
import { GENDERS } from "../../constants/studentConstants";
import {
  SLOT_TRAINERS, SLOT_COURSES, SLOT_CAMPUSES, FACILITY_OPTIONS,
  SLOT_STATUS_OPTIONS, ONLINE_OPTIONS, CERT_OPTIONS,
} from "../../constants/slotConstants";

export function SlotFormModal({ title, initialValues, onClose, onSave }) {
  const [form, setForm] = useState(initialValues);
  useEscapeKey(onClose);
  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="ta-modal-overlay" onClick={onClose}>
      <form className="ta-modal ta-slot-modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit} role="dialog" aria-modal="true" aria-label={title}>
        <div className="ta-modal-header">
          <h3>{title}</h3>
          <button type="button" className="ta-modal-close" onClick={onClose} aria-label="Close">
            <Icon path={ICONS.close} size={18} />
          </button>
        </div>

        <div className="ta-modal-body">
          <div className="ta-slot-format-hint">
            Format: Mon 09:00 AM - 11:00 AM | Wed 09:00 AM - 11:00 AM | Fri 09:00 AM - 11:00 AM
          </div>

          <input
            className="ta-form-input ta-full-width"
            placeholder="schedule"
            value={form.schedule}
            onChange={(e) => set("schedule", e.target.value)}
          />

          <div className="ta-slot-form-row">
            <select className="ta-form-select" value={form.city} onChange={(e) => set("city", e.target.value)}>
              <option value="">Select city</option>
              {["Sukkur", "Karachi", "Lahore", "Islamabad"].map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
            <select className="ta-form-select" value={form.campus} onChange={(e) => set("campus", e.target.value)}>
              <option value="">Select campus</option>
              {SLOT_CAMPUSES.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          <select className="ta-form-select ta-full-width" value={form.course} onChange={(e) => set("course", e.target.value)}>
            <option value="">Select course</option>
            {SLOT_COURSES.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>

          <div className="ta-slot-form-row">
            <select className="ta-form-select" value={form.trainer} onChange={(e) => set("trainer", e.target.value)}>
              <option value="">Select trainer</option>
              {SLOT_TRAINERS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
            <select className="ta-form-select" value={form.classType} onChange={(e) => set("classType", e.target.value)}>
              <option value="">Class type</option>
              {FACILITY_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          <div className="ta-slot-form-row">
            <select className="ta-form-select" value={form.status} onChange={(e) => set("status", e.target.value)}>
              <option value="">Select status</option>
              {SLOT_STATUS_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
            <select className="ta-form-select" value={form.gender} onChange={(e) => set("gender", e.target.value)}>
              <option value="">Select gender</option>
              {GENDERS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          <div className="ta-slot-form-row">
            <input className="ta-form-input" type="date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} />
            <input className="ta-form-input" type="date" value={form.endDate} onChange={(e) => set("endDate", e.target.value)} />
          </div>

          <div className="ta-slot-form-row">
            <select className="ta-form-select" value={form.onlineOffline} onChange={(e) => set("onlineOffline", e.target.value)}>
              <option value="">Class Type</option>
              {ONLINE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
            <input
              className="ta-form-input"
              type="number"
              min="0"
              placeholder="Trainer hourly rate"
              value={form.hourlyRate}
              onChange={(e) => set("hourlyRate", e.target.value)}
            />
          </div>

          <div className="ta-slot-form-row">
            <select className="ta-form-select" value={form.cert} onChange={(e) => set("cert", e.target.value)}>
              <option value="Paid">Paid</option>
              <option value="Free">Free</option>
            </select>
            <input
              className="ta-form-input"
              placeholder="Whatsapp Group link"
              value={form.whatsappLink}
              onChange={(e) => set("whatsappLink", e.target.value)}
            />
          </div>

          <div className="ta-filter-field ta-full-width">
            <label>Capacity</label>
            <div className="ta-slot-capacity-row">
              <input
                type="range"
                min="0"
                max="200"
                aria-label="Capacity"
                value={form.capacity}
                onChange={(e) => set("capacity", Number(e.target.value))}
                className="ta-slot-capacity-slider"
              />
              <span className="ta-slot-capacity-value">{form.capacity}</span>
            </div>
          </div>
        </div>

        <div className="ta-modal-footer">
          <button type="button" className="ta-btn-outline" onClick={onClose}>Cancel</button>
          <button type="submit" className="ta-btn-primary">Submit</button>
        </div>
      </form>
    </div>
  );
}

export function SlotsFiltersModal({ onClose, onApply, initialValues }) {
  const [values, setValues] = useState(initialValues || {});
  useEscapeKey(onClose);
  const set = (key, val) => setValues((v) => ({ ...v, [key]: val }));

  const FIELDS = [
    { key: "trainer", label: "Trainer", options: SLOT_TRAINERS },
    { key: "course", label: "Course", options: SLOT_COURSES },
    { key: "campus", label: "Campus", options: SLOT_CAMPUSES },
    { key: "facility", label: "Facility", options: FACILITY_OPTIONS },
    { key: "gender", label: "Gender", options: GENDERS },
    { key: "status", label: "Status", options: SLOT_STATUS_OPTIONS },
    { key: "online", label: "Online", options: ONLINE_OPTIONS },
    { key: "cert", label: "Certificate", options: CERT_OPTIONS },
  ];

  return (
    <div className="ta-modal-overlay" onClick={onClose}>
      <div className="ta-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Slot filters">
        <div className="ta-modal-header">
          <h3>Filters</h3>
          <button className="ta-modal-close" onClick={onClose} aria-label="Close">
            <Icon path={ICONS.close} size={18} />
          </button>
        </div>

        <div className="ta-modal-body">
          {FIELDS.map((f) => (
            <div className="ta-filter-field" key={f.key}>
              <label>{f.label}</label>
              <select className="ta-form-select" value={values[f.key] || ""} onChange={(e) => set(f.key, e.target.value)}>
                <option value="">{f.label}</option>
                {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>

        <div className="ta-modal-footer">
          <button className="ta-btn-outline" onClick={() => { setValues({}); onApply({}); }}>Reset</button>
          <button className="ta-btn-outline" onClick={onClose}>Cancel</button>
          <button className="ta-btn-primary" onClick={() => { onApply(values); onClose(); }}>Apply</button>
        </div>
      </div>
    </div>
  );
}
