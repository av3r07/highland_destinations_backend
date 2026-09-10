require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");

const { ContactInquiry } = require("./database");

const app = express();
const PORT = process.env.PORT || 3000;

// CORS
const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests without an Origin header
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  }),
);

app.use(express.json());

// Rate limiter
const apiRateLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_TTL_MS || 60000),
  limit: Number(process.env.RATE_LIMIT_MAX || 100),
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    message: "Too many requests. Please try again later.",
  },
});

// Health check
app.get("/", (req, res) => {
  res.json({
    service: "highland-destinations-backend",
    status: "ok",
  });
});

// Apply rate limiting to API routes
app.use("/api", apiRateLimiter);

// Create contact inquiry
app.post("/api/v1/contact-inquiries", async (req, res) => {
  try {
    const { name, mobileNumber, email, requirements, message } = req.body;

    if (!name || !mobileNumber || !email) {
      return res.status(400).json({
        message: "Name, mobile number and email are required",
      });
    }

    const inquiry = await ContactInquiry.create({
      name,
      mobileNumber,
      email,
      requirements,
      message,
    });

    return res.status(201).json({
      message: "Inquiry submitted successfully",
      data: inquiry,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
});

// 404
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// Connect MongoDB and start server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
  });

module.exports = app;
