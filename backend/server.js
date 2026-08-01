import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

// Fallback catalog — mirrors the frontend's COURSES/CAMPUSES lists. Used
// only so the dashboard's "Courses"/"Campuses" cards don't show 0 before
// any students have been added yet.
const COURSES = ['Graphic Designing', 'Mobile App Development', 'Web Development', 'Digital Marketing', 'Spoken English'];
const CAMPUSES = ['TITAN Sukkur Campus', 'TITAN Karachi Campus', 'TITAN Lahore Campus'];

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ================= ADMIN AUTH SCHEMA & MODEL =================
const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  name: { type: String, required: true },
});

const AdminUser = mongoose.model('AdminUser', adminSchema);

const fallbackUsers = [
  {
    email: 'superadmin@example.com',
    password: 'super',
    role: 'Super Admin',
    name: 'Super Admin',
  },
  {
    email: 'subadmin@example.com',
    password: 'sub',
    role: 'Sub Admin',
    name: 'Sub Admin',
  },
];

// ================= STUDENT SCHEMA & MODEL =================
const invoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, default: '' },
  jazzCashId: { type: String, default: '' },
  type: { type: String, default: 'Registration' },
  month: { type: String, default: '' },
  dueDate: { type: String, default: '' },
  amount: { type: Number, default: 1000 },
  status: { type: String, default: 'PENDING' },
});

const studentSchema = new mongoose.Schema({
  admissionNo: { type: String, required: true, unique: true },
  rollNumber: { type: String, required: true, unique: true },
  photo: { type: String, default: '' }, // base64 data URL (uploaded from SuperAdmin form)
  studentName: { type: String, required: true },
  fatherName: { type: String, required: true },
  cnic: { type: String, required: true },
  phone: { type: String, required: true },
  country: { type: String, default: 'Pakistan' },
  city: { type: String, default: '' },
  campus: { type: String, default: '' },
  course: { type: String, default: '' },
  batch: { type: String, default: '' },
  slot: { type: String, default: '' },
  status: { type: String, default: 'pending' },
  paymentStatus: { type: String, default: 'Not Generated' },
  gender: { type: String, default: 'Male' },
  laptop: { type: String, default: 'No' },
  invoices: [invoiceSchema],
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);

// ================= TRAINER SCHEMA & MODEL =================
const trainerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  employeeId: { type: String, required: true, unique: true }, // doubles as trainer's "roll no"
  photo: { type: String, default: '' }, // base64 data URL
  courses: { type: [String], default: [] },
  cities: { type: [String], default: [] },
  campus: { type: String, default: '' },
  slotSchedule: { type: String, default: '' },
  status: { type: String, default: 'Active' },
}, { timestamps: true });

const Trainer = mongoose.model('Trainer', trainerSchema);

