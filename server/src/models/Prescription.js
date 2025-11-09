import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js"; // link to user

const Prescription = sequelize.define("Prescription", {
  prescriptionDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  patientName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  patientAge: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  patientGender: {
    type: DataTypes.ENUM("Male", "Female", "Other"),
    allowNull: false,
  },
  diagnosis: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  medicines: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  nextVisitDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
});

// Relation: a prescription belongs to a user
Prescription.belongsTo(User, { foreignKey: "userId" });

export default Prescription;
