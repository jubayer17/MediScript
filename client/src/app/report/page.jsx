"use client";

import { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import { formatDateToDDMMYYYY } from "@/utils/dateFormat";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Report() {
  const { token } = useAppContext();
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const totalPrescriptions = report.reduce(
    (sum, r) => sum + parseInt(r.count || 0),
    0
  );

  const totalPages = Math.ceil(report.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = report.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    if (!token) return;

    const fetchReport = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get("/api/v1/prescriptions/report/daywise", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReport(res.data || []);
        setCurrentPage(1);
      } catch (err) {
        console.error(err);
        setError("Failed to load report");
        setReport([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [token]);

  return (
    <ProtectedRoute>
      <div className="p-3 sm:p-6 max-w-4xl mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900">
          Day-wise Prescription Report
        </h1>

        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-3 py-2 sm:px-4 sm:py-3 text-sm">
            {error}
          </div>
        )}

        <div className="mb-4 sm:mb-6 bg-white border-2 border-gray-300 p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 font-bold">
                Total Prescriptions
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                {totalPrescriptions}
              </p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600 font-bold">
                Total Days
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                {report.length}
              </p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600 font-bold">
                Average per Day
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                {report.length > 0
                  ? (totalPrescriptions / report.length).toFixed(1)
                  : "0"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-900 -mx-3 sm:mx-0">
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs sm:text-sm">
              <thead className="bg-gray-900 text-white">
                <tr>
                  <th className="px-3 py-2 sm:px-4 sm:py-3 border border-gray-700 text-left font-bold">
                    Date
                  </th>
                  <th className="px-3 py-2 sm:px-4 sm:py-3 border border-gray-700 text-left font-bold">
                    Prescription Count
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="2"
                      className="text-center py-6 sm:py-8 border border-gray-300 text-sm"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : report.length > 0 ? (
                  currentData.map((r) => (
                    <tr key={r.prescriptionDate} className="hover:bg-gray-100">
                      <td className="px-3 py-2 sm:px-4 sm:py-3 border border-gray-300">
                        {formatDateToDDMMYYYY(r.prescriptionDate)}
                      </td>
                      <td className="px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 font-bold">
                        {r.count}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="2"
                      className="text-center py-6 sm:py-8 border border-gray-300 text-gray-600 text-sm"
                    >
                      No data found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {report.length > itemsPerPage && (
          <div className="mt-4 sm:mt-6 bg-white border-2 border-gray-300 p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs sm:text-sm text-gray-600 font-bold text-center sm:text-left">
                Showing {startIndex + 1} to {Math.min(endIndex, report.length)}{" "}
                of {report.length} days
              </div>

              <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-2 py-1 sm:px-3 border-2 border-gray-300 text-gray-900 font-bold hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                >
                  Previous
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let page;
                    if (totalPages <= 5) {
                      page = i + 1;
                    } else if (currentPage <= 3) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i;
                    } else {
                      page = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`px-2 py-1 sm:px-3 border-2 font-bold text-xs sm:text-sm ${
                          currentPage === page
                            ? "bg-gray-900 text-white border-gray-900"
                            : "border-gray-300 text-gray-900 hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-2 py-1 sm:px-3 border-2 border-gray-300 text-gray-900 font-bold hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
