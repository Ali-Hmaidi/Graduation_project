const express = require("express");
const router = express.Router();

const {
  getAllEamils,
  CreateEamil,
  getEamil,
  deleteEamil,
  RetrieveSpecificUserEamils,
} = require("../controllers/emails");

router.route("/").post(CreateEamil).get(getAllEamils);
router.route("/:id").get(getEamil).delete(deleteEamil);
router.route("/userEamils/:userid").get(RetrieveSpecificUserEamils);

module.exports = router;
