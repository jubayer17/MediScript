"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function PrescriptionPage() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const rxcui = searchParams.get("rxcui");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/api/v1/prescriptions"
        );
        const data = await res.json();
        setPrescriptions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Prescription List for RxCUI: {rxcui}
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Patient Name</th>
              <th className="border px-4 py-2">Age</th>
              <th className="border px-4 py-2">Gender</th>
              <th className="border px-4 py-2">Diagnosis</th>
              <th className="border px-4 py-2">Medicines</th>
              <th className="border px-4 py-2">Next Visit</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.map((p) => (
              <tr key={p.id} className="hover:bg-gray-100">
                <td className="border px-4 py-2">{p.id}</td>
                <td className="border px-4 py-2">{p.prescriptionDate}</td>
                <td className="border px-4 py-2">{p.patientName}</td>
                <td className="border px-4 py-2">{p.patientAge}</td>
                <td className="border px-4 py-2">{p.patientGender}</td>
                <td className="border px-4 py-2">{p.diagnosis}</td>
                <td className="border px-4 py-2">{p.medicines}</td>
                <td className="border px-4 py-2">{p.nextVisitDate || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
