const mongoose = require("mongoose");
const User = require("../models/User");
const NotificationsSchema = new mongoose.Schema(
  {
    //userId
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "MUST PROVIDE user"],
    },
    creatorName: String,

    matchId: {
      type: mongoose.Types.ObjectId,
      ref: "Match",
      required: [true, "MUST PROVIDE matchId"],
    },
  },
  { timestamps: true }
);

NotificationsSchema.pre("save", async function () {
  const name = await User.findById({ _id: this.userId });
  this.creatorName = name.name;
});

module.exports = mongoose.model("Notification", NotificationsSchema);
