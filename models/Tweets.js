const mongoose = require("mongoose");
const User = require("../models/User");

const TweetsSchema = new mongoose.Schema(
  {
    //userId
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "MUST PROVIDE user"],
    },
    creatorName: String,
    likesCount: {
      type: Number,
      default: 0,
    },
    Description: {
      type: String,
      required: [true, "MUST PROVIDE tweet body"],
      trim: true,
      maxlength: [1000, "the tweet can not be more than 1000 characters"],
    },
    thumbnail: String,
  },
  { timestamps: true }
);

TweetsSchema.pre("save", async function () {
  const name = await User.findById({ _id: this.createdBy });
  this.creatorName = name.name;
});

module.exports = mongoose.model("Tweet", TweetsSchema);
