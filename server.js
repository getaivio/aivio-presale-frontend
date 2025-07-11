const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB with proper options + error handling
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => {
  console.error("❌ MongoDB connection error:", err.message);
  process.exit(1); // Stop the app if DB fails
});

// ✅ Define Mongoose Models
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
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
