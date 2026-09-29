import jwt from "jsonwebtoken";
import { env } from "../config.js";
import { unauthorized } from "../utils/errors.js";
import User from "../models/User.js";

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) throw unauthorized();
    const payload = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(payload.sub).select("-passwordHash -resetPasswordTokenHash");
    if (!user) throw unauthorized("User no longer exists");
    req.user = user;
    next();
  } catch (err) {
    if (err?.name === "JsonWebTokenError" || err?.name === "TokenExpiredError") return next(unauthorized("Invalid or expired token"));
    next(err);
  }
}
