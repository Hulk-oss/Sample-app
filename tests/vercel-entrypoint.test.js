import assert from "node:assert/strict";
import test from "node:test";

test("Vercel entrypoint exports a request handler", async () => {
  const module = await import("../server.js");
  assert.equal(typeof module.default, "function");
});
