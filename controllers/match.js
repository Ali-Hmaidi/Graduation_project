const Match = require("../models/Match");

const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("../errors");

const getMatches = async (req, res) => {
  const matches = await Match.find({});
  res.status(StatusCodes.OK).json({ matches });
};

const CreateMatch = async (req, res) => {
  const isAdmin = req.user.admin;
  if (isAdmin) {
    const match = await Match.create(req.body);
    res.status(StatusCodes.CREATED).json({ success: true, match });
  } else {
    res.status(StatusCodes.UNAUTHORIZED).json({ success: false });
  }
};

const getMatch = async (req, res) => {
  const {
    params: { id: matchId },
  } = req;

  const match = await Match.findOne({
    _id: matchId,
  });

  if (!match) {
    throw new NotFoundError(`no team  with id ${matchId}`);
  }

  res.status(StatusCodes.OK).json({ match });
};

const deleteMatch = async (req, res) => {
  const isAdmin = req.user.admin;
  const {
    params: { id: matchId },
  } = req;

  if (isAdmin) {
    const match = await Match.findByIdAndRemove({
      _id: matchId,
    });

    if (!match) {
      throw new NotFoundError(`no match with id ${matchId}`);
    }

    res.status(StatusCodes.OK).json({ success: true });
  } else {
    res.status(StatusCodes.UNAUTHORIZED).json({ success: false });
  }
};

module.exports = {
  getMatches,
  CreateMatch,
  getMatch,
  deleteMatch,
};
