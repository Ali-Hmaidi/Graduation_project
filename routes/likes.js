const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authentication");

const {
  getLikes,
  likeTweet,
  unlikeTweet,
  getLikesCount,
} = require("../controllers/likes");

router
  .route("/:id")
  .get(getLikes)
  .post(authenticateUser, likeTweet)
  .delete(authenticateUser, unlikeTweet);
router.route("/likesCount/:id").get(getLikesCount);

module.exports = router;
