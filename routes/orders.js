const express = require("express");
const router = express.Router();

const {
  addOrder,
  getMyOrder,
  getAllOrders,
  updateOrder,
} = require("../controllers/orders");

router.route("/").post(addOrder).patch(updateOrder).get(getAllOrders);
router.route("/myorder").get(getMyOrder);

module.exports = router;
