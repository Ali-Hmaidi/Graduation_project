const User = require("../models/User");
const Token = require("../models/Token");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const bcrypt = require("bcryptjs");
const Joi = require("joi");
const crypto = require("crypto");
const sendEmail = require("../middleware/sendEmail");
const path = require("path");

const getUsers = async (req, res) => {
  const isAdmin = req.user.admin;
  if (isAdmin) {
    const users = await User.find({});
    res.status(StatusCodes.OK).json({ users });
  } else {
    res.status(StatusCodes.UNAUTHORIZED).json({ success: false });
  }
};

const CreateUser = async (req, res) => {
  const isAdmin = req.user.admin;
  if (isAdmin) {
    const user = await User.create(req.body);
    res.status(StatusCodes.CREATED).json({ success: true, user });
  } else {
    res.status(StatusCodes.UNAUTHORIZED).json({ success: false });
  }
};

const getUser = async (req, res) => {
  const {
    params: { id: userId },
  } = req;
  const logedinUserId = req.user.userId;

  const isAdmin = req.user.admin;

  const user = await User.findOne({
    _id: userId,
  });

  if (!user) {
    throw new NotFoundError(`no user with id ${userId}`);
  }

  if (isAdmin || String(logedinUserId) === String(userId)) {
    res.status(StatusCodes.OK).json({ user });
  } else {
    res.status(StatusCodes.UNAUTHORIZED).json({ success: false });
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;

  const isAdmin = req.user.admin;
  if (isAdmin) {
    const user = await User.findByIdAndRemove({
      _id: userId,
    });

    if (!user) {
      throw new NotFoundError(`no user with id ${userId}`);
    }

    res.status(StatusCodes.OK).json({ success: true });
  } else {
    res.status(StatusCodes.UNAUTHORIZED).json({ success: false });
  }
};

const updateUser = async (req, res) => {
  const {
    body: { name, email, birthday, address },
    params: { id: userId },
  } = req;

  const logedinUserId = req.user.userId;
  const isAdmin = req.user.admin;

  if (isAdmin || String(logedinUserId) === String(userId)) {
    if (!name || !email || !birthday || !address) {
      throw new BadRequestError("fields cant be empty");
    }
    const user = await User.findByIdAndUpdate({ _id: userId }, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      throw new NotFoundError(`no user with id ${userId}`);
    }

    res.status(StatusCodes.OK).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      birthday: user.birthday,
      address: user.address,
    });
  } else {
    res.status(StatusCodes.UNAUTHORIZED).json({ success: false });
  }
};

const changePassword = async (req, res) => {
  const {
    body: { password },
    params: { id: userId },
  } = req;
  const isAdmin = req.user.admin;

  const logeduserId = req.user.userId;
  if (userId != logeduserId && !isAdmin) {
    throw new BadRequestError("a user can only change  his password");
  }

  if (!password) {
    throw new BadRequestError("fields cant be empty");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(password, salt);
  const user = await User.findByIdAndUpdate(
    { _id: userId },
    { password: hashedpassword }
  );

  if (!user) {
    throw new NotFoundError(`no user with id ${userId}`);
  }

  res.status(StatusCodes.OK).send();
};

const confirmEmail = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id });
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).send({ message: "Invalid link" });
  }

  const token = await Token.findOne({
    userId: user._id,
    token: req.params.token,
  });
  if (!token) {
    return res.status(StatusCodes.NOT_FOUND).send({ message: "Invalid link" });
  }

  await User.findByIdAndUpdate({ _id: user._id }, { verified: true });
  await token.remove();

  res.status(StatusCodes.OK).sendFile(path.resolve("./src/success.html"));
};

const sendPasswordResetEmail = async (req, res) => {
  const schema = Joi.object({ email: Joi.string().email().required() });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("user with given email doesn't exist");

  let token = await Token.findOne({ userId: user._id });
  if (!token) {
    token = await new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();
  }

  const link = `${process.env.BASE_URL_FRONT}/password-reset/${user._id}/${token.token}`;
  await sendEmail(user.email, "Password reset", link);

  res.send("password reset link sent to your email account");
};
const restPassword = async (req, res) => {
  const schema = Joi.object({ password: Joi.string().required() });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.params.userId);
  if (!user) return res.status(400).send("invalid link or expired");

  const token = await Token.findOne({
    userId: user._id,
    token: req.params.token,
  });
  if (!token) return res.status(400).send("Invalid link or expired");

  user.password = req.body.password;
  await user.save();

  await token.delete();

  res.status(StatusCodes.OK).send("password reset sucessfully.");
};

module.exports = {
  getUsers,
  getUser,
  CreateUser,
  deleteUser,
  updateUser,
  changePassword,
  confirmEmail,
  sendPasswordResetEmail,
  restPassword,
};
