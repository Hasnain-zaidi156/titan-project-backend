import { useState } from "react";
import { Icon, ICONS } from "./Icon";
import { useEscapeKey } from "./hooks";
import { Avatar, PhotoUploadField } from "./Avatar";
import { CustomSelect } from "./CustomSelect";
import { DayTimePicker } from "./DayTimePicker";
import {
  FILTER_FIELDS, COUNTRIES, CITIES, CAMPUSES, COURSES, BATCHES, SLOTS,
  STATUS_OPTIONS, PAYMENT_STATUS_OPTIONS, GENDERS, LAPTOP_OPTIONS,
  validateStudentForm,
} from "../../constants/studentConstants";

export function FiltersModal({ onClose, onApply, initialValues }) {
  const [values, setValues] = useState(initialValues || {});
  useEscapeKey(onClose);

  const setField = (key, val) => setValues((v) => ({ ...v, [key]: val }));

  return (
    <div className="ta-modal-overlay" onClick={onClose}>
      <div className="ta-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Filters">
        <div className="ta-modal-header">
          <h3>Filters</h3>
          <button className="ta-modal-close" onClick={onClose} aria-label="Close filters">
            <Icon path={ICONS.close} size={18} />
          </button>
        </div>

        <div className="ta-modal-body">
          <div className="ta-filter-field">
            <label>{FILTER_FIELDS[0].label}</label>
            <div className="ta-date-range-wrap">
              <input
                type="date"
                aria-label="Start date"
                value={values.startDate || ""}
                onChange={(e) => setField("startDate", e.target.value)}
              />
              <span style={{ color: "var(--ta-text-muted)", fontSize: "11px" }}>to</span>
              <input
                type="date"
                aria-label="End date"
                value={values.endDate || ""}
                onChange={(e) => setField("endDate", e.target.value)}
              />
              <Icon path={ICONS.calendar} size={15} />
            </div>
          </div>

          {FILTER_FIELDS.slice(1).map((field) => (
            <CustomSelect
              key={field.key}
              label={field.label}
              value={values[field.key]}
              options={field.options}
              onChange={(val) => setField(field.key, val)}
            />
          ))}
        </div>

        <div className="ta-modal-footer">
          <button
            className="ta-btn-outline"
            onClick={() => {
              setValues({});
              onApply({});
            }}
          >
            Reset
          </button>
          <button className="ta-btn-outline" onClick={onClose}>Cancel</button>
          <button
            className="ta-btn-primary"
            onClick={() => {
              onApply(values);
              onClose();
            }}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

export function StudentFormModal({ title, initialValues, onClose, onSave, saving, serverError }) {
  const [form, setForm] = useState(initialValues);
  const [errors, setErrors] = useState({});
  useEscapeKey(onClose);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = validateStudentForm(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
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
          <PhotoUploadField label="Student Photo" value={form.photo} onChange={(val) => set("photo", val)} />

          <div className="ta-filter-field">
            <label>Roll Number</label>
            <input
              className="ta-form-input"
              value={form.rollNumber}
              onChange={(e) => set("rollNumber", e.target.value)}
              placeholder="Leave blank to auto-generate"
            />
            <p className="ta-field-hint" style={{ fontSize: 11, color: "var(--ta-text-muted)", marginTop: 4 }}>
              Blank chor dein to unique roll number khud generate ho jayega.
            </p>
          </div>

          <div className="ta-filter-field">
            <label>Student name *</label>
            <input className="ta-form-input" required value={form.studentName} onChange={(e) => set("studentName", e.target.value)} />
          </div>
          <div className="ta-filter-field">
            <label>Father name *</label>
            <input className="ta-form-input" required value={form.fatherName} onChange={(e) => set("fatherName", e.target.value)} />
          </div>
          <div className="ta-filter-field">
            <label>CNIC *</label>
            <input
              className={`ta-form-input ${errors.cnic ? "ta-form-input-error" : ""}`}
              required
              value={form.cnic}
              onChange={(e) => set("cnic", e.target.value)}
              placeholder="00000-0000000-0"
            />
            {errors.cnic && <p className="ta-field-error-msg">{errors.cnic}</p>}
          </div>
          <div className="ta-filter-field">
            <label>Date of Birth</label>
            <div className="ta-date-range-wrap">
              <input
                type="date"
                className={errors.dob ? "ta-form-input-error" : ""}
                value={form.dob}
                onChange={(e) => set("dob", e.target.value)}
                aria-label="Date of birth"
              />
              <Icon path={ICONS.calendar} size={15} />
            </div>
            <p className="ta-field-hint" style={{ fontSize: 11, color: "var(--ta-text-muted)", marginTop: 4 }}>
              Student "Create Password" screen par CNIC + DOB se identity verify hoti hai — optional hai, lekin is field ke bina wo login nahi bana sakega.
            </p>
            {errors.dob && <p className="ta-field-error-msg">{errors.dob}</p>}
          </div>
          <div className="ta-filter-field">
            <label>Phone *</label>
            <input
              className={`ta-form-input ${errors.phone ? "ta-form-input-error" : ""}`}
              required
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="03XX-XXXXXXX"
            />
            {errors.phone && <p className="ta-field-error-msg">{errors.phone}</p>}
          </div>
          <div className="ta-filter-field">
            <label>Country</label>
            <select className="ta-form-select" value={form.country} onChange={(e) => set("country", e.target.value)}>
              {COUNTRIES.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div className="ta-filter-field">
            <label>City</label>
            <select className="ta-form-select" value={form.city} onChange={(e) => set("city", e.target.value)}>
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
            <label>Course</label>
            <select className="ta-form-select" value={form.course} onChange={(e) => set("course", e.target.value)}>
              {COURSES.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div className="ta-filter-field">
            <label>Batch</label>
            <select className="ta-form-select" value={form.batch} onChange={(e) => set("batch", e.target.value)}>
              {BATCHES.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div className="ta-filter-field">
            <label>Slot</label>
            <select className="ta-form-select" value={form.slot} onChange={(e) => set("slot", e.target.value)}>
              {SLOTS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div className="ta-filter-field" style={{ gridColumn: "1 / -1" }}>
            <label>Timing (Days + Time)</label>
            <DayTimePicker value={form.timing} onChange={(val) => set("timing", val)} />
            <p className="ta-field-hint" style={{ fontSize: 11, color: "var(--ta-text-muted)", marginTop: 4 }}>
              Yehi timing trainer ke slot schedule se match karke uske Course card mein student dikhata hai.
            </p>
          </div>
          <div className="ta-filter-field">
            <label>Status</label>
            <select className="ta-form-select" value={form.status} onChange={(e) => set("status", e.target.value)}>
              {STATUS_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div className="ta-filter-field">
            <label>Payment Status</label>
            <select className="ta-form-select" value={form.paymentStatus} onChange={(e) => set("paymentStatus", e.target.value)}>
              {PAYMENT_STATUS_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div className="ta-filter-field">
            <label>Gender</label>
            <select className="ta-form-select" value={form.gender} onChange={(e) => set("gender", e.target.value)}>
              {GENDERS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div className="ta-filter-field">
            <label>Laptop</label>
            <select className="ta-form-select" value={form.laptop} onChange={(e) => set("laptop", e.target.value)}>
              {LAPTOP_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
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

export function ViewStudentModal({ student, onClose }) {
  useEscapeKey(onClose);
  const FIELDS = [
    ["Roll Number", student.rollNumber],
    ["Admission No", student.admissionNo],
    ["Student name", student.studentName],
    ["Father name", student.fatherName],
    ["CNIC", student.cnic],
    ["Date of Birth", student.dob],
    ["Phone", student.phone],
    ["Country", student.country],
    ["City", student.city],
    ["Campus", student.campus],
    ["Course", student.course],
    ["Batch", student.batch],
    ["Slot", student.slot],
    ["Timing", student.timing],
    ["Status", student.status],
    ["Payment Status", student.paymentStatus],
    ["Gender", student.gender],
    ["Laptop", student.laptop],
  ];

  return (
    <div className="ta-modal-overlay" onClick={onClose}>
      <div className="ta-modal ta-view-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Student details">
        <div className="ta-modal-header">
          <h3>Student Details</h3>
          <button className="ta-modal-close" onClick={onClose} aria-label="Close">
            <Icon path={ICONS.close} size={18} />
          </button>
        </div>
        <div style={{ display: "flex", justifyContent: "center", padding: "16px 0 4px" }}>
          <Avatar src={student.photo} alt={student.studentName} size={84} />
        </div>
        <div className="ta-view-grid">
          {FIELDS.map(([label, val]) => (
            <div className="ta-view-row" key={label}>
              <span className="ta-view-label">{label}</span>
              <span className="ta-view-value">{val || "—"}</span>
            </div>
          ))}
        </div>
        <div className="ta-modal-footer">
          <button className="ta-btn-primary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export function PaymentsModal({ student, onClose, onGenerate, onMarkPaid }) {
  const [month, setMonth] = useState("");
  useEscapeKey(onClose);

  return (
    <div className="ta-modal-overlay" onClick={onClose}>
      <div className="ta-modal ta-payments-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={`Payments for ${student.studentName}`}>
        <div className="ta-modal-header">
          <h3>Payments — {student.studentName}</h3>
          <button className="ta-modal-close" onClick={onClose} aria-label="Close">
            <Icon path={ICONS.close} size={18} />
          </button>
        </div>

        <div className="ta-table-wrap ta-payments-table-wrap">
          <table className="ta-table">
            <thead>
              <tr>
                <th>Invoice number</th>
                <th>JazzCash ID</th>
                <th>Type</th>
                <th>Month</th>
                <th>Due date</th>
                <th>Amount (Rs)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {student.invoices.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className="ta-empty-state">
                      <Icon path={ICONS.inbox} size={36} />
                      <p>No invoices yet</p>
                    </div>
                  </td>
                </tr>
              ) : (
                student.invoices.map((inv, i) => (
                  <tr key={i}>
                    <td>{inv.invoiceNumber}</td>
                    <td>{inv.jazzCashId || "—"}</td>
                    <td>{inv.type}</td>
                    <td>{inv.month}</td>
                    <td>{inv.dueDate}</td>
                    <td>{inv.amount}</td>
                    <td>
                      <span className={`ta-badge ${inv.status === "PAID" ? "ta-badge-green" : "ta-badge-orange"}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td>
                      {inv.status !== "PAID" && (
                        <button
                          type="button"
                          className="ta-icon-action"
                          title="Mark as paid"
                          aria-label="Mark as paid"
                          onClick={() => onMarkPaid(i)}
                        >
                          <Icon path={ICONS.check} size={15} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="ta-modal-body ta-payments-generate-row">
          <div className="ta-filter-field" style={{ flex: 1 }}>
            <label>Select month</label>
            <div className="ta-date-range-wrap">
              <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
              <Icon path={ICONS.calendar} size={15} />
            </div>
          </div>
        </div>

        <div className="ta-modal-footer ta-payments-footer">
          <button
            type="button"
            className="ta-btn-primary ta-generate-btn"
            disabled={!month}
            onClick={() => {
              if (!month) return;
              onGenerate(month);
              setMonth("");
            }}
          >
            GENERATE
          </button>
        </div>
      </div>
    </div>
  );
}
