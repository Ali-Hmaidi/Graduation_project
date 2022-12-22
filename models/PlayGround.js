const mongoose = require("mongoose");

const PlayGroundsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please provide playground name"],
    minlength: 3,
    maxlength: 50,
  },

  location: String,
  description: String,
  numberOfSeats: Number,
});

module.exports = mongoose.model("PlayGround", PlayGroundsSchema);
