const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authentication");

const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.resolve(`./src/teamsTumbnails`));
  },
  filename: (req, file, callback) => {
    req.body.thumbnail =
      path.resolve(`./src/teamsTumbnails`) +
      "/" +
      Date.now() +
      path.extname(file.originalname);
    callback(null, req.body.thumbnail);
  },
});
const upload = multer({ storage: storage });

const {
  getTeams,
  getTeam,
  CreateTeam,
  deleteTeam,
  updateTeam,
  uploadTeamThumbnail,
} = require("../controllers/team");

router.get("/", getTeams).post("/", authenticateUser, CreateTeam);
router
  .get("/:id", getTeam)
  .delete("/:id", authenticateUser, deleteTeam)
  .patch("/:id", authenticateUser, updateTeam)
  .post(
    "/upload/:id",
    authenticateUser,
    upload.single("image"),
    uploadTeamThumbnail
  );

module.exports = router;
