import { Router } from "express";
import { aiController } from "../controllers/ai.controller";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.post("/parse-job", requireAuth, aiController.parseJob);

export default router;
