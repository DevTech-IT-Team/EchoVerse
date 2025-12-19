require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");

const authRoutes = require("../backend/routes/auth");
const contactRoutes = require("./routes/contactRoutes");
const adminRoutes = require("./routes/adminRoutes");
const eventsRoutes = require("./routes/events");

const app = express();

/* =========================
   Middleware
========================= */
app.use(express.json());

app.use(cors({
  origin: [
    // Local development
    "http://127.0.0.1:5504",
    "http://localhost:5504",
    "http://127.0.0.1:3000",
    "http://localhost:3000",

    // GitHub Pages (if still used)
    "https://prernacreditor.github.io",

    // ✅ LIVE FRONTEND DOMAINS (IMPORTANT)
    "https://collinfreestoneentertainment.com",
    "https://www.collinfreestoneentertainment.com"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Handle preflight requests
app.options("*", cors());

/* =========================
   Serve Admin Static Files
========================= */
app.use(
  "/admin",
  express.static(path.join(__dirname, "..", "docs", "admin"))
);

/* =========================
   Database
========================= */
connectDB();

/* =========================
   API Routes
========================= */
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/events", eventsRoutes);

/* =========================
   Root
========================= */
app.get("/", (req, res) => {
  res.send("API is running...");
});

/* =========================
   Server
========================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
