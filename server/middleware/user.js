import { unauthorized } from "../utils/errors.js";

export function requireUserPortal(req, res, next) {
  if (req.user.role !== "user") {
    return next(unauthorized("User finance access required"));
  }
  next();
}
