const { Queue } = require("bullmq");

const connection = {
  host: "localhost",
  port: 6380,
};
const emailQueue = new Queue("email", { connection });

module.exports = { emailQueue, connection };
