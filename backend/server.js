import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

dotenv.config();

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
    { email: 'superadmin@example.com', password: 'super', role: 'Super Admin', name: 'Super Admin' },
    { email: 'subadmin@example.com', password: 'sub', role: 'Sub Admin', name: 'Sub Admin' },
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
    photo: { type: String, default: '' },
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
    timing: { type: String, default: '' },
    status: { type: String, default: 'pending' },
    paymentStatus: { type: String, default: 'Not Generated' },
    gender: { type: String, default: 'Male' },
    laptop: { type: String, default: 'No' },
    email: { type: String, default: '' },
    dob: { type: String, default: '' },
    address: { type: String, default: '' },
    fatherPhone: { type: String, default: '' },
    computerProficiency: { type: String, default: '' },
    lastQualification: { type: String, default: '' },
    hearAboutUs: { type: String, default: '' },
    password: { type: String, default: '' },
    accountActivated: { type: Boolean, default: false },
    invoices: [invoiceSchema],
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);

// ================= TRAINER SCHEMA & MODEL =================
const trainerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    employeeId: { type: String, required: true, unique: true },
    photo: { type: String, default: '' },
    courses: { type: [String], default: [] },
    cities: { type: [String], default: [] },
    campus: { type: String, default: '' },
    slotSchedule: { type: String, default: '' },
    status: { type: String, default: 'Active' },
    password: { type: String, default: '' },
}, { timestamps: true });

const Trainer = mongoose.model('Trainer', trainerSchema);

// ================= STUDENT ATTENDANCE SCHEMA & MODEL =================
const attendanceSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    rollNumber: { type: String, required: true },
    date: { type: String, required: true },
    status: { type: String, enum: ['present', 'leave'], default: 'present' },
    reason: { type: String, default: '' },
}, { timestamps: true });
attendanceSchema.index({ rollNumber: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);

// ================= TRAINER ATTENDANCE SCHEMA & MODEL =================
const trainerAttendanceSchema = new mongoose.Schema({
    trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer' },
    employeeId: { type: String, required: true },
    trainerName: { type: String, required: true },
    slotSchedule: { type: String, default: '' },
    campus: { type: String, default: '' },
    checkIn: { type: String, default: '' },
    checkOut: { type: String, default: '' },
    lateMinutes: { type: Number, default: 0 },
    status: { type: String, default: 'default' },
}, { timestamps: true });

const TrainerAttendance = mongoose.model('TrainerAttendance', trainerAttendanceSchema);

// ================= TRAINER ATTENDANCE REQUEST SCHEMA & MODEL =================
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

// ================= ASSIGNMENT SCHEMA & MODEL =================
const assignmentSubmissionSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    rollNumber: { type: String, required: true },
    studentName: { type: String, required: true },
    link: { type: String, default: '' },
    description: { type: String, default: '' },
    status: { type: String, default: 'Submitted' },
    approved: { type: Boolean, default: null },
    feedback: { type: String, default: '' },
    submittedAt: { type: Date, default: Date.now },
});

const assignmentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    course: { type: String, required: true },
    campus: { type: String, default: '' },
    batch: { type: String, default: '' },
    dueDate: { type: String, required: true },
    createdBy: { type: String, default: '' },
    createdByName: { type: String, default: '' },
    submissions: [assignmentSubmissionSchema],
}, { timestamps: true });

const Assignment = mongoose.model('Assignment', assignmentSchema);

// ================= QUIZ SCHEMA & MODEL =================
const quizResultSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    rollNumber: { type: String, required: true },
    studentName: { type: String, required: true },
    score: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
    attempts: { type: Number, default: 1 },
    status: { type: String, default: 'PENDING' },
    date: { type: String, default: '' },
});

const quizSchema = new mongoose.Schema({
    title: { type: String, required: true },
    course: { type: String, required: true },
    campus: { type: String, default: '' },
    totalQuestions: { type: Number, default: 40 },
    date: { type: String, required: true },
    expiry: { type: String, required: true },
    status: { type: String, default: 'ACTIVE' },
    createdBy: { type: String, default: '' },
    createdByName: { type: String, default: '' },
    results: [quizResultSchema],
}, { timestamps: true });

const Quiz = mongoose.model('Quiz', quizSchema);

const isDbConnected = () => mongoose.connection.readyState === 1;

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
        timing: doc.timing || '',
        status: doc.status,
        paymentStatus: doc.paymentStatus,
        gender: doc.gender,
        laptop: doc.laptop,
        email: doc.email || '',
        dob: doc.dob || '',
        address: doc.address || '',
        accountActivated: !!doc.accountActivated,
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
        studentId: doc.studentId ? doc.studentId.toString() : undefined,
        rollNumber: doc.rollNumber,
        date: doc.date,
        status: doc.status,
        reason: doc.reason || '',
    };
}

