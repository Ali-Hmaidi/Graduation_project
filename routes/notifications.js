const express = require("express");
const router = express.Router();

const {
  StratNotification,
  EndNotification,
  RetrieveSpecificUserNotifications,
} = require("../controllers/notifications");

router.get("/start/:matchId", StratNotification);
router.get("/end/:scheduleName/:notificationId", EndNotification);
router.get("/userNotifications", RetrieveSpecificUserNotifications);
module.exports = router;
