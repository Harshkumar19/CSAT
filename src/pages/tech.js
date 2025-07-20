import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function TechPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/proxy?sheet=TECH");
        if (response.data && Array.isArray(response.data)) {
          setData(response.data);
        }
      } catch (err) {
        console.error("Error fetching tech data:", err);
        setError("Failed to fetch tech data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Get all unique column headers from the data
  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <div
      className={`min-h-screen transition-all duration-700 ${
        darkMode ? "bg-[#111827]" : "bg-[#FAFAFA]"
      }`}
    >
      <div
        className={`backdrop-blur-xl bg-opacity-70 sticky top-0 z-50 transition-all duration-700 ${
          darkMode ? "bg-[#1F2937]/30" : "bg-white/30"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <button
                onClick={() => router.push("/")}
                className={`mr-4 p-2 rounded-full transition-all duration-700 ${
                  darkMode
                    ? "bg-[#374151] text-gray-200 hover:bg-[#4B5563]"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </button>
              <div>
                <h1
                  className={`text-4xl font-bold ${
                    darkMode ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  Tech Ratings
                </h1>
                <p className="text-sm mt-1 font-medium text-gray-500">
                  Detailed view of tech satisfaction scores
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative w-16 h-16">
              <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-gray-200 animate-ping"></div>
              <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
            </div>
          </div>
        ) : error ? (
          <div
            className={`border rounded-2xl p-6 backdrop-blur-xl transition-all duration-700 ${
              darkMode
                ? "bg-red-900/20 border-red-700/30 text-red-300"
                : "bg-red-50/50 border-red-200/50 text-red-700"
            }`}
          >
            {error}
          </div>
        ) : (
          <div
            className={`rounded-2xl overflow-hidden backdrop-blur-xl transition-all duration-700 ${
              darkMode
                ? "bg-[#1F2937] border border-[#374151]"
                : "bg-white border border-gray-100"
            }`}
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead
                  className={`transition-colors duration-700 ${
                    darkMode ? "bg-[#374151]" : "bg-gray-50"
                  }`}
                >
                  <tr>
                    {columns.map((col) => (
                      <th
                        key={col}
                        className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                          darkMode ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody
                  className={`divide-y ${
                    darkMode ? "divide-gray-600" : "divide-gray-200"
                  }`}
                >
                  {data.map((row, idx) => (
                    <tr
                      key={idx}
                      className={`transition-colors duration-700 ${
                        darkMode ? "hover:bg-[#4B5563]" : "hover:bg-gray-50"
                      }`}
                    >
                      {columns.map((col) => (
                        <td
                          key={col}
                          className={`px-6 py-4 whitespace-nowrap text-sm ${
                            darkMode ? "text-gray-300" : "text-gray-900"
                          }`}
                        >
                          {row[col]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