// ================= STUDENT ATTENDANCE SCHEMA & MODEL =================
// One document per (student, date). Mark Attendance / Multi Attendance /
// View Attendance (mark-as-leave) pages all read & write this collection.
const attendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  rollNumber: { type: String, required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  status: { type: String, enum: ['present', 'leave'], default: 'present' },
  reason: { type: String, default: '' },
}, { timestamps: true });
attendanceSchema.index({ rollNumber: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);

// ================= TRAINER ATTENDANCE SCHEMA & MODEL =================
// One document per check-in/check-out. Mark Trainer Attendance (scan card)
// creates/closes these; View Trainer Attendance reads & edits them.
const trainerAttendanceSchema = new mongoose.Schema({
  trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer' },
  employeeId: { type: String, required: true },
  trainerName: { type: String, required: true },
  slotSchedule: { type: String, default: '' },
  campus: { type: String, default: '' },
  checkIn: { type: String, default: '' }, // "YYYY-MM-DDTHH:mm:00"
  checkOut: { type: String, default: '' },
  lateMinutes: { type: Number, default: 0 },
  status: { type: String, default: 'default' },
}, { timestamps: true });

const TrainerAttendance = mongoose.model('TrainerAttendance', trainerAttendanceSchema);

// ================= TRAINER ATTENDANCE REQUEST SCHEMA & MODEL =================
// Correction requests submitted from the "Attendance Request" page.
const trainerAttendanceRequestSchema = new mongoose.Schema({
  trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer' },
  trainerName: { type: String, required: true },
  campus: { type: String, default: '' },
  schedule: { type: String, default: '' },
  checkIn: { type: String, default: '' },
  checkOut: { type: String, default: '' },
  type: { type: String, default: 'Correction' },
  status: { type: String, default: 'pending' },
  reason: { type: String, default: '' },
}, { timestamps: true });

const TrainerAttendanceRequest = mongoose.model('TrainerAttendanceRequest', trainerAttendanceRequestSchema);

const isDbConnected = () => mongoose.connection.readyState === 1;

// Maps a Mongoose student document to the plain shape the frontend expects
// (id as a string instead of Mongo's _id).
function serializeStudent(doc) {
  return {
    id: doc._id.toString(),
    admissionNo: doc.admissionNo,
    rollNumber: doc.rollNumber,
    photo: doc.photo || '',
    studentName: doc.studentName,
    fatherName: doc.fatherName,
    cnic: doc.cnic,
    phone: doc.phone,
    country: doc.country,
    city: doc.city,
    campus: doc.campus,
    course: doc.course,
    batch: doc.batch,
    slot: doc.slot,
    status: doc.status,
    paymentStatus: doc.paymentStatus,
    gender: doc.gender,
    laptop: doc.laptop,
    invoices: doc.invoices || [],
  };
}

function serializeTrainer(doc) {
  return {
    id: doc._id.toString(),
    name: doc.name,
    email: doc.email,
    employeeId: doc.employeeId,
    photo: doc.photo || '',
    courses: doc.courses || [],
    cities: doc.cities || [],
    campus: doc.campus,
    slotSchedule: doc.slotSchedule,
    status: doc.status,
  };
}

function serializeAttendance(doc) {
  return {
    id: doc._id.toString(),
    studentId: doc.studentId?.toString(),
    rollNumber: doc.rollNumber,
    date: doc.date,
    status: doc.status,
    reason: doc.reason || '',
  };
}

function serializeTrainerAttendance(doc) {
  return {
    id: doc._id.toString(),
    trainerId: doc.trainerId?.toString(),
    employeeId: doc.employeeId,
    trainerName: doc.trainerName,
    slotSchedule: doc.slotSchedule,
    campus: doc.campus,
    checkIn: doc.checkIn,
    checkOut: doc.checkOut,
    lateMinutes: doc.lateMinutes,
    status: doc.status,
  };
}

function serializeTrainerAttendanceRequest(doc) {
  return {
    id: doc._id.toString(),
    trainerId: doc.trainerId?.toString(),
    trainerName: doc.trainerName,
    campus: doc.campus,
    schedule: doc.schedule,
    checkIn: doc.checkIn,
    checkOut: doc.checkOut,
    type: doc.type,
    status: doc.status,
    reason: doc.reason || '',
  };
}

// ---- shared date / schedule helpers (mirror the frontend's logic so
// backend-computed stats and check-in windows match what the UI shows) ----

const CLASS_WEEKDAYS = [2, 4]; // Tuesday & Thursday are scheduled class days

function pad2(n) {
  return String(n).padStart(2, '0');
}

function toYMD(d) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function todayYMD() {
  return toYMD(new Date());
}

// Counts how many scheduled class weekdays fall between `from` and `to`
// (inclusive), used to compute a student's "Total Classes".
function countClassWeekdays(from, to) {
  let count = 0;
  const cursor = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const end = new Date(to.getFullYear(), to.getMonth(), to.getDate());
  while (cursor <= end) {
    if (CLASS_WEEKDAYS.includes(cursor.getDay())) count += 1;
    cursor.setDate(cursor.getDate() + 1);
  }
  return count;
}

function parseScheduleTimes(schedule) {
  if (!schedule) return [];
  const parts = schedule.split('|').map((p) => p.trim());
  const times = [];
  parts.forEach((part) => {
    const match = part.match(/(\d{1,2}:\d{2}\s?[AP]M)\s*-\s*(\d{1,2}:\d{2}\s?[AP]M)/i);
    if (match) times.push({ start: match[1], end: match[2] });
  });
  return times;
}

function to24hMinutes(t) {
  const m = t.trim().match(/(\d{1,2}):(\d{2})\s?([AP]M)/i);
  if (!m) return null;
  let h = Number(m[1]);
  const min = Number(m[2]);
  const ampm = m[3].toUpperCase();
  if (ampm === 'PM' && h !== 12) h += 12;
  if (ampm === 'AM' && h === 12) h = 0;
  return h * 60 + min;
}

// Returns { allowed, lateMinutes, nearestStart } for a check-in attempt
// against a trainer's slot schedule.
function evaluateCheckInWindow(schedule, now = new Date()) {
  const times = parseScheduleTimes(schedule);
  if (times.length === 0) return { allowed: true, lateMinutes: 0 };
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  for (const { start } of times) {
    const startMin = to24hMinutes(start);
    if (startMin == null) continue;
    if (nowMinutes >= startMin - 30 && nowMinutes <= startMin + 90) {
      return { allowed: true, lateMinutes: Math.max(0, nowMinutes - startMin) };
    }
  }
  return { allowed: false, lateMinutes: 0 };
}

// Generates a unique 6-digit roll number by scanning existing ones instead
// of trusting document count (count drifts if students are ever deleted).
async function generateUniqueRollNumber() {
  const last = await Student.findOne().sort({ rollNumber: -1 }).select('rollNumber');
  let next = last && !Number.isNaN(Number(last.rollNumber)) ? Number(last.rollNumber) + 1 : 827001;
  // Guard against collisions (e.g. manually-entered roll numbers higher than the sequence).
  while (await Student.exists({ rollNumber: String(next) })) {
    next += 1;
  }
  return String(next);
}

// Health Endpoint
app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'Titan admin backend is running' });
});

