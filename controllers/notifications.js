const Match = require("../models/Match");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");

const sendEmail = require("../middleware/sendEmail");
const schedule = require("node-schedule");

var Notification;

const StratNotification = async (req, res) => {
  const userId = req.params.userId;
  const matchId = req.params.matchId;

  const match = await Match.findOne({ _id: matchId });
  const user = await User.findById({ _id: userId });

  if (String(req.user.userId) !== String(userId)) {
    throw new BadRequestError("a user can only start notification for himself");
  }

  var yesterday = new Date(match.matchDate);
  yesterday.setDate(match.matchDate.getDate() - 1);

  const timeElapsed = Date.now() + 10000;
  const today = new Date(timeElapsed);

  //   console.log(today);
  //   console.log(yesterday);

  Notification = schedule.scheduleJob(yesterday, async function () {
    const text = `Hey there,\nThere is going to be a scheduled match tomorrow on PS-Sport at ${match.matchDate.getHours()} Oclock\nMake sure not to miss it.\nPS-Sport,\nAdmin. `;

    await sendEmail(user.email, "Notification Email", text);
  });

  res.status(StatusCodes.OK).json({ success: true });
};

const EndNotification = async (req, res) => {
  Notification.cancel();

  res.status(StatusCodes.OK).json({ success: true });
};

module.exports = {
  StratNotification,
  EndNotification,
};