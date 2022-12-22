const mongoose = require("mongoose");

const MatchesSchema = new mongoose.Schema({
  firstTeamId: {
    type: mongoose.Types.ObjectId,
    ref: "Team",

    required: true,
  },
  secondTeamId: {
    type: mongoose.Types.ObjectId,
    ref: "Team",

    validate: [
      validateteams,
      "cant have a team to have a match with themselves",
    ],
    required: true,
  },
  status: {
    type: String,
    enum: ["comingSoon", "onGoing", "endded"],
    default: "comingSoon",
  },
  playGround: {
    type: mongoose.Types.ObjectId,
    ref: "PlayGround",

    required: true,
  },
  matchDate: {
    type: Date,
    required: true,
  },
});

function validateteams(team) {
  return String(team) !== String(this.firstTeamId);
}

module.exports = mongoose.model("Match", MatchesSchema);
