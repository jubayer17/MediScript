import express from "express";
import {
  getPrescriptions,
  createPrescription,
  updatePrescription,
  deletePrescription,
  getDayWiseReport,
  getAllPrescriptions,
} from "../controllers/prescriptionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// all routes are protected
router.use(protect);

router.get("/", getPrescriptions); // list prescriptions (date filter optional)
router.post("/", createPrescription); // create new
router.put("/:id", updatePrescription); // update
router.delete("/:id", deletePrescription); // delete
router.get("/report/daywise", getDayWiseReport); // day-wise count
router.get("/all", getAllPrescriptions);
export default router;
