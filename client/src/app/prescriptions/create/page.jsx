"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function CreatePrescription() {
  const router = useRouter();
  const { createPrescription, loading } = useAppContext();

  const [formData, setFormData] = useState({
    prescriptionDate: new Date().toISOString().slice(0, 10),
    patientName: "",
    patientAge: "",
    patientGender: "",
    diagnosis: "",
    medicines: "",
    nextVisitDate: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.prescriptionDate ||
      !formData.patientName ||
      !formData.patientAge ||
      !formData.patientGender
    ) {
      setError("Please fill all required fields (Date, Name, Age, Gender)");
      return;
    }

    const result = await createPrescription(formData);

    if (result.success) {
      router.push("/prescriptions");
    } else {
      setError(result.message);
    }
  };

  return (
    <ProtectedRoute>
      <div className="p-3 sm:p-6 max-w-6xl mx-auto">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Create New Prescription
          </h1>
        </div>

        <div className="bg-white border-2 border-gray-900 p-4 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {error && (
              <div className="bg-red-100 border-2 border-red-400 text-red-700 px-3 py-2 sm:px-4 sm:py-3 text-sm">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="prescriptionDate"
                className="block text-xs sm:text-sm font-bold text-gray-900 mb-2"
              >
                Prescription Date: <span className="text-red-600">*</span>
              </label>
              <input
                id="prescriptionDate"
                name="prescriptionDate"
                type="date"
                value={formData.prescriptionDate}
                onChange={handleChange}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-300 focus:outline-none focus:border-gray-900 text-sm sm:text-base"
                required
              />
            </div>

            <div>
              <label
                htmlFor="patientName"
                className="block text-xs sm:text-sm font-bold text-gray-900 mb-2"
              >
                Patient Name: <span className="text-red-600">*</span>
              </label>
              <input
                id="patientName"
                name="patientName"
                type="text"
                placeholder="Enter patient name"
                value={formData.patientName}
                onChange={handleChange}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-300 focus:outline-none focus:border-gray-900 text-sm sm:text-base"
                required
              />
            </div>

            <div>
              <label
                htmlFor="patientAge"
                className="block text-xs sm:text-sm font-bold text-gray-900 mb-2"
              >
                Patient Age: <span className="text-red-600">*</span>
              </label>
              <input
                id="patientAge"
                name="patientAge"
                type="number"
                placeholder="Enter age"
                value={formData.patientAge}
                onChange={handleChange}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-300 focus:outline-none focus:border-gray-900 text-sm sm:text-base"
                required
                min="0"
              />
            </div>

            <div>
              <label
                htmlFor="patientGender"
                className="block text-xs sm:text-sm font-bold text-gray-900 mb-2"
              >
                Patient Gender: <span className="text-red-600">*</span>
              </label>
              <select
                id="patientGender"
                name="patientGender"
                value={formData.patientGender}
                onChange={handleChange}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-300 focus:outline-none focus:border-gray-900 text-sm sm:text-base"
                required
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="diagnosis"
                className="block text-xs sm:text-sm font-bold text-gray-900 mb-2"
              >
                Diagnosis:
              </label>
              <textarea
                id="diagnosis"
                name="diagnosis"
                placeholder="Enter diagnosis"
                value={formData.diagnosis}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-300 focus:outline-none focus:border-gray-900 text-sm sm:text-base"
              />
            </div>

            <div>
              <label
                htmlFor="medicines"
                className="block text-xs sm:text-sm font-bold text-gray-900 mb-2"
              >
                Medicines:
              </label>
              <textarea
                id="medicines"
                name="medicines"
                placeholder="Enter prescribed medicines"
                value={formData.medicines}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-300 focus:outline-none focus:border-gray-900 text-sm sm:text-base"
              />
            </div>

            <div>
              <label
                htmlFor="nextVisitDate"
                className="block text-xs sm:text-sm font-bold text-gray-900 mb-2"
              >
                Next Visit Date:
              </label>
              <input
                id="nextVisitDate"
                name="nextVisitDate"
                type="date"
                value={formData.nextVisitDate}
                onChange={handleChange}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-300 focus:outline-none focus:border-gray-900 text-sm sm:text-base"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:flex-1 bg-gray-900 text-white py-2 sm:py-3 font-bold hover:bg-gray-700 focus:outline-none border-2 border-gray-900 disabled:bg-gray-500 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {loading ? "Creating..." : "Create Prescription"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/prescriptions")}
                className="w-full sm:flex-1 bg-white text-gray-900 py-2 sm:py-3 font-bold hover:bg-gray-100 border-2 border-gray-900 text-sm sm:text-base"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
