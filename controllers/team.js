const Team = require("../models/Team");

const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getTeams = async (req, res) => {
  const teams = await Team.find({});
  res.status(StatusCodes.OK).json({ teams });
};

const CreateTeam = async (req, res) => {
  const team = await Team.create(req.body);
  res.status(StatusCodes.CREATED).json({ team });
};

const getTeam = async (req, res) => {
  const {
    params: { id: teamId },
  } = req;

  const team = await Team.findOne({
    _id: teamId,
  });

  if (!team) {
    throw new NotFoundError(`no team  with id ${teamId}`);
  }

  res.status(StatusCodes.OK).json({ team });
};

const deleteTeam = async (req, res) => {
  const {
    //user: { userId },
    params: { id: teamtId },
  } = req;

  // const id = await Team.findOne({ _id: teamtId });
  // if (id.createdBy != userId) {
  //   throw new BadRequestError("a user can only delete tweets that he created");
  // }

  const team = await Team.findByIdAndRemove({
    _id: teamtId,
  });

  if (!team) {
    throw new NotFoundError(`no team with id ${teamtId}`);
  }

  res.status(StatusCodes.OK).json({ success: true });
};

module.exports = {
  getTeams,
  getTeam,
  CreateTeam,
  deleteTeam,
};
