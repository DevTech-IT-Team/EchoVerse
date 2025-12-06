 require("dotenv").config();
 const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const contactRoutes = require("./routes/contactRoutes"); // FIXED


console.log("Loaded SENDGRID_API_KEY:", process.env.SENDGRID_API_KEY);
const app = express();

// Middleware
app.use(express.json());

app.use(cors({
  origin: ["http://127.0.0.1:3000", "http://localhost:3000"],
  credentials: true
}));

// DB Connection
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
