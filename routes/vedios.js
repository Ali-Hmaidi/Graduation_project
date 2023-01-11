const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authentication");
const {
  getVideo,
  getAllVedios,
  uploadVideo,
} = require("../controllers/vedios");

router.route("/").get(getAllVedios);
router.route("/:videoName").get(getVideo);
router.route("/:matchId").post(authenticateUser, uploadVideo);

module.exports = router;
