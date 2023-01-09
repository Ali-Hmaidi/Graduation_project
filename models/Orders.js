const mongoose = require("mongoose");
const Product = require("./Product");

const OrdersSchema = new mongoose.Schema(
  {
    //userId
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "MUST PROVIDE user"],
      unique: [true, "An order already exist for this user"],
    },
    subtotal: Number,
    shipping: {
      type: Number,
      default: 0,
    },
    total: Number,
    products: {
      type: [mongoose.Types.ObjectId],
      ref: "Product",
    },
  },
  { timestamps: true }
);

OrdersSchema.pre("save", async function () {
  this.subtotal = 0;
  for (var i = 0; i < this.products.length; i++) {
    const product = await Product.findById({ _id: this.products[i] });

    this.subtotal += product.price;
  }

  this.total = this.subtotal + this.shipping;
});

module.exports = mongoose.model("Order", OrdersSchema);
