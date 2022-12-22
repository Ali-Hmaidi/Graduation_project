const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authentication");

const {
  getTeams,
  getTeam,
  CreateTeam,
  deleteTeam,
  updateTeam,
} = require("../controllers/team");

router.get("/", getTeams).post("/", authenticateUser, CreateTeam);
router
  .get("/:id", getTeam)
  .delete("/:id", authenticateUser, deleteTeam)
  .patch("/:id", authenticateUser, updateTeam);

module.exports = router;
