let ws;
let apiToken = "pat_df0cbb0150b40589d016c49888fea3098f54ef3d5dde910f8e0ac4ef9f9fb0f5";

function log(msg) {
  document.getElementById("log").innerHTML += `<p>${msg}</p>`;
}

// CONNECT TO DERIV
function connect() {
  apiToken = document.getElementById("33p7PVqGTbhzPMv1GNtXr").value;

  ws = new WebSocket("wss://ws.derivws.com/websockets/v3?app_id=33p7PVqGTbhzPMv1GNtXr");

  ws.onopen = () => {
    document.getElementById("status").innerText = "Connected";
    log("Connected to Deriv");

    ws.send(JSON.stringify({
      authorize:https://alphones142775-cmyk.github.io/Trading-platform/   }));

    ws.send(JSON.stringify({
      balance: 1
    }));

    ws.send(JSON.stringify({
      ticks: "R_100"
    }));
  };

  ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data);

    // AUTH
    if (data.msg_type === "authorize") {
      log("pat_df0cbb0150b40589d016c49888fea3098f54ef3d5dde910f8e0ac4ef9f9fb0f5");
    }

    // BALANCE
    if (data.msg_type === "balance") {
      document.getElementById("balance").innerText = data.balance.balance;
    }

    // TICK DATA
    if (data.msg_type === "tick") {
      document.getElementById("tick").innerText = data.tick.quote;
    }

    log(JSON.stringify(data));
  };

  ws.onerror = () => {
    document.getElementById("status").innerText = "Error";
  };
}

// BUY CALL
function buy() {
  const amount = document.getElementById("amount").value;
  const symbol = document.getElementById("symbol").value;

  ws.send(JSON.stringify({
    buy: 1,
    price: amount,
    parameters: {
      amount: amount,
      basis: "stake",
      contract_type: "CALL",
      currency: "USD",
      duration: 5,
      duration_unit: "m",
      symbol: symbol
    }
  }));

  log("BUY CALL placed");
}

// BUY PUT
function sell() {
  const amount = document.getElementById("amount").value;
  const symbol = document.getElementById("symbol").value;

  ws.send(JSON.stringify({
    buy: 1,
    price: amount,
    parameters: {
      amount: amount,
      basis: "stake",
      contract_type: "PUT",
      currency: "USD",
      duration: 5,
      duration_unit: "m",
      symbol: symbol
    }
  }));

  log("BUY PUT placed");
}
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const tradeRoutes = require("./routes/tradeRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/trades", tradeRoutes);

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port", PORT));
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB Connected");
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDB;const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  balance: { type: Number, default: 0 },
  apiToken: String, // optional: for Deriv integration
});

module.exports = mongoose.model("User", UserSchema);
const mongoose = require("mongoose");

const TradeSchema = new mongoose.Schema({
  userId: String,
  symbol: String,
  amount: Number,
  contractType: String,
  status: { type: String, default: "open" },
  profit: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Trade", TradeSchema);
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashed
  });

  res.json(user);
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ msg: "Wrong password" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.json({ token, user });
};
const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);

module.exports = router;
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};
const Trade = require("../models/Trade");

exports.createTrade = async (req, res) => {
  const { symbol, amount, contractType } = req.body;

  const trade = await Trade.create({
    userId: req.user.id,
    symbol,
    amount,
    contractType
  });

  res.json(trade);
};

exports.getTrades = async (req, res) => {
  const trades = await Trade.find({ userId: req.user.id });
  res.json(trades);
};
const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const { createTrade, getTrades } = require("../controllers/tradeController");

router.post("/", auth, createTrade);
router.get("/", auth, getTrades);

module.exports = router;
const express = require("express");
const cors = require("cors");
const helmet = require("helmet
                       ");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const tradeRoutes = require("./routes/tradeRoutes");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting (production safety)
app.use(rateLimit({
  windowMs: 60 * 1000,
  max: 100
}));

app.use("/api/auth", authRoutes);
app.use("/api/trades", tradeRoutes);

app.get("/", (req, res) => {
  res.send("Trading API Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("API running on", PORT));
const WebSocket = require("ws");

class DerivEngine {
  constructor(appId, token) {
    this.appId = appId;
    this.token = token;
    this.ws = null;
    this.connected = false;
  }

  connect() {
    this.ws = new WebSocket(
      `wss://ws.derivws.com/websockets/v3?app_id=${this.appId}`
    );

    this.ws.on("open", () => {
      console.log("Trading engine connected");

      this.ws.send(JSON.stringify({
        authorize: this.token
      }));

      this.connected = true;
    });

    this.ws.on("message", (data) => {
      const msg = JSON.parse(data);
      console.log("ENGINE:", msg);
    });

    this.ws.on("close", () => {
      console.log("Reconnecting...");
      setTimeout(() => this.connect(), 3000);
    });
  }

  buyContract(payload) {
    if (!this.connected) return;

    this.ws.send(JSON.stringify({
      buy: 1,
      price: payload.amount,
      parameters: payload
    }));
  }
}

module.exports = DerivEngine;
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,

  balance: { type: Number, default: 0 },

  derivToken: {
    type: String,
    select: false // hidden from normal queries
  }
});

module.exports = mongoose.model("User", UserSchema);
