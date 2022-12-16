const express = require("express");
const router = express.Router();

const {
  getPlayers,
  getPlayer,
  CreatePlayer,
  deletePlayer,
  RetrieveTeamPlayers,
} = require("../controllers/player");

router.get("/", getPlayers).post("/", CreatePlayer);
router.get("/:id", getPlayer).delete("/:id", deletePlayer);
router.get("/team/:teamId", RetrieveTeamPlayers);

module.exports = router;
