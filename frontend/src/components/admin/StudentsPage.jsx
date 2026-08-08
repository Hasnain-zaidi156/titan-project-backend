import { useState, useEffect } from "react";
import { Icon, ICONS } from "./Icon";
import { Avatar } from "./Avatar";
import { ConfirmPopover } from "./CustomSelect";
import { ToastStack } from "./ToastStack";
import { useToasts } from "./hooks";
import { API_URL } from "../../constants/config";
import {
  TABLE_COLUMNS, SEED_STUDENTS, EMPTY_FORM, statusBadgeClass, paymentBadgeClass,
} from "../../constants/studentConstants";
import { FiltersModal, StudentFormModal, ViewStudentModal, PaymentsModal } from "./StudentModals";

export function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({});
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { toasts, showToast } = useToasts();

  const [formModal, setFormModal] = useState(null);
  const [formSaving, setFormSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [viewStudent, setViewStudent] = useState(null);
  const [paymentsStudent, setPaymentsStudent] = useState(null);
  const [confirmFor, setConfirmFor] = useState(null);

  // ---- Load students from MongoDB (via backend API) on mount ----
  useEffect(() => {
    let cancelled = false;

    const loadStudents = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/students`);
        const data = await response.json();
        if (!cancelled) {
          if (response.ok && Array.isArray(data) && data.length > 0) {
            setStudents(data);
          } else if (response.ok && Array.isArray(data)) {
            // DB reachable but empty -> demo rows dikhao taake UI khali na lage
            setStudents(SEED_STUDENTS);
          } else {
            setStudents(SEED_STUDENTS);
          }
        }
      } catch (error) {
        console.error("Failed to load students from API", error);
        if (!cancelled) setStudents(SEED_STUDENTS);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadStudents();
    return () => {
      cancelled = true;
    };
  }, []);

  const matchesFilters = (s) => {
    const f = appliedFilters;
    if (f.country && s.country !== f.country) return false;
    if (f.city && s.city !== f.city) return false;
    if (f.campus && s.campus !== f.campus) return false;
    if (f.course && s.course !== f.course) return false;
    if (f.batch && s.batch !== f.batch) return false;
    if (f.slot && s.slot !== f.slot) return false;
    if (f.status && s.status !== f.status) return false;
    if (f.laptop && s.laptop !== f.laptop) return false;
    if (f.paymentStatus && s.paymentStatus !== f.paymentStatus) return false;
    if (f.gender && s.gender !== f.gender) return false;
    return true;
  };

  const matchesSearch = (s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.trim().toLowerCase();
    return [s.admissionNo, s.rollNumber, s.studentName, s.fatherName, s.cnic, s.phone, s.course]
      .filter(Boolean)
      .some((field) => field.toLowerCase().includes(q));
  };

  const filteredRows = students.filter((s) => matchesFilters(s) && matchesSearch(s));
  const totalItems = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(page, totalPages);
  const startIdx = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endIdx = Math.min(safePage * pageSize, totalItems);
  const pageRows = filteredRows.slice((safePage - 1) * pageSize, safePage * pageSize);

  const runSearch = () => {
    setSearchQuery(searchInput);
    setPage(1);
  };

  const handleExport = () => {
    const header = TABLE_COLUMNS.filter((c) => c !== "Action" && c !== "Photo").join(",");
    const lines = filteredRows.map((s) =>
      [s.rollNumber, s.studentName, s.fatherName, s.cnic, s.phone, s.course, s.status, s.paymentStatus]
        .map((v) => `"${(v || "").toString().replace(/"/g, '""')}"`)
        .join(",")
    );
    const csv = [header, ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "students.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("Export downloaded");
  };

  // ---- Add student: POST to MongoDB cluster via backend API ----
  const handleAddStudent = async (form) => {
    setFormSaving(true);
    setFormError("");
    try {
      const response = await fetch(`${API_URL}/api/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, invoices: [] }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to save student");
      }
      setStudents((prev) => [data, ...prev]);
      setFormModal(null);
      showToast("Student added");
    } catch (error) {
      console.error("Add student error:", error);
      setFormError(error.message || "Could not add student");
      showToast(error.message || "Could not add student", "error");
    } finally {
      setFormSaving(false);
    }
  };

  // ---- Edit student: PUT to MongoDB cluster via backend API ----
  const handleEditStudent = async (form) => {
    const target = formModal.student;
    setFormSaving(true);
    setFormError("");
    try {
      const response = await fetch(`${API_URL}/api/students/${target.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update student");
      }
      setStudents((prev) => prev.map((s) => (s.id === target.id ? data : s)));
      setFormModal(null);
      showToast("Student updated");
    } catch (error) {
      console.error("Edit student error:", error);
      setFormError(error.message || "Could not update student");
      showToast(error.message || "Could not update student", "error");
    } finally {
      setFormSaving(false);
    }
  };

  // ---- Delete student: DELETE from MongoDB cluster via backend API ----
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/students/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete student");
      }
      setStudents((prev) => prev.filter((s) => s.id !== id));
      setConfirmFor(null);
      showToast("Student deleted");
    } catch (error) {
      console.error("Delete student error:", error);
      showToast(error.message || "Could not delete student", "error");
    }
  };

  const handleSendEmail = () => {
    setConfirmFor(null);
    showToast("Email sent");
  };

  const handleDownloadRow = (s) => {
    showToast(`Downloaded record for ${s.studentName}`);
  };

  // ---- Generate invoice: PUT updated invoices array to MongoDB ----
  const handleGenerateInvoice = async (month) => {
    if (!paymentsStudent) return;
    const newInvoice = {
      invoiceNumber: paymentsStudent.admissionNo,
      jazzCashId: "",
      type: "Registration",
      month,
      dueDate: "10-" + month,
      amount: 1000,
      status: "PENDING",
    };
    const updatedInvoices = [...paymentsStudent.invoices, newInvoice];

    try {
      const response = await fetch(`${API_URL}/api/students/${paymentsStudent.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoices: updatedInvoices, paymentStatus: "Pending" }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to generate invoice");
      }
      setStudents((prev) => prev.map((s) => (s.id === paymentsStudent.id ? data : s)));
      setPaymentsStudent(data);
      showToast("Invoice generated");
    } catch (error) {
      console.error("Generate invoice error:", error);
      showToast(error.message || "Could not generate invoice", "error");
    }
  };

  // ---- Mark invoice paid: PUT updated invoices array to MongoDB ----
  const handleMarkPaid = async (invIdx) => {
    if (!paymentsStudent) return;
    const updatedInvoices = paymentsStudent.invoices.map((inv, i) =>
      i === invIdx ? { ...inv, status: "PAID" } : inv
    );

    try {
      const response = await fetch(`${API_URL}/api/students/${paymentsStudent.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoices: updatedInvoices, paymentStatus: "Paid" }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update invoice");
      }
      setStudents((prev) => prev.map((s) => (s.id === paymentsStudent.id ? data : s)));
      setPaymentsStudent(data);
      showToast("Marked as paid");
    } catch (error) {
      console.error("Mark paid error:", error);
      showToast(error.message || "Could not mark as paid", "error");
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

        <input
          className="ta-search-input"
          type="text"
          placeholder="Search"
          aria-label="Search students"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && runSearch()}
        />

        <button className="ta-btn-primary" onClick={runSearch}>Search</button>
        <button className="ta-btn-primary" onClick={handleExport}>Export</button>
        <button
          className="ta-btn-primary ta-add-new-btn"
          onClick={() => { setFormError(""); setFormModal({ mode: "add" }); }}
        >
          <Icon path={ICONS.plus} size={15} />
          Add new
        </button>
      </div>

      <div className="ta-table-wrap">
        <table className="ta-table">
          <thead>
            <tr>
              {TABLE_COLUMNS.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={TABLE_COLUMNS.length}>
                  <div className="ta-empty-state">
                    <p>Loading students…</p>
                  </div>
                </td>
              </tr>
            ) : pageRows.length === 0 ? (
              <tr>
                <td colSpan={TABLE_COLUMNS.length}>
                  <div className="ta-empty-state">
                    <Icon path={ICONS.inbox} size={42} />
                    <p>No data</p>
                  </div>
                </td>
              </tr>
            ) : (
              pageRows.map((s) => (
                <tr key={s.id}>
                  <td><Avatar src={s.photo} alt={s.studentName} size={32} /></td>
                  <td><span className="ta-badge ta-badge-blue">{s.rollNumber || "—"}</span></td>
                  <td><span className="ta-link-text">{s.studentName}</span></td>
                  <td>{s.fatherName}</td>
                  <td>{s.cnic}</td>
                  <td>{s.phone}</td>
                  <td>{s.course}</td>
                  <td>
                    <span className={`ta-badge ${statusBadgeClass(s.status)}`}>
                      {s.status?.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <span className={`ta-badge ${paymentBadgeClass(s.paymentStatus)}`}>
                      {s.paymentStatus?.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <div className="ta-action-row">
                      <button className="ta-icon-action" title="View" aria-label={`View ${s.studentName}`} onClick={() => setViewStudent(s)}>
                        <Icon path={ICONS.eye} size={15} />
                      </button>
                      <button className="ta-icon-action" title="Payments" aria-label={`Payments for ${s.studentName}`} onClick={() => setPaymentsStudent(s)}>
                        <Icon path={ICONS.receipt} size={15} />
                      </button>
                      <button
                        className="ta-icon-action"
                        title="Edit"
                        aria-label={`Edit ${s.studentName}`}
                        onClick={() => { setFormError(""); setFormModal({ mode: "edit", student: s }); }}
                      >
                        <Icon path={ICONS.pencil} size={15} />
                      </button>
                      <div className="ta-action-popover-anchor">
                        <button
                          className="ta-icon-action"
                          title="Send email"
                          aria-label={`Send email to ${s.studentName}`}
                          onClick={() => setConfirmFor({ id: s.id, action: "send" })}
                        >
                          <Icon path={ICONS.send} size={15} />
                        </button>
                        {confirmFor?.id === s.id && confirmFor.action === "send" && (
                          <ConfirmPopover
                            message="Sure to send email again?"
                            onCancel={() => setConfirmFor(null)}
                            onConfirm={handleSendEmail}
                          />
                        )}
                      </div>
                      <button className="ta-icon-action" title="Download" aria-label={`Download record for ${s.studentName}`} onClick={() => handleDownloadRow(s)}>
                        <Icon path={ICONS.download} size={15} />
                      </button>
                      <div className="ta-action-popover-anchor">
                        <button
                          className="ta-icon-action ta-icon-action-danger"
                          title="Delete"
                          aria-label={`Delete ${s.studentName}`}
                          onClick={() => setConfirmFor({ id: s.id, action: "delete" })}
                        >
                          <Icon path={ICONS.trash} size={15} />
                        </button>
                        {confirmFor?.id === s.id && confirmFor.action === "delete" && (
                          <ConfirmPopover
                            message="Delete this student?"
                            onCancel={() => setConfirmFor(null)}
                            onConfirm={() => handleDelete(s.id)}
                          />
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalItems > 0 && (
        <div className="ta-pagination">
          <span className="ta-pagination-info">
            {startIdx}-{endIdx} of {totalItems} items
          </span>
          <div className="ta-pagination-controls">
            <button
              className="ta-page-btn"
              disabled={safePage <= 1}
              aria-label="Previous page"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <Icon path={ICONS.chevronLeft} size={14} />
            </button>
            <span className="ta-page-current">{safePage}</span>
            <button
              className="ta-page-btn"
              disabled={safePage >= totalPages}
              aria-label="Next page"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              <Icon path={ICONS.chevronRight} size={14} />
            </button>
            <select
              className="ta-page-size-select"
              aria-label="Rows per page"
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
            >
              <option value={10}>10 / page</option>
              <option value={25}>25 / page</option>
              <option value={50}>50 / page</option>
            </select>
          </div>
        </div>
      )}

      {filtersOpen && (
        <FiltersModal
          initialValues={appliedFilters}
          onClose={() => setFiltersOpen(false)}
          onApply={(vals) => { setAppliedFilters(vals); setPage(1); }}
        />
      )}

      {formModal?.mode === "add" && (
        <StudentFormModal
          title="Add New Student"
          initialValues={EMPTY_FORM}
          onClose={() => setFormModal(null)}
          onSave={handleAddStudent}
          saving={formSaving}
          serverError={formError}
        />
      )}

      {formModal?.mode === "edit" && (
        <StudentFormModal
          title="Edit Student"
          initialValues={formModal.student}
          onClose={() => setFormModal(null)}
          onSave={handleEditStudent}
          saving={formSaving}
          serverError={formError}
        />
      )}

      {viewStudent && (
        <ViewStudentModal student={viewStudent} onClose={() => setViewStudent(null)} />
      )}

      {paymentsStudent && (
        <PaymentsModal
          student={paymentsStudent}
          onClose={() => setPaymentsStudent(null)}
          onGenerate={handleGenerateInvoice}
          onMarkPaid={handleMarkPaid}
        />
      )}

      <ToastStack toasts={toasts} />
    </div>
  );
}
