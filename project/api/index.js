import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET || 'mediguide_secret_key';

if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
}

// --- MODELS ---
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  city: String,
  phone: String,
  bio: String,
  avatar: String,
  savedHospitals: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});
export const User = mongoose.model('User', UserSchema);

const HospitalSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: String,
  specialization: String,
  city: String,
  address: String,
  phone: String,
  email: String,
  rating: Number,
  reviewCount: Number,
  consultationFee: Number,
  distance: Number,
  beds: Number,
  doctors: Number,
  image: String,
  gallery: [String],
  lat: Number,
  lng: Number,
  availability: String,
  tags: [String],
  verified: Boolean,
  wikiUrl: String
});
export const Hospital = mongoose.model('Hospital', HospitalSchema);

// --- ROUTES ---

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, city, phone } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, city, phone, bio: '', avatar: '' });
    await user.save();

    console.log(`👤 New user registered: ${email} (${name})`);
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name, email, city, phone, bio: user.bio, avatar: user.avatar, savedHospitals: [] } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        city: user.city, 
        phone: user.phone, 
        bio: user.bio,
        avatar: user.avatar,
        savedHospitals: user.savedHospitals 
      } 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/hospitals', async (req, res) => {
  try {
    // Use .lean() to get plain JS objects instead of Mongoose documents (faster + easier mapping)
    const hospitals = await Hospital.find().lean();
    
    const fallbackImages = [
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80',
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&q=80',
      'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800&q=80',
      'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&q=80'
    ];

    const fixedHospitals = hospitals.map((h, i) => {
      // Ensure we have an image, or use fallback if it's a relative path
      if (!h.image || (typeof h.image === 'string' && h.image.startsWith('/hospitals/'))) {
        h.image = fallbackImages[i % fallbackImages.length];
      }
      return h;
    });

    res.json(fixedHospitals);
  } catch (err) {
    console.error('❌ Error fetching hospitals:', err);
    res.status(500).json({ error: 'Failed to fetch hospitals', details: err.message });
  }
});

app.post('/api/hospitals/seed', async (req, res) => {
  try {
    const { data, secret } = req.body;
    if (secret !== JWT_SECRET) return res.status(403).send('Forbidden');
    await Hospital.deleteMany({});
    await Hospital.insertMany(data);
    res.send('Database Seeded Successfully');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/user/save-hospital', async (req, res) => {
  try {
    const { userId, hospitalId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).send('User not found');

    const index = user.savedHospitals.indexOf(hospitalId);
    if (index > -1) {
      user.savedHospitals.splice(index, 1);
    } else {
      user.savedHospitals.push(hospitalId);
    }
    await user.save();
    res.json({ savedHospitals: user.savedHospitals });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/user/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/user/:id', async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, user: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- AUTO SEEDING LOGIC ---
export const autoSeed = async (data) => {
  try {
    const count = await Hospital.countDocuments();
    // If database is empty OR has very few hospitals, force a full re-seed
    if (count < 50) {
      console.log(`🌱 Database has only ${count} hospitals. Re-seeding for full experience...`);
      await Hospital.deleteMany({});
      await Hospital.insertMany(data);
      console.log('✅ Auto-seeding complete!');
    } else {
      console.log(`ℹ️ Database already has ${count} hospitals.`);
    }

    // --- Demo User Setup ---
    const demoEmail = 'demo@mediguide.com';
    const hasDemo = await User.findOne({ email: demoEmail });
    if (!hasDemo) {
      const hp = await bcrypt.hash('demo1234', 10);
      await new User({
        name: 'Demo User',
        email: demoEmail,
        password: hp,
        city: 'Ahmedabad',
        phone: '+91 9999999999',
        bio: 'I am a demo user exploring MediGuide!',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80',
        savedHospitals: []
      }).save();
      console.log('✨ Demo user created: demo@mediguide.com');
    }
  } catch (err) {
    console.error('❌ Auto-seeding failed:', err.message);
  }
};

export default app;
