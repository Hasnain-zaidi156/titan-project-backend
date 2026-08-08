import { useState, useRef } from "react";
import { Icon, ICONS } from "./Icon";

// Circular avatar — Student photo aur Trainer photo dono ke liye shared hai.
// Photo na ho to plain user icon dikhata hai.
export function Avatar({ src, alt, size = 34 }) {
  const dim = { width: size, height: size };
  if (src) {
    return (
      <img
        src={src}
        alt={alt || ""}
        style={{
          ...dim,
          borderRadius: "50%",
          objectFit: "cover",
          border: "1px solid var(--ta-border, #d9d9d9)",
          flexShrink: 0,
        }}
      />
    );
  }
  return (
    <div
      style={{
        ...dim,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--ta-bg-muted, #f0f0f0)",
        color: "var(--ta-text-muted, #999)",
        flexShrink: 0,
      }}
      aria-hidden="true"
    >
      <Icon path={ICONS.user} size={Math.round(size * 0.55)} />
    </div>
  );
}

// <input type="file"> se image ko base64 data URL mein convert karta hai
export function readImageAsDataUrl(file, onLoaded, onError) {
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    onError?.("Please choose an image file");
    return;
  }
  if (file.size > 3 * 1024 * 1024) {
    onError?.("Image must be smaller than 3MB");
    return;
  }
  const reader = new FileReader();
  reader.onload = () => onLoaded(reader.result);
  reader.onerror = () => onError?.("Could not read image");
  reader.readAsDataURL(file);
}

// Circular preview + file input + remove button — StudentFormModal aur
// TrainerFormModal dono isko use karte hain
export function PhotoUploadField({ label = "Photo", value, onChange }) {
  const [error, setError] = useState("");
  const inputId = useRef(`photo-upload-${Math.random().toString(36).slice(2)}`).current;

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    setError("");
    readImageAsDataUrl(
      file,
      (dataUrl) => onChange(dataUrl),
      (msg) => setError(msg)
    );
    e.target.value = ""; // allow re-selecting the same file
  };

  return (
    <div className="ta-filter-field">
      <label>{label}</label>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Avatar src={value} alt={label} size={48} />
        <label
          htmlFor={inputId}
          className="ta-btn-outline"
          style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}
        >
          <Icon path={ICONS.camera} size={14} />
          {value ? "Change" : "Upload"}
        </label>
        <input
          id={inputId}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFile}
        />
        {value && (
          <button
            type="button"
            className="ta-icon-action"
            title="Remove photo"
            aria-label="Remove photo"
            onClick={() => onChange("")}
          >
            <Icon path={ICONS.trash} size={14} />
          </button>
        )}
      </div>
      {error && <p className="ta-field-error-msg">{error}</p>}
    </div>
  );
}
