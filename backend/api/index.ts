import express from "express";
import serverless from "serverless-http";

const app = express();

app.get("/", (_, res) => {
  res.send("Express backend deployed via Vercel + pnpm!");
});

app.get("/api/hello", (_, res) => {
  res.json({ message: "Hello from Express on Vercel!" });
});

export const handler = serverless(app);
