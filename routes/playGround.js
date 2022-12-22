const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authentication");

const {
  getPlayGrounds,
  getPlayGround,
  CreatePlayGround,
  deletePlayGround,
  updatePlayGround,
} = require("../controllers/playGround");

router.get("/", getPlayGrounds).post("/", authenticateUser, CreatePlayGround);
router
  .get("/:id", getPlayGround)
  .delete("/:id", authenticateUser, deletePlayGround)
  .patch("/:id", authenticateUser, updatePlayGround);
module.exports = router;
