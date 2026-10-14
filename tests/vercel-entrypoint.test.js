import assert from "node:assert/strict";
import test from "node:test";

test("shared Vercel handler exports a request handler", async () => {
  const module = await import("../server.js");
  assert.equal(typeof module.default, "function");
});

test("Vercel API handler exports a request handler", async () => {
  const module = await import("../api/handler.js");
  assert.equal(typeof module.default, "function");
});
