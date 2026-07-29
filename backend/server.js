import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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

const isDbConnected = () => mongoose.connection.readyState === 1;

// Maps a Mongoose student document to the plain shape the frontend expects
// (id as a string instead of Mongo's _id).
function serializeStudent(doc) {
  return {
    id: doc._id.toString(),
    admissionNo: doc.admissionNo,
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

// Admin Dashboard Endpoint
app.get('/api/admin/dashboard', async (req, res) => {
  try {
    const stats = {
      totalStudents: 592986,
      enrolledStudents: 21110,
      courses: 132,
      campuses: 49,
    };
    res.json(stats);
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

      const newStudent = new Student({
        ...studentData,
        admissionNo,
        invoices: studentData.invoices || [],
      });

      const savedStudent = await newStudent.save();
      return res.status(201).json(serializeStudent(savedStudent));
    }

    res.status(503).json({ message: 'Database connection unavailable' });
  } catch (error) {
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

    const updated = await Student.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(serializeStudent(updated));
  } catch (error) {
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