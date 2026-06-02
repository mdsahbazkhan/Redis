const express = require("express");
const { emailQueue } = require("./queue");
const app = express();

app.use(express.json());
app.post("/welcome-email", async (req, res) => {
  const job = emailQueue.add(
    "send-welcome-email",
    {
      to: req.body.to,
      name: req.body.name || "User",
      subject: "Welcome to our platform",
      body: `Hello ${req.body.name || "User"}, welcome to our platform! We're glad to have you here.`,
    },
    {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 5000,
      },
    },
  );
  res
    .status(200)
    .json({ message: "Welcome email job added to the queue", jobId: job.id });
});

app.listen(3000, () => {
  console.log("Server is running on port http://localhost:3000");
});
