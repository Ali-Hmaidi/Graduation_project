const Ticket = require("../models/Ticket");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const Match = require("../models/Match");

const path = require("path");
const QRCode = require("qrcode");

const getAllTickets = async (req, res) => {
  const isAdmin = req.user.admin;

  if (!isAdmin) {
    throw new BadRequestError("only admin can send this request");
  }
  const tickets = await Ticket.find({});
  res.status(StatusCodes.OK).json({ tickets });
};

const createTicket = async (req, res) => {
  req.body.userId = req.user.userId;

  const matchId = req.params.matchId;
  req.body.matchId = matchId;

  const url =
    process.env.BASE_URL_BACK + `/tickets/qrcode/${req.body.userId}/${matchId}`;

  const name = Date.now() + ".png";
  QRCode.toFile(
    path.resolve("./src/QRCodes") + "/" + name,
    url,
    function (error) {
      if (error) {
        console.log(error);
      }
    }
  );

  req.body.qrcode = process.env.BASE_URL_BACK + "/src/QRCodes/" + name;

  const ticket = await Ticket.create(req.body);
  res.status(StatusCodes.CREATED).json({ ticket });
};

const getUserTickets = async (req, res) => {
  const userId = req.user.userId;

  const tickets = await Ticket.find({ userId: userId });
  res.status(StatusCodes.OK).json({ tickets });
};

const deleteTicketsOfEndedMatches = async (req, res) => {
  const {
    params: { id: matchId },
  } = req;

  const isAdmin = req.user.admin;

  if (!isAdmin) {
    throw new BadRequestError("only admin can send this request");
  }

  const match = await Match.findById({ _id: matchId });

  if (match.status != "endded") {
    throw new BadRequestError(
      "the match is not done tickets cant be removed untill the match finishes"
    );
  }

  const tickets = await Ticket.find({
    matchId: matchId,
  });

  for (let i = 0; i < tickets.length; i++) {
    const deleteTicket = await Ticket.findByIdAndRemove({
      _id: tickets[i]._id,
    });
  }

  res.status(StatusCodes.OK).json({ success: true });
};

const deleteTicket = async (req, res) => {
  const {
    params: { id: ticketId },
  } = req;

  const isAdmin = req.user.admin;

  if (!isAdmin) {
    throw new BadRequestError("only admin can send this request");
  }

  const ticket = await Ticket.findByIdAndRemove({ _id: ticketId });

  res.status(StatusCodes.OK).json({ success: true });
};

const confirmTicket = async (req, res) => {
  const userId = req.params.userId;
  const matchId = req.params.matchId;

  res.status(StatusCodes.OK).json({ success: true });
};

module.exports = {
  createTicket,
  getUserTickets,
  deleteTicketsOfEndedMatches,
  getAllTickets,
  deleteTicket,
  confirmTicket,
};
