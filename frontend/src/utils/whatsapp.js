// wa.me link se WhatsApp Web/App khulta hai with message pre-filled —
// admin sirf "Send" dabata hai, koi paid API/account chahiye nahi.
export function openWhatsApp(phone, message) {
  const digits = String(phone || "").replace(/\D/g, "");
  const withCountry = digits.startsWith("92") ? digits : digits.startsWith("0") ? `92${digits.slice(1)}` : digits;
  if (!withCountry) return false;
  window.open(`https://wa.me/${withCountry}?text=${encodeURIComponent(message)}`, "_blank");
  return true;
}
