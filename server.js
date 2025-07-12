const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ✅ Update this list with your actual frontend domains
const allowedOrigins = [
  'https://presale.getaivio.com',
  'https://aivio-presale-frontend.vercel.app',
  'https://getaivio.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error("❌ CORS Blocked for:", origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

// ✅ MongoDB Connection
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error("❌ MONGO_URI is not set in .env");
  process.exit(1);
}

mongoose.connect(mongoURI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// ✅ Models
const Purchase = mongoose.model('Purchase', new mongoose.Schema({
  wallet: String,
  usdtAmount: Number,
  aivReceived: Number,
  txHash: String,
  date: Date,
  status: String
}));

const Whitelist = mongoose.model('Whitelist', new mongoose.Schema({
  wallet: String,
  name: String,
  email: String,
  approved: { type: Boolean, default: false }
}));

// ✅ API Routes
app.post('/api/logPurchase', async (req, res) => {
  try {
    const p = new Purchase(req.body);
    await p.save();
    res.send({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: 'Error logging purchase' });
  }
});

app.post('/api/whitelist', async (req, res) => {
  try {
    const { wallet, name, email } = req.body;
    const entry = new Whitelist({ wallet, name, email });
    await entry.save();
    res.send({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: 'Error adding to whitelist' });
  }
});

app.get('/api/checkWhitelist/:wallet', async (req, res) => {
  try {
    const entry = await Whitelist.findOne({ wallet: req.params.wallet, approved: true });
    res.send({ whitelisted: !!entry });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: 'Error checking whitelist' });
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
