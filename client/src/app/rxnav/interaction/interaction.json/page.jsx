"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { formatDateToDDMMYYYY } from "@/utils/dateFormat";

export default function PrescriptionDataPage() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const rxcui = searchParams.get("rxcui");

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "http://localhost:3000/api/v1/prescriptions"
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setPrescriptions(data);
      } catch (err) {
        console.error("Error fetching prescriptions:", err);
        setError("Failed to fetch prescriptions. Make sure you are logged in.");
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, [rxcui]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <p className="text-gray-600 text-sm sm:text-base">
          Loading prescriptions...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3 sm:p-6 max-w-7xl mx-auto">
        <div className="bg-red-100 border-2 border-red-400 text-red-700 px-3 py-2 sm:px-4 sm:py-3 text-sm">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900">
        All Prescriptions {rxcui && `(RxCUI: ${rxcui})`}
      </h1>

      {prescriptions.length === 0 ? (
        <div className="bg-gray-100 border-2 border-gray-300 p-4 sm:p-6 text-center">
          <p className="text-gray-600 text-sm sm:text-base">
            No prescriptions found.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white border-2 border-gray-900 -mx-3 sm:mx-0">
          <table className="min-w-full text-xs sm:text-sm">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="px-2 py-2 sm:px-4 sm:py-3 border border-gray-700 text-left font-bold">
                  ID
                </th>
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
              </tr>
            </thead>
            <tbody>
              {prescriptions.map((prescription) => (
                <tr key={prescription.id} className="hover:bg-gray-100">
                  <td className="px-2 py-2 sm:px-4 sm:py-3 border border-gray-300">
                    {prescription.id}
                  </td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3 border border-gray-300">
                    {formatDateToDDMMYYYY(prescription.prescriptionDate)}
                  </td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3 border border-gray-300">
                    {prescription.patientName}
                  </td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3 border border-gray-300 hidden sm:table-cell">
                    {prescription.patientAge}
                  </td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3 border border-gray-300 hidden md:table-cell">
                    {prescription.patientGender}
                  </td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3 border border-gray-300 hidden lg:table-cell">
                    {prescription.diagnosis}
                  </td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3 border border-gray-300 hidden lg:table-cell">
                    {prescription.medicines}
                  </td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3 border border-gray-300 hidden md:table-cell">
                    {prescription.nextVisitDate
                      ? formatDateToDDMMYYYY(prescription.nextVisitDate)
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 sm:mt-6">
        <p className="text-xs sm:text-sm text-gray-600">
          Total prescriptions:{" "}
          <span className="font-bold">{prescriptions.length}</span>
        </p>
      </div>
    </div>
  );
}