function serializeTrainerAttendance(doc) {
    return {
        id: doc._id.toString(),
        trainerId: doc.trainerId ? doc.trainerId.toString() : undefined,
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
        trainerId: doc.trainerId ? doc.trainerId.toString() : undefined,
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

function serializeAssignment(doc) {
    return {
        id: doc._id.toString(),
        title: doc.title,
        description: doc.description || '',
        course: doc.course,
        campus: doc.campus || '',
        batch: doc.batch || '',
        dueDate: doc.dueDate,
        createdBy: doc.createdBy || '',
        createdByName: doc.createdByName || '',
        createdAt: doc.createdAt,
        submissions: (doc.submissions || []).map((s) => ({
            id: s._id.toString(),
            studentId: s.studentId ? s.studentId.toString() : undefined,
            rollNumber: s.rollNumber,
            studentName: s.studentName,
            link: s.link || '',
            description: s.description || '',
            status: s.status,
            approved: s.approved,
            feedback: s.feedback || '',
            submittedAt: s.submittedAt,
        })),
    };
}

function serializeQuiz(doc) {
    return {
        id: doc._id.toString(),
        title: doc.title,
        course: doc.course,
        campus: doc.campus || '',
        totalQuestions: doc.totalQuestions,
        date: doc.date,
        expiry: doc.expiry,
        status: doc.status,
        createdBy: doc.createdBy || '',
        createdByName: doc.createdByName || '',
        results: (doc.results || []).map((r) => ({
            id: r._id.toString(),
            studentId: r.studentId ? r.studentId.toString() : undefined,
            rollNumber: r.rollNumber,
            studentName: r.studentName,
            score: r.score,
            totalQuestions: r.totalQuestions,
            attempts: r.attempts,
            status: r.status,
            date: r.date,
        })),
    };
}

const CLASS_WEEKDAYS = [2, 4];

function pad2(n) {
    return String(n).padStart(2, '0');
}

function toYMD(d) {
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function todayYMD() {
    return toYMD(new Date());
}

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

function evaluateCheckInWindow(schedule, now = new Date()) {
    const times = parseScheduleTimes(schedule);
    if (times.length === 0) return { allowed: true, lateMinutes: 0 };
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    for (const { start }
        of times) {
        const startMin = to24hMinutes(start);
        if (startMin == null) continue;
        if (nowMinutes >= startMin - 30 && nowMinutes <= startMin + 90) {
            return { allowed: true, lateMinutes: Math.max(0, nowMinutes - startMin) };
        }
    }
    return { allowed: false, lateMinutes: 0 };
}

async function generateUniqueRollNumber() {
    const last = await Student.findOne().sort({ rollNumber: -1 }).select('rollNumber');
    let next = last && !Number.isNaN(Number(last.rollNumber)) ? Number(last.rollNumber) + 1 : 827001;
    while (await Student.exists({ rollNumber: String(next) })) {
        next += 1;
    }
    return String(next);
}

app.get('/api/health', (req, res) => {
    res.json({ ok: true, message: 'Titan admin backend is running' });
});

app.post('/api/admin/login', async(req, res) => {
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

        res.json({ id: user._id || user.email, email: user.email, role: user.role, name: user.name });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
});

app.get('/api/admin/dashboard', async(req, res) => {
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
            courses: distinctCourses.filter(Boolean).length || COURSES.length,
            campuses: distinctCampuses.filter(Boolean).length || CAMPUSES.length,
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch dashboard stats', error: error.message });
    }
});

app.post('/api/admin/seed', async(req, res) => {
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

// ===== ONE-TIME SEED: Graphic Designing students =====
app.post('/api/seed-gd-students', async(req, res) => {
    try {
        if (!isDbConnected()) return res.status(503).json({ message: 'Database not connected' });
        const gdStudents = [
            { studentName: 'Ali Raza', fatherName: 'Muhammad Raza', cnic: '4210101234567', phone: '03001234001', course: 'Graphic Designing', campus: 'TITAN Ghotki Campus (Ghotki)', city: 'Ghotki', batch: 'Batch 2', slot: 'MWF', timing: 'Mon 10:00 AM - 12:00 PM | Wed 10:00 AM - 12:00 PM | Fri 10:00 AM - 12:00 PM', status: 'enrolled', gender: 'Male', email: 'aliraza.gd@gmail.com' },
            { studentName: 'Bilal Ahmed', fatherName: 'Ahmed Khan', cnic: '4210101234568', phone: '03001234002', course: 'Graphic Designing', campus: 'TITAN Ghotki Campus (Ghotki)', city: 'Ghotki', batch: 'Batch 2', slot: 'MWF', timing: 'Mon 10:00 AM - 12:00 PM | Wed 10:00 AM - 12:00 PM | Fri 10:00 AM - 12:00 PM', status: 'enrolled', gender: 'Male', email: 'bilalahmed.gd@gmail.com' },
            { studentName: 'Hassan Mirza', fatherName: 'Mirza Saleem', cnic: '4210101234569', phone: '03001234003', course: 'Graphic Designing', campus: 'TITAN Ghotki Campus (Ghotki)', city: 'Ghotki', batch: 'Batch 2', slot: 'MWF', timing: 'Mon 10:00 AM - 12:00 PM | Wed 10:00 AM - 12:00 PM | Fri 10:00 AM - 12:00 PM', status: 'enrolled', gender: 'Male', email: 'hassan.mirza.gd@gmail.com' },
            { studentName: 'Usman Farooq', fatherName: 'Farooq Ahmad', cnic: '4210101234570', phone: '03001234004', course: 'Graphic Designing', campus: 'TITAN Ghotki Campus (Ghotki)', city: 'Ghotki', batch: 'Batch 2', slot: 'MWF', timing: 'Mon 10:00 AM - 12:00 PM | Wed 10:00 AM - 12:00 PM | Fri 10:00 AM - 12:00 PM', status: 'enrolled', gender: 'Male', email: 'usman.farooq.gd@gmail.com' },
            { studentName: 'Kamran Sheikh', fatherName: 'Sheikh Anwar', cnic: '4210101234571', phone: '03001234005', course: 'Graphic Designing', campus: 'TITAN Ghotki Campus (Ghotki)', city: 'Ghotki', batch: 'Batch 2', slot: 'MWF', timing: 'Mon 10:00 AM - 12:00 PM | Wed 10:00 AM - 12:00 PM | Fri 10:00 AM - 12:00 PM', status: 'enrolled', gender: 'Male', email: 'kamran.gd@gmail.com' },
            { studentName: 'Sana Bibi', fatherName: 'Ghulam Nabi', cnic: '4210101234572', phone: '03001234006', course: 'Graphic Designing', campus: 'TITAN Ghotki Campus (Ghotki)', city: 'Ghotki', batch: 'Batch 2', slot: 'MWF-PM', timing: 'Mon 02:00 PM - 04:00 PM | Wed 02:00 PM - 04:00 PM | Fri 02:00 PM - 04:00 PM', status: 'enrolled', gender: 'Female', email: 'sana.gd@gmail.com' },
            { studentName: 'Nadia Hussain', fatherName: 'Hussain Bakhsh', cnic: '4210101234573', phone: '03001234007', course: 'Graphic Designing', campus: 'TITAN Ghotki Campus (Ghotki)', city: 'Ghotki', batch: 'Batch 2', slot: 'MWF-PM', timing: 'Mon 02:00 PM - 04:00 PM | Wed 02:00 PM - 04:00 PM | Fri 02:00 PM - 04:00 PM', status: 'enrolled', gender: 'Female', email: 'nadia.gd@gmail.com' },
            { studentName: 'Hina Fatima', fatherName: 'Fateh Khan', cnic: '4210101234574', phone: '03001234008', course: 'Graphic Designing', campus: 'TITAN Ghotki Campus (Ghotki)', city: 'Ghotki', batch: 'Batch 2', slot: 'MWF-PM', timing: 'Mon 02:00 PM - 04:00 PM | Wed 02:00 PM - 04:00 PM | Fri 02:00 PM - 04:00 PM', status: 'enrolled', gender: 'Female', email: 'hina.gd@gmail.com' },
        ];
        let added = 0, skipped = 0;
        for (const s of gdStudents) {
            const exists = await Student.findOne({ cnic: s.cnic });
            if (exists) { skipped++; continue; }
            const rollNumber = await generateUniqueRollNumber();
            const count = await Student.countDocuments();
            let admissionNo = `ADM${900000 + count + 1}`;
            // Ensure admissionNo is unique
            while (await Student.exists({ admissionNo })) {
                admissionNo = `ADM${parseInt(admissionNo.replace('ADM', '')) + 1}`;
            }
            await new Student({ ...s, rollNumber, admissionNo }).save();
            added++;
        }
        res.json({ message: `Seeded ${added} Graphic Designing students (${skipped} skipped as duplicates)` });
    } catch (err) {
        console.error('Seed GD error:', err);
        res.status(500).json({ message: 'Seed failed', error: err.message });
    }
});

app.get('/api/students', async(req, res) => {
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

app.post('/api/students', async(req, res) => {
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
        if (error.code === 11000 && error.keyPattern && error.keyPattern.rollNumber) {
            return res.status(409).json({ message: 'Roll number already exists. Please choose another one.' });
        }
        console.error('Save student error:', error);
        res.status(500).json({ message: 'Failed to save student', error: error.message });
    }
});

app.put('/api/students/:id', async(req, res) => {
    try {
        if (!isDbConnected()) {
            return res.status(503).json({ message: 'Database connection unavailable' });
        }

        const updateBody = {...req.body };
        if (typeof updateBody.rollNumber === 'string') {
            updateBody.rollNumber = updateBody.rollNumber.trim();
            if (!updateBody.rollNumber) delete updateBody.rollNumber;
        }

        const updated = await Student.findByIdAndUpdate(req.params.id, { $set: updateBody }, { new: true, runValidators: true });

        if (!updated) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.json(serializeStudent(updated));
    } catch (error) {
        if (error.code === 11000 && error.keyPattern && error.keyPattern.rollNumber) {
            return res.status(409).json({ message: 'Roll number already exists. Please choose another one.' });
        }
        console.error('Update student error:', error);
        res.status(500).json({ message: 'Failed to update student', error: error.message });
    }
});

app.delete('/api/students/:id', async(req, res) => {
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

const BLOCKED_STUDENT_STATUSES = ['rejected', 'eliminated', 'dropout', 'cancelled', 'blacklisted'];

app.get('/api/attendance/summary', async(req, res) => {
    try {
        if (!isDbConnected()) return res.json([]);

        const students = await Student.find().sort({ createdAt: -1 });
        const today = new Date();

        const rows = await Promise.all(
            students.map(async(s) => {
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

app.get('/api/attendance/history/:rollNumber', async(req, res) => {
    try {
        if (!isDbConnected()) return res.json([]);
        const records = await Attendance.find({ rollNumber: req.params.rollNumber }).sort({ date: -1 }).limit(20);
        res.json(records.map(serializeAttendance));
    } catch (error) {
        console.error('Attendance history error:', error);
        res.status(500).json({ message: 'Failed to load attendance history', error: error.message });
    }
});

// ===== TRAINER VIEW: Attendance by course + date =====
app.get('/api/attendance/by-course', async(req, res) => {
    try {
        if (!isDbConnected()) return res.json({ students: [], classDates: [], totalClassDays: 0 });
        const { course, date } = req.query;
        if (!course) return res.status(400).json({ message: 'course query param required' });

        // Get all enrolled students in this course
        const students = await Student.find({ course }).sort({ studentName: 1 });
        const rollNumbers = students.map(s => s.rollNumber);
        const allRecords = rollNumbers.length ? await Attendance.find({ rollNumber: { $in: rollNumbers } }) : [];

        // Unique dates that ANY student was marked = a class was held
        const classDateSet = new Set(allRecords.map(r => r.date));
        const classDates = [...classDateSet].sort();
        const totalClassDays = classDates.length;

        const rows = students.map(s => {
            const recs = allRecords.filter(r => r.rollNumber === s.rollNumber);
            const presentCount = recs.filter(r => r.status === 'present').length;
            const leaveCount = recs.filter(r => r.status === 'leave').length;
            const absentCount = Math.max(0, totalClassDays - presentCount - leaveCount);
            const pct = totalClassDays > 0 ? Math.round((presentCount / totalClassDays) * 100) : 0;

            let dateStatus = 'NOT MARKED';
            if (date) {
                const rec = recs.find(r => r.date === date);
                if (rec) dateStatus = rec.status === 'present' ? 'PRESENT' : 'LEAVE';
                else if (classDates.includes(date)) dateStatus = 'ABSENT';
            }

            return {
                id: s._id.toString(),
                rollNumber: s.rollNumber,
                studentName: s.studentName,
                fatherName: s.fatherName,
                photo: s.photo || '',
                course: s.course,
                batch: s.batch,
                gender: s.gender,
                status: s.status,
                dateStatus,
                totalClasses: totalClassDays,
                present: presentCount,
                leave: leaveCount,
                absent: absentCount,
                percentage: pct,
            };
        });

        res.json({ students: rows, classDates, totalClassDays });
    } catch (err) {
        console.error('By-course attendance error:', err);
        res.status(500).json({ message: 'Failed to load course attendance', error: err.message });
    }
});

app.post('/api/attendance/mark', async(req, res) => {
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

        const record = await Attendance.findOneAndUpdate({ rollNumber, date }, { $set: { studentId: student._id, rollNumber, date, status: 'present' } }, { new: true, upsert: true, setDefaultsOnInsert: true });

        res.json({ student: serializeStudent(student), record: serializeAttendance(record) });
    } catch (error) {
        console.error('Mark attendance error:', error);
        res.status(500).json({ message: 'Failed to mark attendance', error: error.message });
    }
});

app.post('/api/attendance/mark-bulk', async(req, res) => {
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
            await Attendance.findOneAndUpdate({ rollNumber, date }, { $set: { studentId: student._id, rollNumber, date, status: 'present' } }, { upsert: true, setDefaultsOnInsert: true });
            marked += 1;
        }

        res.json({ marked, notFound });
    } catch (error) {
        console.error('Bulk mark attendance error:', error);
        res.status(500).json({ message: 'Failed to mark attendance', error: error.message });
    }
});

app.post('/api/attendance/leave', async(req, res) => {
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

        const record = await Attendance.findOneAndUpdate({ rollNumber, date }, { $set: { studentId: student._id, rollNumber, date, status: 'leave', reason } }, { new: true, upsert: true, setDefaultsOnInsert: true });

        res.json(serializeAttendance(record));
    } catch (error) {
        console.error('Mark leave error:', error);
        res.status(500).json({ message: 'Failed to mark leave', error: error.message });
    }
});

app.get('/api/trainers', async(req, res) => {
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

app.post('/api/trainers', async(req, res) => {
    try {
        if (!isDbConnected()) {
            return res.status(503).json({ message: 'Database connection unavailable' });
        }

        const trainerData = req.body;

        if (!trainerData.email || !String(trainerData.email).trim()) {
            return res.status(400).json({ message: 'Email is required' });
        }
        if (!trainerData.password || String(trainerData.password).length < 6) {
            return res.status(400).json({ message: 'Password is required (minimum 6 characters)' });
        }

        const passwordHash = await bcrypt.hash(String(trainerData.password), 10);

        const newTrainer = new Trainer({
            ...trainerData,
            email: String(trainerData.email).trim().toLowerCase(),
            password: passwordHash,
            photo: trainerData.photo || '',
            courses: Array.isArray(trainerData.courses) ? trainerData.courses : [trainerData.courses].filter(Boolean),
            cities: Array.isArray(trainerData.cities) ? trainerData.cities : [trainerData.cities].filter(Boolean),
        });

        const savedTrainer = await newTrainer.save();
        res.status(201).json(serializeTrainer(savedTrainer));
    } catch (error) {
        if (error.code === 11000 && error.keyPattern && error.keyPattern.employeeId) {
            return res.status(409).json({ message: 'Employee ID already exists. Please choose another one.' });
        }
        if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
            return res.status(409).json({ message: 'A trainer with this email already exists.' });
        }
        console.error('Save trainer error:', error);
        res.status(500).json({ message: 'Failed to save trainer', error: error.message });
    }
});

app.put('/api/trainers/:id', async(req, res) => {
    try {
        if (!isDbConnected()) {
            return res.status(503).json({ message: 'Database connection unavailable' });
        }

        const updateBody = {...req.body };
        if (updateBody.courses && !Array.isArray(updateBody.courses)) updateBody.courses = [updateBody.courses];
        if (updateBody.cities && !Array.isArray(updateBody.cities)) updateBody.cities = [updateBody.cities];

        if (updateBody.email) updateBody.email = String(updateBody.email).trim().toLowerCase();

        if (typeof updateBody.password === 'string' && updateBody.password.trim()) {
            if (updateBody.password.length < 6) {
                return res.status(400).json({ message: 'Password must be at least 6 characters' });
            }
            updateBody.password = await bcrypt.hash(updateBody.password, 10);
        } else {
            delete updateBody.password;
        }

        const updated = await Trainer.findByIdAndUpdate(req.params.id, { $set: updateBody }, { new: true, runValidators: true });

        if (!updated) {
            return res.status(404).json({ message: 'Trainer not found' });
        }

        res.json(serializeTrainer(updated));
    } catch (error) {
        if (error.code === 11000 && error.keyPattern && error.keyPattern.employeeId) {
            return res.status(409).json({ message: 'Employee ID already exists. Please choose another one.' });
        }
        if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
            return res.status(409).json({ message: 'A trainer with this email already exists.' });
        }
        console.error('Update trainer error:', error);
        res.status(500).json({ message: 'Failed to update trainer', error: error.message });
    }
});

app.delete('/api/trainers/:id', async(req, res) => {
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

app.post('/api/trainer-login', async(req, res) => {
    try {
        if (!isDbConnected()) {
            return res.status(503).json({ message: 'Database connection unavailable' });
        }
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const trainer = await Trainer.findOne({ email: String(email).trim().toLowerCase() });
        if (!trainer || !trainer.password) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (trainer.status && trainer.status.toLowerCase() === 'inactive') {
            return res.status(403).json({ message: 'Your account is inactive. Please contact admin.' });
        }

        const match = await bcrypt.compare(String(password), trainer.password);
        if (!match) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.json({ message: 'Login successful', trainer: serializeTrainer(trainer) });
    } catch (error) {
        console.error('Trainer login error:', error);
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
});

app.get('/api/trainer-attendance', async(req, res) => {
    try {
        if (!isDbConnected()) return res.json([]);
        const records = await TrainerAttendance.find().sort({ createdAt: -1 });
        res.json(records.map(serializeTrainerAttendance));
    } catch (error) {
        console.error('Fetch trainer attendance error:', error);
        res.status(500).json({ message: 'Failed to fetch trainer attendance', error: error.message });
    }
});

app.post('/api/trainer-attendance/checkin', async(req, res) => {
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

app.post('/api/trainer-attendance/checkout', async(req, res) => {
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

app.put('/api/trainer-attendance/:id', async(req, res) => {
    try {
        if (!isDbConnected()) {
            return res.status(503).json({ message: 'Database connection unavailable' });
        }

        const updated = await TrainerAttendance.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
        if (!updated) return res.status(404).json({ message: 'Attendance record not found' });

        res.json(serializeTrainerAttendance(updated));
    } catch (error) {
        console.error('Update trainer attendance error:', error);
        res.status(500).json({ message: 'Failed to update trainer attendance', error: error.message });
    }
});

app.get('/api/trainer-attendance-requests', async(req, res) => {
    try {
        if (!isDbConnected()) return res.json([]);
        const requests = await TrainerAttendanceRequest.find().sort({ createdAt: -1 });
        res.json(requests.map(serializeTrainerAttendanceRequest));
    } catch (error) {
        console.error('Fetch trainer attendance requests error:', error);
        res.status(500).json({ message: 'Failed to fetch requests', error: error.message });
    }
});

app.post('/api/trainer-attendance-requests', async(req, res) => {
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

app.get('/api/assignments', async(req, res) => {
    try {
        if (!isDbConnected()) return res.json([]);
        const filter = {};
        if (req.query.course) filter.course = req.query.course;
        if (req.query.campus) filter.campus = req.query.campus;
        const assignments = await Assignment.find(filter).sort({ createdAt: -1 });
        res.json(assignments.map(serializeAssignment));
    } catch (error) {
        console.error('Fetch assignments error:', error);
        res.status(500).json({ message: 'Failed to fetch assignments', error: error.message });
    }
});

app.post('/api/assignments', async(req, res) => {
    try {
        if (!isDbConnected()) {
            return res.status(503).json({ message: 'Database connection unavailable' });
        }
        const { title, description, course, campus, batch, dueDate, createdBy, createdByName } = req.body;
        if (!title || !course || !dueDate) {
            return res.status(400).json({ message: 'title, course and dueDate are required' });
        }
        const created = await Assignment.create({ title, description, course, campus, batch, dueDate, createdBy, createdByName, submissions: [] });
        res.status(201).json(serializeAssignment(created));
    } catch (error) {
        console.error('Create assignment error:', error);
        res.status(500).json({ message: 'Failed to create assignment', error: error.message });
    }
});

app.put('/api/assignments/:id', async(req, res) => {
    try {
        if (!isDbConnected()) {
            return res.status(503).json({ message: 'Database connection unavailable' });
        }
        const updated = await Assignment.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
        if (!updated) return res.status(404).json({ message: 'Assignment not found' });
        res.json(serializeAssignment(updated));
    } catch (error) {
        console.error('Update assignment error:', error);
        res.status(500).json({ message: 'Failed to update assignment', error: error.message });
    }
});

app.delete('/api/assignments/:id', async(req, res) => {
    try {
        if (!isDbConnected()) {
            return res.status(503).json({ message: 'Database connection unavailable' });
        }
        const deleted = await Assignment.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Assignment not found' });
        res.json({ message: 'Deleted', id: req.params.id });
    } catch (error) {
        console.error('Delete assignment error:', error);
        res.status(500).json({ message: 'Failed to delete assignment', error: error.message });
    }
});

app.post('/api/assignments/:id/submit', async(req, res) => {
    try {
        if (!isDbConnected()) {
            return res.status(503).json({ message: 'Database connection unavailable' });
        }
        const { rollNumber, studentName, link, description } = req.body;
        if (!rollNumber || !studentName) {
            return res.status(400).json({ message: 'rollNumber and studentName are required' });
        }
        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

        const isLate = new Date() > new Date(assignment.dueDate);
        const existingIdx = assignment.submissions.findIndex((s) => s.rollNumber === rollNumber);
        const submissionData = {
            rollNumber,
            studentName,
            link: link || '',
            description: description || '',
            status: isLate ? 'Late Submitted' : 'Submitted',
            approved: null,
            submittedAt: new Date(),
        };

        if (existingIdx >= 0) {
            assignment.submissions[existingIdx].set(submissionData);
        } else {
            assignment.submissions.push(submissionData);
        }
        await assignment.save();
        res.json(serializeAssignment(assignment));
    } catch (error) {
        console.error('Submit assignment error:', error);
        res.status(500).json({ message: 'Failed to submit assignment', error: error.message });
    }
});

app.put('/api/assignments/:id/submissions/:subId', async(req, res) => {
    try {
        if (!isDbConnected()) {
            return res.status(503).json({ message: 'Database connection unavailable' });
        }
        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

        const submission = assignment.submissions.id(req.params.subId);
        if (!submission) return res.status(404).json({ message: 'Submission not found' });

        if (typeof req.body.approved === 'boolean') submission.approved = req.body.approved;
        if (typeof req.body.feedback === 'string') submission.feedback = req.body.feedback;
        await assignment.save();
        res.json(serializeAssignment(assignment));
    } catch (error) {
        console.error('Update submission error:', error);
        res.status(500).json({ message: 'Failed to update submission', error: error.message });
    }
});

app.get('/api/quizzes', async(req, res) => {
    try {
        if (!isDbConnected()) return res.json([]);
        const filter = {};
        if (req.query.course) filter.course = req.query.course;
        const quizzes = await Quiz.find(filter).sort({ createdAt: -1 });
        res.json(quizzes.map(serializeQuiz));
    } catch (error) {
        console.error('Fetch quizzes error:', error);
        res.status(500).json({ message: 'Failed to fetch quizzes', error: error.message });
    }
});

app.post('/api/quizzes', async(req, res) => {
    try {
        if (!isDbConnected()) {
            return res.status(503).json({ message: 'Database connection unavailable' });
        }
        const { title, course, campus, totalQuestions, date, expiry, createdBy, createdByName } = req.body;
        if (!title || !course || !date || !expiry) {
            return res.status(400).json({ message: 'title, course, date and expiry are required' });
        }
        const created = await Quiz.create({
            title,
            course,
            campus,
            totalQuestions: totalQuestions || 40,
            date,
            expiry,
            createdBy,
            createdByName,
            status: 'ACTIVE',
            results: [],
        });
        res.status(201).json(serializeQuiz(created));
    } catch (error) {
        console.error('Create quiz error:', error);
        res.status(500).json({ message: 'Failed to create quiz', error: error.message });
    }
});

app.put('/api/quizzes/:id', async(req, res) => {
    try {
        if (!isDbConnected()) {
            return res.status(503).json({ message: 'Database connection unavailable' });
        }
        const updated = await Quiz.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
        if (!updated) return res.status(404).json({ message: 'Quiz not found' });
        res.json(serializeQuiz(updated));
    } catch (error) {
        console.error('Update quiz error:', error);
        res.status(500).json({ message: 'Failed to update quiz', error: error.message });
    }
});

app.delete('/api/quizzes/:id', async(req, res) => {
    try {
        if (!isDbConnected()) {
            return res.status(503).json({ message: 'Database connection unavailable' });
        }
        const deleted = await Quiz.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Quiz not found' });
        res.json({ message: 'Deleted', id: req.params.id });
    } catch (error) {
        console.error('Delete quiz error:', error);
        res.status(500).json({ message: 'Failed to delete quiz', error: error.message });
    }
});

app.post('/api/quizzes/:id/result', async(req, res) => {
    try {
        if (!isDbConnected()) {
            return res.status(503).json({ message: 'Database connection unavailable' });
        }
        const { rollNumber, studentName, score, totalQuestions } = req.body;
        if (!rollNumber || !studentName || score == null || !totalQuestions) {
            return res.status(400).json({ message: 'rollNumber, studentName, score and totalQuestions are required' });
        }
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

        const pct = (Number(score) / Number(totalQuestions)) * 100;
        const resultData = {
            rollNumber,
            studentName,
            score: Number(score),
            totalQuestions: Number(totalQuestions),
            attempts: 1,
            status: pct >= 50 ? 'PASSED' : 'FAILED',
            date: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true }),
        };

        const existingIdx = quiz.results.findIndex((r) => r.rollNumber === rollNumber);
        if (existingIdx >= 0) {
            resultData.attempts = quiz.results[existingIdx].attempts + 1;
            quiz.results[existingIdx].set(resultData);
        } else {
            quiz.results.push(resultData);
        }
        await quiz.save();
        res.json(serializeQuiz(quiz));
    } catch (error) {
        console.error('Submit quiz result error:', error);
        res.status(500).json({ message: 'Failed to submit quiz result', error: error.message });
    }
});

app.post('/api/students/:id/generate-voucher', async(req, res) => {
    try {
        if (!isDbConnected()) {
            return res.status(503).json({ message: 'Database connection unavailable' });
        }

        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        const alreadyPending = student.invoices.find((inv) => inv.status === 'PENDING');
        if (alreadyPending) {
            return res.status(409).json({
                message: 'A voucher is already pending. Please pay it before generating a new one.',
                student: serializeStudent(student),
            });
        }

        const now = new Date();
        const targetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        const yyyymm = `${targetDate.getFullYear()}${pad2(targetDate.getMonth() + 1)}`;
        const monthLabel = targetDate.toLocaleString('en-US', { month: 'short', year: 'numeric' });
        const dueDate = `08-${targetDate.toLocaleString('en-US', { month: 'short' })}-${targetDate.getFullYear()}`;

        const newInvoice = {
            invoiceNumber: `${yyyymm}${student.rollNumber}`,
            jazzCashId: `${yyyymm}${student.rollNumber}`,
            type: 'Monthly',
            month: monthLabel,
            dueDate,
            amount: 1000,
            status: 'PENDING',
        };

        student.invoices.push(newInvoice);
        student.paymentStatus = 'Pending';
        await student.save();

        res.status(201).json({ invoice: newInvoice, student: serializeStudent(student) });
    } catch (error) {
        console.error('Generate voucher error:', error);
        res.status(500).json({ message: 'Failed to generate voucher', error: error.message });
    }
});

app.post('/api/enroll', async(req, res) => {
    try {
        if (!isDbConnected()) {
            return res.status(503).json({ message: 'Database connection unavailable' });
        }
        const {
            studentName,
            fatherName,
            cnic,
            phone,
            fatherPhone,
            email,
            dob,
            address,
            country,
            city,
            campus,
            course,
            batch,
            gender,
            laptop,
            computerProficiency,
            lastQualification,
            hearAboutUs,
            photo,
            password,
        } = req.body;

        if (!studentName || !fatherName || !cnic || !phone || !password) {
            return res.status(400).json({ message: 'Name, father name, CNIC, phone and password are required' });
        }
        if (String(password).length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        const existing = await Student.findOne({ cnic });
        if (existing) {
            return res.status(409).json({ message: 'An application with this CNIC already exists. Try logging in instead.' });
        }

        const count = await Student.countDocuments();
        const admissionNo = `ADM${900000 + count + 1}`;
        const rollNumber = await generateUniqueRollNumber();
        const passwordHash = await bcrypt.hash(String(password), 10);

        const created = await Student.create({
            admissionNo,
            rollNumber,
            studentName,
            fatherName,
            cnic,
            phone,
            fatherPhone: fatherPhone || '',
            email: email || '',
            dob: dob || '',
            address: address || '',
            country: country || 'Pakistan',
            city: city || '',
            campus: campus || '',
            course: course || '',
            batch: batch || '',
            gender: gender || 'Male',
            laptop: laptop || 'No',
            computerProficiency: computerProficiency || '',
            lastQualification: lastQualification || '',
            hearAboutUs: hearAboutUs || '',
            photo: photo || '',
            status: 'pending',
            paymentStatus: 'Not Generated',
            password: passwordHash,
            accountActivated: true,
        });

        res.status(201).json({ message: 'Application submitted', student: serializeStudent(created) });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: 'A student with this CNIC or roll number already exists.' });
        }
        console.error('Enroll error:', error);
        res.status(500).json({ message: 'Failed to submit application', error: error.message });
    }
});

app.post('/api/students/activate', async(req, res) => {
    try {
        if (!isDbConnected()) {
            return res.status(503).json({ message: 'Database connection unavailable' });
        }
        const { cnic, dob, password } = req.body;
        if (!cnic || !dob || !password) {
            return res.status(400).json({ message: 'CNIC, Date of Birth and password are required' });
        }
        if (String(password).length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        const student = await Student.findOne({ cnic: String(cnic).trim() });
        if (!student) {
            return res.status(404).json({ message: 'No student found with this CNIC. Please check with your admin.' });
        }
        if (!student.dob || student.dob !== dob) {
            return res.status(401).json({ message: 'CNIC and Date of Birth do not match our records. Please check with your admin.' });
        }

        student.password = await bcrypt.hash(String(password), 10);
        student.accountActivated = true;
        await student.save();

        res.json({ message: 'Password created. You can now log in.', student: serializeStudent(student) });
    } catch (error) {
        console.error('Activate account error:', error);
        res.status(500).json({ message: 'Failed to create password', error: error.message });
    }
});

app.post('/api/student-login', async(req, res) => {
    try {
        if (!isDbConnected()) {
            return res.status(503).json({ message: 'Database connection unavailable' });
        }
        const { identifier, password } = req.body;
        if (!identifier || !password) {
            return res.status(400).json({ message: 'Roll Number/CNIC and password are required' });
        }

        const student = await Student.findOne({
            $or: [{ rollNumber: String(identifier).trim() }, { cnic: String(identifier).trim() }],
        });
        if (!student) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        if (!student.accountActivated || !student.password) {
            return res.status(409).json({ message: 'Account not activated yet. Please use "Activate Account" first.' });
        }
        if (BLOCKED_STUDENT_STATUSES.includes((student.status || '').toLowerCase())) {
            return res.status(403).json({ message: `Your account status is '${student.status}'. Please contact admin.` });
        }

        const match = await bcrypt.compare(String(password), student.password);
        if (!match) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.json({ message: 'Login successful', student: serializeStudent(student) });
    } catch (error) {
        console.error('Student login error:', error);
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
});

async function seedDefaultData() {
    try {
        // Seed default Admin users if none exist
        const adminCount = await AdminUser.countDocuments();
        if (adminCount === 0) {
            await AdminUser.insertMany(fallbackUsers);
            console.log('Default Admin users seeded');
        }

        // Seed default Trainers if none exist
        const trainerCount = await Trainer.countDocuments();
        if (trainerCount === 0) {
            const defaultPasswordHash = await bcrypt.hash('password123', 10);
            const defaultTrainers = [
                {
                    name: 'Sir Rajesh Kumar(SUK)',
                    email: 'rajesh.kumar@titan.edu',
                    employeeId: '15354',
                    courses: ['Web Development'],
                    cities: ['Sukkur'],
                    campus: 'Saylani TITAN Sukkur Campus',
                    slotSchedule: 'Sat 12:00 PM - 02:00 PM | Sun 12:00 PM - 02:00 PM',
                    status: 'Active',
                    password: defaultPasswordHash,
                },
                {
                    name: 'Miss Maham',
                    email: 'maham@titan.edu',
                    employeeId: '15360',
                    courses: ['Graphic Designing'],
                    cities: ['Sukkur'],
                    campus: 'Saylani TITAN Sukkur Campus',
                    slotSchedule: 'Sat 08:00 AM - 10:00 AM | Sun 08:00 AM - 10:00 AM',
                    status: 'Active',
                    password: defaultPasswordHash,
                },
                {
                    name: 'Sir ARSLAN AHMED (SUK)',
                    email: 'arslan.ahmed@titan.edu',
                    employeeId: '15349',
                    courses: ['Artificial Intelligence and Data Science'],
                    cities: ['Sukkur'],
                    campus: 'Saylani TITAN Sukkur Campus',
                    slotSchedule: 'Sat 08:00 AM - 10:00 AM | Sun 08:00 AM - 10:00 AM',
                    status: 'Active',
                    password: defaultPasswordHash,
                },
            ];
            await Trainer.insertMany(defaultTrainers);
            console.log('Default Trainers seeded (default password: password123)');
        }
    } catch (err) {
        console.error('Error seeding default data:', err.message);
    }
}

const startServer = async() => {
    try {
        if (process.env.MONGODB_URI) {
            await mongoose.connect(process.env.MONGODB_URI);
            console.log('MongoDB connected');
            await seedDefaultData();
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