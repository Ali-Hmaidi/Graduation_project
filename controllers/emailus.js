const User = require("../models/User");

const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");

const emailUs = async (req, res) => {
  res.status(StatusCodes.OK).json({ success: true });
};

module.exports = {
  emailUs,
};
