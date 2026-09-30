import jwt from "jsonwebtoken";
import { env } from "../config.js";
import { unauthorized, serviceUnavailable } from "../utils/errors.js";
import User from "../models/User.js";

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) {
      throw unauthorized("Authentication token is required", "TOKEN_REQUIRED");
    }

    if (!env.jwtSecret) {
      throw serviceUnavailable("Authentication service is not configured correctly.", "AUTH_SERVICE_UNAVAILABLE");
    }

    let payload;
    try {
      payload = jwt.verify(token, env.jwtSecret);
    } catch (err) {
      if (err?.name === "TokenExpiredError") {
        throw unauthorized("Your session has expired. Please log in again.", "TOKEN_EXPIRED");
      }
      throw unauthorized("Invalid or corrupted authentication token.", "INVALID_TOKEN");
    }

    const user = await User.findById(payload.sub).select("-passwordHash -resetPasswordTokenHash");
    if (!user) {
      throw unauthorized("User account no longer exists.", "USER_NOT_FOUND");
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}
