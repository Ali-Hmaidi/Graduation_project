const express = require("express");
const router = express.Router();

const {
  getTeams,
  getTeam,
  CreateTeam,
  deleteTeam,
} = require("../controllers/team");

router.get("/", getTeams).post("/", CreateTeam);
router.get("/:id", getTeam).delete("/:id", deleteTeam);

module.exports = router;