// Admin Login Endpoint (Unchanged)
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = null;

    if (isDbConnected()) {
      user = await AdminUser.findOne({ email, password });
    } else {
      user = fallbackUsers.find((entry) => entry.email === email && entry.password === password);
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      id: user._id || user.email,
      email: user.email,
      role: user.role,
      name: user.name,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Admin Dashboard Endpoint — computed live from MongoDB so the numbers
// change the moment a student is added/edited/deleted (no more hardcoding).
app.get('/api/admin/dashboard', async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.json({ totalStudents: 0, enrolledStudents: 0, courses: 0, campuses: 0 });
    }

    const [totalStudents, enrolledStudents, distinctCourses, distinctCampuses] = await Promise.all([
      Student.countDocuments(),
      Student.countDocuments({ status: 'enrolled' }),
      Student.distinct('course'),
      Student.distinct('campus'),
    ]);

    res.json({
      totalStudents,
      enrolledStudents,
      // Fall back to the fixed course/campus catalog when no students exist
      // yet, so the cards don't show 0 on a brand-new install.
      courses: distinctCourses.filter(Boolean).length || COURSES.length,
      campuses: distinctCampuses.filter(Boolean).length || CAMPUSES.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch dashboard stats', error: error.message });
  }
});

// Admin Seed Endpoint
app.post('/api/admin/seed', async (req, res) => {
  try {
    const seedUsers = fallbackUsers;
    if (isDbConnected()) {
      await AdminUser.deleteMany({});
      const created = await AdminUser.insertMany(seedUsers);
      return res.json({ message: 'Seeded admin users', count: created.length });
    }
    res.json({ message: 'Seeded admin users in memory', count: seedUsers.length });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ message: 'Seeding failed', error: error.message });
  }
});

