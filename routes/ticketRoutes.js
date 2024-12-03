const express = require("express");
const router = express.Router();
const ticketsController = require("../controllers/TicketController");
router.route("/")
    .get(ticketsController.getAllTickets)
    .post(ticketsController.createTicket)
    .patch(ticketsController.updateTicket)
    .delete(ticketsController.deleteTicket);

module.exports = router;