import mongoose from "mongoose";
import { env } from "./config.js";
import app from "./app.js";

mongoose.connect(env.mongoUri)
  .then(() => {
    app.listen(env.port, () => {
      console.log("Freelancer CFO API listening on http://localhost:" + env.port);
    });
  })
  .catch(err => {
    console.error("MongoDB connection failed", err);
    process.exit(1);
  });

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});
