const express = require("express");
const router = express.Router();

const {
  getUsers,
  getUser,
  CreateUser,
  deleteUser,
  updateUser,
  changePassword,
} = require("../controllers/user");

router.get("/", getUsers).post("/", CreateUser);
router.route("/:id").get(getUser).delete(deleteUser).patch(updateUser);
router.route("/changepassword/:id").patch(changePassword);

module.exports = router;
