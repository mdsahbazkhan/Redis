const { Worker } = require("bullmq");
const { connection } = require("./queue");

const worker = new Worker(
  "email",
  async (job) => {
    console.log(`Processing job ${job.id} with data:`, job.name, job.data);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log(`Completed job ${job.id},${job.name},${job.data}`);
  },
  { connection },
);

worker.on("completed", (job) => {
  console.log("Job completed:", job.id, job.name, job.data);
});

worker.on("failed", (job, err) => {
  console.log("Job failed:", job.id, job.name, job.data, err);
});
