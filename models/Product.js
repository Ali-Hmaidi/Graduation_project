const mongoose = require("mongoose");

const ProductsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "product name must be provided"],
  },
  price: {
    type: Number,
    required: [true, "product price must be provided"],
  },
  featured: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  company: {
    type: String,
    enume: {
      values: ["ikea", "liddy", "caressa", "marcos"],
      message: "{VALUE} is not supported",
    },
  },
  thumbnail: {
    type: String,
    default:
      "https://apollobattery.com.au/wp-content/uploads/2022/08/default-product-image.png",
  },
});

module.exports = mongoose.model("Product", ProductsSchema);
