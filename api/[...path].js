// Vercel routes /api/* requests through this explicit catch-all function.
// Keep the Express router as the single source of truth for API routes and errors.
import handler from "../server.js";

export default handler;
