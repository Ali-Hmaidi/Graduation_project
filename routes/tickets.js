const express = require("express");
const router = express.Router();

const {
  createTicket,
  deleteTicketsOfEndedMatches,
  getAllTickets,
  getUserTickets,
  deleteTicket,
  confirmTicket,
} = require("../controllers/tickets");

router.route("/").get(getAllTickets);
router.route("/delete/:id").delete(deleteTicket);

router
  .route("/:matchId")
  .delete(deleteTicketsOfEndedMatches)
  .post(createTicket);
router.route("/mytickets").get(getUserTickets);

router.route("/qrcode/:userId/:matchId").get(confirmTicket);

module.exports = router;
