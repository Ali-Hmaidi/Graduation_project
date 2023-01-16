const Tweet = require("../models/Tweets");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const Likes = require("../models/Likes");

const getAllTweets = async (req, res) => {
  const { name, sort } = req.query;
  const queryObject = {};

  if (name) {
    queryObject.creatorName = { $regex: name, $options: "i" };
  }

  let result = Tweet.find(queryObject);
  // sort
  if (sort) {
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("createdAt");
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const tweets = await result;

  // for (var i = 0; i < tweets.length; i++) {
  //   const likes = await Likes.find({ tweetId: tweets[i]._id });

  //   tweets[i].likesCount = likes.length;
  // }

  res.status(StatusCodes.OK).json({ tweets });
};

const CreateTweet = async (req, res) => {
  req.body.createdBy = req.user.userId;

  req.body.thumbnail =
    process.env.BASE_URL_BACK + "/src/tweetThumbnails/" + req.body.thumbnail;

  const tweet = await Tweet.create(req.body);
  res.status(StatusCodes.CREATED).json({ tweet });
};
const getTweet = async (req, res) => {
  const {
    params: { id: tweetId },
  } = req;

  const tweet = await Tweet.findOne({
    _id: tweetId,
    //createdBy: userId,
  });

  if (!tweet) {
    throw new NotFoundError(`no tweet with id ${tweetId}`);
  }

  res.status(StatusCodes.OK).json({ tweet });
};
const deleteTweet = async (req, res) => {
  const {
    user: { userId },
    params: { id: tweetId },
  } = req;

  const isAdmin = req.user.admin;
  console.log(isAdmin);
  const id = await Tweet.findOne({ _id: tweetId });
  if (String(id.createdBy) !== String(userId) && !isAdmin) {
    throw new BadRequestError("a user can only delete posts that he created");
  }

  const tweet = await Tweet.findByIdAndRemove({
    _id: tweetId,
    createdBy: userId,
  });

  if (!tweet) {
    throw new NotFoundError(`no tweet with id ${tweetId}`);
  }

  res.status(StatusCodes.OK).json({ success: true });
};
const updateTweet = async (req, res) => {
  const {
    body: { Description },
    params: { id: tweetId },
  } = req;

  const isAdmin = req.user.admin;
  const id = await Tweet.findOne({ _id: tweetId });
  const userId = req.user.userId;

  if (String(id.createdBy) !== String(userId) && !isAdmin) {
    throw new BadRequestError("a user can only update tweets that he created");
  }

  if (!Description) {
    throw new BadRequestError("Description  field cant be empty");
  }
  const tweet = await Tweet.findByIdAndUpdate(
    { createdBy: userId, _id: tweetId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!tweet) {
    throw new NotFoundError(`no tweet with id ${tweetId}`);
  }

  res.status(StatusCodes.OK).json({ tweet });
};

const RetrieveSpecificUserTweets = async (req, res) => {
  const userId = req.params.userid;

  const tweets = await Tweet.find({ createdBy: userId }).sort("createdAt");
  res.status(StatusCodes.OK).json({ tweets });
};

module.exports = {
  CreateTweet,
  getAllTweets,
  getTweet,
  deleteTweet,
  updateTweet,
  RetrieveSpecificUserTweets,
};
