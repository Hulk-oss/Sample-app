export class AppError extends Error {
  constructor(status, code, message, details = undefined) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export const notFound = (message = "Resource not found", code = "NOT_FOUND") =>
  new AppError(404, code, message);

export const validation = (message = "Validation failed", details = undefined) =>
  new AppError(400, "VALIDATION_ERROR", message, details);

export const unauthorized = (message = "Authentication required", code = "UNAUTHORIZED", details = undefined) =>
  new AppError(401, code, message, details);

export const forbidden = (message = "Access denied", code = "FORBIDDEN", details = undefined) =>
  new AppError(403, code, message, details);

export const conflict = (message = "Resource already exists", code = "CONFLICT", details = undefined) =>
  new AppError(409, code, message, details);

export const tooManyRequests = (message = "Too many requests. Please try again later.", code = "TOO_MANY_REQUESTS", details = undefined) =>
  new AppError(429, code, message, details);

export const serviceUnavailable = (message = "Service temporarily unavailable", code = "SERVICE_UNAVAILABLE", details = undefined) =>
  new AppError(503, code, message, details);

