const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authentication");

const {
  getWinnerOfAll,
  getWinnerOfTwo,
} = require("../controllers/predictions");

router.get("/", getWinnerOfAll);
router.get("/:team1Id/:team2Id", getWinnerOfTwo);

module.exports = router;
