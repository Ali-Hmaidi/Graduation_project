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

  faceBookLink: {
    type: String,
    default: "",
  },
  instegramLink: {
    type: String,
    default: "",
  },
  youtubeLink: {
    type: String,
    default: "",
  },

  wins: { type: Number, default: 0 },

  losses: { type: Number, default: 0 },

  ties: { type: Number, default: 0 },

  matchesPlayed: { type: Number, default: 0 },

  points: { type: Number, default: 0 },

  GF: { type: Number, default: 0 },

  GA: { type: Number, default: 0 },

  GD: { type: Number, default: 0 },
});

module.exports = mongoose.model("Team", TeamsSchema);
