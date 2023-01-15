const express = require("express");
const router = express.Router();

const {
  StratNotification,
  EndNotification,
} = require("../controllers/notifications");

router.get("/start/:userId/:matchId", StratNotification);
router.get("/end/:userId/:matchId", EndNotification);

module.exports = router;
