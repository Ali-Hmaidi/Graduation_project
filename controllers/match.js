const Match = require("../models/Match");
const Team = require("../models/Team");
const PlayGround = require("../models/PlayGround");

const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");

const getMatches = async (req, res) => {
  const { status, sort } = req.query;
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
    body: { status },
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
      { _id: matchobj._id },
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

    if (req.body.result && req.body.status) {
      const { team1Score, team2Score } = req.body.result;

      if (status === "endded") {
        if (team1Score > team2Score) {
          const team1 = await Team.findOne({ _id: firstTeamId });

          await Team.findByIdAndUpdate(
            { _id: firstTeamId },
            {
              wins: ++team1.wins,
              matchesPlayed: ++team1.matchesPlayed,
              points: team1.points + 2,
              GF: team1.GF + team1Score,
              GA: team1.GA + team2Score,
              GD: team1.GD + (team1Score - team2Score),
            }
          );

          const team2 = await Team.findOne({ _id: secondTeamId });
          await Team.findByIdAndUpdate(
            { _id: secondTeamId },
            {
              losses: ++team2.losses,
              matchesPlayed: ++team2.matchesPlayed,
              points: team2.points + 1,
              GF: team2.GF + team2Score,
              GA: team2.GA + team1Score,
              GD: team2.GD + (team2Score - team1Score),
            }
          );
        } else if (team1Score < team2Score) {
          const team2 = await Team.findOne({ _id: secondTeamId });

          await Team.findByIdAndUpdate(
            { _id: secondTeamId },
            {
              wins: ++team2.wins,
              matchesPlayed: ++team2.matchesPlayed,
              points: team2.points + 2,
              GF: team2.GF + team2Score,
              GA: team2.GA + team1Score,
              GD: team2.GD + (team2Score - team1Score),
            }
          );

          const team1 = await Team.findOne({ _id: firstTeamId });
          await Team.findByIdAndUpdate(
            { _id: firstTeamId },
            {
              losses: ++team1.losses,
              matchesPlayed: ++team1.matchesPlayed,
              points: team1.points + 1,
              GF: team1.GF + team1Score,
              GA: team1.GA + team2Score,
              GD: team1.GD + (team1Score - team2Score),
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
