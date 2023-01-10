const mongoose = require("mongoose");
const User = require("../models/User");
const reviewsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "MUST PROVIDE user"],
  },
  creatorName: String,
  ProductId: {
    type: mongoose.Types.ObjectId,
    REF: "Product",
    required: true,
    index: true,
  },

  review: String,
});

reviewsSchema.index(
  { userId: 1, ProductId: 1 },
  { unique: [true, "Review already added before"] }
);

reviewsSchema.pre("save", async function () {
  const name = await User.findById({ _id: this.userId });
  this.creatorName = name.name;
});

module.exports = mongoose.model("Review", reviewsSchema);
