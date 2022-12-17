const Team = require("../models/Team");

const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getTeams = async (req, res) => {
  const teams = await Team.find({});
  res.status(StatusCodes.OK).json({ teams });
};

const CreateTeam = async (req, res) => {
  const isAdmin = req.user.admin;
  if (isAdmin) {
    const team = await Team.create(req.body);
    res.status(StatusCodes.CREATED).json({ team });
  } else {
    res.status(StatusCodes.UNAUTHORIZED).json({ success: false });
  }
};

const getTeam = async (req, res) => {
  const teamId = req.params.id;

  const team = await Team.findOne({
    _id: teamId,
  });

  if (!team) {
    throw new NotFoundError(`no team  with id ${teamId}`);
  }

  res.status(StatusCodes.OK).json({ team });
};

const deleteTeam = async (req, res) => {
  const teamId = req.params.id;

  const isAdmin = req.user.admin;
  if (isAdmin) {
    const team = await Team.findByIdAndRemove({
      _id: teamId,
    });

    if (!team) {
      throw new NotFoundError(`no team with id ${teamtId}`);
    }

    res.status(StatusCodes.OK).json({ success: true });
  } else {
    res.status(StatusCodes.UNAUTHORIZED).json({ success: false });
  }
};

module.exports = {
  getTeams,
  getTeam,
  CreateTeam,
  deleteTeam,
};
