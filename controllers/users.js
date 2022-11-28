import User from "../models/User.js";
import Note from "../models/Note.js";
import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler";

//Get user by id
export const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id).select("-password");

  if (!user) return res.status(400).json("User not found!");

  res.status(200).json(user);
});

//Get all users
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");

  if (!users?.length) return res.status(400).json("No users found!");

  res.status(200).json(users);
});

//Create a user
export const createNewUser = asyncHandler(async (req, res) => {
  const { username, password, roles } = req.body;

  if (!username || !password)
    return res.status(400).json("Username and password required");

  const duplicate = await User.findOne({ username })
    .collation({ locale: "en", strength: 2 })
    .exec();

  if (duplicate) return res.status(409).json("Username already exists");

  const hashedPwd = await bcrypt.hash(password, 10);

  const newUser =
    Array.isArray(roles) && roles.length
      ? {
          username,
          password: hashedPwd,
          roles,
        }
      : {
          username,
          password: hashedPwd,
        };

  await User.create(newUser);

  res.status(201).json(`New user ${username} created!`);
});

//Update a user
export const updateUser = asyncHandler(async (req, res) => {
  const { id, username, roles, active, password } = req.body;

  if (
    !id ||
    !username ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== "boolean"
  )
    return res.status(400).json("All fields except password are required");

  const user = await User.findById(id);

  if (!user) return res.status(404).json("User does not exists");

  //check for duplicate
  const duplicate = await User.findOne({ username })
    .collation({ locale: "en", strength: 2 })
    .exec();

  if (duplicate && duplicate._id.toString() !== id)
    return res.status(409).json("Username already exists");

  user.username = username;

  user.roles = roles;

  user.active = active;

  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await user.save();

  res.status(200).json(`${updatedUser.username} Updated!`);
});

//Delete a user
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json("User Id is required");

  const user = await User.findById(id);

  if (!user) return res.status(404).json("User does not exists");

  const note = await Note.findOne({ user: id }).exec();

  if (note) return res.status(400).json("User has an assigned note");

  await User.findByIdAndDelete(id);

  res.status(200).json(`User ${user.username} with ID ${id} has been deleted!`);
});
