import { GENDERS } from "./studentConstants";

export const SLOT_TRAINERS = ["Shehzad Iqbal", "Miss Muskan", "Shumaila Shiwani", "Miss Hanifa Asad", "Waqas Ahmed", "Sana Malik", "Faisal Raza"];
export const SLOT_COURSES = [
  "Modern Web Application Development | Batch (1)",
  "AI & Game Creators | Batch (1)",
  "Little Geniuses: Coding, Design & AI Fun Lab | Batch (1)",
];
export const SLOT_CAMPUSES = ["Bahria College 1 Majeed...", "Bahria College Hanif...", "Bahria Subh-e-Nau Se..."];
export const FACILITY_OPTIONS = ["Lab", "Non-Lab"];
export const SLOT_STATUS_OPTIONS = ["ACTIVE", "INACTIVE"];
export const ONLINE_OPTIONS = ["YES", "NO"];
export const CERT_OPTIONS = ["FREE", "PAID"];

export const SEED_SLOTS = [
  {
    id: 1, schedule: "Sat 11:00 PM - 01:00 AM", trainer: "Shehzad Iqbal",
    course: "Modern Web Application Development | Batch (1)", city: "Sukkur",
    campus: "Bahria College 1 Majeed...", enrolled: 15, capacity: 50,
    classType: "Lab", gender: "Male", status: "ACTIVE", onlineOffline: "NO",
    startDate: "2025-08-01", endDate: "", cert: "FREE", hourlyRate: "", whatsappLink: "",
  },
  {
    id: 2, schedule: "Sat 09:00 AM - 11:00 AM", trainer: "Shehzad Iqbal",
    course: "Modern Web Application Development | Batch (1)", city: "Sukkur",
    campus: "Bahria College 1 Majeed...", enrolled: 19, capacity: 63,
    classType: "Lab", gender: "Female", status: "ACTIVE", onlineOffline: "NO",
    startDate: "2025-08-01", endDate: "", cert: "FREE", hourlyRate: "", whatsappLink: "",
  },
  {
    id: 3, schedule: "Mon 09:00 AM - 11:00 AM", trainer: "Miss Muskan",
    course: "AI & Game Creators | Batch (1)", city: "Karachi",
    campus: "Bahria College Hanif...", enrolled: 0, capacity: 50,
    classType: "Lab", gender: "Female", status: "ACTIVE", onlineOffline: "NO",
    startDate: "2026-06-08", endDate: "2026-08-01", cert: "FREE", hourlyRate: "", whatsappLink: "",
  },
  {
    id: 4, schedule: "Mon 11:00 AM - 01:00 PM", trainer: "Miss Muskan",
    course: "Little Geniuses: Coding, Design & AI Fun Lab | Batch (1)", city: "Karachi",
    campus: "Bahria College Hanif...", enrolled: 0, capacity: 70,
    classType: "Lab", gender: "Female", status: "ACTIVE", onlineOffline: "NO",
    startDate: "2026-06-08", endDate: "2026-08-01", cert: "FREE", hourlyRate: "", whatsappLink: "",
  },
  {
    id: 5, schedule: "Mon 11:00 AM - 01:00 PM", trainer: "Shumaila Shiwani",
    course: "Little Geniuses: Coding, Design & AI Fun Lab | Batch (1)", city: "Lahore",
    campus: "Bahria Subh-e-Nau Se...", enrolled: 0, capacity: 80,
    classType: "Lab", gender: "Female", status: "ACTIVE", onlineOffline: "NO",
    startDate: "2026-06-08", endDate: "2026-08-01", cert: "FREE", hourlyRate: "", whatsappLink: "",
  },
  {
    id: 6, schedule: "Tue 09:00 AM - 11:00 AM", trainer: "Miss Hanifa Asad",
    course: "AI & Game Creators | Batch (1)", city: "Karachi",
    campus: "Bahria College Hanif...", enrolled: 0, capacity: 60,
    classType: "Lab", gender: "Female", status: "ACTIVE", onlineOffline: "NO",
    startDate: "2026-06-08", endDate: "2026-06-10", cert: "FREE", hourlyRate: "", whatsappLink: "",
  },
];

export const EMPTY_SLOT_FORM = {
  schedule: "", city: "", campus: SLOT_CAMPUSES[0], course: SLOT_COURSES[0],
  trainer: SLOT_TRAINERS[0], classType: FACILITY_OPTIONS[0], status: "ACTIVE",
  gender: GENDERS[0], startDate: "", endDate: "", onlineOffline: "NO",
  hourlyRate: "", cert: "Paid", whatsappLink: "", enrolled: 0, capacity: 50,
};
