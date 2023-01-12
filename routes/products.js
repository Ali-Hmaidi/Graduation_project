const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authentication");

const {
  getAllProductsStatic,
  getAllProducts,
  updateProduct,
  deleteProduct,
  CreateProduct,
  getProduct,
  addReview,
  deleteReview,
  GetReviewsForProduct,
} = require("../controllers/products");

router.route("/").get(getAllProducts).post(authenticateUser, CreateProduct);
router.route("/static").get(getAllProductsStatic);
router
  .route("/reviews/:id")
  .post(authenticateUser, addReview)
  .get(GetReviewsForProduct)
  .delete(authenticateUser, deleteReview);

router
  .route("/:id")
  .delete(authenticateUser, deleteProduct)
  .patch(authenticateUser, updateProduct)
  .get(getProduct);

module.exports = router;
