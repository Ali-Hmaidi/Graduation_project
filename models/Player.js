const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const PlayersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please provide name"],
    minlength: 3,
    maxlength: 50,
  },
  teamId: {
    type: mongoose.Types.ObjectId,
    ref: "Team",
  },
  thumbnail: {
    type: String,
    default:
      "https://cdn.britannica.com/19/233519-050-F0604A51/LeBron-James-Los-Angeles-Lakers-Staples-Center-2019.jpg",
  },
});

module.exports = mongoose.model("Player", PlayersSchema);
