const Team = require("../models/Team");

const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const Player = require("../models/Player");
const Match = require("../models/Match");

const getTeams = async (req, res) => {
  const { name, sort } = req.query;
  const queryObject = {};
  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }
  let result = Team.find(queryObject);

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

  const teams = await result;

  //const teams = await Team.find({});
  res.status(StatusCodes.OK).json({ teams });
};

const CreateTeam = async (req, res) => {
  const isAdmin = req.user.admin;
  if (isAdmin) {
    const team = await Team.create(req.body);
    res.status(StatusCodes.CREATED).json({ success: true, team });
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

  const players = await Player.find({ teamId: team._id });

  res.status(StatusCodes.OK).json({ team, playersList: players });
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

const updateTeam = async (req, res) => {
  const {
    params: { id: teamId },
  } = req;

  const isAdmin = req.user.admin;

  if (isAdmin) {
    const team = await Team.findByIdAndUpdate({ _id: teamId }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!team) {
      throw new NotFoundError(`no team with id ${teamId}`);
    }

    const matches = await Match.find({});

    for (var i = 0; i < matches.length; i++) {
      if (String(teamId) === String(matches[i].firstTeamId._id)) {
        const updatedMatch = await Match.findByIdAndUpdate(
          { _id: matches[i]._id },
          {
            firstTeamId: team,
          }
        );
      } else if (String(teamId) === String(matches[i].secondTeamId._id)) {
        const updatedMatch = await Match.findByIdAndUpdate(
          { _id: matches[i]._id },
          {
            secondTeamId: team,
          }
        );
      }
    }

    res.status(StatusCodes.OK).json({
      team,
    });
  } else {
    res.status(StatusCodes.UNAUTHORIZED).json({ success: false });
  }
};

const uploadTeamThumbnail = async (req, res) => {
  const isAdmin = req.user.admin;
  if (isAdmin) {
    const teamId = req.params.id;
    req.body.thumbnail = "assets/images/teams/" + req.body.thumbnail;

    const team = await Team.findByIdAndUpdate({ _id: teamId }, req.body);
    res.status(StatusCodes.CREATED).json({ team });
  } else {
    res.status(StatusCodes.UNAUTHORIZED).json({ success: false });
  }
};
module.exports = {
  getTeams,
  getTeam,
  CreateTeam,
  deleteTeam,
  updateTeam,
  uploadTeamThumbnail,
};
