import { useState } from "react";
import { Icon, ICONS } from "./Icon";
import { Avatar } from "./Avatar";
import { ToastStack } from "./ToastStack";
import { useToasts } from "./hooks";
import { API_URL } from "../../constants/config";

export function MarkTrainerAttendancePage() {
  const [employeeId, setEmployeeId] = useState("");
  const [verifiedTrainer, setVerifiedTrainer] = useState(null);
  const [searched, setSearched] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [actionBusy, setActionBusy] = useState(false);
  const { toasts, showToast } = useToasts();

  // ---- Verify: asli MongoDB collection ke against trainer dhoondo ----
  const handleVerify = async () => {
    const id = employeeId.trim();
    if (!id || verifying) return;
    setVerifying(true);
    try {
      const response = await fetch(`${API_URL}/api/trainers`);
      const data = await response.json();
      const trainer = response.ok && Array.isArray(data) ? data.find((t) => t.employeeId === id) : null;
      setVerifiedTrainer(trainer || null);
      setSearched(true);
    } catch (error) {
      console.error("Verify trainer error:", error);
      setVerifiedTrainer(null);
      setSearched(true);
      showToast("Could not reach the server", "error");
    } finally {
      setVerifying(false);
    }
  };

  // ---- Check in: POST se MongoDB mein TrainerAttendance record banta hai.
  // Backend check-in window validate karta hai aur duplicate open check-in reject karta hai ----
  const handleCheckIn = async () => {
    if (!verifiedTrainer || actionBusy) return;
    setActionBusy(true);
    try {
      const response = await fetch(`${API_URL}/api/trainer-attendance/checkin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId: verifiedTrainer.employeeId }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Check-in failed");
      }
      showToast(`Checked in: ${verifiedTrainer.name}`);
    } catch (error) {
      console.error("Trainer check-in error:", error);
      showToast(error.message || "Check-in failed", "error");
    } finally {
      setActionBusy(false);
    }
  };

  // ---- Check out: aaj ka open TrainerAttendance record close karta hai ----
  const handleCheckOut = async () => {
    if (!verifiedTrainer || actionBusy) return;
    setActionBusy(true);
    try {
      const response = await fetch(`${API_URL}/api/trainer-attendance/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId: verifiedTrainer.employeeId }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Check-out failed");
      }
      showToast(`Checked out: ${verifiedTrainer.name}`);
    } catch (error) {
      console.error("Trainer check-out error:", error);
      showToast(error.message || "Check-out failed", "error");
    } finally {
      setActionBusy(false);
    }
  };

  return (
    <div className="ta-students-page">
      <div className="ta-panel ta-trainer-scan-panel">
        <h3 style={{ marginBottom: 14 }}>Scan Trainer Card</h3>
        <div className="ta-trainer-scan-row">
          <div className="ta-trainer-scan-input-col">
            <input
              className="ta-form-input ta-full-width"
              placeholder="Scan or enter Employee ID"
              aria-label="Employee ID"
              value={employeeId}
              onChange={(e) => { setEmployeeId(e.target.value); setSearched(false); }}
              onKeyDown={(e) => e.key === "Enter" && handleVerify()}
            />
            <button className="ta-btn-primary ta-full-width ta-verify-btn" onClick={handleVerify} disabled={verifying}>
              {verifying ? "Verifying…" : "Verify Trainer"}
            </button>
          </div>

          <div className="ta-trainer-info-card">
            <p className="ta-trainer-info-title">Trainer Information</p>
            {!searched && (
              <p className="ta-trainer-info-placeholder">Scan or enter Employee ID to see trainer details</p>
            )}
            {searched && !verifiedTrainer && (
              <p className="ta-trainer-info-placeholder">Trainer not found</p>
            )}
            {verifiedTrainer && (
              <div className="ta-trainer-info-body">
                <div className="ta-trainer-avatar">
                  <Avatar src={verifiedTrainer.photo} alt={verifiedTrainer.name} size={56} />
                </div>
                <p className="ta-trainer-info-name">{verifiedTrainer.name}</p>
                <p className="ta-trainer-info-id">Employee ID: {verifiedTrainer.employeeId}</p>
                <div className="ta-trainer-info-actions">
                  <button className="ta-btn-primary" onClick={handleCheckIn} disabled={actionBusy}>
                    <Icon path={ICONS.refresh} size={14} /> Check In
                  </button>
                  <button className="ta-btn-outline ta-checkout-btn" onClick={handleCheckOut} disabled={actionBusy}>
                    <Icon path={ICONS.refresh} size={14} /> Check Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ToastStack toasts={toasts} />
    </div>
  );
}
