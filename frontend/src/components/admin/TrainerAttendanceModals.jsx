import { useState } from "react";
import { Icon, ICONS } from "./Icon";
import { useEscapeKey } from "./hooks";
import { CITIES, CAMPUSES } from "../../constants/studentConstants";
import { TRAINERS_FULL_LIST } from "../../constants/trainerConstants";
import { TODAY_REF, toYMD } from "../../utils/dateUtils";

// Exported taake TrainerAttendanceRequestPage bhi isko reuse kar sake
export function TrainerAttendanceFiltersModal({ onClose, onApply, initialValues, trainers }) {
  const [values, setValues] = useState(initialValues || {});
  useEscapeKey(onClose);
  const set = (key, val) => setValues((v) => ({ ...v, [key]: val }));

  const trainerList = trainers?.length ? trainers : TRAINERS_FULL_LIST;
  const trainerNames = trainerList.map((t) => t.name);
  const courseNames = [...new Set(trainerList.flatMap((t) => t.courses))];
  const scheduleOptions = [...new Set(trainerList.map((t) => t.slotSchedule))];

  return (
    <div className="ta-modal-overlay" onClick={onClose}>
      <div className="ta-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Trainer attendance filters">
        <div className="ta-modal-header">
          <h3>Filters</h3>
          <button className="ta-modal-close" onClick={onClose} aria-label="Close">
            <Icon path={ICONS.close} size={18} />
          </button>
        </div>
        <div className="ta-modal-body">
          <div className="ta-filter-field">
            <label>City</label>
            <select className="ta-form-select" value={values.city || ""} onChange={(e) => set("city", e.target.value)}>
              <option value="">City</option>
              {CITIES.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div className="ta-filter-field">
            <label>Campus</label>
            <select className="ta-form-select" value={values.campus || ""} onChange={(e) => set("campus", e.target.value)}>
              <option value="">Campus</option>
              {CAMPUSES.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div className="ta-filter-field">
            <label>Course</label>
            <select className="ta-form-select" value={values.course || ""} onChange={(e) => set("course", e.target.value)}>
              <option value="">Course</option>
              {courseNames.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div className="ta-filter-field">
            <label>Trainer</label>
            <select className="ta-form-select" value={values.trainer || ""} onChange={(e) => set("trainer", e.target.value)}>
              <option value="">Trainer</option>
              {trainerNames.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div className="ta-filter-field">
            <label>Slot Schedule</label>
            <select className="ta-form-select" value={values.slotSchedule || ""} onChange={(e) => set("slotSchedule", e.target.value)}>
              <option value="">Slot Schedule</option>
              {scheduleOptions.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div className="ta-filter-field">
            <label>Start date  →  End date</label>
            <div className="ta-date-range-wrap">
              <input type="date" aria-label="Start date" value={values.startDate || ""} onChange={(e) => set("startDate", e.target.value)} />
              <span style={{ color: "var(--ta-text-muted)", fontSize: 11 }}>to</span>
              <input type="date" aria-label="End date" value={values.endDate || ""} onChange={(e) => set("endDate", e.target.value)} />
              <Icon path={ICONS.calendar} size={15} />
            </div>
          </div>
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

export function TrainerAttendanceEditModal({ record, onClose, onSave }) {
  const initialDate = record.checkIn ? record.checkIn.slice(0, 10) : toYMD(TODAY_REF.getFullYear(), TODAY_REF.getMonth(), TODAY_REF.getDate());
  const [date, setDate] = useState(initialDate);
  const [checkIn, setCheckIn] = useState(record.checkIn ? record.checkIn.slice(11, 16) : "");
  const [checkOut, setCheckOut] = useState(record.checkOut ? record.checkOut.slice(11, 16) : "");
  useEscapeKey(onClose);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      checkIn: checkIn ? `${date}T${checkIn}:00` : record.checkIn,
      checkOut: checkOut ? `${date}T${checkOut}:00` : record.checkOut,
    });
  };

  return (
    <div className="ta-modal-overlay" onClick={onClose}>
      <form className="ta-modal" style={{ maxWidth: 380 }} onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit} role="dialog" aria-modal="true" aria-label={`Edit attendance for ${record.trainerName}`}>
        <div className="ta-modal-header">
          <h3>Edit Attendance — {record.trainerName}</h3>
          <button type="button" className="ta-modal-close" onClick={onClose} aria-label="Close">
            <Icon path={ICONS.close} size={18} />
          </button>
        </div>
        <div className="ta-modal-body">
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
        </div>
        <div className="ta-modal-footer">
          <button type="button" className="ta-btn-outline" onClick={onClose}>Cancel</button>
          <button type="submit" className="ta-btn-primary">Save</button>
        </div>
      </form>
    </div>
  );
}
