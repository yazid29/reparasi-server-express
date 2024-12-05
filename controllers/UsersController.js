const User = require("../models/User");
const Ticket = require("../models/Ticket");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean();
  if (!users?.length) {
    return res.status(404).json({ message: "No users found" });
  }
  res.status(200).json(users);
});

const createUser = asyncHandler(async (req, res) => {
  const { username, password, roles } = req.body;
  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const duplicate = await User.findOne({ username }).lean().exec();
  if (duplicate) {
    return res.status(400).json({ message: "Username already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    username,
    password: hashedPassword,
    roles,
  });

  if (newUser) {
    res.status(201).json({ message: `New user ${username} created` });
  } else {
    res.status(400).json({ message: "Failed to create new user" });
  }
});

const updateUser = asyncHandler(async (req, res) => {
  // destructuring
  const { id, username, roles, active, password } = req.body;

  // validasi kelengkapan data
  if (
    !id ||
    !username ||
    !Array.isArray(roles) ||
    typeof active !== "boolean"
  ) {
    return res.status(400).json({ message: "All field required" });
  }

  // validasi existing data
  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User Not Found" });
  }

  // validasi duplicate username
  const duplicate = await User.findOne({ username }).lean().exec();

  // memperbolehkan admin untuk meng-update username pada user dengan id sama.
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Username already exist" });
  }

  user.username = username;
  user.roles = roles;
  user.active = active;

  // jika ingin meng-update password
  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await user.save();

  res.json({ message: `${updatedUser.id} Has ben updated.` });
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "User ID required" });
  }
  const ticket = await Ticket.findOne({ user: id }).lean().exec();
  if (ticket) {
    return res.status(400).json({ message: "User has assigned tickets" });
  }
  const user = await User.findById(id).exec();
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const result = await user.deleteOne();
  const reply = `Username ${user.username} with ID ${id} deleted`;
  res.json(reply);
});

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
};
