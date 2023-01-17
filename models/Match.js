const mongoose = require("mongoose");

const MatchesSchema = new mongoose.Schema({
  firstTeamId: {
    type: {},

    required: true,
  },
  secondTeamId: {
    type: {},

    validate: [
      validateteams,
      "cant have a team to have a match with themselves",
    ],
    required: true,
  },
  Description: String,
  status: {
    type: String,
    enum: ["comingSoon", "onGoing", "endded"],
    default: "comingSoon",
  },
  playGround: {
    type: {},

    required: true,
  },
  matchDate: {
    type: Date,
    required: true,
  },
  isToday: {
    type: Boolean,
    default: false,
  },
  bigMatch: {
    type: Boolean,
    default: false,
    index: true,
  },
  result: {
    type: { team1Score: Number, team2Score: Number },
    default: { team1Score: 0, team2Score: 0 },
  },
  videoName: {
    type: String,
    default: "match1.mp4",
  },
  ticketPrice: {
    type: Number,
    required: true,
    default: 10,
  },
});

function validateteams(team) {
  return String(team) !== String(this.firstTeamId);
}

module.exports = mongoose.model("Match", MatchesSchema);
