const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authentication");

const {
  getPlayers,
  getPlayer,
  CreatePlayer,
  deletePlayer,
  RetrieveTeamPlayers,
  updatePlayer,
} = require("../controllers/player");

router.get("/", getPlayers).post("/", authenticateUser, CreatePlayer);
router
  .get("/:id", getPlayer)
  .delete("/:id", authenticateUser, deletePlayer)
  .patch("/:id", authenticateUser, updatePlayer);
router.get("/team/:teamId", RetrieveTeamPlayers);

module.exports = router;
