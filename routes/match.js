const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authentication");

const {
  getMatches,
  CreateMatch,
  getMatch,
  deleteMatch,
  updateMatch,
  getBigMatches,
} = require("../controllers/match");

router.get("/", getMatches).post("/", authenticateUser, CreateMatch);
router.route("/bigmatches").get(getBigMatches);

router
  .get("/:id", getMatch)
  .delete("/:id", authenticateUser, deleteMatch)
  .patch("/:id", authenticateUser, updateMatch);

module.exports = router;
