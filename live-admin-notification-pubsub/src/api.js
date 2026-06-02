const express = require("express");
const Redis = require("ioredis");

const app = express();
const publisher = new Redis(process.env.REDIS_URL || "redis://localhost:6380");

app.use(express.json());

app.post("/notifications",async (req, res) => {
    const payload={
        title:req.body.title||"Default Title",
        createdAt:new Date().toISOString()

    }
    const receivers=await publisher.publish("notifications", JSON.stringify(payload));
    res.json({message:"Notification sent to "+receivers+" subscribers",payload});
});


app.listen(3000, () => {
  console.log("API server is running on port http://localhost:3000");
});