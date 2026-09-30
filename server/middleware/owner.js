import { forbidden } from "../utils/errors.js";

export function requirePlatformOwner(req, res, next) {
  try {
    if (req.user.role !== "platform_owner") {
      throw forbidden("Platform owner access required", "FORBIDDEN");
    }
    next();
  } catch (error) {
    next(error);
  }
}
