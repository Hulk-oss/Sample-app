import { forbidden } from "../utils/errors.js";

export function requireUserPortal(req, res, next) {
  if (req.user.role !== "user") {
    return next(forbidden("User finance access required", "FORBIDDEN"));
  }
  next();
}
