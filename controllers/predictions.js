const brain = require("brain.js");
const Match = require("../models/Match");

const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");
const Team = require("../models/Team");

const config = {
  binaryThresh: 0.5,
  hiddenLayers: [3, 3], // array of ints for the sizes of the hidden layers in the network
  activation: "sigmoid", // supported activation types: ['sigmoid', 'relu', 'leaky-relu', 'tanh'],
  leakyReluAlpha: 0.01, // supported for activation type 'leaky-relu'
};

const net = new brain.NeuralNetwork(config);

const getWinnerOfAll = async (req, res) => {
  //63bdc06ce76c17026c1ba4ce
  const firstTeamId = await Team.findById({ _id: "63bdc040e76c17026c1ba4c8" });
  const secondTeamId = await Team.findById({ _id: "63bdc06ce76c17026c1ba4ce" });

  for (let i = 0; i < 5; i++) {
    const jsonMatch = {
      firstTeamId: firstTeamId,
      secondTeamId: secondTeamId,
      playGround: "63bdc6ddacd68f083cafdbbf",
      matchDate: "2023-01-01T18:00:00.000Z",
      Description: "Lorem",

      status: "endded",
      result: {
        //return a random number 0 - 99
        team1Score: Math.floor(Math.random() * 100),
        team2Score: Math.floor(Math.random() * 100),
      },
    };

    await Match.create(jsonMatch);
    console.log("Success!!!!");
  }

  res.status(StatusCodes.OK).json({ success: true });
};

getWinnerOfTwo = async (req, res) => {
  const team1Id = req.params.team1Id;
  const team2Id = req.params.team2Id;

  const matches = await Match.find({});

  const team1Matches = [];
  const team2Matches = [];

  for (let i = 0; i < matches.length; i++) {
    if (String(matches[i].firstTeamId._id) === String(team1Id)) {
      team1Matches.push(matches[i]);
    }
    if (String(matches[i].secondTeamId._id) === String(team2Id)) {
      team2Matches.push(matches[i]);
    }
  }

  const trainingData = [];
  for (let i = 0; i < team1Matches.length; i++) {
    const team1Score = team1Matches[i].result.team1Score;
    const team2Score = team1Matches[i].result.team2Score;
    trainingData.push({
      input: {
        team1: 1,
        team2: 0,
      },
      // if 1 => team 1 is winner , if 0 team2 is winner , if 3 tie
      output: {
        winner: team1Score > team2Score ? 1 : team1Score > team2Score ? 0 : 0.5,
      },
    });
  }
  for (let i = 0; i < team2Matches.length; i++) {
    const team1Score = team2Matches[i].result.team1Score;
    const team2Score = team2Matches[i].result.team2Score;
    trainingData.push({
      input: {
        team1: 1,
        team2: 0,
      },
      // if 1 => team 1 is winner , if 0 team2 is winner , if 3 tie
      output: {
        winner: team1Score > team2Score ? 1 : team1Score > team2Score ? 0 : 0.5,
      },
    });
  }

  console.log(trainingData);

  const stats = net.train(trainingData);
  const result = net.run({ team1: 1, team2: 0 });

  res.status(StatusCodes.OK).json({ stats: stats, result: result });
};

module.exports = {
  getWinnerOfAll,
  getWinnerOfTwo,
};
