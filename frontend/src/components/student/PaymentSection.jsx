"use client"

// Payment/voucher page - fee records + generate voucher button

const PAYMENT_METHODS = [
  { key: "JazzCash", label: "JazzCash" },
  { key: "EasyPaisa", label: "EasyPaisa" },
  { key: "Bank Transfer", label: "Bank Transfer" },
]

export default function PaymentSection({
  studentCourse,
  setStudentView,
  feeRecords,
  liveInvoices,
  generatingVoucher,
  voucherError,
  generateVoucher,
  paymentMethod = "JazzCash",
  setPaymentMethod,
}) {
  return (
    <div className="s-section animated-fade">
      <div className="s-breadcrumb-row">
        <div className="breadcrumbs">
          <span className="breadcrumb-nav-link" onClick={() => setStudentView("home")}>Home</span> &gt; <span className="current-crumb">{studentCourse.title}</span> &gt; <span className="current-crumb">Payment</span>
        </div>
      </div>
      <div className="workspace-card-view">
        <h3 style={{ marginTop: 0 }}>Payment Instructions</h3>
        <div className="s-payment-steps">
          {["Open JazzCash APP", "Select 'Universities' option", "Search and select 'TITAN'", "Enter your Voucher ID", "Enter the amount (Rs: 1000/-)", "Confirm the payment", "Take screenshot and keep as record"].map((step, i) => (
            <div key={i} className="s-payment-step"><div className="s-step-num">{i + 1}</div><span>{step}</span></div>
          ))}
        </div>
      </div>
      <div className="workspace-card-view" style={{ marginTop: 20 }}>
        <h3 style={{ marginTop: 0 }}>Payment Method</h3>
        <div className="s-payment-method-row">
          {PAYMENT_METHODS.map((m) => (
            <label key={m.key} className={`s-payment-method-pill ${paymentMethod === m.key ? "active" : ""}`}>
              <input
                type="radio"
                name="paymentMethod"
                value={m.key}
                checked={paymentMethod === m.key}
                onChange={() => setPaymentMethod && setPaymentMethod(m.key)}
              />
              {m.label}
            </label>
          ))}
        </div>
      </div>
      <div className="workspace-card-view" style={{ marginTop: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <h3 style={{ margin: 0 }}>Fee Records</h3>
          <button
            className="student-view-details-btn"
            style={{ opacity: generatingVoucher ? 0.7 : 1 }}
            onClick={() => generateVoucher(paymentMethod)}
            disabled={generatingVoucher || (liveInvoices || []).some((inv) => inv.status === "PENDING")}
          >
            {generatingVoucher ? "Generating..." : `Generate Voucher (${paymentMethod})`}
          </button>
        </div>
        {voucherError && <p style={{ color: "var(--red-color, #ef4444)", fontSize: "0.85rem", marginTop: 8 }}>{voucherError}</p>}
        <div className="table-responsive-wrapper" style={{ marginTop: 12 }}>
          <table className="client-data-table s-fee-table">
            <thead><tr><th>Month</th><th>Amount</th><th>Type</th><th>Due date</th><th>Voucher ID</th><th>Method</th><th>Status</th></tr></thead>
            <tbody>
              {(liveInvoices || []).map((inv, i) => (
                <tr key={`live-${i}`}>
                  <td>{inv.month}</td>
                  <td>Rs: {inv.amount} /-</td>
                  <td>{inv.type}</td>
                  <td>{inv.dueDate}</td>
                  <td style={{ fontSize: "0.8rem" }}>{inv.invoiceNumber}</td>
                  <td>{inv.paymentMethod || "-"}</td>
                  <td><span className={inv.status === "PAID" ? "badge-present-status" : "s-att-badge s-att-leave"}>{inv.status}</span></td>
                </tr>
              ))}
              {feeRecords.map((r, i) => (
                <tr key={i}><td>{r.month}</td><td>{r.amount}</td><td>{r.type}</td><td>{r.dueDate}</td><td style={{ fontSize: "0.8rem" }}>{r.voucherId}</td><td>JazzCash</td><td><span className="badge-present-status">{r.status}</span></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