// ================= STUDENT API ENDPOINTS =================
// All of these read/write directly against the MongoDB cluster configured
// via MONGODB_URI in .env. Every add / edit / invoice change / delete from
// the SuperAdmin portal's Students page goes through these routes.

// GET: Fetch all students from MongoDB
app.get('/api/students', async (req, res) => {
  try {
    if (isDbConnected()) {
      const students = await Student.find().sort({ createdAt: -1 });
      return res.json(students.map(serializeStudent));
    }
    res.json([]);
  } catch (error) {
    console.error('Fetch students error:', error);
    res.status(500).json({ message: 'Failed to fetch students', error: error.message });
  }
});

// POST: Add new student to MongoDB
app.post('/api/students', async (req, res) => {
  try {
    const studentData = req.body;

    if (isDbConnected()) {
      const count = await Student.countDocuments();
      const admissionNo = studentData.admissionNo || `ADM${900000 + count + 1}`;
      const rollNumber = (studentData.rollNumber || '').trim() || (await generateUniqueRollNumber());

      const newStudent = new Student({
        ...studentData,
        admissionNo,
        rollNumber,
        photo: studentData.photo || '',
        invoices: studentData.invoices || [],
      });

      const savedStudent = await newStudent.save();
      return res.status(201).json(serializeStudent(savedStudent));
    }

    res.status(503).json({ message: 'Database connection unavailable' });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.rollNumber) {
      return res.status(409).json({ message: 'Roll number already exists. Please choose another one.' });
    }
    console.error('Save student error:', error);
    res.status(500).json({ message: 'Failed to save student', error: error.message });
  }
});

// PUT: Update an existing student in MongoDB (edit form, invoice
// generation, and mark-as-paid all go through this same route — they
// just send different fields in the body).
app.put('/api/students/:id', async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(503).json({ message: 'Database connection unavailable' });
    }

    const updateBody = { ...req.body };
    if (typeof updateBody.rollNumber === 'string') {
      updateBody.rollNumber = updateBody.rollNumber.trim();
      if (!updateBody.rollNumber) delete updateBody.rollNumber; // never blank out an existing roll number
    }

    const updated = await Student.findByIdAndUpdate(
      req.params.id,
      { $set: updateBody },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(serializeStudent(updated));
  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.rollNumber) {
      return res.status(409).json({ message: 'Roll number already exists. Please choose another one.' });
    }
    console.error('Update student error:', error);
    res.status(500).json({ message: 'Failed to update student', error: error.message });
  }
});

// DELETE: Remove a student from MongoDB
app.delete('/api/students/:id', async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(503).json({ message: 'Database connection unavailable' });
    }

    const deleted = await Student.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: 'Deleted', id: req.params.id });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ message: 'Failed to delete student', error: error.message });
  }
});

// ================= STUDENT ATTENDANCE API ENDPOINTS =================
// Backs the Mark Attendance / Multi Attendance / View Attendance pages.
// Every present/leave mark is a real Attendance document in MongoDB,
// keyed by (rollNumber, date), so stats survive refreshes and are shared
// across Super Admin and Sub Admin.

// Statuses that should NOT be allowed to have attendance marked.
const BLOCKED_STUDENT_STATUSES = ['rejected', 'eliminated', 'dropout', 'cancelled', 'blacklisted'];

