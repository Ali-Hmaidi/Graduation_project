const mongoose = require("mongoose");
const User = require("../models/User");
const CommentsSchema = new mongoose.Schema(
  {
    //userId
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "MUST PROVIDE user"],
    },
    creatorName: String,

    Description: {
      type: String,
      required: [true, "MUST PROVIDE tweet body"],
      trim: true,
      maxlength: [1000, "the tweet can not be more than 1000 characters"],
    },
    tweetId: {
      type: mongoose.Types.ObjectId,
      ref: "Tweets",
      required: [true, "MUST PROVIDE tweetId"],
    },
  },
  { timestamps: true }
);

CommentsSchema.pre("save", async function () {
  const name = await User.findById({ _id: this.userId });
  this.creatorName = name.name;
});

module.exports = mongoose.model("Comments", CommentsSchema);
