import sharedHandler from "../server.js";

export default function apiHandler(req, res) {
  const requestUrl = new URL(req.url || "/api/handler", "http://vercel.local");
  const routedPath = requestUrl.searchParams.get("__cfo_path");

  // The route is added by vercel.json. Convert it back to the /api/... URL
  // that the existing Express router expects, preserving normal query params.
  if (routedPath !== null) {
    requestUrl.searchParams.delete("__cfo_path");
    const apiPath = routedPath.replace(/^\/+|\/+$/g, "");

    if (!apiPath || apiPath.split("/").some(segment => segment === "." || segment === "..")) {
      return res.status(400).json({
        error: { code: "INVALID_API_ROUTE", message: "Invalid API route." }
      });
    }

    req.url = "/api/" + apiPath + (requestUrl.search ? requestUrl.search : "");
  }

  return sharedHandler(req, res);
}
