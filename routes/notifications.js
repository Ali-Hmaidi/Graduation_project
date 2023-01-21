const express = require("express");
const router = express.Router();

const {
  StratNotification,
  EndNotification,
} = require("../controllers/notifications");

router.get("/start/:matchId", StratNotification);
router.get("/end/:scheduleName/:notificationId", EndNotification);

module.exports = router;
