const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authentication");

const {
  getAllProductsStatic,
  getAllProducts,
  updateProduct,
  deleteProduct,
  CreateProduct,
} = require("../controllers/products");

router.route("/").get(getAllProducts).post(authenticateUser, CreateProduct);
router.route("/static").get(getAllProductsStatic);
router
  .route("/:id")
  .delete(authenticateUser, deleteProduct)
  .patch(authenticateUser, updateProduct);

module.exports = router;
