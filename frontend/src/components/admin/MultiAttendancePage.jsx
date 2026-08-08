import { useState } from "react";
import { ToastStack } from "./ToastStack";
import { useToasts } from "./hooks";
import { API_URL } from "../../constants/config";
import { TODAY_REF, toInputDate } from "../../utils/dateUtils";

// Ek date ke liye comma-separated roll numbers paste kar ke bulk attendance
// mark karta hai (admin.saylanimit.com ke /add-multi-attendance jaisa)
export function MultiAttendancePage() {
  const [date, setDate] = useState(() => toInputDate(TODAY_REF));
  const [rollNumbers, setRollNumbers] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toasts, showToast } = useToasts();

  const canSubmit = date && rollNumbers.trim().length > 0 && !submitting;

  // ---- Bulk mark: pura roll-number list ek hi call mein MongoDB ko POST karo ----
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    const numbers = rollNumbers
      .split(",")
      .map((n) => n.trim())
      .filter(Boolean);

    if (numbers.length === 0) {
      showToast("Please enter at least one roll number.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/api/attendance/mark-bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, rollNumbers: numbers }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to mark attendance");
      }

      if (data.notFound?.length) {
        showToast(`Marked ${data.marked} · Not found: ${data.notFound.join(", ")}`, "error");
      } else {
        showToast(`Attendance marked for ${data.marked} student(s) on ${date}`);
      }
      setRollNumbers("");
    } catch (error) {
      console.error("Bulk mark attendance error:", error);
      showToast(error.message || "Could not mark attendance", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="ta-updation-page">
      <form className="ta-updation-form ta-multi-attendance-form" onSubmit={handleUpdate}>
        <input
          className="ta-updation-input"
          type="date"
          aria-label="Attendance date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <textarea
          className="ta-updation-textarea ta-multi-attendance-roll"
          placeholder="Roll numbers example: 1122,1123,1124,1125"
          aria-label="Roll numbers"
          value={rollNumbers}
          onChange={(e) => setRollNumbers(e.target.value)}
        />

        <button type="submit" className="ta-updation-submit" disabled={!canSubmit}>
          {submitting ? "UPDATING…" : "UPDATE"}
        </button>

        <p className="ta-updation-hint">
          Use this link for comma separated values{" "}
          <a href="https://arraythis.com" target="_blank" rel="noreferrer">
            https://arraythis.com
          </a>
        </p>
      </form>

      <ToastStack toasts={toasts} />
    </div>
  );
}