// GET: Summary table for View Attendance — one row per student with
// computed Total/Present/Leave/Absent/Percentage.
app.get('/api/attendance/summary', async (req, res) => {
  try {
    if (!isDbConnected()) return res.json([]);

    const students = await Student.find().sort({ createdAt: -1 });
    const today = new Date();

    const rows = await Promise.all(
      students.map(async (s) => {
        const records = await Attendance.find({ rollNumber: s.rollNumber });
        const present = records.filter((r) => r.status === 'present').length;
        const leave = records.filter((r) => r.status === 'leave').length;
        const totalClasses = countClassWeekdays(s.createdAt || today, today);
        const absent = Math.max(0, totalClasses - present - leave);
        const percentage = totalClasses > 0 ? ((present + leave) / totalClasses) * 100 : 0;

        return {
          rollNumber: s.rollNumber,
          studentName: s.studentName,
          fatherName: s.fatherName,
          course: s.course,
          campus: s.campus,
          status: s.status,
          photo: s.photo || '',
          totalClasses,
          present,
          leave,
          absent,
          percentage,
          presentDates: records.filter((r) => r.status === 'present').map((r) => r.date),
          leaveDates: records.filter((r) => r.status === 'leave').map((r) => r.date),
        };
      })
    );

    res.json(rows);
  } catch (error) {
    console.error('Attendance summary error:', error);
    res.status(500).json({ message: 'Failed to load attendance summary', error: error.message });
  }
});

// GET: Recent attendance history for one roll number (used by Mark Attendance's history panel).
app.get('/api/attendance/history/:rollNumber', async (req, res) => {
  try {
    if (!isDbConnected()) return res.json([]);
    const records = await Attendance.find({ rollNumber: req.params.rollNumber }).sort({ date: -1 }).limit(20);
    res.json(records.map(serializeAttendance));
  } catch (error) {
    console.error('Attendance history error:', error);
    res.status(500).json({ message: 'Failed to load attendance history', error: error.message });
  }
});

// POST: Mark today's (or given date's) attendance for one roll number.
app.post('/api/attendance/mark', async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(503).json({ message: 'Database connection unavailable' });
    }

    const rollNumber = (req.body.rollNumber || '').trim();
    const date = req.body.date || todayYMD();
    if (!rollNumber) return res.status(400).json({ message: 'Roll number is required' });

    const student = await Student.findOne({ rollNumber });
    if (!student) {
      return res.status(404).json({ message: 'No student found with this roll number.' });
    }

    if (BLOCKED_STUDENT_STATUSES.includes((student.status || '').toLowerCase())) {
      return res.status(409).json({
        message: `The student exists, but their status is invalid. '${student.status}'`,
        student: serializeStudent(student),
      });
    }

    const record = await Attendance.findOneAndUpdate(
      { rollNumber, date },
      { $set: { studentId: student._id, rollNumber, date, status: 'present' } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json({ student: serializeStudent(student), record: serializeAttendance(record) });
  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(500).json({ message: 'Failed to mark attendance', error: error.message });
  }
});

// POST: Bulk mark present for a comma-list of roll numbers (Multi Attendance page).
app.post('/api/attendance/mark-bulk', async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(503).json({ message: 'Database connection unavailable' });
    }

    const date = req.body.date || todayYMD();
    const rollNumbers = Array.isArray(req.body.rollNumbers) ? req.body.rollNumbers : [];

    let marked = 0;
    const notFound = [];

    for (const raw of rollNumbers) {
      const rollNumber = String(raw).trim();
      if (!rollNumber) continue;
      const student = await Student.findOne({ rollNumber });
      if (!student) {
        notFound.push(rollNumber);
        continue;
      }
      await Attendance.findOneAndUpdate(
        { rollNumber, date },
        { $set: { studentId: student._id, rollNumber, date, status: 'present' } },
        { upsert: true, setDefaultsOnInsert: true }
      );
      marked += 1;
    }

    res.json({ marked, notFound });
  } catch (error) {
    console.error('Bulk mark attendance error:', error);
    res.status(500).json({ message: 'Failed to mark attendance', error: error.message });
  }
});

// POST: Mark a specific date as leave for a roll number (from the absent-day calendar click).
app.post('/api/attendance/leave', async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(503).json({ message: 'Database connection unavailable' });
    }

    const rollNumber = (req.body.rollNumber || '').trim();
    const date = req.body.date;
    const reason = req.body.reason || '';
    if (!rollNumber || !date) return res.status(400).json({ message: 'Roll number and date are required' });

    const student = await Student.findOne({ rollNumber });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const record = await Attendance.findOneAndUpdate(
      { rollNumber, date },
      { $set: { studentId: student._id, rollNumber, date, status: 'leave', reason } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json(serializeAttendance(record));
  } catch (error) {
    console.error('Mark leave error:', error);
    res.status(500).json({ message: 'Failed to mark leave', error: error.message });
  }
});

