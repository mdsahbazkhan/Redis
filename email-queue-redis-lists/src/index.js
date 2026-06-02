const express = require("express");
const Redis = require("ioredis");
const app = express();
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6380");

const QUEUE_KEY = "queue:emails";
app.use(express.json());
app.post("/emails", async (req, res) => {
  const job = {
    to: req.body.to,
    subject: req.body.subject || "No subject",
    body: req.body.body || "No body",
    createdAt: new Date().toISOString(),
  };
  await redis.lpush(QUEUE_KEY, JSON.stringify(job));
  res.json({ status: "queued", job });
});

app.get("/emails/process-one", async (req, res) => {
  const rawJob = await redis.rpop(QUEUE_KEY);
  if (!rawJob) {
    return res.json({ status: "no jobs in queue" });
  }
  const job = JSON.parse(rawJob);
  // Simulate email sending
  console.log(`Sending email to ${job.to} with subject "${job.subject}"`);
  res.json({ message: "Email Sent", job });
});

app.listen(3000, () => {
  console.log("Server is running on port http://localhost:3000");
});

// Job loss
// retry problem
// parallel worker
