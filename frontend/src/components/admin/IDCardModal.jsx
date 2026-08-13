import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { TITAN_LOGO } from "../../constants/config";
import { Icon, ICONS } from "./Icon";

// ============================================================================
// Reusable ID card generator — same visual design for Student aur Trainer,
// sirf fields alag hain (Student: Course/Roll Number; Trainer: Designation/
// Department/Valid Until). QR code har user ke liye unique data encode karta
// hai, taake scan karke turant verify ho sake ke ye card asli hai aur kis
// student/trainer ka hai.
// ============================================================================

const NAVY = "#0d1f4c";
const GOLD = "#c9a24b";

function validUntilLabel(createdAt) {
  const base = createdAt ? new Date(createdAt) : new Date();
  const until = new Date(base);
  until.setFullYear(until.getFullYear() + 1);
  return until.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function buildQrPayload(type, person) {
  if (type === "student") {
    return JSON.stringify({
      org: "TITAN",
      type: "STUDENT",
      rollNumber: person.rollNumber,
      admissionNo: person.admissionNo,
      name: person.studentName,
    });
  }
  return JSON.stringify({
    org: "TITAN",
    type: "TRAINER",
    employeeId: person.employeeId,
    name: person.name,
  });
}

function CardShell({ innerRef, children }) {
  return (
    <div
      ref={innerRef}
      style={{
        width: 340,
        height: 460,
        borderRadius: 22,
        background: "#fdfcf9",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 6px 24px rgba(13,31,76,0.18)",
        fontFamily: "'Segoe UI', Arial, sans-serif",
      }}
    >
      {/* top navy sweep */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 90, background: NAVY, clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 100%)" }} />
      {/* gold accent line under header */}
      <div style={{ position: "absolute", top: 92, left: 24, right: 24, height: 3, background: GOLD, borderRadius: 2 }} />
      {/* bottom gold sweep */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 46, background: `linear-gradient(90deg, ${GOLD}, #e6c877, ${GOLD})`, clipPath: "polygon(0 55%, 100% 0, 100% 100%, 0% 100%)" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 36, background: NAVY, clipPath: "polygon(0 60%, 100% 15%, 100% 100%, 0% 100%)" }} />
      {/* IMPORTANT: ye wrapper "position: relative" hai isliye ye baaki
          absolute decorative divs ke UPAR paint hota hai (CSS stacking
          rule: positioned elements DOM order se stack hote hain, in-flow
          normal content unke peeche chala jata hai) — isi wrapper ke bina
          navy/gold shapes text/icons ke upar overlap kar rahe the. */}
      <div style={{ position: "relative", zIndex: 1, height: "100%" }}>
        {children}
      </div>
    </div>
  );
}

function Header() {
  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 10, padding: "14px 16px 0" }}>
      <img src={TITAN_LOGO} alt="TITAN" style={{ width: 46, height: 46, objectFit: "contain", borderRadius: 8, background: "#fff" }} crossOrigin="anonymous" />
      <div>
        <div style={{ color: "#fff", fontWeight: 800, fontSize: 20, letterSpacing: 1, lineHeight: 1 }}>TITAN</div>
        <div style={{ color: "#e7ecfa", fontSize: 8, fontWeight: 600, letterSpacing: 0.3 }}>TAJ INSTITUTE OF TECHNOLOGY<br />& APPLIED NETWORKS</div>
      </div>
    </div>
  );
}

