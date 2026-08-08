import { useState } from "react";
import { Icon, ICONS } from "./Icon";
import { Avatar } from "./Avatar";
import { ToastStack } from "./ToastStack";
import { useToasts } from "./hooks";
import { API_URL } from "../../constants/config";

export function MarkAttendancePage() {
  const [rollInput, setRollInput] = useState("");
  const [studentInfo, setStudentInfo] = useState(null); // { student, history, error }
  const [feed, setFeed] = useState([]); // recent marks, newest first
  const [marking, setMarking] = useState(false);
  const { toasts, showToast } = useToasts();

  // ---- Mark attendance: POST to MongoDB, phir usi roll number ki recent
  // history wapas fetch karte hain taake panel real saved records dikhaye ----
  const handleMark = async () => {
    const roll = rollInput.trim();
    if (!roll || marking) return;
    setMarking(true);

    try {
      const response = await fetch(`${API_URL}/api/attendance/mark`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollNumber: roll }),
      });
      const data = await response.json();

      if (!response.ok) {
        // 404 = roll number nahi mila, 409 = student exists but status blocked
        setStudentInfo({ student: data.student, error: data.message || "Could not mark attendance." });
        return;
      }

      const historyRes = await fetch(`${API_URL}/api/attendance/history/${encodeURIComponent(roll)}`);
      const historyData = await historyRes.json();
      const history = historyRes.ok && Array.isArray(historyData)
        ? historyData.map((r) => ({ label: `${r.date} — ${r.status === "leave" ? "Leave" : "Present"}` }))
        : [];

      setStudentInfo({ student: data.student, history, error: null });
      setFeed((prev) => [{ student: data.student, time: new Date() }, ...prev]);
      showToast(`Attendance marked for ${data.student.studentName}`);
      setRollInput("");
    } catch (error) {
      console.error("Mark attendance error:", error);
      setStudentInfo({ error: "Could not reach the server. Please try again." });
      showToast("Could not mark attendance", "error");
    } finally {
      setMarking(false);
    }
  };

  return (
    <div className="ta-attendance-page">
      <div className="ta-attendance-grid">
        <div className="ta-attendance-main">
          <h3>Student Attendance</h3>

          <div className="ta-attendance-scan-input">
            <div className="ta-input-wrap">
              <Icon path={ICONS.search} size={15} />
              <input
                type="text"
                placeholder="Scan or Enter Roll Number..."
                value={rollInput}
                onChange={(e) => setRollInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleMark()}
              />
            </div>
          </div>

          <button className="ta-btn-primary ta-mark-btn" onClick={handleMark} disabled={marking}>
            {marking ? "Marking…" : "Mark Attendance"}
          </button>

          <div className="ta-attendance-cards">
            <div className="ta-attendance-card">
              <h4 className="ta-attendance-card-title">Student Information</h4>
              {!studentInfo ? (
                <div className="ta-attendance-placeholder">
                  Scan or enter a roll number to view student details.
                </div>
              ) : studentInfo.error && !studentInfo.student ? (
                <div className="ta-attendance-placeholder ta-attendance-error">
                  {studentInfo.error}
                </div>
              ) : (
                <div className="ta-attendance-student">
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <Avatar src={studentInfo.student.photo} alt={studentInfo.student.studentName} size={64} />
                  </div>
                  <h4>{studentInfo.student.studentName}</h4>
                  <p className="ta-attendance-roll">Roll Number: {studentInfo.student.rollNumber}</p>
                  <p className="ta-attendance-course">{studentInfo.student.course}</p>
                  <p className="ta-attendance-payment">
                    Payment Status: {studentInfo.student.paymentStatus || "N/A"}
                  </p>

                  {studentInfo.error ? (
                    <div className="ta-attendance-invalid">{studentInfo.error}</div>
                  ) : (
                    <div className="ta-attendance-success">
                      <Icon path={ICONS.check} size={14} /> Attendance Marked
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="ta-attendance-card">
              <h4 className="ta-attendance-card-title">Attendance History</h4>
              {!studentInfo || !studentInfo.student || !studentInfo.history?.length ? (
                <div className="ta-attendance-placeholder">No attendance history found.</div>
              ) : (
                <ul className="ta-attendance-history-list">
                  {studentInfo.history.map((h, i) => (
                    <li key={i}>{h.label}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="ta-attendance-feed-panel">
          {feed.length === 0 ? (
            <div className="ta-attendance-feed-empty">No recent scans yet.</div>
          ) : (
            <div className="ta-attendance-feed">
              {feed.map((f, i) => (
                <div className="ta-attendance-feed-item" key={i}>
                  <Avatar src={f.student.photo} alt={f.student.studentName} size={32} />
                  <div className="ta-attendance-feed-info">
                    <p className="ta-attendance-feed-name">
                      {f.student.studentName} ({f.student.rollNumber})
                    </p>
                    <p className="ta-attendance-feed-course">{f.student.course}</p>
                  </div>
                  <span className="ta-attendance-feed-time">a few seconds ago</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ToastStack toasts={toasts} />
    </div>
  );
}
