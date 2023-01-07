const mongoose = require("mongoose");
const User = require("../models/User");
const LikesSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "MUST PROVIDE user"],
  },
  creatorName: String,
  tweetId: {
    type: mongoose.Types.ObjectId,
    REF: "Tweets",
    required: true,
    index: true,
  },
});

LikesSchema.index(
  { userId: 1, tweetId: 1 },
  { unique: [true, "already liked before"] }
);

LikesSchema.pre("save", async function () {
  const name = await User.findById({ _id: this.userId });
  this.creatorName = name.name;
});

module.exports = mongoose.model("Likes", LikesSchema);
