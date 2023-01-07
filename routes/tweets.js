const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authentication");

const {
  CreateTweet,
  getAllTweets,
  getTweet,
  deleteTweet,
  updateTweet,
  RetrieveSpecificUserTweets,
} = require("../controllers/tweets");

router.route("/").post(authenticateUser, CreateTweet).get(getAllTweets);
router
  .route("/:id")
  .get(getTweet)
  .delete(authenticateUser, deleteTweet)
  .patch(authenticateUser, updateTweet);
router.route("/userTweets/:userid").get(RetrieveSpecificUserTweets);

module.exports = router;
