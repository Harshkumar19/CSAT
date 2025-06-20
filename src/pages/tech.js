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
          const processedData = response.data.map((item) => ({
            ...item,
            rating: parseFloat(item.Rating) || 0,
            dateObj: parseDate(item.Date),
          }));
          setData(processedData);
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

  const parseDate = (dateString) => {
    if (!dateString) return null;
    const parts = dateString.split(", ")[0].split("/");
    if (parts.length !== 3) return null;
    return new Date(parts[2], parts[0] - 1, parts[1]);
  };

  return (
    <div
      className={`min-h-screen transition-all duration-700 ${
        darkMode ? "bg-[#111827]" : "bg-[#FAFAFA]"
      }`}
    >
      {/* Header */}
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
                  Detailed view of technical support satisfaction scores
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
                    <th
                      className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        darkMode ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      Customer
                    </th>
                    <th
                      className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        darkMode ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      Rating
                    </th>
                    <th
                      className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        darkMode ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody
                  className={`divide-y ${
                    darkMode ? "divide-gray-600" : "divide-gray-200"
                  }`}
                >
                  {data.map((item, index) => (
                    <tr
                      key={index}
                      className={`transition-colors duration-700 ${
                        darkMode ? "hover:bg-[#4B5563]" : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              darkMode ? "bg-[#374151]" : "bg-gray-100"
                            }`}
                          >
                            <span
                              className={`text-sm font-medium ${
                                darkMode ? "text-gray-300" : "text-gray-600"
                              }`}
                            >
                              {item.Name
                                ? item.Name.charAt(0).toUpperCase()
                                : "N"}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div
                              className={`text-sm font-medium ${
                                darkMode ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {item.Name}
                            </div>
                            <div
                              className={`text-sm ${
                                darkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {item.Number}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span
                            className={`text-sm font-medium mr-2 ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {item.Rating}
                          </span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= item.rating
                                    ? "text-yellow-400"
                                    : darkMode
                                    ? "text-gray-600"
                                    : "text-gray-300"
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {item.Date}
                      </td>
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
