const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'passport_app_secret_2025';

app.use(cors());
app.use(express.json());

// ─── In-Memory Data Store ────────────────────────────────────────────────────
const users = [];
const applications = [];

// ─── Seed Demo User ───────────────────────────────────────────────────────────
(async () => {
  const hashedPassword = await bcrypt.hash('HireMe@2025!', 10);
  users.push({
    id: uuidv4(),
    name: 'Demo User',
    email: 'hire-me@anshumat.org',
    password: hashedPassword,
    city: 'New Delhi',
    dob: '1995-06-15',
    createdAt: new Date().toISOString(),
  });
  console.log('✅ Demo user seeded: hire-me@anshumat.org / HireMe@2025!');
})();

// ─── Middleware ───────────────────────────────────────────────────────────────
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
}

// ─── Auth Routes ──────────────────────────────────────────────────────────────
app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password, city, dob } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: 'Name, email, and password are required' });

  if (users.find(u => u.email === email))
    return res.status(409).json({ message: 'Email already registered' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { id: uuidv4(), name, email, password: hashedPassword, city, dob, createdAt: new Date().toISOString() };
  users.push(user);

  const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, city: user.city, dob: user.dob } });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, city: user.city, dob: user.dob } });
});

// ─── Application Routes ───────────────────────────────────────────────────────
app.get('/api/applications', authMiddleware, (req, res) => {
  const userApps = applications.filter(a => a.userId === req.user.id);
  res.json(userApps);
});

app.post('/api/applications', authMiddleware, (req, res) => {
  const app_data = {
    id: uuidv4(),
    userId: req.user.id,
    status: 'draft',
    step: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    personalInfo: {},
    addressInfo: {},
    documents: [],
    appointment: null,
  };
  applications.push(app_data);
  res.status(201).json(app_data);
});

app.get('/api/applications/:id', authMiddleware, (req, res) => {
  const app_data = applications.find(a => a.id === req.params.id && a.userId === req.user.id);
  if (!app_data) return res.status(404).json({ message: 'Application not found' });
  res.json(app_data);
});

app.patch('/api/applications/:id', authMiddleware, (req, res) => {
  const idx = applications.findIndex(a => a.id === req.params.id && a.userId === req.user.id);
  if (idx === -1) return res.status(404).json({ message: 'Application not found' });

  applications[idx] = {
    ...applications[idx],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };
  res.json(applications[idx]);
});

app.delete('/api/applications/:id', authMiddleware, (req, res) => {
  const idx = applications.findIndex(a => a.id === req.params.id && a.userId === req.user.id);
  if (idx === -1) return res.status(404).json({ message: 'Application not found' });
  applications.splice(idx, 1);
  res.json({ message: 'Application deleted' });
});

// ─── Appointment Slots ────────────────────────────────────────────────────────
app.get('/api/slots', authMiddleware, (req, res) => {
  const today = new Date();
  const slots = [];
  const offices = ['New Delhi - Janpath', 'Mumbai - Worli', 'Chennai - Nungambakkam', 'Bengaluru - Koramangala'];
  const times = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];

  for (let d = 3; d <= 14; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() + d);
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    offices.forEach(office => {
      times.forEach(time => {
        slots.push({
          id: uuidv4(),
          date: date.toISOString().split('T')[0],
          time,
          office,
          available: Math.random() > 0.3,
        });
      });
    });
  }
  res.json(slots);
});

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
