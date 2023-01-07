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
    default:
      "https://www.espn.com/i/teamlogos/soccer/500/default-team-logo-500.png?h=100&w=100",
  },
  description: String,
  wins: Number,
  losses: Number,
  ties: Number,
  matchesPlayed: Number,
});

module.exports = mongoose.model("Team", TeamsSchema);
