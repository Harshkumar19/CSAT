import { useState, useEffect } from "react";
import axios from "axios";

// Configuration: Set to true to use mock data, false to use Google Sheets
const USE_MOCK_DATA = true; // Change to true to use mock data

// Mock data for testing
const MOCK_DATA = [
  {
    Name: "John Smith",
    Number: "+1234567890",
    Brand: "TechCorp",
    Tech: "4",
    "Media ": "5",
    "Solutions ": "4",
    Date: "12/15/2023, 10:30 AM",
    dateObj: new Date(2023, 11, 15),
    month: 12,
    year: 2023,
    mediaScore: 5,
    solutionsScore: 4,
    techScore: 4,
  },
  {
    Name: "Sarah Johnson",
    Number: "+1234567891",
    Brand: "InnovateInc",
    Tech: "3",
    "Media ": "4",
    "Solutions ": "5",
    Date: "12/14/2023, 2:15 PM",
    dateObj: new Date(2023, 11, 14),
    month: 12,
    year: 2023,
    mediaScore: 4,
    solutionsScore: 5,
    techScore: 3,
  },
  {
    Name: "Mike Davis",
    Number: "+1234567892",
    Brand: "TechCorp",
    Tech: "5",
    "Media ": "3",
    "Solutions ": "4",
    Date: "12/13/2023, 9:45 AM",
    dateObj: new Date(2023, 11, 13),
    month: 12,
    year: 2023,
    mediaScore: 3,
    solutionsScore: 4,
    techScore: 5,
  },
  {
    Name: "Emily Wilson",
    Number: "+1234567893",
    Brand: "GlobalTech",
    Tech: "2",
    "Media ": "4",
    "Solutions ": "3",
    Date: "12/12/2023, 4:20 PM",
    dateObj: new Date(2023, 11, 12),
    month: 12,
    year: 2023,
    mediaScore: 4,
    solutionsScore: 3,
    techScore: 2,
  },
  {
    Name: "David Brown",
    Number: "+1234567894",
    Brand: "InnovateInc",
    Tech: "4",
    "Media ": "5",
    "Solutions ": "5",
    Date: "12/11/2023, 11:10 AM",
    dateObj: new Date(2023, 11, 11),
    month: 12,
    year: 2023,
    mediaScore: 5,
    solutionsScore: 5,
    techScore: 4,
  },
  {
    Name: "Lisa Anderson",
    Number: "+1234567895",
    Brand: "TechCorp",
    Tech: "3",
    "Media ": "2",
    "Solutions ": "3",
    Date: "12/10/2023, 1:30 PM",
    dateObj: new Date(2023, 11, 10),
    month: 12,
    year: 2023,
    mediaScore: 2,
    solutionsScore: 3,
    techScore: 3,
  },
  {
    Name: "Robert Taylor",
    Number: "+1234567896",
    Brand: "GlobalTech",
    Tech: "5",
    "Media ": "4",
    "Solutions ": "4",
    Date: "12/9/2023, 3:45 PM",
    dateObj: new Date(2023, 11, 9),
    month: 12,
    year: 2023,
    mediaScore: 4,
    solutionsScore: 4,
    techScore: 5,
  },
  {
    Name: "Jennifer Martinez",
    Number: "+1234567897",
    Brand: "InnovateInc",
    Tech: "4",
    "Media ": "5",
    "Solutions ": "4",
    Date: "12/8/2023, 10:15 AM",
    dateObj: new Date(2023, 11, 8),
    month: 12,
    year: 2023,
    mediaScore: 5,
    solutionsScore: 4,
    techScore: 4,
  },
  {
    Name: "Christopher Lee",
    Number: "+1234567898",
    Brand: "TechCorp",
    Tech: "3",
    "Media ": "3",
    "Solutions ": "5",
    Date: "12/7/2023, 2:50 PM",
    dateObj: new Date(2023, 11, 7),
    month: 12,
    year: 2023,
    mediaScore: 3,
    solutionsScore: 5,
    techScore: 3,
  },
  {
    Name: "Amanda White",
    Number: "+1234567899",
    Brand: "GlobalTech",
    Tech: "5",
    "Media ": "4",
    "Solutions ": "3",
    Date: "12/6/2023, 12:25 PM",
    dateObj: new Date(2023, 11, 6),
    month: 12,
    year: 2023,
    mediaScore: 4,
    solutionsScore: 3,
    techScore: 5,
  },
  {
    Name: "Kevin Garcia",
    Number: "+1234567800",
    Brand: "TechCorp",
    Tech: "4",
    "Media ": "5",
    "Solutions ": "5",
    Date: "12/5/2023, 9:30 AM",
    dateObj: new Date(2023, 11, 5),
    month: 12,
    year: 2023,
    mediaScore: 5,
    solutionsScore: 5,
    techScore: 4,
  },
  {
    Name: "Michelle Rodriguez",
    Number: "+1234567801",
    Brand: "InnovateInc",
    Tech: "2",
    "Media ": "3",
    "Solutions ": "4",
    Date: "12/4/2023, 4:15 PM",
    dateObj: new Date(2023, 11, 4),
    month: 12,
    year: 2023,
    mediaScore: 3,
    solutionsScore: 4,
    techScore: 2,
  },
  {
    Name: "Daniel Thompson",
    Number: "+1234567802",
    Brand: "GlobalTech",
    Tech: "5",
    "Media ": "4",
    "Solutions ": "4",
    Date: "12/3/2023, 11:45 AM",
    dateObj: new Date(2023, 11, 3),
    month: 12,
    year: 2023,
    mediaScore: 4,
    solutionsScore: 4,
    techScore: 5,
  },
  {
    Name: "Jessica Clark",
    Number: "+1234567803",
    Brand: "TechCorp",
    Tech: "3",
    "Media ": "5",
    "Solutions ": "3",
    Date: "12/2/2023, 1:20 PM",
    dateObj: new Date(2023, 11, 2),
    month: 12,
    year: 2023,
    mediaScore: 5,
    solutionsScore: 3,
    techScore: 3,
  },
  {
    Name: "Ryan Lewis",
    Number: "+1234567804",
    Brand: "InnovateInc",
    Tech: "4",
    "Media ": "4",
    "Solutions ": "5",
    Date: "12/1/2023, 3:10 PM",
    dateObj: new Date(2023, 11, 1),
    month: 12,
    year: 2023,
    mediaScore: 4,
    solutionsScore: 5,
    techScore: 4,
  },
  {
    Name: "Nicole Walker",
    Number: "+1234567805",
    Brand: "GlobalTech",
    Tech: "5",
    "Media ": "3",
    "Solutions ": "4",
    Date: "11/30/2023, 10:55 AM",
    dateObj: new Date(2023, 10, 30),
    month: 11,
    year: 2023,
    mediaScore: 3,
    solutionsScore: 4,
    techScore: 5,
  },
  {
    Name: "Brandon Hall",
    Number: "+1234567806",
    Brand: "TechCorp",
    Tech: "4",
    "Media ": "4",
    "Solutions ": "4",
    Date: "11/29/2023, 2:40 PM",
    dateObj: new Date(2023, 10, 29),
    month: 11,
    year: 2023,
    mediaScore: 4,
    solutionsScore: 4,
    techScore: 4,
  },
  {
    Name: "Stephanie Young",
    Number: "+1234567807",
    Brand: "InnovateInc",
    Tech: "3",
    "Media ": "5",
    "Solutions ": "5",
    Date: "11/28/2023, 9:25 AM",
    dateObj: new Date(2023, 10, 28),
    month: 11,
    year: 2023,
    mediaScore: 5,
    solutionsScore: 5,
    techScore: 3,
  },
  {
    Name: "Gregory King",
    Number: "+1234567808",
    Brand: "GlobalTech",
    Tech: "5",
    "Media ": "2",
    "Solutions ": "3",
    Date: "11/27/2023, 4:35 PM",
    dateObj: new Date(2023, 10, 27),
    month: 11,
    year: 2023,
    mediaScore: 2,
    solutionsScore: 3,
    techScore: 5,
  },
  {
    Name: "Rachel Wright",
    Number: "+1234567809",
    Brand: "TechCorp",
    Tech: "4",
    "Media ": "5",
    "Solutions ": "4",
    Date: "11/26/2023, 12:15 PM",
    dateObj: new Date(2023, 10, 26),
    month: 11,
    year: 2023,
    mediaScore: 5,
    solutionsScore: 4,
    techScore: 4,
  },
];

