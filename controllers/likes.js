const Likes = require("../models/Likes");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const Tweets = require("../models/Tweets");

const getLikes = async (req, res) => {
  const { page, pageSize } = req.query;

  const {
    params: { id: tweetId },
  } = req;

  const tweetLikes = await Likes.find({ tweetId: tweetId })
    .limit(Number(pageSize))
    .skip((Number(page) - 1) * Number(pageSize));

  res.status(StatusCodes.OK).json({ tweetLikes });
};

const likeTweet = async (req, res) => {
  const {
    user: { userId },
    params: { id: tweetId },
  } = req;

  const temp1 = await Tweets.findOne({ _id: tweetId });

  if (temp1) {
    const temp = await Likes.find({
      tweetId: tweetId,
      userId: userId,
    });

    const count = temp.length;
    if (count < 1) {
      req.body.userId = userId;
      req.body.tweetId = tweetId;
      const like = await Likes.create(req.body);
      res.status(StatusCodes.CREATED).json({ like });
    } else {
      throw new BadRequestError("already liked");
    }
  } else {
    throw new BadRequestError("cant find the tweet");
  }
};

const unlikeTweet = async (req, res) => {
  const {
    user: { userId },
    params: { id: tweetId },
  } = req;

  const id = await Likes.findOne({ tweetId: tweetId, userId: userId });
  if (!id) {
    throw new BadRequestError("tweet is already unliked");
  }

  const unlike = await Likes.findByIdAndRemove({
    _id: id._id,
  });

  if (!unlike) {
    throw new NotFoundError(`no tweet with id ${tweetId}`);
  }

  res.status(StatusCodes.OK).send();
};

const getLikesCount = async (req, res) => {
  const {
    params: { id: tweetId },
  } = req;

  const temp1 = await Tweets.findOne({ _id: tweetId });

  if (temp1) {
    const temp = await Likes.find({
      tweetId: tweetId,
    });

    const count = temp.length;
    res.status(StatusCodes.OK).json({ likesCount: count });
  } else {
    throw new BadRequestError("cant find the tweet");
  }
};

module.exports = {
  getLikes,
  likeTweet,
  unlikeTweet,
  getLikesCount,
};