function IconBadge({ path }) {
  return (
    <span style={{ width: 26, height: 26, borderRadius: "50%", background: NAVY, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <Icon path={path} size={13} />
    </span>
  );
}

function FrontCard({ innerRef, type, person }) {
  const isStudent = type === "student";
  const title = isStudent ? "STUDENT CARD" : "TRAINER CARD";
  const name = isStudent ? person.studentName : person.name;

  const fields = isStudent
    ? [["NAME", name], ["COURSE", person.course], ["ROLL NUMBER", person.rollNumber]]
    : [["NAME", name], ["EMPLOYEE NO", person.employeeId], ["VALID UNTIL", validUntilLabel(person.createdAt)]];

  return (
    <CardShell innerRef={innerRef}>
      <Header />
      <div style={{ textAlign: "center", marginTop: 22 }}>
        <span style={{ color: NAVY, fontWeight: 800, fontSize: 15, letterSpacing: 1.5, borderBottom: `2px solid ${GOLD}`, paddingBottom: 4 }}>{title}</span>
      </div>
      <div style={{ margin: "16px auto 10px", width: 148, height: 168, border: `2px solid ${NAVY}`, borderRadius: 10, overflow: "hidden", background: "#eef1f8", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {person.photo
          ? <img src={person.photo} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} crossOrigin="anonymous" />
          : <span style={{ color: "#9aa4c0", fontSize: 12 }}>No Photo</span>}
      </div>
      <div style={{ padding: "4px 22px", fontSize: 12.5, color: "#1c2a52" }}>
        {fields.map(([label, value]) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <strong>{label}:</strong><span style={{ borderBottom: "1px solid #b9c0d6", flex: 1, marginLeft: 8, textAlign: "right" }}>{value || "—"}</span>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", bottom: 10, left: 0, right: 0, textAlign: "center", color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: 1.5 }}>EMPOWERING FUTURES</div>
    </CardShell>
  );
}

function BackCard({ innerRef, type, person, qrDataUrl }) {
  const isStudent = type === "student";
  const rows = isStudent
    ? [
        [ICONS.user, "Name", person.studentName],
        [ICONS.user, "Father's Name", person.fatherName],
        [ICONS.idCard, "CNIC Number", person.cnic],
        [ICONS.book, "Course", person.course],
        [ICONS.cap, "Batch", person.batch],
      ]
    : [
        [ICONS.user, "Name", person.name],
        [ICONS.idCard, "Employee No.", person.employeeId],
        [ICONS.book, "Designation", person.designation || "Trainer"],
        [ICONS.cap, "Department", person.department || (person.courses || []).join(", ")],
        [ICONS.calendar, "Valid Until", validUntilLabel(person.createdAt)],
      ];

  return (
    <CardShell innerRef={innerRef}>
      <Header />
      <div style={{ padding: "18px 20px 0", fontSize: 12, color: "#1c2a52" }}>
        {rows.map(([icon, label, value]) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 11 }}>
            <IconBadge path={icon} />
            <strong style={{ width: 92, flexShrink: 0 }}>{label}</strong>
            <span>:</span>
            <span style={{ borderBottom: "1px solid #b9c0d6", flex: 1, marginLeft: 4, paddingBottom: 2, wordBreak: "break-word" }}>{value || "—"}</span>
          </div>
        ))}
      </div>
      <div style={{ margin: "6px 20px 0", borderTop: `1px solid ${GOLD}` }} />
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 20px 0" }}>
        {qrDataUrl && <img src={qrDataUrl} alt="QR" style={{ width: 64, height: 64 }} />}
        <div style={{ fontSize: 8.5, color: "#3a4670", lineHeight: 1.4 }}>
          <strong style={{ color: NAVY }}>IMPORTANT</strong><br />
          This card is the property of TITAN. It is non-transferable and must be used only for TITAN purposes.
        </div>
      </div>
    </CardShell>
  );
}

export function IDCardModal({ type, person, onClose }) {
  const frontRef = useRef(null);
  const backRef = useRef(null);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    QRCode.toDataURL(buildQrPayload(type, person), { width: 200, margin: 1, color: { dark: NAVY, light: "#ffffff" } })
      .then(setQrDataUrl)
      .catch((err) => console.error("QR generate failed:", err));
  }, [type, person]);

  // Front + Back dono side ek hi PDF page par (upar-neeche), ek hi button —
  // design bilkul wahi rehta hai.
  const downloadPDF = async () => {
    if (!frontRef.current || !backRef.current) return;
    setDownloading(true);
    try {
      const [frontCanvas, backCanvas] = await Promise.all([
        html2canvas(frontRef.current, { scale: 3, backgroundColor: "#ffffff", useCORS: true }),
        html2canvas(backRef.current, { scale: 3, backgroundColor: "#ffffff", useCORS: true }),
      ]);
      const cardWmm = 85.6, cardHmm = 115.8; // card aspect ratio maintain
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: [cardWmm + 20, cardHmm * 2 + 30] });
      const x = 10;
      pdf.addImage(frontCanvas.toDataURL("image/png"), "PNG", x, 10, cardWmm, cardHmm);
      pdf.addImage(backCanvas.toDataURL("image/png"), "PNG", x, cardHmm + 20, cardWmm, cardHmm);
      pdf.save(`TITAN-${type}-${idValue}.pdf`);
    } catch (err) {
      console.error("ID card PDF download failed:", err);
    } finally {
      setDownloading(false);
    }
  };

  const idValue = type === "student" ? person.rollNumber : person.employeeId;
  const displayName = type === "student" ? person.studentName : person.name;

  return (
    <div className="ta-modal-overlay" onClick={onClose}>
      <div
        className="ta-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="ID Card"
        style={{ maxWidth: 760, width: "auto" }}
      >
        <div className="ta-modal-header">
          <h3>{type === "student" ? "Student" : "Trainer"} ID Card — {displayName}</h3>
          <button className="ta-modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="ta-modal-body" style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center", padding: 20 }}>
          <FrontCard innerRef={frontRef} type={type} person={person} />
          <BackCard innerRef={backRef} type={type} person={person} qrDataUrl={qrDataUrl} />
        </div>
        <div className="ta-modal-footer">
          <button className="ta-btn-primary" disabled={downloading} onClick={downloadPDF}>
            {downloading ? "Preparing…" : "Download Card (PDF)"}
          </button>
          <button className="ta-btn-outline" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

