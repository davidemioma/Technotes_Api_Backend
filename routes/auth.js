import express from "express";
import { signIn, refreshToken, logout } from "../controllers/auth.js";
import { loginLimiter } from "../middleware/loginlimitter.js";

const router = express.Router();

router.post("/signin", loginLimiter, signIn);

router.get("/refresh", refreshToken);

router.get("/logout", logout);

export default router;
