import Note from "../models/Note.js";
import User from "../models/User.js";
import asyncHandler from "express-async-handler";

//Get note by id
export const getNote = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const note = await Note.findById(id);

  if (!note) return res.status(400).json("Note not found!");

  res.status(200).json(note);
});

//Get all notes
export const getAllNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find().lean();

  if (!notes?.length) return res.status(400).json("No notes found!");

  const notesWithUser = await Promise.all(
    notes.map(async (note) => {
      const user = await User.findById(note.user);

      return { ...note, username: user.username };
    })
  );

  res.status(200).json(notesWithUser);
});

//Create notes
export const createNote = asyncHandler(async (req, res) => {
  const { user, title, text } = req.body;

  if (!user || !title || !text)
    return res.status(400).json("User, title and text required");

  const duplicate = await Note.findOne({ title })
    .collation({ locale: "en", strength: 2 })
    .exec();

  if (duplicate) return res.status(409).json("Note already exists");

  await Note.create({ user, title, text });

  res.status(201).json(`New note created!`);
});

//Update notes
export const updateNote = asyncHandler(async (req, res) => {
  const { id, user, title, text, completed } = req.body;

  if (!id || !user || !title || !text || typeof completed !== "boolean")
    return res.status(400).json({ message: "All fields are required" });

  const note = await Note.findById(id);

  if (!note) return res.status(404).json("Note does not exists");

  //check for duplicate
  const duplicate = await Note.findOne({ title })
    .collation({ locale: "en", strength: 2 })
    .exec();

  if (duplicate && duplicate._id.toString() !== id)
    return res.status(409).json("Note already exists");

  note.user = user;

  note.title = title;

  note.text = text;

  note.completed = completed;

  const updatedNote = await note.save();

  res.status(200).json(`${updatedNote.title} Updated!`);
});

//Delete notes
export const deleteNote = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json("Note Id is required");

  const note = await Note.findById(id);

  if (!note) return res.status(404).json("Note does not exists");

  await Note.findByIdAndDelete(id);

  res.status(200).json(`Note ${note.title} with ID ${id} has been deleted!`);
});
