const mongoose = require("mongoose");

const contactInquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    mobileNumber: { type: String, required: true, trim: true, maxlength: 30 },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },
    requirements: { type: String, trim: true, maxlength: 2000 },
    message: { type: String, trim: true, maxlength: 2000 },
  },
  { collection: "contact_inquiries", timestamps: true },
);

const ContactInquiry =
  mongoose.models.ContactInquiry ||
  mongoose.model("ContactInquiry", contactInquirySchema);

async function connectDatabase() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured");
  }

  await mongoose.connect(process.env.MONGODB_URI, {
    maxPoolSize: Number(process.env.MONGODB_MAX_POOL_SIZE || 20),
    minPoolSize: Number(process.env.MONGODB_MIN_POOL_SIZE || 2),
    serverSelectionTimeoutMS: Number(
      process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS || 5000,
    ),
    connectTimeoutMS: Number(process.env.MONGODB_CONNECT_TIMEOUT_MS || 5000),
    socketTimeoutMS: Number(process.env.MONGODB_SOCKET_TIMEOUT_MS || 45000),
  });
}

module.exports = { ContactInquiry, connectDatabase };
