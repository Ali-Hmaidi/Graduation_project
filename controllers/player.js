const Player = require("../models/Player");

const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getPlayers = async (req, res) => {
  const players = await Player.find({});
  res.status(StatusCodes.OK).json({ players });
};

const CreatePlayer = async (req, res) => {
  const player = await Player.create(req.body);
  res.status(StatusCodes.CREATED).json({ player });
};

const getPlayer = async (req, res) => {
  const {
    params: { id: playerId },
  } = req;

  const player = await Player.findOne({
    _id: playerId,
  });

  if (!player) {
    throw new NotFoundError(`no team  with id ${playerId}`);
  }

  res.status(StatusCodes.OK).json({ player });
};

const deletePlayer = async (req, res) => {
  const {
    //user: { userId },
    params: { id: PlayerId },
  } = req;

  // const id = await Team.findOne({ _id: teamtId });
  // if (id.createdBy != userId) {
  //   throw new BadRequestError("a user can only delete tweets that he created");
  // }

  const player = await Player.findByIdAndRemove({
    _id: PlayerId,
  });

  if (!player) {
    throw new NotFoundError(`no player with id ${PlayerId}`);
  }

  res.status(StatusCodes.OK).json({ success: true });
};

const RetrieveTeamPlayers = async (req, res) => {
  const theTeamId = req.params.teamId;
  console.log(theTeamId);
  const players = await Player.find({ teamId: theTeamId });
  res.status(StatusCodes.OK).json({ players });
};

module.exports = {
  getPlayers,
  getPlayer,
  CreatePlayer,
  deletePlayer,
  RetrieveTeamPlayers,
};
