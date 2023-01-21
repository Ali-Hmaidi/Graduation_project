const Match = require("../models/Match");
const User = require("../models/User");
const Notifications = require("../models/Notification");

const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");

const sendEmail = require("../middleware/sendEmail");
const schedule = require("node-schedule");
const { required } = require("joi");

var Notification;

const StratNotification = async (req, res) => {
  const userId = req.user.userId;
  const matchId = req.params.matchId;

  const match = await Match.findOne({ _id: matchId });
  const user = await User.findById({ _id: userId });

  const notification = await Notifications.create({
    userId: userId,
    matchId: matchId,
  });

  let calculatedDate = new Date(match.matchDate);
  calculatedDate.setDate(calculatedDate.getDate() - 1);
  calculatedDate = calculatedDate.toISOString();
  const reminderDate = new Date(calculatedDate);

  // var yesterday = new Date(match.matchDate);
  // yesterday.setDate(match.matchDate.getDate() - 1);

  // const timeElapsed = Date.now() + 10000;
  // const today = new Date(timeElapsed);

  // console.log(today);
  // console.log(yesterday);
  const unique_name = Date.now().toString();

  Notification = schedule.scheduleJob(
    unique_name,
    reminderDate,
    async function () {
      const text = `Hey there,\nThere is going to be a scheduled match tomorrow on PS-Sport at ${match.matchDate.getHours()} Oclock\nMake sure not to miss it.\nPS-Sport,\nAdmin. `;

      await sendEmail(user.email, "Notification Email", text);
    }
  );

  res
    .status(StatusCodes.OK)
    .json({ success: true, scheduleName: unique_name, notification });
};

const EndNotification = async (req, res) => {
  const unique_name = req.params.scheduleName;
  const notify = req.params.notificationId;
  const EndNotification = schedule.scheduledJobs[unique_name];

  if (!EndNotification) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, msg: "the notification is off" });
  } else {
  }
  EndNotification.cancel();
  await Notifications.findOneAndRemove({ _id: notify });
  res.status(StatusCodes.OK).json({ success: true });
};

module.exports = {
  StratNotification,
  EndNotification,
};
