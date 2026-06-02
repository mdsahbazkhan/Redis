const express = require("express");
const Redis = require("ioredis");

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6380");

function otpKey(phone) {
  return `otp:${phone}`;
}

app.post("/otp", async (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ error: "Phone number is required" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await redis.set(otpKey(phone), otp, "EX", 30); // OTP valid for 30 seconds

  res.json({ message: "OTP sent", otp }); // In production, you would send the OTP via SMS
});

app.post("/otp/verify", async (req, res) => {
  const { phone, otp } = req.body;
  const storedOtp = await redis.get(otpKey(phone));
  if (!storedOtp) {
    return res.status(400).json({ error: "OTP expired or not found" });
  }
  if (storedOtp !== otp) {
    return res.status(400).json({ error: "Invalid OTP" });
  }
  // User is verified, delete the OTP from Redis
  await redis.del(otpKey(phone));
  res.json({ message: "OTP verified successfully" });
});

app.get("/otp/:phone/ttl", async (req, res) => {
  const { phone } = req.params;
  const ttl = await redis.ttl(otpKey(phone));
  res.json({ ttl });
});

app.listen(3000, () => {
  console.log("Server is running on port http://localhost:3000");
});
