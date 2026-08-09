export const STATUS_OPTIONS = [
  "pending", "approved", "rejected", "passed", "failed", "enrolled",
  "completed", "eliminated", "dropout", "cancelled", "certified", "blacklisted",
];

export const PAYMENT_STATUS_OPTIONS = ["Paid", "Pending", "Not Generated"];
export const COUNTRIES = ["Pakistan"];
export const CITIES = ["Sukkur", "Karachi", "Lahore", "Islamabad"];
export const CAMPUSES = ["TITAN Sukkur Campus", "TITAN Karachi Campus", "TITAN Lahore Campus"];
export const COURSES = ["Graphic Designing", "Mobile App Development", "Web Development", "Digital Marketing", "Spoken English"];
export const BATCHES = ["Batch 1", "Batch 2", "Batch 3"];
export const SLOTS = ["Morning", "Evening"];
export const GENDERS = ["Male", "Female"];
export const LAPTOP_OPTIONS = ["Yes", "No"];

export const FILTER_FIELDS = [
  { key: "dateRange", label: "Start date  →  End date", type: "date-range" },
  { key: "country", label: "Country", type: "select", options: COUNTRIES },
  { key: "city", label: "City", type: "select", options: CITIES },
  { key: "campus", label: "Campus", type: "select", options: CAMPUSES },
  { key: "course", label: "Course", type: "select", options: COURSES },
  { key: "batch", label: "Batch", type: "select", options: BATCHES },
  { key: "slot", label: "Slot", type: "select", options: SLOTS },
  { key: "status", label: "Status", type: "select", options: STATUS_OPTIONS },
  { key: "laptop", label: "Laptop", type: "select", options: LAPTOP_OPTIONS },
  { key: "sponsorship", label: "Sponsorship Status", type: "select", options: ["Sponsored", "Self Paid"] },
  { key: "year", label: "Year", type: "select", options: ["2026", "2025", "2024"] },
  { key: "paymentMonth", label: "Payment Month", type: "select", options: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"] },
  { key: "paymentStatus", label: "Payment Status", type: "select", options: PAYMENT_STATUS_OPTIONS },
  { key: "gender", label: "Gender", type: "select", options: GENDERS },
];

export const TABLE_COLUMNS = [
  "Photo", "Roll No", "Student name", "Father name", "CNIC", "Phone",
  "Course", "Status", "Payment Status", "Action",
];

// Backend down ho ya DB khali ho to demo rows dikhane ke liye fallback
export const SEED_STUDENTS = [
  {
    id: 1,
    admissionNo: "ADM844226",
    rollNumber: "827544",
    photo: "",
    studentName: "Muhammad Hassan",
    fatherName: "Muhammad Afzal",
    cnic: "45504-0805007-3",
    dob: "",
    phone: "0310-3589178",
    course: "Mobile App Development",
    status: "enrolled",
    paymentStatus: "Not Generated",
    country: "Pakistan",
    city: "Sukkur",
    campus: "TITAN Sukkur Campus",
    batch: "Batch 1",
    slot: "Morning",
    gender: "Male",
    laptop: "No",
    invoices: [
      { invoiceNumber: "ADM844226", jazzCashId: "", type: "Registration", month: "May-2026", dueDate: "10-May-2026", amount: 1000, status: "PENDING" },
    ],
  },
  {
    id: 2,
    admissionNo: "ADM844227",
    rollNumber: "827545",
    photo: "",
    studentName: "Ayesha Khan",
    fatherName: "Imran Khan",
    cnic: "45201-1234567-8",
    dob: "",
    phone: "0300-1234567",
    course: "Graphic Designing",
    status: "pending",
    paymentStatus: "Pending",
    country: "Pakistan",
    city: "Karachi",
    campus: "TITAN Karachi Campus",
    batch: "Batch 2",
    slot: "Evening",
    gender: "Female",
    laptop: "Yes",
    invoices: [],
  },
  {
    id: 3,
    admissionNo: "ADM844228",
    rollNumber: "827546",
    photo: "",
    studentName: "Bilal Ahmed",
    fatherName: "Tariq Ahmed",
    cnic: "45100-9876543-2",
    dob: "",
    phone: "0321-1234567",
    course: "Web Development",
    status: "completed",
    paymentStatus: "Paid",
    country: "Pakistan",
    city: "Lahore",
    campus: "TITAN Lahore Campus",
    batch: "Batch 1",
    slot: "Morning",
    gender: "Male",
    laptop: "No",
    invoices: [
      { invoiceNumber: "ADM844228", jazzCashId: "JC998877", type: "Registration", month: "April-2026", dueDate: "10-Apr-2026", amount: 1000, status: "PAID" },
    ],
  },
];

export const EMPTY_FORM = {
  rollNumber: "", photo: "", studentName: "", fatherName: "", cnic: "", dob: "",
  phone: "", country: "Pakistan", city: CITIES[0], campus: CAMPUSES[0],
  course: COURSES[0], batch: BATCHES[0], slot: SLOTS[0], status: "pending",
  paymentStatus: "Not Generated", gender: GENDERS[0], laptop: "No",
  timing: "", // "Sat 09:00 AM - 11:00 AM | Sun 09:00 AM - 11:00 AM" — DayTimePicker se aata hai, trainer matching ke liye
};

// Pakistani CNIC: 12345-1234567-1 (dashes optional while typing)
export const CNIC_PATTERN = /^\d{5}-?\d{7}-?\d{1}$/;
// Pakistani mobile: 03XX-XXXXXXX (dash optional)
export const PHONE_PATTERN = /^03\d{2}-?\d{7}$/;

export function validateStudentForm(form) {
  const errors = {};
  if (!form.studentName.trim()) errors.studentName = "Required";
  if (!form.fatherName.trim()) errors.fatherName = "Required";
  if (!CNIC_PATTERN.test(form.cnic.trim())) errors.cnic = "Format: 00000-0000000-0";
  if (!form.dob) errors.dob = "Required — needed for student's Create Password login";
  if (!PHONE_PATTERN.test(form.phone.trim())) errors.phone = "Format: 03XXXXXXXXX";
  return errors;
}

export function statusBadgeClass(status) {
  const s = (status || "").toLowerCase();
  if (["enrolled", "approved", "passed"].includes(s)) return "ta-badge-blue";
  if (["completed", "certified"].includes(s)) return "ta-badge-green";
  if (["rejected", "failed", "eliminated", "cancelled", "blacklisted"].includes(s)) return "ta-badge-red";
  return "ta-badge-gray";
}

export function paymentBadgeClass(status) {
  const s = (status || "").toLowerCase();
  if (s === "paid") return "ta-badge-green";
  if (s === "pending") return "ta-badge-orange";
  return "ta-badge-red";
}
