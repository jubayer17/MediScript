import express from "express";
import {
  getPrescriptions,
  createPrescription,
  updatePrescription,
  deletePrescription,
  getDayWiseReport,
} from "../controllers/prescriptionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getPrescriptions);
router.post("/", createPrescription);
router.put("/:id", updatePrescription);
router.delete("/:id", deletePrescription);
router.get("/report/daywise", getDayWiseReport);

export default router;
