const PlayGround = require("../models/PlayGround");

const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getPlayGrounds = async (req, res) => {
  const playGrounds = await PlayGround.find({});
  res.status(StatusCodes.OK).json({ playGrounds });
};

const CreatePlayGround = async (req, res) => {
  const isAdmin = req.user.admin;
  if (isAdmin) {
    const playGround = await PlayGround.create(req.body);
    res.status(StatusCodes.CREATED).json({ success: true, playGround });
  } else {
    res.status(StatusCodes.UNAUTHORIZED).json({ success: false });
  }
};

const getPlayGround = async (req, res) => {
  const {
    params: { id: playGroundId },
  } = req;

  const playGround = await PlayGround.findOne({
    _id: playGroundId,
  });

  if (!playGround) {
    throw new NotFoundError(`no playGround  with id ${playGroundId}`);
  }

  res.status(StatusCodes.OK).json({ playGround });
};

const deletePlayGround = async (req, res) => {
  const playGroundId = req.params.id;
  const isAdmin = req.user.admin;
  if (isAdmin) {
    const playGround = await PlayGround.findByIdAndRemove({
      _id: playGroundId,
    });
    if (!playGround) {
      throw new NotFoundError(`no playGround with id ${playGroundId}`);
    }
    res.status(StatusCodes.OK).json({ success: true });
  } else {
    res.status(StatusCodes.UNAUTHORIZED).json({ success: false });
  }
};

const updatePlayGround = async (req, res) => {
  const {
    body: { name, location, description, numberOfSeats },
    params: { id: playGroundId },
  } = req;

  const isAdmin = req.user.admin;

  if (isAdmin) {
    if (!name || !location || !description || !numberOfSeats) {
      throw new BadRequestError("fields cant be empty");
    }
    const playGround = await PlayGround.findByIdAndUpdate(
      { _id: playGroundId },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!playGround) {
      throw new NotFoundError(`no team with id ${playGroundId}`);
    }

    res.status(StatusCodes.OK).json({
      _id: playGround._id,
      name: playGround.name,
      location: playGround.location,
      description: playGround.description,
      numberOfSeats: playGround.numberOfSeats,
    });
  } else {
    res.status(StatusCodes.UNAUTHORIZED).json({ success: false });
  }
};

module.exports = {
  getPlayGrounds,
  getPlayGround,
  CreatePlayGround,
  deletePlayGround,
  updatePlayGround,
};
