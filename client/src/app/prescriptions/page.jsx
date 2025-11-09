"use client";

import { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import { formatDateToDDMMYYYY } from "@/utils/dateFormat";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Prescriptions() {
  const router = useRouter();
  const { token, prescriptions, setPrescriptions, loading, setLoading } =
    useAppContext();

  const formatDate = (d) => d.toISOString().slice(0, 10);
  const today = new Date();
  const defaultEnd = formatDate(today);
  const defaultStartDate = new Date(today);
  defaultStartDate.setDate(defaultStartDate.getDate() - 30);
  const defaultStart = formatDate(defaultStartDate);

  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);

  useEffect(() => {
    if (!token) return;

    const fetchPrescriptions = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);

        const res = await axios.get(
          `/api/v1/prescriptions?${params.toString()}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPrescriptions(res.data || []);
      } catch (err) {
        console.error(err);
        setPrescriptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, [token, startDate, endDate, setPrescriptions, setLoading]);

  const handleEdit = (id) => {
    window.location.href = `/prescriptions/edit/${id}`;
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this prescription?")) return;

    try {
      await axios.delete(`/api/v1/prescriptions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPrescriptions(prescriptions.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete prescription");
    }
  };

  return (
    <ProtectedRoute>
      <div className="p-3 sm:p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Prescriptions
          </h1>
        </div>

        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 bg-white border-2 border-gray-300 p-3 sm:p-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full sm:w-auto border-2 border-gray-300 px-2 py-2 sm:px-3 text-sm focus:outline-none focus:border-gray-900"
          />
          <span className="text-gray-700 font-bold text-center sm:text-left text-sm">
            to
          </span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full sm:w-auto border-2 border-gray-300 px-2 py-2 sm:px-3 text-sm focus:outline-none focus:border-gray-900"
          />
          <button
            onClick={() => {
              setStartDate(startDate);
              setEndDate(endDate);
            }}
            className="w-full sm:w-auto sm:ml-4 px-3 py-2 border-2 border-gray-900 text-gray-900 text-sm font-bold"
          >
            Apply
          </button>
        </div>

        <div className="overflow-x-auto bg-white border-2 border-gray-900 ">
          <table className="min-w-full text-xs sm:text-sm">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="px-2 py-2 sm:px-4 sm:py-3 border border-gray-700 text-left font-bold">
                  Date
                </th>
                <th className="px-2 py-2 sm:px-4 sm:py-3 border border-gray-700 text-left font-bold">
                  Patient
                </th>
                <th className="px-2 py-2 sm:px-4 sm:py-3 border border-gray-700 text-left font-bold hidden sm:table-cell">
                  Age
                </th>
                <th className="px-2 py-2 sm:px-4 sm:py-3 border border-gray-700 text-left font-bold hidden md:table-cell">
                  Gender
                </th>
                <th className="px-2 py-2 sm:px-4 sm:py-3 border border-gray-700 text-left font-bold hidden lg:table-cell">
                  Diagnosis
                </th>
                <th className="px-2 py-2 sm:px-4 sm:py-3 border border-gray-700 text-left font-bold hidden lg:table-cell">
                  Medicines
                </th>
                <th className="px-2 py-2 sm:px-4 sm:py-3 border border-gray-700 text-left font-bold hidden md:table-cell">
                  Next Visit
                </th>
                <th className="px-2 py-2 sm:px-4 sm:py-3 border border-gray-700 text-left font-bold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center py-6 sm:py-8 border border-gray-300 text-sm"
                  >
                    Loading...
                  </td>
                </tr>
              ) : prescriptions.length > 0 ? (
                prescriptions.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-100">
                    <td className="px-2 py-2 sm:px-4 sm:py-3 border border-gray-300">
                      {formatDateToDDMMYYYY(p.prescriptionDate)}
                    </td>
                    <td className="px-2 py-2 sm:px-4 sm:py-3 border border-gray-300">
                      {p.patientName}
                    </td>
                    <td className="px-2 py-2 sm:px-4 sm:py-3 border border-gray-300 hidden sm:table-cell">
                      {p.patientAge}
                    </td>
                    <td className="px-2 py-2 sm:px-4 sm:py-3 border border-gray-300 hidden md:table-cell">
                      {p.patientGender}
                    </td>
                    <td className="px-2 py-2 sm:px-4 sm:py-3 border border-gray-300 hidden lg:table-cell">
                      {p.diagnosis}
                    </td>
                    <td className="px-2 py-2 sm:px-4 sm:py-3 border border-gray-300 hidden lg:table-cell">
                      {p.medicines}
                    </td>
                    <td className="px-2 py-2 sm:px-4 sm:py-3 border border-gray-300 hidden md:table-cell">
                      {p.nextVisitDate
                        ? formatDateToDDMMYYYY(p.nextVisitDate)
                        : "-"}
                    </td>
                    <td className="px-2 py-2 sm:px-4 sm:py-3 border border-gray-300">
                      <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                        <button
                          onClick={() => handleEdit(p.id)}
                          className="px-2 py-1 sm:px-3 border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white font-bold text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="px-2 py-1 sm:px-3 border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-bold text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center py-6 sm:py-8 border border-gray-300 text-gray-600 text-sm"
                  >
                    No prescriptions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ProtectedRoute>
  );
}
