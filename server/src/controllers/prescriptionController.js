import Prescription from "../models/Prescription.js";
import { Op } from "sequelize";

export const getPrescriptions = async (req, res) => {
  try {
    // Support flexible filtering:
    // - startDate & endDate (YYYY-MM-DD)
    // - startDate only (>=)
    // - endDate only (<=)
    // - month=YYYY-MM (compatibility)
    // - date=YYYY-MM-DD (exact match, legacy)
    const { startDate, endDate, month, date } = req.query;
    const where = { userId: req.user.id };

    if (month) {
      // month in format YYYY-MM -> filter from first to last day of month
      const [y, m] = month.split("-");
      if (y && m) {
        const year = parseInt(y, 10);
        const monthIdx = parseInt(m, 10); // 1-based
        // get last day of month: new Date(year, monthIdx, 0).getDate()
        const lastDay = new Date(year, monthIdx, 0).getDate();
        const start = `${y}-${m}-01`;
        const end = `${y}-${m}-${String(lastDay).padStart(2, "0")}`;
        where.prescriptionDate = { [Op.between]: [start, end] };
      }
    } else if (startDate && endDate) {
      where.prescriptionDate = { [Op.between]: [startDate, endDate] };
    } else if (startDate) {
      where.prescriptionDate = { [Op.gte]: startDate };
    } else if (endDate) {
      where.prescriptionDate = { [Op.lte]: endDate };
    } else if (date) {
      where.prescriptionDate = date;
    }

    const prescriptions = await Prescription.findAll({
      where,
      order: [["prescriptionDate", "DESC"]],
    });

    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createPrescription = async (req, res) => {
  const {
    prescriptionDate,
    patientName,
    patientAge,
    patientGender,
    diagnosis,
    medicines,
    nextVisitDate,
  } = req.body;

  if (!prescriptionDate || !patientName || !patientAge || !patientGender) {
    return res
      .status(400)
      .json({ message: "Please fill all required fields." });
  }

  try {
    const prescription = await Prescription.create({
      userId: req.user.id,
      prescriptionDate,
      patientName,
      patientAge,
      patientGender,
      diagnosis: diagnosis || "",
      medicines: medicines || "",
      nextVisitDate: nextVisitDate || null,
    });

    res.status(201).json(prescription);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updatePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!prescription)
      return res.status(404).json({ message: "Prescription not found" });

    const {
      prescriptionDate,
      patientName,
      patientAge,
      patientGender,
      diagnosis,
      medicines,
      nextVisitDate,
    } = req.body;

    await prescription.update({
      prescriptionDate: prescriptionDate || prescription.prescriptionDate,
      patientName: patientName || prescription.patientName,
      patientAge: patientAge || prescription.patientAge,
      patientGender: patientGender || prescription.patientGender,
      diagnosis: diagnosis !== undefined ? diagnosis : prescription.diagnosis,
      medicines: medicines !== undefined ? medicines : prescription.medicines,
      nextVisitDate:
        nextVisitDate !== undefined
          ? nextVisitDate
          : prescription.nextVisitDate,
    });

    res.json(prescription);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deletePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!prescription)
      return res.status(404).json({ message: "Prescription not found" });

    await prescription.destroy();
    res.json({ message: "Prescription deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getDayWiseReport = async (req, res) => {
  try {
    const prescriptions = await Prescription.findAll({
      where: { userId: req.user.id },
      attributes: [
        "prescriptionDate",
        [
          Prescription.sequelize.fn("COUNT", Prescription.sequelize.col("id")),
          "count",
        ],
      ],
      group: ["prescriptionDate"],
      order: [["prescriptionDate", "DESC"]],
    });

    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/v1/prescriptions
export const getAllPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.findAll({
      where: { userId: req.user.id },
      order: [["prescriptionDate", "DESC"]],
    });

    res.json(prescriptions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
