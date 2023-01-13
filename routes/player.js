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
  uploadPlayerThumbnail,
} = require("../controllers/player");

const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.resolve(`./src/playerThumbnail`));
  },
  filename: (req, file, callback) => {
    req.body.thumbnail = Date.now() + path.extname(file.originalname);
    callback(null, req.body.thumbnail);
  },
});
const upload = multer({ storage: storage });

router.get("/", getPlayers).post("/", authenticateUser, CreatePlayer);
router
  .get("/:id", getPlayer)
  .delete("/:id", authenticateUser, deletePlayer)
  .patch("/:id", authenticateUser, updatePlayer);
router.get("/team/:teamId", RetrieveTeamPlayers);
router.post(
  "/upload/:id",
  authenticateUser,
  upload.single("image"),
  uploadPlayerThumbnail
);

module.exports = router;
