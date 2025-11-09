"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function DrugInteractionPage() {
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const rxcui = searchParams.get("rxcui");

  useEffect(() => {
    if (!rxcui) {
      setError("RxCUI parameter is required");
      setLoading(false);
      return;
    }

    const fetchInteractions = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://rxnav.nlm.nih.gov/REST/interaction/interaction.json?rxcui=${rxcui}`
        );
        const data = await res.json();

        if (data.interactionTypeGroup && data.interactionTypeGroup.length > 0) {
          const interactionList =
            data.interactionTypeGroup[0].interactionType[0].interactionPair ||
            [];
          setInteractions(interactionList);
        } else {
          setInteractions([]);
        }
      } catch (err) {
        console.error("Error fetching interactions:", err);
        setError("Failed to fetch drug interactions");
      } finally {
        setLoading(false);
      }
    };

    fetchInteractions();
  }, [rxcui]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading drug interactions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">
        Drug Interactions for RxCUI: {rxcui}
      </h1>

      {interactions.length === 0 ? (
        <div className="bg-gray-100 border-2 border-gray-300 p-6 text-center">
          <p className="text-gray-600">No interactions found for this drug.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white border-2 border-gray-900">
          <table className="min-w-full">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="px-4 py-3 border border-gray-700 text-left font-bold">
                  Drug 1
                </th>
                <th className="px-4 py-3 border border-gray-700 text-left font-bold">
                  Drug 2
                </th>
                <th className="px-4 py-3 border border-gray-700 text-left font-bold">
                  Severity
                </th>
                <th className="px-4 py-3 border border-gray-700 text-left font-bold">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {interactions.map((interaction, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="px-4 py-3 border border-gray-300">
                    {interaction.interactionConcept[0]?.minConceptItem?.name ||
                      "N/A"}
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    {interaction.interactionConcept[1]?.minConceptItem?.name ||
                      "N/A"}
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    {interaction.severity || "N/A"}
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    {interaction.description || "No description available"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6">
        <p className="text-sm text-gray-600">
          Total interactions found:{" "}
          <span className="font-bold">{interactions.length}</span>
        </p>
      </div>
    </div>
  );
}
