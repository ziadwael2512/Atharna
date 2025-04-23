// src/routes/feed.routes.ts

import express from "express";
import { getFeed } from "../controllers/feed.controller";

const router = express.Router();

router.get("/feed", getFeed); // GET /api/feed

export default router;
