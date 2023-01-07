const mongoose = require("mongoose");

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
      "https://www.contentviewspro.com/wp-content/uploads/2017/07/default_image.png",
  },
});

module.exports = mongoose.model("Player", PlayersSchema);
