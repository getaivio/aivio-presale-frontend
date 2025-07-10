const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI);

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

app.post('/api/logPurchase', async (req, res) => {
  const p = new Purchase(req.body);
  await p.save();
  res.send({ success: true });
});

app.post('/api/whitelist', async (req, res) => {
  const { wallet, name, email } = req.body;
  const entry = new Whitelist({ wallet, name, email });
  await entry.save();
  res.send({ success: true });
});

app.get('/api/checkWhitelist/:wallet', async (req, res) => {
  const entry = await Whitelist.findOne({ wallet: req.params.wallet, approved: true });
  res.send({ whitelisted: !!entry });
});

app.listen(3001, () => console.log("Backend running on port 3001"));
