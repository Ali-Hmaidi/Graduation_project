const mongoose = require("mongoose");

const ticketsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    requierd: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  matchId: {
    type: mongoose.Types.ObjectId,
    ref: "Match",
    requierd: true,
  },
  personalIdNumber: {
    type: Number,
    requierd: true,
  },
  qrcode: {
    type: String,
  },
});

module.exports = mongoose.model("Ticket", ticketsSchema);
