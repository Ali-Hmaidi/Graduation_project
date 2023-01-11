const express = require("express");
const router = express.Router();

const {
  addOrder,
  getMyOrder,
  getAllOrders,
  updateOrder,
  getMyOrderProducts,
} = require("../controllers/orders");

router.route("/").post(addOrder).patch(updateOrder).get(getAllOrders);
router.route("/myorder").get(getMyOrder);
router.route("/myorder/products").get(getMyOrderProducts);

module.exports = router;