// ================= TRAINER API ENDPOINTS =================
// Mirrors the Student routes above so Trainers now persist in the same
// MongoDB cluster instead of only living in frontend React state.

// GET: Fetch all trainers from MongoDB
app.get('/api/trainers', async (req, res) => {
  try {
    if (isDbConnected()) {
      const trainers = await Trainer.find().sort({ createdAt: -1 });
      return res.json(trainers.map(serializeTrainer));
    }
    res.json([]);
  } catch (error) {
    console.error('Fetch trainers error:', error);
    res.status(500).json({ message: 'Failed to fetch trainers', error: error.message });
  }
});

// POST: Add new trainer to MongoDB
app.post('/api/trainers', async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(503).json({ message: 'Database connection unavailable' });
    }

    const trainerData = req.body;
    const newTrainer = new Trainer({
      ...trainerData,
      photo: trainerData.photo || '',
      courses: Array.isArray(trainerData.courses) ? trainerData.courses : [trainerData.courses].filter(Boolean),
      cities: Array.isArray(trainerData.cities) ? trainerData.cities : [trainerData.cities].filter(Boolean),
    });

    const savedTrainer = await newTrainer.save();
    res.status(201).json(serializeTrainer(savedTrainer));
  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.employeeId) {
      return res.status(409).json({ message: 'Employee ID already exists. Please choose another one.' });
    }
    console.error('Save trainer error:', error);
    res.status(500).json({ message: 'Failed to save trainer', error: error.message });
  }
});

// PUT: Update an existing trainer in MongoDB
app.put('/api/trainers/:id', async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(503).json({ message: 'Database connection unavailable' });
    }

    const updateBody = { ...req.body };
    if (updateBody.courses && !Array.isArray(updateBody.courses)) updateBody.courses = [updateBody.courses];
    if (updateBody.cities && !Array.isArray(updateBody.cities)) updateBody.cities = [updateBody.cities];

    const updated = await Trainer.findByIdAndUpdate(
      req.params.id,
      { $set: updateBody },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Trainer not found' });
    }

    res.json(serializeTrainer(updated));
  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.employeeId) {
      return res.status(409).json({ message: 'Employee ID already exists. Please choose another one.' });
    }
    console.error('Update trainer error:', error);
    res.status(500).json({ message: 'Failed to update trainer', error: error.message });
  }
});

// DELETE: Remove a trainer from MongoDB
app.delete('/api/trainers/:id', async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(503).json({ message: 'Database connection unavailable' });
    }

    const deleted = await Trainer.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Trainer not found' });
    }

    res.json({ message: 'Deleted', id: req.params.id });
  } catch (error) {
    console.error('Delete trainer error:', error);
    res.status(500).json({ message: 'Failed to delete trainer', error: error.message });
  }
});

// ================= TRAINER ATTENDANCE API ENDPOINTS =================
// Backs the "Scan Trainer Card" (Mark), View, and edit-correction flows.

// GET: All trainer attendance records (View Trainer Attendance page)
app.get('/api/trainer-attendance', async (req, res) => {
  try {
    if (!isDbConnected()) return res.json([]);
    const records = await TrainerAttendance.find().sort({ createdAt: -1 });
    res.json(records.map(serializeTrainerAttendance));
  } catch (error) {
    console.error('Fetch trainer attendance error:', error);
    res.status(500).json({ message: 'Failed to fetch trainer attendance', error: error.message });
  }
});

