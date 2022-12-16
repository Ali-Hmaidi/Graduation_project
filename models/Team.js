const mongoose = require("mongoose");

const TeamsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please provide name"],
    unique: true,
    minlength: 3,
    maxlength: 50,
  },
  thumbnail: {
    type: String,
  },
  describtion: String,
  wins: Number,
  losses: Number,
  ties: Number,
  matchesPlayed: Number,
});

module.exports = mongoose.model("Team", TeamsSchema);
