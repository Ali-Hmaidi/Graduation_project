const mongoose = require("mongoose");
const User = require("../models/User");

const EamilsSchema = new mongoose.Schema(
  {
    //userId
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "MUST PROVIDE user"],
    },
    creatorName: String,
    subject: {
      type: String,
      required: true,
      default: "Email from a user",
    },
    Description: {
      type: String,
      required: [true, "MUST PROVIDE tweet body"],
      trim: true,
      maxlength: [1000, "the tweet can not be more than 1000 characters"],
    },
  },
  { timestamps: true }
);

EamilsSchema.pre("save", async function () {
  const name = await User.findById({ _id: this.createdBy });
  this.creatorName = name.name;
});

module.exports = mongoose.model("Eamil", EamilsSchema);
