const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authentication");

const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.resolve(`./src/tweetThumbnails`));
  },
  filename: (req, file, callback) => {
    req.body.Description = file.Description;
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
  CreateTweet,
  getAllTweets,
  getTweet,
  deleteTweet,
  updateTweet,
  RetrieveSpecificUserTweets,
} = require("../controllers/tweets");

router
  .route("/")
  .post(authenticateUser, upload.single("image"), CreateTweet)
  .get(getAllTweets);
router
  .route("/:id")
  .get(getTweet)
  .delete(authenticateUser, deleteTweet)
  .patch(authenticateUser, updateTweet);
router.route("/userTweets/:userid").get(RetrieveSpecificUserTweets);

module.exports = router;
