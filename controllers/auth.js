import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "express-async-handler";

//Signing In
export const signIn = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: "Username and password required" });
  }

  const user = await User.findOne({ username }).exec();

  if (!user || !user.active) return res.status(401).json("Unauthorized");

  const pwdMatched = await bcrypt.compare(password, user.password);

  if (!pwdMatched) return res.status(401).json("Wrong password");

  const accessToken = jwt.sign(
    {
      userInfo: {
        username: user.username,
        roles: user.roles,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { username: user.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    sameSite: "None",
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, //Must match the refresh token,
  });

  res
    .status(200)
    .json({ accessToken, username: user.username, roles: user.roles });
});

//Refresh Token
export const refreshToken = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.status(401).json("You are not authenticated!");

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    asyncHandler(async (err, decoded) => {
      if (err) return res.status(403).json("Token is not valid!");

      const user = await User.findOne({ username: decoded.username }).exec();

      if (!user) return res.status(401).json("Unauthorized");

      const accessToken = jwt.sign(
        {
          userInfo: {
            username: user.username,
            roles: user.roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      res
        .status(200)
        .json({ accessToken, username: user.username, roles: user.roles });
    })
  );
};

//Logout
export const logout = asyncHandler(async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(204);

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });

  res.status(200).json("Cookie cleared");
});
