const express = require("express");
const Redis = require("ioredis");
const app = express();
app.use(express.json());
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6380");

app.post("/user/:id/json", async (req, res) => {
  const rawData = await redis.set(
    `user:${req.params.id}:json`,
    JSON.stringify(req.body),
  );
  res.json({ savedAs: "json" });
});

app.get("/user/:id/json", async (req, res) => {
  const rawData = await redis.get(`user:${req.params.id}:json`);

  res.json({
    user: rawData ? JSON.parse(rawData) : null,
  });
});

app.post("/user/:id/hash", async (req, res) => {
  await redis.hset(`user:${req.params.id}:hash`, req.body);
  res.json({ savedAs: "hash" });
});

app.get("/user/:id/hash", async (req, res) => {
  const userData = await redis.hgetall(`user:${req.params.id}:hash`);
  res.json({ user: userData });
});

app.listen(3000, () => {
  console.log("Server is running on port http://localhost:3000");
});

// hset
// hgetall
// hget
// hdel
// hexists
