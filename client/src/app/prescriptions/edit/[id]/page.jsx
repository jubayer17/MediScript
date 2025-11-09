"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function EditPrescription() {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useAppContext();

  const [formData, setFormData] = useState({
    prescriptionDate: "",
    patientName: "",
    patientAge: "",
    patientGender: "Male",
    diagnosis: "",
    medicines: "",
    nextVisitDate: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token || !id) return;

    const fetchPrescription = async () => {
      try {
        const res = await axios.get(`/api/v1/prescriptions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const prescription = res.data.find((p) => p.id === parseInt(id));

        if (prescription) {
          setFormData({
            prescriptionDate: prescription.prescriptionDate || "",
            patientName: prescription.patientName || "",
            patientAge: prescription.patientAge || "",
            patientGender: prescription.patientGender || "Male",
            diagnosis: prescription.diagnosis || "",
            medicines: prescription.medicines || "",
            nextVisitDate: prescription.nextVisitDate || "",
          });
        } else {
          setError("Prescription not found");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load prescription");
      } finally {
        setLoading(false);
      }
    };

    fetchPrescription();
  }, [token, id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.put(`/api/v1/prescriptions/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      router.push("/prescriptions");
    } catch (err) {
      console.error(err);
      setError("Failed to update prescription");
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="p-6 max-w-2xl mx-auto">
          <p className="text-center">Loading...</p>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">
          Edit Prescription
        </h1>

        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white border-2 border-gray-300 p-6"
        >
          <div className="mb-4">
            <label className="block font-bold text-gray-900 mb-2">
              Prescription Date:
            </label>
            <input
              type="date"
              name="prescriptionDate"
              value={formData.prescriptionDate}
              onChange={handleChange}
              required
              className="w-full border-2 border-gray-300 px-3 py-2 focus:outline-none focus:border-gray-900"
            />
          </div>

          <div className="mb-4">
            <label className="block font-bold text-gray-900 mb-2">
              Patient Name:
            </label>
            <input
              type="text"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              required
              className="w-full border-2 border-gray-300 px-3 py-2 focus:outline-none focus:border-gray-900"
            />
          </div>

          <div className="mb-4">
            <label className="block font-bold text-gray-900 mb-2">Age:</label>
            <input
              type="number"
              name="patientAge"
              value={formData.patientAge}
              onChange={handleChange}
              required
              className="w-full border-2 border-gray-300 px-3 py-2 focus:outline-none focus:border-gray-900"
            />
          </div>

          <div className="mb-4">
            <label className="block font-bold text-gray-900 mb-2">
              Gender:
            </label>
            <select
              name="patientGender"
              value={formData.patientGender}
              onChange={handleChange}
              required
              className="w-full border-2 border-gray-300 px-3 py-2 focus:outline-none focus:border-gray-900"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block font-bold text-gray-900 mb-2">
              Diagnosis:
            </label>
            <textarea
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              rows="3"
              className="w-full border-2 border-gray-300 px-3 py-2 focus:outline-none focus:border-gray-900"
            />
          </div>

          <div className="mb-4">
            <label className="block font-bold text-gray-900 mb-2">
              Medicines:
            </label>
            <textarea
              name="medicines"
              value={formData.medicines}
              onChange={handleChange}
              rows="3"
              className="w-full border-2 border-gray-300 px-3 py-2 focus:outline-none focus:border-gray-900"
            />
          </div>

          <div className="mb-6">
            <label className="block font-bold text-gray-900 mb-2">
              Next Visit Date:
            </label>
            <input
              type="date"
              name="nextVisitDate"
              value={formData.nextVisitDate}
              onChange={handleChange}
              className="w-full border-2 border-gray-300 px-3 py-2 focus:outline-none focus:border-gray-900"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="px-6 py-2 bg-gray-900 text-white font-bold hover:bg-gray-700 border-2 border-gray-900"
            >
              Update
            </button>
            <button
              type="button"
              onClick={() => router.push("/prescriptions")}
              className="px-6 py-2 border-2 border-gray-300 text-gray-900 font-bold hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  );
}
