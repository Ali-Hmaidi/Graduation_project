const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authentication");

const {
  getTeams,
  getTeam,
  CreateTeam,
  deleteTeam,
} = require("../controllers/team");

router.get("/", getTeams).post("/", authenticateUser, CreateTeam);
router.get("/:id", getTeam).delete("/:id", authenticateUser, deleteTeam);

module.exports = router;
