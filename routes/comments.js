const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authentication");

const {
  addComment,
  getComments,
  deleteComment,
} = require("../controllers/comments");

router
  .route("/:id")
  .post(authenticateUser, addComment)
  .get(getComments)
  .delete(authenticateUser, deleteComment);

module.exports = router;
