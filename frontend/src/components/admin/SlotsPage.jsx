import { useState } from "react";
import { Icon, ICONS } from "./Icon";
import { ToastStack } from "./ToastStack";
import { useToasts, nextId } from "./hooks";
import { SEED_SLOTS, EMPTY_SLOT_FORM } from "../../constants/slotConstants";
import { formatSlotDate } from "../../utils/dateUtils";
import { SlotFormModal, SlotsFiltersModal } from "./SlotModals";

// NOTE: Slots abhi local state (SEED_SLOTS) par chal rahe hain — backend
// API connect karni ho to StudentsPage/TrainersListPage pattern follow karo
// (fetch on mount, POST/PUT for add/edit).
export function SlotsPage() {
  const [slots, setSlots] = useState(SEED_SLOTS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({});
  const [formModal, setFormModal] = useState(null);
  const { toasts, showToast } = useToasts();

  const matchesFilters = (s) => {
    const f = appliedFilters;
    if (f.trainer && s.trainer !== f.trainer) return false;
    if (f.course && s.course !== f.course) return false;
    if (f.campus && s.campus !== f.campus) return false;
    if (f.facility && s.classType !== f.facility) return false;
    if (f.gender && s.gender !== f.gender) return false;
    if (f.status && s.status !== f.status) return false;
    if (f.online && s.onlineOffline !== f.online) return false;
    if (f.cert && s.cert !== f.cert) return false;
    return true;
  };

  const filteredRows = slots.filter(matchesFilters);

  const handleAdd = (form) => {
    setSlots((prev) => [{ id: nextId(prev), ...form }, ...prev]);
    setFormModal(null);
    showToast("Slot added");
  };

  const handleEdit = (form) => {
    setSlots((prev) => prev.map((s) => (s.id === formModal.slot.id ? { ...s, ...form } : s)));
    setFormModal(null);
    showToast("Slot updated");
  };

  return (
    <div className="ta-students-page">
      <div className="ta-students-toolbar">
        <button className="ta-icon-only-btn" title="Export" aria-label="Export slots">
          <Icon path={ICONS.download} size={16} />
        </button>

        <div style={{ flex: 1 }} />

        <button className="ta-btn-outline ta-filters-btn" onClick={() => setFiltersOpen(true)}>
          <Icon path={ICONS.filter} size={15} />
          Filters
          {Object.values(appliedFilters).some(Boolean) && <span className="ta-filter-dot" />}
        </button>

        <button className="ta-btn-primary ta-add-new-btn" onClick={() => setFormModal({ mode: "add" })}>
          <Icon path={ICONS.plus} size={15} />
          Add new
        </button>
      </div>

      <div className="ta-table-wrap">
        <table className="ta-table">
          <thead>
            <tr>
              <th>Schedule</th>
              <th>Trainer</th>
              <th>Course</th>
              <th>Campus</th>
              <th>Seats</th>
              <th>Facility</th>
              <th>Gender</th>
              <th>Status</th>
              <th>Online</th>
              <th>Start</th>
              <th>End</th>
              <th>Cert.</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.length === 0 ? (
              <tr>
                <td colSpan={13}>
                  <div className="ta-empty-state">
                    <Icon path={ICONS.inbox} size={42} />
                    <p>No data</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredRows.map((s) => (
                <tr key={s.id}>
                  <td>{s.schedule}</td>
                  <td>{s.trainer}</td>
                  <td>{s.course}</td>
                  <td>{s.campus}</td>
                  <td>{s.enrolled}/{s.capacity}</td>
                  <td>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                      <Icon path={ICONS.building} size={13} /> {s.classType}
                    </span>
                  </td>
                  <td>{s.gender}</td>
                  <td>
                    <span className={`ta-badge ${s.status === "ACTIVE" ? "ta-badge-blue" : "ta-badge-gray"}`}>
                      {s.status}
                    </span>
                  </td>
                  <td>{s.onlineOffline}</td>
                  <td>{formatSlotDate(s.startDate)}</td>
                  <td>{formatSlotDate(s.endDate)}</td>
                  <td>
                    <span className={`ta-badge ${(s.cert || "").toUpperCase() === "FREE" ? "ta-badge-orange" : "ta-badge-green"}`}>
                      {s.cert}
                    </span>
                  </td>
                  <td>
                    <button className="ta-icon-action" title="Edit" aria-label={`Edit slot ${s.schedule}`} onClick={() => setFormModal({ mode: "edit", slot: s })}>
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
        <SlotsFiltersModal
          initialValues={appliedFilters}
          onClose={() => setFiltersOpen(false)}
          onApply={setAppliedFilters}
        />
      )}

      {formModal?.mode === "add" && (
        <SlotFormModal
          title="Add new slot"
          initialValues={EMPTY_SLOT_FORM}
          onClose={() => setFormModal(null)}
          onSave={handleAdd}
        />
      )}

      {formModal?.mode === "edit" && (
        <SlotFormModal
          title="Edit slot"
          initialValues={formModal.slot}
          onClose={() => setFormModal(null)}
          onSave={handleEdit}
        />
      )}

      <ToastStack toasts={toasts} />
    </div>
  );
}
