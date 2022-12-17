const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authentication");

const {
  getMatches,
  CreateMatch,
  getMatch,
  deleteMatch,
} = require("../controllers/match");

router.get("/", getMatches).post("/", authenticateUser, CreateMatch);
router.get("/:id", getMatch).delete("/:id", authenticateUser, deleteMatch);

module.exports = router;
