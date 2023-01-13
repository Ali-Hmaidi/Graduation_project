require("dotenv").config();

const connectDB = require("./db/connect");
const Match = require("./models/Match");
const Team = require("./models/Team");

const func = async () => {
  const firstTeamId = await Team.findById({ _id: "63bdc040e76c17026c1ba4c8" });
  const secondTeamId = await Team.findById({ _id: "63bdc06ce76c17026c1ba4ce" });

  return { firstTeamId, secondTeamId };
};

const { firstTeamId, secondTeamId } = func();

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
  const start = async () => {
    try {
      await connectDB(process.env.MONGO_URI);
      //await Product.deleteMany();
      await Match.create(jsonMatch);
      console.log("Success!!!!");
      //process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
  start();
}

process.exit(0);
