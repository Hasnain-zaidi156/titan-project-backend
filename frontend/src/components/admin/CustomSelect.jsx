import { useState } from "react";
import { Icon, ICONS } from "./Icon";
import { useEscapeKey } from "./hooks";

// Ek hi reusable dropdown — jahan bhi styled <select> chahiye wahan ye use hota hai
export function CustomSelect({ label, value, placeholder, options, onChange, allowClear = true }) {
  const [open, setOpen] = useState(false);
  const shownPlaceholder = placeholder || label;

  return (
    <div className="ta-filter-field">
      {label && <label>{label}</label>}
      <div
        className="ta-select-wrap"
        onClick={() => setOpen((p) => !p)}
        role="button"
        tabIndex={0}
        aria-haspopup="listbox"
        aria-expanded={open}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((p) => !p);
          }
          if (e.key === "Escape") setOpen(false);
        }}
      >
        <span className={value ? "" : "ta-select-placeholder"}>{value || shownPlaceholder}</span>
        <Icon path={ICONS.chevronDown} size={15} />
        {open && (
          <>
            <div className="ta-select-backdrop" onClick={(e) => { e.stopPropagation(); setOpen(false); }} />
            <div className="ta-select-menu" role="listbox">
              {allowClear && (
                <div
                  className="ta-select-option ta-select-option-clear"
                  onClick={(e) => { e.stopPropagation(); onChange(""); setOpen(false); }}
                >
                  {shownPlaceholder}
                </div>
              )}
              {options.length === 0 && <div className="ta-select-empty">No options</div>}
              {options.map((opt) => (
                <div
                  key={opt}
                  className="ta-select-option"
                  role="option"
                  aria-selected={value === opt}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(opt);
                    setOpen(false);
                  }}
                >
                  {opt}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Chota inline confirm popover — delete/send jaisi actions par
export function ConfirmPopover({ message, onCancel, onConfirm }) {
  useEscapeKey(onCancel);
  return (
    <div className="ta-confirm-popover" onClick={(e) => e.stopPropagation()} role="alertdialog" aria-modal="true">
      <div className="ta-confirm-popover-msg">
        <Icon path={ICONS.alert} size={15} />
        <span>{message}</span>
      </div>
      <div className="ta-confirm-popover-actions">
        <button className="ta-btn-outline ta-confirm-btn-sm" onClick={onCancel}>Cancel</button>
        <button className="ta-btn-primary ta-confirm-btn-sm" onClick={onConfirm}>OK</button>
      </div>
    </div>
  );
}
