const express = require("express");
const router = express.Router();

const { emailUs } = require("../controllers/emailus");

router.post("/", emailUs);

module.exports = router;
