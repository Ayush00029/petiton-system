const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/petitions", require("./routes/petitionRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));

// Basic Health Check Endpoint
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Petition System API is running smoothly",
        database: "connected"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;