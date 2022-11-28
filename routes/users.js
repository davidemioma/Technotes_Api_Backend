import express from "express";
import {
  getUser,
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
} from "../controllers/users.js";
import { verifyJwt } from "../middleware/verifyJwt.js";

const router = express.Router();

router.use(verifyJwt);

router.get("/:id", getUser);

router.get("/", getAllUsers);

router.post("/", createNewUser);

router.patch("/", updateUser);

router.delete("/:id", deleteUser);

export default router;
