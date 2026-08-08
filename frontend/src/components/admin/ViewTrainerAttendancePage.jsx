import { useState, useEffect } from "react";
import { Icon, ICONS } from "./Icon";
import { ToastStack } from "./ToastStack";
import { useToasts } from "./hooks";
import { API_URL } from "../../constants/config";
import { SEED_TRAINER_ATTENDANCE } from "../../constants/trainerConstants";
import { formatDateTimeLabel, durationLabel } from "../../utils/dateUtils";
import { TrainerAttendanceFiltersModal, TrainerAttendanceEditModal } from "./TrainerAttendanceModals";

export function ViewTrainerAttendancePage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trainers, setTrainers] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({});
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [editRecord, setEditRecord] = useState(null);
  const { toasts, showToast } = useToasts();

  // ---- Attendance records + trainer list (filter dropdowns ke liye) MongoDB se load karo ----
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const [recRes, trainerRes] = await Promise.all([
          fetch(`${API_URL}/api/trainer-attendance`),
          fetch(`${API_URL}/api/trainers`),
        ]);
        const recData = await recRes.json();
        const trainerData = await trainerRes.json();
        if (!cancelled) {
          setRecords(recRes.ok && Array.isArray(recData) ? recData : SEED_TRAINER_ATTENDANCE);
          setTrainers(trainerRes.ok && Array.isArray(trainerData) ? trainerData : []);
        }
      } catch (error) {
        console.error("Failed to load trainer attendance", error);
        if (!cancelled) setRecords(SEED_TRAINER_ATTENDANCE);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const matchesFilters = (r) => {
    const f = appliedFilters;
    if (f.campus && r.campus !== f.campus) return false;
    if (f.trainer && r.trainerName !== f.trainer) return false;
    if (f.slotSchedule && r.slotSchedule !== f.slotSchedule) return false;
    return true;
  };

  const matchesSearch = (r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.trim().toLowerCase();
    return r.trainerName.toLowerCase().includes(q) || r.employeeId.includes(q);
  };

  const filteredRows = records.filter((r) => matchesFilters(r) && matchesSearch(r));
  const runSearch = () => setSearchQuery(searchInput);
  const handleExport = () => showToast("Export downloaded");

  // ---- Correction save karo: PUT to MongoDB ----
  const handleSaveEdit = async (updated) => {
    try {
      const response = await fetch(`${API_URL}/api/trainer-attendance/${editRecord.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update attendance");
      }
      setRecords((prev) => prev.map((r) => (r.id === editRecord.id ? data : r)));
      setEditRecord(null);
      showToast("Attendance updated");
    } catch (error) {
      console.error("Update trainer attendance error:", error);
      showToast(error.message || "Could not update attendance", "error");
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
          placeholder="Search"
          aria-label="Search trainer attendance"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && runSearch()}
        />
        <button className="ta-btn-primary" onClick={runSearch}>Search</button>
        <button className="ta-btn-primary" onClick={handleExport}>Export</button>
      </div>

      <div className="ta-table-wrap">
        <table className="ta-table">
          <thead>
            <tr>
              <th>Trainer</th>
              <th>Slot Schedule</th>
              <th>Campus</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8}><div className="ta-empty-state"><p>Loading attendance…</p></div></td></tr>
            ) : filteredRows.length === 0 ? (
              <tr><td colSpan={8}><div className="ta-empty-state"><Icon path={ICONS.inbox} size={42} /><p>No data</p></div></td></tr>
            ) : (
              filteredRows.map((r) => (
                <tr key={r.id}>
                  <td><span className="ta-link-text">{r.trainerName}</span></td>
                  <td>{r.slotSchedule}</td>
                  <td>{r.campus}</td>
                  <td>
                    {formatDateTimeLabel(r.checkIn)}
                    {r.lateMinutes > 0 && <div className="ta-late-tag">Late: {r.lateMinutes}m</div>}
                  </td>
                  <td>{formatDateTimeLabel(r.checkOut)}</td>
                  <td>{durationLabel(r.checkIn, r.checkOut)}</td>
                  <td><span className="ta-badge ta-badge-gray">{r.status}</span></td>
                  <td>
                    <button className="ta-icon-action" title="Edit" aria-label={`Edit attendance for ${r.trainerName}`} onClick={() => setEditRecord(r)}>
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
        <TrainerAttendanceFiltersModal
          initialValues={appliedFilters}
          onClose={() => setFiltersOpen(false)}
          onApply={setAppliedFilters}
          trainers={trainers}
        />
      )}

      {editRecord && (
        <TrainerAttendanceEditModal
          record={editRecord}
          onClose={() => setEditRecord(null)}
          onSave={handleSaveEdit}
        />
      )}

      <ToastStack toasts={toasts} />
    </div>
  );
}
