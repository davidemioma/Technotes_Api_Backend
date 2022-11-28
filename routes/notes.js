import express from "express";
import {
  getNote,
  getAllNotes,
  createNote,
  updateNote,
  deleteNote,
} from "../controllers/notes.js";
import { verifyJwt } from "../middleware/verifyJwt.js";

const router = express.Router();

router.use(verifyJwt);

router.get("/:id", getNote);

router.get("/", getAllNotes);

router.post("/", createNote);

router.patch("/", updateNote);

router.delete("/:id", deleteNote);

export default router;
