const User = require("../models/User");
const { StatusCodes, getStatusCode } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const Token = require("../models/Token");
const sendEmail = require("../middleware/sendEmail");
const crypto = require("crypto");

const register = async (req, res) => {
  const user = await User.create({ ...req.body });

  //verviying the email here:
  const emailToken = await Token.create({
    userId: user._id,
    token: crypto.randomBytes(32).toString("hex"),
  });

  const url = `${process.env.BASE_URL_BACK}/users/${user._id}/verify/${emailToken.token}`;
  await sendEmail(user.email, "Verify Email", url);

  //creating the token for the user to be loged in so we cant send it unless he vervied his email
  //const token = user.createJWT();
  res
    .status(StatusCodes.CREATED)
    .send({ message: "An Email sent to your account please verify" });
  //.json({ user: { name: user.name, admin: user.admin }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  // compare password
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  if (!user.verified) {
    let emailToken = await Token.findOne({ userId: user._id });
    if (!emailToken) {
      emailToken = await Token.create({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      });

      const url = `${process.env.BASE_URL_BACK}/users/${user._id}/verify/${emailToken.token}`;
      await sendEmail(user.email, "Verify Email", url);
    }
    return res
      .status(StatusCodes.NOT_FOUND)
      .send({ message: "An Email sent to your account please verify" });
  }

  const token = user.createJWT();

  res
    .status(StatusCodes.OK)
    .json({ user: { name: user.name, admin: user.admin }, token });
};

module.exports = {
  register,
  login,
};
