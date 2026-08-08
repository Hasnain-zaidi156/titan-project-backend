import { useState } from "react";
import { CustomSelect } from "./CustomSelect";
import { ToastStack } from "./ToastStack";
import { useToasts } from "./hooks";
import { STATUS_OPTIONS } from "../../constants/studentConstants";

const UPDATION_TYPES = ["results"];

export function UpdationPage() {
  const [type, setType] = useState("results");
  const [rollNumbers, setRollNumbers] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const { toasts, showToast } = useToasts();

  const canSubmit = rollNumbers.trim().length > 0 && !!status;

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    const numbers = rollNumbers
      .split(",")
      .map((n) => n.trim())
      .filter(Boolean);

    showToast(`Updated ${numbers.length} record(s) to "${status}"`);
    setRollNumbers("");
    setMessage("");
    setStatus("");
  };

  return (
    <div className="ta-updation-page">
      <form className="ta-updation-form" onSubmit={handleUpdate}>
        <CustomSelect
          value={type}
          placeholder="results"
          options={UPDATION_TYPES}
          onChange={setType}
          allowClear={false}
        />

        <textarea
          className="ta-updation-textarea ta-updation-roll"
          placeholder="Roll numbers example: 1122,1123,1124,1125"
          aria-label="Roll numbers"
          value={rollNumbers}
          onChange={(e) => setRollNumbers(e.target.value)}
        />

        <input
          className="ta-updation-input"
          type="text"
          placeholder="Message"
          aria-label="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <CustomSelect
          value={status}
          placeholder="Select status"
          options={STATUS_OPTIONS}
          onChange={setStatus}
        />

        <button type="submit" className="ta-updation-submit" disabled={!canSubmit}>
          UPDATE
        </button>

        <p className="ta-updation-hint">
          Use this link for comma seprated values{" "}
          <a href="https://arraythis.com" target="_blank" rel="noreferrer">
            Text to Array Converter
          </a>
        </p>
      </form>

      <ToastStack toasts={toasts} />
    </div>
  );
}
