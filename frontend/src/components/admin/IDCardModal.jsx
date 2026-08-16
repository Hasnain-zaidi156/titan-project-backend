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

function CardShell({ innerRef, children, gradId = "idcard-gold-grad" }) {
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
      {/* IMPORTANT: pehle ye 3 decorative shapes CSS clip-path (polygon())
          se banti thi. html2canvas clip-path ko reliably support nahi
          karta — canvas snapshot lete waqt clip-path ignore ho jata tha
          aur ye teeno divs APNI FULL RECTANGLE shape mein render ho jate
          the (bina slant/cut ke), jo TITAN logo/header aur neeche ke
          fields ke UPAR se poora block kar dete the. Yehi wo wajah thi
          jiski waja se "Download PDF" karne ke baad card ka design toota
          hua / squished dikhta tha (header ghayab, back card ka content
          upar-neeche gadmad). Fix: same shapes ab SVG <polygon> se banayi
          hain — SVG html2canvas mein hamesha sahi render hota hai. */}
      <svg
        width={340}
        height={460}
        viewBox="0 0 340 460"
        style={{ position: "absolute", top: 0, left: 0, zIndex: 0 }}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={GOLD} />
            <stop offset="50%" stopColor="#e6c877" />
            <stop offset="100%" stopColor={GOLD} />
          </linearGradient>
        </defs>
        {/* top navy sweep */}
        <polygon points="0,0 340,0 340,40.5 0,90" fill={NAVY} />
        {/* bottom gold sweep */}
        <polygon points="0,439.3 340,414 340,460 0,460" fill={`url(#${gradId})`} />
        {/* bottom navy sweep */}
        <polygon points="0,445.6 340,429.4 340,460 0,460" fill={NAVY} />
      </svg>
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
    <CardShell innerRef={innerRef} gradId="idcard-gold-grad-front">
      <Header />
      <div style={{ textAlign: "center", marginTop: 26 }}>
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
            <strong>{label}:</strong><span style={{ borderBottom: "1px solid #b9c0d6", flex: 1, marginLeft: 8, textAlign: "center" }}>{value || "—"}</span>
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
    <CardShell innerRef={innerRef} gradId="idcard-gold-grad-back">
      <Header />
      <div style={{ padding: "18px 20px 0", fontSize: 12, color: "#1c2a52" }}>
        {rows.map(([icon, label, value]) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 11 }}>
            <IconBadge path={icon} />
            <strong style={{ width: 92, flexShrink: 0 }}>{label}</strong>
            <span>:</span>
            <span style={{ borderBottom: "1px solid #b9c0d6", flex: 1, marginLeft: 4, paddingBottom: 2, textAlign: "center", wordBreak: "break-word" }}>{value || "—"}</span>
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

  // Photo/logo jaisi <img> tags network se load hoti hain — agar
  // html2canvas capture inke poora load hone SE PEHLE chal jaye to wo
  // image tooti hui / khali kheenchta hai. Isliye capture se pehle sab
  // images ka load hona confirm karte hain.
  const waitForImages = (el) => {
    const imgs = Array.from(el.querySelectorAll("img"));
    return Promise.all(
      imgs.map((img) =>
        img.complete
          ? Promise.resolve()
          : new Promise((resolve) => {
              img.onload = resolve;
              img.onerror = resolve;
            })
      )
    );
  };

  // Front + Back dono side ek hi PDF page par (upar-neeche), ek hi button —
  // design bilkul wahi rehta hai.
  const downloadPDF = async () => {
    if (!frontRef.current || !backRef.current) return;
    setDownloading(true);
    try {
      await Promise.all([waitForImages(frontRef.current), waitForImages(backRef.current)]);
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

  // IMPORTANT: is modal ka bahar wala frame (overlay/box/header/footer/
  // buttons) pehle .ta-modal-overlay, .ta-modal, .ta-btn-primary jaisi
  // classes use karta tha — ye sirf SuperAdmin.css mein defined hain, jo
  // Admin portal ke components load karte hain. Student aur Trainer
  // dashboard ye CSS file import hi nahi karte, isliye wahan se card khulne
  // par sirf plain/unstyled box dikhta tha (koi dark overlay, rounding,
  // ya styled buttons nahi). Fix: poora modal chrome ab inline styles se
  // banaya hai — isliye kisi bhi portal (Admin/Student/Trainer) se khule,
  // hamesha sahi design dikhega, kisi bahar ki CSS file par depend nahi.
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(9, 24, 52, 0.55)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="ID Card"
        style={{
          background: "#fff",
          borderRadius: 14,
          borderTop: `4px solid ${GOLD}`,
          width: "100%",
          maxWidth: 760,
          maxHeight: "88vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 20px 60px rgba(9,24,52,0.35)",
          fontFamily: "'Segoe UI', Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: "1px solid #e5e8f0" }}>
          <h3 style={{ margin: 0, color: NAVY, fontSize: 17, fontWeight: 800 }}>{type === "student" ? "Student" : "Trainer"} ID Card — {displayName}</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", fontSize: 22, lineHeight: 1, padding: 4 }}
          >
            ×
          </button>
        </div>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center", padding: 20, overflowY: "auto" }}>
          <FrontCard innerRef={frontRef} type={type} person={person} />
          <BackCard innerRef={backRef} type={type} person={person} qrDataUrl={qrDataUrl} />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, padding: "16px 24px", borderTop: "1px solid #e5e8f0" }}>
          <button
            disabled={downloading}
            onClick={downloadPDF}
            style={{
              background: `linear-gradient(180deg, #2f4f9e, ${NAVY})`,
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "10px 16px",
              fontSize: 13,
              fontWeight: 700,
              cursor: downloading ? "not-allowed" : "pointer",
              opacity: downloading ? 0.6 : 1,
            }}
          >
            {downloading ? "Preparing…" : "Download Card (PDF)"}
          </button>
          <button
            onClick={onClose}
            style={{
              background: "#fff",
              color: "#1c2a52",
              border: "1px solid #d8dce5",
              borderRadius: 8,
              padding: "10px 16px",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

