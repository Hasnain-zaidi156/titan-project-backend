import { useState, useEffect } from "react";
import { Icon, ICONS } from "./Icon";
import { ToastStack } from "./ToastStack";
import { useToasts } from "./hooks";
import { API_URL } from "../../constants/config";
import { attendanceStats } from "../../utils/dateUtils";
import { AttendanceDetailsModal } from "./AttendanceDetailsModal";

export function ViewAttendancePage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rollInput, setRollInput] = useState("");
  const [query, setQuery] = useState("");
  const [detailsFor, setDetailsFor] = useState(null);
  const { toasts, showToast } = useToasts();

  // ---- Per-student attendance summary MongoDB se load karo ----
  useEffect(() => {
    let cancelled = false;

    const loadSummary = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/attendance/summary`);
        const data = await response.json();
        if (!cancelled && response.ok && Array.isArray(data)) {
          setRecords(data);
        }
      } catch (error) {
        console.error("Failed to load attendance summary", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadSummary();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = records.filter(
    (r) =>
      !query.trim() ||
      r.rollNumber.includes(query.trim()) ||
      r.studentName.toLowerCase().includes(query.trim().toLowerCase())
  );

  const runSearch = () => setQuery(rollInput);

  // ---- Absent din ko leave mark karo: POST MongoDB ko, phir local state
  // patch (leave count badhao / absent count ghatao) full reload ke bagair ----
  const handleMarkLeave = async (rollNumber, dateStr, reason) => {
    try {
      const response = await fetch(`${API_URL}/api/attendance/leave`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollNumber, date: dateStr, reason }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to mark leave");
      }

      const patch = (r) =>
        r.rollNumber === rollNumber
          ? {
              ...r,
              leaveDates: [...r.leaveDates, dateStr],
              leave: r.leave + 1,
              absent: Math.max(0, r.absent - 1),
            }
          : r;

      setRecords((prev) => prev.map(patch));
      setDetailsFor((prev) => (prev && prev.rollNumber === rollNumber ? patch(prev) : prev));
      showToast("Marked as leave");
    } catch (error) {
      console.error("Mark leave error:", error);
      showToast(error.message || "Could not mark leave", "error");
    }
  };

  return (
    <div className="ta-students-page">
      <div className="ta-students-toolbar">
        <input
          className="ta-search-input"
          type="text"
          placeholder="Search by roll number or name"
          aria-label="Search by roll number or name"
          value={rollInput}
          onChange={(e) => setRollInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && runSearch()}
        />
        <button className="ta-btn-primary" onClick={runSearch}>Search</button>
      </div>

      <div className="ta-table-wrap">
        <table className="ta-table">
          <thead>
            <tr>
              <th>Roll Number</th>
              <th>Student Name</th>
              <th>Course</th>
              <th>Total Classes</th>
              <th>Present</th>
              <th>Leave</th>
              <th>Absent</th>
              <th>Percentage</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9}>
                  <div className="ta-empty-state">
                    <p>Loading attendance…</p>
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={9}>
                  <div className="ta-empty-state">
                    <Icon path={ICONS.inbox} size={42} />
                    <p>No data</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((r) => {
                const stats = attendanceStats(r);
                return (
                  <tr key={r.rollNumber}>
                    <td>{r.rollNumber}</td>
                    <td><span className="ta-link-text">{r.studentName}</span></td>
                    <td>{r.course}</td>
                    <td>{r.totalClasses}</td>
                    <td>{stats.present}</td>
                    <td>{stats.leave}</td>
                    <td>{stats.absent}</td>
                    <td>{stats.percentage.toFixed(2)}%</td>
                    <td>
                      <button className="ta-icon-action" title="View" aria-label={`View attendance for ${r.studentName}`} onClick={() => setDetailsFor(r)}>
                        <Icon path={ICONS.eye} size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {detailsFor && (
        <AttendanceDetailsModal
          record={detailsFor}
          onClose={() => setDetailsFor(null)}
          onMarkLeave={handleMarkLeave}
        />
      )}

      <ToastStack toasts={toasts} />
    </div>
  );
}
