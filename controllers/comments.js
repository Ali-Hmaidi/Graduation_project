const Comments = require("../models/Comments");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const Tweets = require("../models/Tweets");

const addComment = async (req, res) => {
  const {
    user: { userId },
    params: { id: tweetId },
  } = req;
  req.body.tweetId = tweetId;
  req.body.userId = userId;

  const temp = await Tweets.findOne({ _id: req.params.id });

  if (temp) {
    const comment = await Comments.create(req.body);
    res.status(StatusCodes.CREATED).json({ comment });
  } else {
    throw new BadRequestError("cant find the tweet");
  }
};

const getComments = async (req, res) => {
  const { page, pageSize } = req.query;

  const {
    params: { id: tweetId },
  } = req;

  const tweetComments = await Comments.find({ tweetId: tweetId })
    .limit(Number(pageSize))
    .skip((Number(page) - 1) * Number(pageSize))
    .sort("createdAt");
  res.status(StatusCodes.OK).json({ tweets: tweetComments });
};

const deleteComment = async (req, res) => {
  const {
    user: { userId },
    params: { id: commentId },
  } = req;
  const isAdmin = req.user.admin;
  const id = await Comments.findOne({ _id: commentId });
  if (id) {
    if (id.userId != userId || isAdmin) {
      throw new BadRequestError(
        "a user can only delete tweets that he created"
      );
    }

    const comment = await Comments.findByIdAndRemove({
      _id: commentId,
      userId: userId,
    });

    if (!comment) {
      throw new NotFoundError(`no comment with id ${commentId}`);
    }

    res.status(StatusCodes.OK).send();
  } else {
    throw new NotFoundError("no comment found");
  }
};

module.exports = {
  addComment,
  getComments,
  deleteComment,
};
