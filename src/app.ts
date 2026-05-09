import express from "express";
import dotenv from "dotenv";
import { mpesaWebhookHandler } from "./webhooks/mpesa";
import { mtnWebhookHandler } from "./webhooks/mtn";
import { airtelWebhookHandler } from "./webhooks/airtel";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.post("/webhooks/mpesa", mpesaWebhookHandler);
app.post("/webhooks/mtn", mtnWebhookHandler);
app.post("/webhooks/airtel", airtelWebhookHandler);

export default app;
