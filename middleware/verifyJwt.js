import jwt from "jsonwebtoken";

export const verifyJwt = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json("You are not authenticated!");
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json("Token is not valid!");

    req.username = decoded.userInfo.username;

    req.roles = decoded.userInfo.roles;

    next();
  });
};
