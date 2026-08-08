import { COURSES, CITIES, CAMPUSES } from "./studentConstants";

export const TRAINER_STATUS_OPTIONS = ["Active", "Inactive"];

// Backend down ho to demo rows dikhane ke liye fallback
export const TRAINERS_FULL_LIST = [
  {
    id: 1,
    name: "Sir Rajesh Kumar(SUK)",
    email: "rajesh.kumar@titan.edu",
    employeeId: "15354",
    photo: "",
    courses: ["Web Development"],
    cities: ["Sukkur"],
    campus: "Saylani TITAN Sukkur Campus",
    slotSchedule: "Sat 12:00 PM - 02:00 PM | Sun 12:00 PM - 02:00 PM",
    status: "Active",
  },
  {
    id: 2,
    name: "Miss Maham",
    email: "maham@titan.edu",
    employeeId: "15360",
    photo: "",
    courses: ["Graphic Designing"],
    cities: ["Sukkur"],
    campus: "Saylani TITAN Sukkur Campus",
    slotSchedule: "Sat 08:00 AM - 10:00 AM | Sun 08:00 AM - 10:00 AM",
    status: "Active",
  },
  {
    id: 3,
    name: "Sir ARSLAN AHMED (SUK)",
    email: "arslan.ahmed@titan.edu",
    employeeId: "15349",
    photo: "",
    courses: ["Artificial Intelligence and Data Science"],
    cities: ["Sukkur"],
    campus: "Saylani TITAN Sukkur Campus",
    slotSchedule: "Sat 08:00 AM - 10:00 AM | Sun 08:00 AM - 10:00 AM",
    status: "Active",
  },
];

export const SEED_TRAINER_ATTENDANCE = [
  {
    id: 1, employeeId: "15354", trainerName: "Sir Rajesh Kumar(SUK)",
    slotSchedule: "Sat 12:00 PM - 02:00 PM | Sun 12:00 PM - 02:00 PM",
    campus: "Saylani TITAN Sukkur Campus",
    checkIn: "2026-04-12T12:28:00", checkOut: "2026-04-12T16:36:00",
    lateMinutes: 28, status: "default",
  },
  {
    id: 2, employeeId: "15360", trainerName: "Miss Maham",
    slotSchedule: "Sat 08:00 AM - 10:00 AM | Sun 08:00 AM - 10:00 AM",
    campus: "Saylani TITAN Sukkur Campus",
    checkIn: "2026-04-12T08:03:00", checkOut: "2026-04-12T11:10:00",
    lateMinutes: 3, status: "default",
  },
  {
    id: 3, employeeId: "15360", trainerName: "Miss Maham",
    slotSchedule: "Sat 08:00 AM - 10:00 AM | Sun 08:00 AM - 10:00 AM",
    campus: "Saylani TITAN Sukkur Campus",
    checkIn: "2026-04-11T08:04:00", checkOut: "",
    lateMinutes: 4, status: "default",
  },
];

export const SEED_TRAINER_ATTENDANCE_REQUESTS = [];

export const EMPTY_TRAINER_FORM = {
  name: "", email: "", employeeId: "", photo: "",
  courses: COURSES[0], cities: CITIES[0], campus: CAMPUSES[0],
  slotSchedule: "", status: "Active",
};