// Dashboard component
export default function Home() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    mediaAvg: 0,
    solutionsAvg: 0,
    techAvg: 0,
    overallAvg: 0,
    totalResponses: 0,
  });

  // Active filter tab
  const [activeTab, setActiveTab] = useState("all");
  // Chart type state
  const [chartType, setChartType] = useState("line");
  // Add refreshTime state to force data refresh
  const [refreshTime, setRefreshTime] = useState(Date.now());
  // Add syncing state to show sync animation
  const [syncing, setSyncing] = useState(false);
  // Dark mode state
  const [darkMode, setDarkMode] = useState(true);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Function to handle manual data refresh
  const handleSyncData = () => {
    setSyncing(true);
    setRefreshTime(Date.now());
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        if (USE_MOCK_DATA) {
          // Use mock data
          console.log("Using mock data:", MOCK_DATA);
          setData(MOCK_DATA);
          setFilteredData(MOCK_DATA);
          calculateStats(MOCK_DATA);
        } else {
          // Fetch from Google Sheets
          const response = await axios.get("/api/proxy");
          const result = response.data;

          // Log the entire sheet data
          console.log("Complete sheet data:", result);

          if (result.data && Array.isArray(result.data)) {
            // Process data and add formatted date
            const processedData = result.data.map((item) => {
              // Parse date string (assuming MM/DD/YYYY format)
              const dateParts = item.Date
                ? item.Date.split(", ")[0].split("/")
                : null;
              let dateObj = null;

              if (dateParts && dateParts.length === 3) {
                // Month is 0-indexed in JavaScript Date
                dateObj = new Date(
                  dateParts[2],
                  dateParts[0] - 1,
                  dateParts[1]
                );
              }

              // Parse Tech field - handle "NA" or numeric values
              const techValue =
                item.Tech === "NA" ? 0 : parseInt(item.Tech) || 0;

              return {
                ...item,
                dateObj,
                month: dateObj ? dateObj.getMonth() + 1 : null, // 1-12
                year: dateObj ? dateObj.getFullYear() : null,
                mediaScore: parseInt(item["Media "]) || 0,
                solutionsScore: parseInt(item["Solutions "]) || 0,
                techScore: techValue,
              };
            });

            // Filter to keep only unique phone numbers
            const uniqueNumbersMap = new Map();
            const uniqueData = [];

            processedData.forEach((item) => {
              if (item.Number && !uniqueNumbersMap.has(item.Number)) {
                uniqueNumbersMap.set(item.Number, true);
                uniqueData.push(item);
              }
            });

            console.log("Filtered unique data:", uniqueData);

            setData(uniqueData);
            setFilteredData(uniqueData);
            calculateStats(uniqueData);
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch CSAT data. Please try again later.");
      } finally {
        setLoading(false);
        setSyncing(false);
      }
    };

    fetchData();
  }, [refreshTime]);

  // Calculate statistics from data
  const calculateStats = (dataToAnalyze) => {
    if (!dataToAnalyze.length) {
      setStats({
        mediaAvg: 0,
        solutionsAvg: 0,
        techAvg: 0,
        overallAvg: 0,
        totalResponses: 0,
      });
      return;
    }

    // Count unique phone numbers
    const uniqueNumbers = new Set();
    dataToAnalyze.forEach((item) => {
      if (item.Number) {
        uniqueNumbers.add(item.Number);
      }
    });

    // Calculate averages using the correct property names
    const mediaSum = dataToAnalyze.reduce(
      (sum, item) => sum + (item.mediaScore || 0),
      0
    );
    const solutionsSum = dataToAnalyze.reduce(
      (sum, item) => sum + (item.solutionsScore || 0),
      0
    );
    const techSum = dataToAnalyze.reduce(
      (sum, item) => sum + (item.techScore || 0),
      0
    );

    const mediaAvg = (mediaSum / dataToAnalyze.length).toFixed(2);
    const solutionsAvg = (solutionsSum / dataToAnalyze.length).toFixed(2);
    const techAvg = (techSum / dataToAnalyze.length).toFixed(2);

    setStats({
      mediaAvg,
      solutionsAvg,
      techAvg,
      overallAvg: (
        (parseFloat(mediaAvg) +
          parseFloat(solutionsAvg) +
          parseFloat(techAvg)) /
        3
      ).toFixed(2),
      totalResponses: uniqueNumbers.size,
    });
  };

  // Handle filtering by time period
  const handleFilterChange = (period) => {
    setActiveTab(period);

    let filtered = [...data];
    const now = new Date();

    if (period === "today") {
      filtered = data.filter((item) => {
        if (!item.dateObj) return false;
        return (
          item.dateObj.getDate() === now.getDate() &&
          item.dateObj.getMonth() === now.getMonth() &&
          item.dateObj.getFullYear() === now.getFullYear()
        );
      });
    } else if (period === "week") {
      // Last 7 days
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);

      filtered = data.filter((item) => {
        if (!item.dateObj) return false;
        return item.dateObj >= weekAgo;
      });
    } else if (period === "month") {
      // Last 30 days
      const monthAgo = new Date();
      monthAgo.setDate(now.getDate() - 30);

      filtered = data.filter((item) => {
        if (!item.dateObj) return false;
        return item.dateObj >= monthAgo;
      });
    } else if (period === "quarter") {
      // Last 90 days
      const quarterAgo = new Date();
      quarterAgo.setDate(now.getDate() - 90);

      filtered = data.filter((item) => {
        if (!item.dateObj) return false;
        return item.dateObj >= quarterAgo;
      });
    } else if (period === "year") {
      // Last 365 days
      const yearAgo = new Date();
      yearAgo.setDate(now.getDate() - 365);

      filtered = data.filter((item) => {
        if (!item.dateObj) return false;
        return item.dateObj >= yearAgo;
      });
    }

    setFilteredData(filtered);
    calculateStats(filtered);
  };

  // Get satisfaction level based on score
  const getSatisfactionLevel = (score) => {
    if (score >= 4.5)
      return { level: "Excellent", color: "text-green-600", bg: "bg-green-50" };
    if (score >= 3.5)
      return { level: "Good", color: "text-blue-600", bg: "bg-blue-50" };
    if (score >= 2.5)
      return { level: "Average", color: "text-yellow-600", bg: "bg-yellow-50" };
    return { level: "Poor", color: "text-red-600", bg: "bg-red-50" };
  };

  // Calculate brand distribution
  const getBrandDistribution = () => {
    const brandCounts = {};
    filteredData.forEach((item) => {
      if (item.Brand) {
        brandCounts[item.Brand] = (brandCounts[item.Brand] || 0) + 1;
      }
    });
    return Object.entries(brandCounts).map(([brand, count]) => ({
      brand,
      count,
      percentage: ((count / filteredData.length) * 100).toFixed(1),
    }));
  };

  // Prepare monthly trend data
  const prepareMonthlyTrend = () => {
    if (!filteredData.length) return [];

    const monthData = {};

    filteredData.forEach((item) => {
      if (!item.dateObj) return;

      const monthYear = `${item.month}/${item.year}`;

      if (!monthData[monthYear]) {
        monthData[monthYear] = {
          monthYear,
          count: 0,
          mediaSum: 0,
          solutionsSum: 0,
          techSum: 0,
          date: new Date(item.year, item.month - 1, 1), // For sorting
        };
      }

      monthData[monthYear].count++;
      monthData[monthYear].mediaSum += item.mediaScore || 0;
      monthData[monthYear].solutionsSum += item.solutionsScore || 0;
      monthData[monthYear].techSum += item.techScore || 0;
    });

    const result = Object.values(monthData).map((item) => ({
      name: item.monthYear,
      mediaAvg: parseFloat((item.mediaSum / item.count).toFixed(2)) || 0,
      solutionsAvg:
        parseFloat((item.solutionsSum / item.count).toFixed(2)) || 0,
      techAvg: parseFloat((item.techSum / item.count).toFixed(2)) || 0,
      date: item.date,
    }));

    // Sort by date
    return result.sort((a, b) => a.date - b.date);
  };

  // Render trend chart
  const renderTrendChart = () => {
    const monthlyData = prepareMonthlyTrend();
    if (!monthlyData.length) return null;

    const maxValue = 5; // Since ratings are out of 5
    const chartHeight = 200;
    const chartWidth = 600;
    const paddingTop = 20;
    const paddingBottom = 40;
    const paddingLeft = 40;
    const paddingRight = 20;

    const graphHeight = chartHeight - paddingTop - paddingBottom;
    const graphWidth = chartWidth - paddingLeft - paddingRight;

    // Scale values to fit in the chart
    const scaleY = (value) => {
      return graphHeight - (value / maxValue) * graphHeight + paddingTop;
    };

    const scaleX = (index) => {
      return (index / (monthlyData.length - 1 || 1)) * graphWidth + paddingLeft;
    };

    // Generate path for overall average
    const overallPath = monthlyData
      .map((item, index) => {
        const x = scaleX(index);
        const y = scaleY(
          (item.mediaAvg + item.solutionsAvg + item.techAvg) / 3
        );
        return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
      })
      .join(" ");

    return (
      <div className="relative">
        <svg width={chartWidth} height={chartHeight} className="w-full">
          {/* Grid lines */}
          {[1, 2, 3, 4, 5].map((value) => (
            <line
              key={value}
              x1={paddingLeft}
              y1={scaleY(value)}
              x2={chartWidth - paddingRight}
              y2={scaleY(value)}
              stroke="#f3f4f6"
              strokeWidth="1"
            />
          ))}

          {/* Trend line */}
          <path
            d={overallPath}
            fill="none"
            stroke="#6366f1"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {monthlyData.map((item, index) => {
            const x = scaleX(index);
            const y = scaleY(
              (item.mediaAvg + item.solutionsAvg + item.techAvg) / 3
            );
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="4"
                fill="#6366f1"
                className="hover:r-6 transition-all"
              />
            );
          })}

          {/* Y-axis labels */}
          {[1, 2, 3, 4, 5].map((value) => (
            <text
              key={value}
              x={paddingLeft - 10}
              y={scaleY(value) + 4}
              textAnchor="end"
              fontSize="12"
              fill="#6b7280"
            >
              {value}
            </text>
          ))}
        </svg>
      </div>
    );
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Header */}
      <div
        className={`border-b transition-colors duration-300 ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1
                className={`text-2xl font-bold transition-colors duration-300 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Overview
              </h1>
              <p
                className={`text-sm mt-1 transition-colors duration-300 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Customer Satisfaction Analytics Dashboard
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  darkMode
                    ? "bg-gray-700 text-yellow-400 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                title={
                  darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
                }
              >
                {darkMode ? (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>

              <button
                onClick={handleSyncData}
                disabled={loading || syncing}
                className={`inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-300 ${
                  darkMode
                    ? "focus:ring-offset-gray-800"
                    : "focus:ring-offset-white"
                }`}
              >
                {loading || syncing ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Syncing...
                  </>
                ) : (
                  <>
                    <svg
                      className="-ml-1 mr-2 h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Sync Data
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && !syncing ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div
            className={`border rounded-lg p-4 transition-colors duration-300 ${
              darkMode
                ? "bg-red-900 border-red-700 text-red-300"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            {error}
          </div>
        ) : (
          <>
            {/* Time Period Filter */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2">
                {[
                  { key: "all", label: "All Time" },
                  { key: "today", label: "Today" },
                  { key: "week", label: "This Week" },
                  { key: "month", label: "This Month" },
                  { key: "quarter", label: "This Quarter" },
                  { key: "year", label: "This Year" },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => handleFilterChange(key)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                      activeTab === key
                        ? "bg-indigo-600 text-white shadow-sm"
                        : darkMode
                        ? "bg-gray-800 text-gray-300 border border-gray-600 hover:bg-gray-700"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Responses */}
              <div
                className={`rounded-xl shadow-sm border p-6 transition-all duration-300 ${
                  darkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className={`text-sm font-medium transition-colors duration-300 ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Total Responses
                    </p>
                    <p
                      className={`text-3xl font-bold mt-2 transition-colors duration-300 ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {stats.totalResponses}
                    </p>
                    <div className="flex items-center mt-2">
                      <span className="text-sm text-green-600 font-medium">
                        +12%
                      </span>
                      <span
                        className={`text-sm ml-1 transition-colors duration-300 ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        vs last period
                      </span>
                    </div>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                      darkMode ? "bg-blue-900" : "bg-blue-100"
                    }`}
                  >
                    <svg
                      className={`w-6 h-6 transition-colors duration-300 ${
                        darkMode ? "text-blue-400" : "text-blue-600"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Overall Satisfaction */}
              <div
                className={`rounded-xl shadow-sm border p-6 transition-all duration-300 ${
                  darkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className={`text-sm font-medium transition-colors duration-300 ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Overall Satisfaction
                    </p>
                    <p
                      className={`text-3xl font-bold mt-2 transition-colors duration-300 ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {stats.overallAvg}
                    </p>
                    <div className="flex items-center mt-2">
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          getSatisfactionLevel(stats.overallAvg).bg
                        } ${getSatisfactionLevel(stats.overallAvg).color}`}
                      >
                        {getSatisfactionLevel(stats.overallAvg).level}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                      darkMode ? "bg-green-900" : "bg-green-100"
                    }`}
                  >
                    <svg
                      className={`w-6 h-6 transition-colors duration-300 ${
                        darkMode ? "text-green-400" : "text-green-600"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Media Rating */}
              <div
                className={`rounded-xl shadow-sm border p-6 transition-all duration-300 ${
                  darkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className={`text-sm font-medium transition-colors duration-300 ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Media Rating
                    </p>
                    <p
                      className={`text-3xl font-bold mt-2 transition-colors duration-300 ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {stats.mediaAvg}
                    </p>
                    <div
                      className={`w-full rounded-full h-2 mt-3 transition-colors duration-300 ${
                        darkMode ? "bg-gray-700" : "bg-gray-200"
                      }`}
                    >
                      <div
                        className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(stats.mediaAvg / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                      darkMode ? "bg-purple-900" : "bg-purple-100"
                    }`}
                  >
                    <svg
                      className={`w-6 h-6 transition-colors duration-300 ${
                        darkMode ? "text-purple-400" : "text-purple-600"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Solutions Rating */}
              <div
                className={`rounded-xl shadow-sm border p-6 transition-all duration-300 ${
                  darkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className={`text-sm font-medium transition-colors duration-300 ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Solutions Rating
                    </p>
                    <p
                      className={`text-3xl font-bold mt-2 transition-colors duration-300 ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {stats.solutionsAvg}
                    </p>
                    <div
                      className={`w-full rounded-full h-2 mt-3 transition-colors duration-300 ${
                        darkMode ? "bg-gray-700" : "bg-gray-200"
                      }`}
                    >
                      <div
                        className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(stats.solutionsAvg / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                      darkMode ? "bg-emerald-900" : "bg-emerald-100"
                    }`}
                  >
                    <svg
                      className={`w-6 h-6 transition-colors duration-300 ${
                        darkMode ? "text-emerald-400" : "text-emerald-600"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Satisfaction Trend */}
              <div
                className={`rounded-xl shadow-sm border p-6 transition-all duration-300 ${
                  darkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3
                    className={`text-lg font-semibold transition-colors duration-300 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Satisfaction Trend
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                    <span
                      className={`text-sm transition-colors duration-300 ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Overall Rating
                    </span>
                  </div>
                </div>
                {renderTrendChart()}
              </div>

              {/* Brand Distribution */}
              <div
                className={`rounded-xl shadow-sm border p-6 transition-all duration-300 ${
                  darkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                <h3
                  className={`text-lg font-semibold mb-6 transition-colors duration-300 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Brand Distribution
                </h3>
                <div className="space-y-4">
                  {getBrandDistribution()
                    .slice(0, 5)
                    .map((brand, index) => (
                      <div
                        key={brand.brand}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              index === 0
                                ? "bg-blue-500"
                                : index === 1
                                ? "bg-green-500"
                                : index === 2
                                ? "bg-yellow-500"
                                : index === 3
                                ? "bg-purple-500"
                                : "bg-red-500"
                            }`}
                          ></div>
                          <span
                            className={`text-sm font-medium transition-colors duration-300 ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {brand.brand}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`text-sm transition-colors duration-300 ${
                              darkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {brand.count}
                          </span>
                          <span
                            className={`text-sm font-medium transition-colors duration-300 ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {brand.percentage}%
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Detailed Ratings */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Media Detailed */}
              <div
                className={`rounded-xl shadow-sm border p-6 transition-all duration-300 ${
                  darkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3
                    className={`text-lg font-semibold transition-colors duration-300 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Media
                  </h3>
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                      darkMode ? "bg-purple-900" : "bg-purple-100"
                    }`}
                  >
                    <svg
                      className={`w-4 h-4 transition-colors duration-300 ${
                        darkMode ? "text-purple-400" : "text-purple-600"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="text-center">
                  <div
                    className={`text-3xl font-bold mb-2 transition-colors duration-300 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {stats.mediaAvg}
                  </div>
                  <div
                    className={`text-sm mb-4 transition-colors duration-300 ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Average Rating
                  </div>
                  <div className="relative w-24 h-24 mx-auto">
                    <svg
                      className="w-24 h-24 transform -rotate-90"
                      viewBox="0 0 100 100"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke={darkMode ? "#374151" : "#e5e7eb"}
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#8b5cf6"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${
                          (stats.mediaAvg / 5) * 251.2
                        } 251.2`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span
                        className={`text-lg font-bold transition-colors duration-300 ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {Math.round((stats.mediaAvg / 5) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Solutions Detailed */}
              <div
                className={`rounded-xl shadow-sm border p-6 transition-all duration-300 ${
                  darkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3
                    className={`text-lg font-semibold transition-colors duration-300 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Solutions
                  </h3>
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                      darkMode ? "bg-emerald-900" : "bg-emerald-100"
                    }`}
                  >
                    <svg
                      className={`w-4 h-4 transition-colors duration-300 ${
                        darkMode ? "text-emerald-400" : "text-emerald-600"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="text-center">
                  <div
                    className={`text-3xl font-bold mb-2 transition-colors duration-300 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {stats.solutionsAvg}
                  </div>
                  <div
                    className={`text-sm mb-4 transition-colors duration-300 ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Average Rating
                  </div>
                  <div className="relative w-24 h-24 mx-auto">
                    <svg
                      className="w-24 h-24 transform -rotate-90"
                      viewBox="0 0 100 100"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke={darkMode ? "#374151" : "#e5e7eb"}
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#10b981"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${
                          (stats.solutionsAvg / 5) * 251.2
                        } 251.2`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span
                        className={`text-lg font-bold transition-colors duration-300 ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {Math.round((stats.solutionsAvg / 5) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tech Detailed */}
              <div
                className={`rounded-xl shadow-sm border p-6 transition-all duration-300 ${
                  darkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3
                    className={`text-lg font-semibold transition-colors duration-300 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Technology
                  </h3>
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                      darkMode ? "bg-blue-900" : "bg-blue-100"
                    }`}
                  >
                    <svg
                      className={`w-4 h-4 transition-colors duration-300 ${
                        darkMode ? "text-blue-400" : "text-blue-600"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="text-center">
                  <div
                    className={`text-3xl font-bold mb-2 transition-colors duration-300 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {stats.techAvg}
                  </div>
                  <div
                    className={`text-sm mb-4 transition-colors duration-300 ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Average Rating
                  </div>
                  <div className="relative w-24 h-24 mx-auto">
                    <svg
                      className="w-24 h-24 transform -rotate-90"
                      viewBox="0 0 100 100"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke={darkMode ? "#374151" : "#e5e7eb"}
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#3b82f6"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${(stats.techAvg / 5) * 251.2} 251.2`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span
                        className={`text-lg font-bold transition-colors duration-300 ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {Math.round((stats.techAvg / 5) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Feedback Table */}
            <div
              className={`rounded-xl shadow-sm border transition-all duration-300 ${
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <div
                className={`px-6 py-4 border-b transition-colors duration-300 ${
                  darkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <h3
                  className={`text-lg font-semibold transition-colors duration-300 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Recent Feedback
                </h3>
                <p
                  className={`text-sm mt-1 transition-colors duration-300 ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {filteredData.length} total responses
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead
                    className={`transition-colors duration-300 ${
                      darkMode ? "bg-gray-700" : "bg-gray-50"
                    }`}
                  >
                    <tr>
                      <th
                        className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${
                          darkMode ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        Customer
                      </th>
                      <th
                        className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${
                          darkMode ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        Brand
                      </th>
                      <th
                        className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${
                          darkMode ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        Media
                      </th>
                      <th
                        className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${
                          darkMode ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        Solutions
                      </th>
                      <th
                        className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${
                          darkMode ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        Tech
                      </th>
                      <th
                        className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${
                          darkMode ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    className={`divide-y transition-colors duration-300 ${
                      darkMode
                        ? "bg-gray-800 divide-gray-700"
                        : "bg-white divide-gray-200"
                    }`}
                  >
                    {filteredData.slice(0, 10).map((item, index) => (
                      <tr
                        key={index}
                        className={`transition-colors duration-300 ${
                          darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                                darkMode ? "bg-gray-600" : "bg-gray-200"
                              }`}
                            >
                              <span
                                className={`text-sm font-medium transition-colors duration-300 ${
                                  darkMode ? "text-gray-300" : "text-gray-600"
                                }`}
                              >
                                {item.Name
                                  ? item.Name.charAt(0).toUpperCase()
                                  : "N"}
                              </span>
                            </div>
                            <div className="ml-3">
                              <div
                                className={`text-sm font-medium transition-colors duration-300 ${
                                  darkMode ? "text-white" : "text-gray-900"
                                }`}
                              >
                                {item.Name}
                              </div>
                              <div
                                className={`text-sm transition-colors duration-300 ${
                                  darkMode ? "text-gray-400" : "text-gray-500"
                                }`}
                              >
                                {item.Number}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full transition-colors duration-300 ${
                              darkMode
                                ? "bg-gray-700 text-gray-300"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {item.Brand}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span
                              className={`text-sm font-medium mr-2 transition-colors duration-300 ${
                                darkMode ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {item["Media "]}
                            </span>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= item.mediaScore
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
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span
                              className={`text-sm font-medium mr-2 transition-colors duration-300 ${
                                darkMode ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {item["Solutions "]}
                            </span>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= item.solutionsScore
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
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              item.Tech === "NA"
                                ? darkMode
                                  ? "bg-gray-700 text-gray-300"
                                  : "bg-gray-100 text-gray-800"
                                : item.techScore >= 3
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {item.Tech}
                          </span>
                        </td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap text-sm transition-colors duration-300 ${
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
          </>
        )}
      </main>
    </div>
  );
}
