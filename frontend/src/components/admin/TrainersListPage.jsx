import { useState, useEffect } from "react";
import { Icon, ICONS } from "./Icon";
import { Avatar } from "./Avatar";
import { ToastStack } from "./ToastStack";
import { useToasts } from "./hooks";
import { API_URL } from "../../constants/config";
import { COURSES, CITIES } from "../../constants/studentConstants";
import { TRAINERS_FULL_LIST, EMPTY_TRAINER_FORM } from "../../constants/trainerConstants";
import { TrainerFormModal } from "./TrainerFormModal";

export function TrainersListPage() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [formModal, setFormModal] = useState(null);
  const [formSaving, setFormSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const { toasts, showToast } = useToasts();

  // ---- Trainers MongoDB (backend API) se load karo mount par ----
  useEffect(() => {
    let cancelled = false;

    const loadTrainers = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/trainers`);
        const data = await response.json();
        if (!cancelled) {
          if (response.ok && Array.isArray(data) && data.length > 0) {
            setTrainers(data);
          } else {
            // DB reachable but empty, ya unreachable -> demo rows fallback
            setTrainers(TRAINERS_FULL_LIST);
          }
        }
      } catch (error) {
        console.error("Failed to load trainers from API", error);
        if (!cancelled) setTrainers(TRAINERS_FULL_LIST);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadTrainers();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = trainers.filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.trim().toLowerCase();
    return t.name.toLowerCase().includes(q) || t.email.toLowerCase().includes(q) || t.employeeId.includes(q);
  });

  const runSearch = () => setSearchQuery(searchInput);
  const handleExport = () => showToast("Export downloaded");

  // ---- Add trainer: POST to MongoDB cluster via backend API ----
  const handleAdd = async (form) => {
    setFormSaving(true);
    setFormError("");
    try {
      const response = await fetch(`${API_URL}/api/trainers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, courses: [form.courses], cities: [form.cities] }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to save trainer");
      }
      setTrainers((prev) => [data, ...prev]);
      setFormModal(null);
      showToast("Trainer added");
    } catch (error) {
      console.error("Add trainer error:", error);
      setFormError(error.message || "Could not add trainer");
      showToast(error.message || "Could not add trainer", "error");
    } finally {
      setFormSaving(false);
    }
  };

  // ---- Edit trainer: PUT to MongoDB cluster via backend API ----
  const handleEdit = async (form) => {
    const target = formModal.trainer;
    setFormSaving(true);
    setFormError("");
    try {
      const response = await fetch(`${API_URL}/api/trainers/${target.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, courses: [form.courses], cities: [form.cities] }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update trainer");
      }
      setTrainers((prev) => prev.map((t) => (t.id === target.id ? data : t)));
      setFormModal(null);
      showToast("Trainer updated");
    } catch (error) {
      console.error("Edit trainer error:", error);
      setFormError(error.message || "Could not update trainer");
      showToast(error.message || "Could not update trainer", "error");
    } finally {
      setFormSaving(false);
    }
  };

  return (
    <div className="ta-students-page">
      <div className="ta-students-toolbar">
        <button className="ta-btn-outline ta-filters-btn" onClick={() => setFiltersOpen(true)}>
          <Icon path={ICONS.filter} size={15} />
          Filters
        </button>
        <input
          className="ta-search-input"
          placeholder="Search"
          aria-label="Search trainers"
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
              <th>Photo</th>
              <th>Trainer name</th>
              <th>Email</th>
              <th>Employee ID (Roll No)</th>
              <th>Courses</th>
              <th>Cities</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8}><div className="ta-empty-state"><p>Loading trainers…</p></div></td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={8}><div className="ta-empty-state"><Icon path={ICONS.inbox} size={42} /><p>No data</p></div></td></tr>
            ) : (
              filtered.map((t) => (
                <tr key={t.id}>
                  <td><Avatar src={t.photo} alt={t.name} size={32} /></td>
                  <td><span className="ta-link-text">{t.name}</span></td>
                  <td>{t.email}</td>
                  <td><span className="ta-badge ta-badge-blue">{t.employeeId}</span></td>
                  <td>{(t.courses || []).join(", ")}</td>
                  <td>{(t.cities || []).join(", ")}</td>
                  <td><span className={`ta-badge ${t.status === "Active" ? "ta-badge-blue" : "ta-badge-gray"}`}>{t.status}</span></td>
                  <td>
                    <button
                      className="ta-icon-action"
                      title="Edit"
                      aria-label={`Edit ${t.name}`}
                      onClick={() => {
                        setFormError("");
                        setFormModal({
                          mode: "edit",
                          trainer: {
                            ...t,
                            courses: t.courses?.[0] || COURSES[0],
                            cities: t.cities?.[0] || CITIES[0],
                          },
                        });
                      }}
                    >
                      <Icon path={ICONS.pencil} size={15} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filtersOpen && (
        <div className="ta-modal-overlay" onClick={() => setFiltersOpen(false)}>
          <div className="ta-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Trainer filters">
            <div className="ta-modal-header">
              <h3>Filters</h3>
              <button className="ta-modal-close" onClick={() => setFiltersOpen(false)} aria-label="Close">
                <Icon path={ICONS.close} size={18} />
              </button>
            </div>
            <div className="ta-modal-body">
              <p style={{ fontSize: 13, color: "var(--ta-text-muted)" }}>
                Filter trainers by city, campus, course, or status.
              </p>
            </div>
            <div className="ta-modal-footer">
              <button className="ta-btn-primary" onClick={() => setFiltersOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {formModal?.mode === "add" && (
        <TrainerFormModal
          title="Add new trainer"
          mode="add"
          initialValues={EMPTY_TRAINER_FORM}
          onClose={() => setFormModal(null)}
          onSave={handleAdd}
          saving={formSaving}
          serverError={formError}
        />
      )}
      {formModal?.mode === "edit" && (
        <TrainerFormModal
          title="Edit trainer"
          mode="edit"
          initialValues={formModal.trainer}
          onClose={() => setFormModal(null)}
          onSave={handleEdit}
          saving={formSaving}
          serverError={formError}
        />
      )}

      <ToastStack toasts={toasts} />
    </div>
  );
}
