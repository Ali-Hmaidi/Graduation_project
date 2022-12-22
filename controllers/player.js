const Player = require("../models/Player");

const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getPlayers = async (req, res) => {
  const players = await Player.find({});
  res.status(StatusCodes.OK).json({ players });
};

const CreatePlayer = async (req, res) => {
  const isAdmin = req.user.admin;
  if (isAdmin) {
    const player = await Player.create(req.body);
    res.status(StatusCodes.CREATED).json({ success: true, player });
  } else {
    res.status(StatusCodes.UNAUTHORIZED).json({ success: false });
  }
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
  const PlayerId = req.params.id;
  const isAdmin = req.user.admin;
  if (isAdmin) {
    const player = await Player.findByIdAndRemove({
      _id: PlayerId,
    });
    if (!player) {
      throw new NotFoundError(`no player with id ${PlayerId}`);
    }
    res.status(StatusCodes.OK).json({ success: true });
  } else {
    res.status(StatusCodes.UNAUTHORIZED).json({ success: false });
  }
};

const RetrieveTeamPlayers = async (req, res) => {
  const theTeamId = req.params.teamId;
  console.log(theTeamId);
  const players = await Player.find({ teamId: theTeamId });
  res.status(StatusCodes.OK).json({ players });
};

const updatePlayer = async (req, res) => {
  const {
    body: { name, teamId, thumbnail },
    params: { id: playerId },
  } = req;

  const isAdmin = req.user.admin;

  if (isAdmin) {
    if (!name || !teamId || !thumbnail) {
      throw new BadRequestError("fields cant be empty");
    }
    const player = await Player.findByIdAndUpdate({ _id: playerId }, req.body, {
      new: true,
      runValidators: true,
    });

    if (!player) {
      throw new NotFoundError(`no PLAYER with id ${playerId}`);
    }

    res.status(StatusCodes.OK).json({
      _id: player._id,
      name: player.name,
      teamId: player.teamId,
      thumbnail: player.thumbnail,
    });
  } else {
    res.status(StatusCodes.UNAUTHORIZED).json({ success: false });
  }
};

module.exports = {
  getPlayers,
  getPlayer,
  CreatePlayer,
  deletePlayer,
  RetrieveTeamPlayers,
  updatePlayer,
};
