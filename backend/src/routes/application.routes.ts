import { Router } from "express";
import { applicationController } from "../controllers/application.controller";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth);

router.get("/", applicationController.list);
router.get("/:id", applicationController.getById);
router.post("/", applicationController.create);
router.put("/:id", applicationController.update);
router.patch("/:id/status", applicationController.updateStatus);
router.delete("/:id", applicationController.remove);

export default router;
