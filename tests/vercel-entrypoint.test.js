import assert from "node:assert/strict";
import test from "node:test";

test("shared Vercel handler exports a request handler", async () => {
  const module = await import("../server.js");
  assert.equal(typeof module.default, "function");
});

test("Vercel API catch-all exports the shared request handler", async () => {
  const module = await import("../api/[...path].js");
  assert.equal(typeof module.default, "function");
});
