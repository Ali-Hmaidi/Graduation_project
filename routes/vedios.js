const express = require("express");
const router = express.Router();

const { getVedio, getAllVedios } = require("../controllers/vedios");

router.route("/").get(getAllVedios);
router.route("/:videoName").get(getVedio);

module.exports = router;
