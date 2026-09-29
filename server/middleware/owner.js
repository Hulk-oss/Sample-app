import { unauthorized } from "../utils/errors.js";

export function requirePlatformOwner(req, res, next) {
  try {
    if (req.user.role !== "platform_owner") {
      throw unauthorized("Platform owner access required");
    }
    next();
  } catch (error) {
    next(error);
  }
}
