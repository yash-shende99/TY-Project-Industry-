import express from 'express';
import { getAnalysisData } from '../controllers/AnalysisController.js';
import ensureAutheticate from '../Middleware/auth.js';

const router = express.Router();

router.get('/data', ensureAutheticate, getAnalysisData);

export default router;
