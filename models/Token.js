const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    requierd: true,
    unique: true,
  },
  token: {
    type: String,
    requierd: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 3600, // 1 hour
  },
});

module.exports = mongoose.model("token", tokenSchema);
