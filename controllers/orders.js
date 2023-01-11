const Order = require("../models/Orders");
const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllOrders = async (req, res) => {
  const isAdmin = req.user.admin;
  if (isAdmin) {
    const orders = await Order.find({});
    res.status(StatusCodes.OK).json({ orders });
  } else {
    res.status(StatusCodes.UNAUTHORIZED).json({ success: false });
  }
};

const getMyOrder = async (req, res) => {
  const userId = req.user.userId;

  let order = await Order.findOne({ userId: userId });

  // for (var i = 0; i < order.products.length; i++) {
  //   const product = await Product.findById({ _id: order.products[i] });
  //   order.products[i] = product;
  // }
  res.status(StatusCodes.OK).json({ order });
};

const addOrder = async (req, res) => {
  //   req.body.userId = req.user.userId;

  const order = await Order.create(req.body);

  res.status(StatusCodes.CREATED).json({ order });
};

const updateOrder = async (req, res) => {
  const {
    body: { products },
  } = req;

  const userId = req.user.userId;

  if (!products) {
    throw new BadRequestError("products  field cant be empty");
  }
  const order = await Order.findOneAndUpdate({ userId: userId }, req.body, {
    new: true,
    runValidators: true,
  });

  // if (order.products.length > 0) {
  //   for (var i = 0; i < order.products.length; i++) {
  //     const product = await Product.findById({ _id: order.products[i] });
  //     order.products[i] = product;
  //   }
  // }

  res.status(StatusCodes.OK).json({ order });
};

module.exports = {
  addOrder,
  getMyOrder,
  getAllOrders,
  updateOrder,
};
