const User = require("../models/User");
const Email = require("../models/Emails");

const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");

const getAllEamils = async (req, res) => {
  const { name, sort } = req.query;
  const queryObject = {};

  if (name) {
    queryObject.creatorName = { $regex: name, $options: "i" };
  }

  let result = Email.find(queryObject);
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

  const emails = await result;

  res.status(StatusCodes.OK).json({ emails });
};
const CreateEamil = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const email = await Email.create(req.body);
  res.status(StatusCodes.CREATED).json({ email });
};

const getEamil = async (req, res) => {
  const {
    params: { id: emailId },
  } = req;

  const email = await Email.findOne({
    _id: emailId,
    //createdBy: userId,
  });

  if (!email) {
    throw new NotFoundError(`no email with id ${emailId}`);
  }

  res.status(StatusCodes.OK).json({ email });
};
const deleteEamil = async (req, res) => {
  const {
    user: { userId },
    params: { id: emailId },
  } = req;

  const isAdmin = req.user.admin;
  console.log(isAdmin);
  const id = await Email.findOne({ _id: emailId });
  if (!isAdmin) {
    throw new BadRequestError("only admin can delete emails");
  }

  const email = await Email.findByIdAndRemove({
    _id: emailId,
    createdBy: userId,
  });

  if (!email) {
    throw new NotFoundError(`no tweet with id ${emailId}`);
  }

  res.status(StatusCodes.OK).json({ success: true });
};
const RetrieveSpecificUserEamils = async (req, res) => {
  const userId = req.params.userid;

  const emails = await Tweet.find({ createdBy: userId }).sort("createdAt");
  res.status(StatusCodes.OK).json({ emails });
};

module.exports = {
  getAllEamils,
  CreateEamil,
  getEamil,
  deleteEamil,
  RetrieveSpecificUserEamils,
};
