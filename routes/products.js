const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authentication");

const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.resolve(`./src/productImages`));
  },
  filename: (req, file, callback) => {
    req.body.thumbnail = Date.now() + path.extname(file.originalname);
    callback(null, req.body.thumbnail);
  },
});
const upload = multer({ storage: storage });

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
  uploadProductImage,
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

router.post(
  "/upload/:id",
  authenticateUser,
  upload.single("image"),
  uploadProductImage
);

module.exports = router;
