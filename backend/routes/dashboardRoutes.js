import express from "express";
import ensureAuthenticate from "../Middleware/auth.js";
import { getDashboardStats } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/stats", ensureAuthenticate, getDashboardStats);

export default router;
