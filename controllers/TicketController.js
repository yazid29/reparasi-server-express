const User = require("../models/User");
const Ticket = require("../models/Ticket");
const asyncHandler = require("express-async-handler");

const getAllTickets = asyncHandler(async (req, res) => {
  // query untuk ambil data ticket
  const tickets = await Ticket.find().lean();

  // validasi jika tidak ada user
  if (!tickets?.length) {
    return res.status(400).json({ message: "No tickets found" });
  }

  const ticketsWithDataUser = await Promise.all(
    tickets.map(async (ticket) => {
      const user = await User.findById(ticket.user).lean().exec();

      return { ...ticket, username: user.username };
    })
  );

  res.status(200).json({
    data: ticketsWithDataUser,
    message: "Success get all tickets",
  });
});
const getByIdTicket = asyncHandler(async (req, res) => {
  const id = req.params.id;
  // query untuk ambil data ticket
  const tickets = await Ticket.findById(id).lean().exec();

  // validasi jika tidak ada user
  if (!tickets) {
    return res.status(400).json({ message: "No tickets found" });
  }

  const user = await User.findById(tickets.user).lean().exec();
  tickets.username = user.username;
  res.status(200).json({
    data: tickets,
    message: "Success get all tickets",
  });
});
const createTicket = asyncHandler(async (req, res) => {
  const { title, desc, user } = req.body;
  if (!title || !desc || !user) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const userExists = await User.findById(user).exec();
  if (!userExists) {
    return res.status(400).json({ message: "User not found" });
  }
  const ticket = await Ticket.create({ title, desc, user });
  if (ticket) {
    res.status(201).json({ message: "New ticket created" });
  } else {
    res.status(400).json({ message: "Failed to create new ticket" });
  }
});

const updateTicket = asyncHandler(async (req, res) => {
  const { id, title, desc, isFixed, user, ticket } = req.body;
  if (!id || !title || !desc || !user) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const ticketData = await Ticket.findById(id).exec();
  if (!ticketData) {
    return res.status(400).json({ message: "Ticket not found" });
  }
  const userExists = await User.findById(user).exec();
  if (!userExists) {
    return res.status(400).json({ message: "User not found" });
  }
  ticketData.title = title;
  ticketData.desc = desc;
  ticketData.isFixed = isFixed == "true" ? true : false;
  ticketData.user = user;
  ticketData.ticket = ticket;
  const updatedTicket = await ticketData.save();
  res.json({ message: `${id} updated` });
});

const deleteTicket = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "Ticket ID required" });
  }
  const ticket = await Ticket.findById(id).exec();
  if (!ticket) {
    return res.status(404).json({ message: "Ticket not found" });
  }
  const result = await ticket.deleteOne();
  const reply = `Ticket with ID ${id} deleted`;
  res.json(reply);
});
const getAllTicketUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean();
  if (!users?.length) {
    return res.status(404).json({ message: "No users found" });
  }
  res.status(200).json(users);
});
module.exports = {
  getAllTickets,
  createTicket,
  updateTicket,
  deleteTicket,
  getByIdTicket,
  getAllTicketUsers
};