// POST: Check in a trainer by Employee ID. Rejects if outside the
// schedule's check-in window, or if already checked in today without
// having checked out yet.
app.post('/api/trainer-attendance/checkin', async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(503).json({ message: 'Database connection unavailable' });
    }

    const employeeId = (req.body.employeeId || '').trim();
    const trainer = await Trainer.findOne({ employeeId });
    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' });
    }

    const openRecord = await TrainerAttendance.findOne({
      employeeId,
      checkIn: { $regex: `^${todayYMD()}` },
      checkOut: '',
    });
    if (openRecord) {
      return res.status(409).json({ message: 'Already checked in. Please check out first.' });
    }

    const { allowed, lateMinutes } = evaluateCheckInWindow(trainer.slotSchedule);
    if (!allowed) {
      return res.status(409).json({ message: 'Check-in not allowed at this time' });
    }

    const now = new Date();
    const record = await TrainerAttendance.create({
      trainerId: trainer._id,
      employeeId: trainer.employeeId,
      trainerName: trainer.name,
      slotSchedule: trainer.slotSchedule,
      campus: trainer.campus,
      checkIn: `${todayYMD()}T${pad2(now.getHours())}:${pad2(now.getMinutes())}:00`,
      checkOut: '',
      lateMinutes,
      status: 'default',
    });

    res.status(201).json({ trainer: serializeTrainer(trainer), record: serializeTrainerAttendance(record) });
  } catch (error) {
    console.error('Trainer check-in error:', error);
    res.status(500).json({ message: 'Failed to check in', error: error.message });
  }
});

// POST: Check out a trainer by Employee ID — closes today's open record.
app.post('/api/trainer-attendance/checkout', async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(503).json({ message: 'Database connection unavailable' });
    }

    const employeeId = (req.body.employeeId || '').trim();
    const openRecord = await TrainerAttendance.findOne({
      employeeId,
      checkIn: { $regex: `^${todayYMD()}` },
      checkOut: '',
    }).sort({ createdAt: -1 });

    if (!openRecord) {
      return res.status(404).json({ message: 'No open check-in found for today' });
    }

    const now = new Date();
    openRecord.checkOut = `${todayYMD()}T${pad2(now.getHours())}:${pad2(now.getMinutes())}:00`;
    await openRecord.save();

    res.json(serializeTrainerAttendance(openRecord));
  } catch (error) {
    console.error('Trainer check-out error:', error);
    res.status(500).json({ message: 'Failed to check out', error: error.message });
  }
});

// PUT: Manual correction of a trainer attendance record (edit modal on View page).
app.put('/api/trainer-attendance/:id', async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(503).json({ message: 'Database connection unavailable' });
    }

    const updated = await TrainerAttendance.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Attendance record not found' });

    res.json(serializeTrainerAttendance(updated));
  } catch (error) {
    console.error('Update trainer attendance error:', error);
    res.status(500).json({ message: 'Failed to update trainer attendance', error: error.message });
  }
});

// ================= TRAINER ATTENDANCE REQUEST API ENDPOINTS =================

// GET: All correction requests
app.get('/api/trainer-attendance-requests', async (req, res) => {
  try {
    if (!isDbConnected()) return res.json([]);
    const requests = await TrainerAttendanceRequest.find().sort({ createdAt: -1 });
    res.json(requests.map(serializeTrainerAttendanceRequest));
  } catch (error) {
    console.error('Fetch trainer attendance requests error:', error);
    res.status(500).json({ message: 'Failed to fetch requests', error: error.message });
  }
});

// POST: Submit a new correction request
app.post('/api/trainer-attendance-requests', async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(503).json({ message: 'Database connection unavailable' });
    }

    const created = await TrainerAttendanceRequest.create(req.body);
    res.status(201).json(serializeTrainerAttendanceRequest(created));
  } catch (error) {
    console.error('Create trainer attendance request error:', error);
    res.status(500).json({ message: 'Failed to submit request', error: error.message });
  }
});

// Start Server
const startServer = async () => {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('MongoDB connected');
    } else {
      console.log('MongoDB URI not found; continuing without DB connection');
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();