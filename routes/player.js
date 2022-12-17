const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authentication");

const {
  getPlayers,
  getPlayer,
  CreatePlayer,
  deletePlayer,
  RetrieveTeamPlayers,
} = require("../controllers/player");

router.get("/", getPlayers).post("/", authenticateUser, CreatePlayer);
router.get("/:id", getPlayer).delete("/:id", authenticateUser, deletePlayer);
router.get("/team/:teamId", RetrieveTeamPlayers);

module.exports = router;
