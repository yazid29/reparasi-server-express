const User = require("../models/User");
const Ticket = require("../models/Ticket");
const asyncHandler = require("express-async-handler");

const getAllTickets = asyncHandler(async (req, res) => {
    const tickets = await Ticket.find().lean().exec();
    if(!tickets?.length) {
        return res.status(404).json({message: "No tickets found"});
    }
    res.status(200).json(tickets);
});

const createTicket = asyncHandler(async (req, res) => {
    const {title,desc,user} = req.body;
    if(!title || !desc || !user) {
        return res.status(400).json({message: "All fields are required"});
    }
    const userExists = await User.findById(user).exec();
    if(!userExists) {
        return res.status(400).json({message: "User not found"});
    }
    const ticket = await Ticket.create({title,desc,user});
    if(ticket) {
        res.status(201).json({message: "New ticket created"});
    } else{
        res.status(400).json({message: "Failed to create new ticket"});
    }
});

const updateTicket = asyncHandler(async (req, res) => {
    const {id, title,desc, isFixed, user} = req.body;
    if(!id || 
        !title || 
        !desc || 
        typeof isFixed !== "boolean" || 
        !user) {
        return res.status(400).json({message: "All fields are required"});
    }
    const ticket = await Ticket.findById(id).exec();
    if(!ticket) {
        return res.status(400).json({message: "Ticket not found"});
    }
    const userExists = await User.findById(user).exec();
    if(!userExists) {
        return res.status(400).json({message: "User not found"});
    }
    ticket.title = title;
    ticket.desc = desc;
    ticket.isFixed = isFixed;
    ticket.user = user;
    const updatedTicket = await ticket.save();
    res.json({message: `${id} updated`});
});

const deleteTicket = asyncHandler(async (req, res) => {
    const {id} = req.body;
    if(!id) {
        return res.status(400).json({message: "Ticket ID required"});
    }
    const ticket = await Ticket.findById(id).exec();
    if(!ticket) {
        return res.status(404).json({message: "Ticket not found"});
    }
    const result = await ticket.deleteOne();
    const reply = `Ticket with ID ${id} deleted`;
    res.json(reply);
});

module.exports = {
    getAllTickets,
    createTicket,
    updateTicket,
    deleteTicket
};