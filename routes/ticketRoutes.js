const express = require("express");
const router = express.Router();
const ticketsController = require("../controllers/TicketController");
const JWTVerifier = require("../middleware/JWTVerifier");

// router.use(JWTVerifier);
router.route("/")
    .get(ticketsController.getAllTickets)
    .post(ticketsController.createTicket)
    .patch(ticketsController.updateTicket)
    .delete(ticketsController.deleteTicket);
router.route("/user").get(ticketsController.getAllTicketUsers);
router.route("/:id").get(ticketsController.getByIdTicket);
module.exports = router;