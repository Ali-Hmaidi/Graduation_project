const Match = require("../models/Match");
const Team = require("../models/Team");
const PlayGround = require("../models/PlayGround");

const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");

const getMatches = async (req, res) => {
  const matches = await Match.find({});

  const today = new Date();
  for (var i = 0; i < matches.length; i++) {
    if (today.toDateString() === matches[i].matchDate.toDateString()) {
      matches[i].isToday = true;
    }
  }

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

  let match = await Match.findOne({
    _id: matchId,
  });

  if (!match) {
    throw new NotFoundError(`no match  with id ${matchId}`);
  }

  const firstTeam = await Team.findOne({ _id: match.firstTeamId });
  const secondTeam = await Team.findOne({ _id: match.secondTeamId });
  const playGround = await PlayGround.findOne({ _id: match.playGround });

  if (!firstTeam || !secondTeam || !playGround) {
    throw new NotFoundError(`no match  with found with this properites`);
  }
  match.firstTeamId = firstTeam;
  match.secondTeamId = secondTeam;
  match.playGround = playGround;

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

const updateMatch = async (req, res) => {
  const {
    body: {
      firstTeamId,
      secondTeamId,
      playGround,
      status,
      matchDate,
      bigMatch,
    },
    params: { id: matchId },
  } = req;

  const isAdmin = req.user.admin;

  if (isAdmin) {
    if ((!firstTeamId || !secondTeamId || !playGround || !status, !matchDate)) {
      throw new BadRequestError("fields cant be empty");
    }
    const match = await Match.findByIdAndUpdate({ _id: matchId }, req.body, {
      new: true,
      runValidators: true,
    });

    if (!match) {
      throw new NotFoundError(`no match with id ${matchId}`);
    }

    res.status(StatusCodes.OK).json({
      _id: match._id,
      firstTeamId: match.firstTeamId,
      secondTeamId: match.secondTeamId,
      playGround: match.playGround,
      status: match.status,
      matchDate: match.matchDate,
      bigMatch: match.bigMatch,
    });
  } else {
    res.status(StatusCodes.UNAUTHORIZED).json({ success: false });
  }
};

module.exports = {
  getMatches,
  CreateMatch,
  getMatch,
  deleteMatch,
  updateMatch,
};
