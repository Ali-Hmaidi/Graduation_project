const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authentication");

const {
  getUsers,
  getUser,
  CreateUser,
  deleteUser,
  updateUser,
  changePassword,
  confirmEmail,
  forgotPassword,
} = require("../controllers/user");

router
  .get("/", authenticateUser, getUsers)
  .post("/", authenticateUser, CreateUser);
router
  .route("/:id")
  .get(authenticateUser, getUser)
  .delete(authenticateUser, deleteUser)
  .patch(authenticateUser, updateUser);
router.route("/changepassword/:id").patch(authenticateUser, changePassword);

router.route("/:id/verify/:token").get(confirmEmail);
router.route("/forgot-password/:email").post(forgotPassword);

module.exports = router;
