const Match = require("../models/Match");
const Team = require("../models/Team");
const PlayGround = require("../models/PlayGround");

const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");

const getMatches = async (req, res) => {
  const { status, sort, fields } = req.query;
  const queryObject = {};

  if (status) {
    queryObject.status = status;
  }

  let result = Match.find(queryObject);
  // sort
  if (sort) {
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("createdAt");
  }

  if (fields) {
    const fieldsList = fields.split(",").join(" ");
    result = result.select(fieldsList);
  }
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const matches = await result;

  for (let i = 0; i < matches.length; i++) {
    if (
      matches[i].status == "comingSoon" &&
      matches[i].matchDate < Date.now()
    ) {
      const updatedMatch = await Match.findByIdAndUpdate(
        { _id: matches[i]._id },
        { status: "endded" }
      );

      matches[i].status = "endded";
    }
  }

  res.status(StatusCodes.OK).json({ matchesCount: matches.length, matches });
};

const getBigMatches = async (req, res) => {
  const matches = await Match.find({ bigMatch: true });

  res.status(StatusCodes.OK).json({ matches });
};

const CreateMatch = async (req, res) => {
  const isAdmin = req.user.admin;
  if (isAdmin) {
    const match = await Match.create(req.body);

    const firstTeamId = await Team.findById({ _id: match.firstTeamId });
    const secondTeamId = await Team.findById({ _id: match.secondTeamId });
    const playGround = await PlayGround.findById({ _id: match.playGround });

    const updatedMatch = await Match.findByIdAndUpdate(
      { _id: match._id },
      {
        firstTeamId: firstTeamId,
        secondTeamId: secondTeamId,
        playGround: playGround,
      }
    );

    res.status(StatusCodes.CREATED).json({ success: true, updatedMatch });
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
    body: { status, result },
    params: { id: matchId },
  } = req;

  const isAdmin = req.user.admin;

  if (isAdmin) {
    const matchobj = await Match.findById({ _id: matchId });

    const firstTeamIdobj = await Team.findById({
      _id: matchobj.firstTeamId._id,
    });

    const secondTeamIdobj = await Team.findById({
      _id: matchobj.secondTeamId._id,
    });

    const playGround = await PlayGround.findById({
      _id: matchobj.playGround._id,
    });

    const updatedMatch = await Match.findByIdAndUpdate(
      { _id: matchId },
      {
        firstTeamId: firstTeamIdobj,
        secondTeamId: secondTeamIdobj,
        playGround: playGround,
      }
    );

    const match = await Match.findByIdAndUpdate({ _id: matchId }, req.body, {
      new: true,
      runValidators: true,
    });

    if (!match) {
      throw new NotFoundError(`no match with id ${matchId}`);
    }

    const firstTeamId = match.firstTeamId._id;
    const secondTeamId = match.secondTeamId._id;

    if (result) {
      const { team1Score, team2Score } = result;

      if (match.status === "endded") {
        if (Number(team1Score) > Number(team2Score)) {
          const team1 = await Team.findOne({ _id: firstTeamId });

          await Team.findByIdAndUpdate(
            { _id: firstTeamId },
            {
              wins: ++team1.wins,
              matchesPlayed: ++team1.matchesPlayed,
              points: team1.points + 2,
              GF: Number(team1.GF) + Number(team1Score),
              GA: Number(team1.GA) + Number(team2Score),
              GD: Number(team1.GD) + (team1Score - team2Score),
            }
          );

          const team2 = await Team.findOne({ _id: secondTeamId });
          await Team.findByIdAndUpdate(
            { _id: secondTeamId },
            {
              losses: ++team2.losses,
              matchesPlayed: ++team2.matchesPlayed,
              points: team2.points + 1,
              GF: Number(team2.GF) + Number(team2Score),
              GA: Number(team2.GA) + Number(team1Score),
              GD: Number(team2.GD) + (team2Score - team1Score),
            }
          );
        } else if (Number(team1Score) < Number(team2Score)) {
          const team2 = await Team.findOne({ _id: secondTeamId });

          await Team.findByIdAndUpdate(
            { _id: secondTeamId },
            {
              wins: ++team2.wins,
              matchesPlayed: ++team2.matchesPlayed,
              points: team2.points + 2,
              GF: Number(team2.GF) + Number(team2Score),
              GA: Number(team2.GA) + Number(team1Score),
              GD: Number(team2.GD) + (team2Score - team1Score),
            }
          );

          const team1 = await Team.findOne({ _id: firstTeamId });
          await Team.findByIdAndUpdate(
            { _id: firstTeamId },
            {
              losses: ++team1.losses,
              matchesPlayed: ++team1.matchesPlayed,
              points: team1.points + 1,
              GF: Number(team1.GF) + Number(team1Score),
              GA: Number(team1.GA) + Number(team2Score),
              GD: Number(team1.GD) + (team1Score - team2Score),
            }
          );
        }
      }
    }

    res.status(StatusCodes.OK).json({
      match,
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
  getBigMatches,
};
