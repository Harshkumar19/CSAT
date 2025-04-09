import { useState, useEffect } from "react";
import axios from "axios";

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
    totalResponses: 0
  });
  
  // Active filter tab
  const [activeTab, setActiveTab] = useState('all');
  // Chart type state
  const [chartType, setChartType] = useState('line');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/proxy");
        const result = response.data;
        
        if (result.data && Array.isArray(result.data)) {
          // Process data and add formatted date
          const processedData = result.data.map(item => {
            // Parse date string (assuming MM/DD/YYYY format)
            const dateParts = item.Date ? item.Date.split(', ')[0].split('/') : null;
            let dateObj = null;
            
            if (dateParts && dateParts.length === 3) {
              // Month is 0-indexed in JavaScript Date
              dateObj = new Date(dateParts[2], dateParts[0] - 1, dateParts[1]);
            }
            
            // Parse Tech field - handle "NA" or numeric values
            const techValue = item.Tech === "NA" ? 0 : parseInt(item.Tech) || 0;
            
            return {
              ...item,
              dateObj,
              month: dateObj ? dateObj.getMonth() + 1 : null, // 1-12
              year: dateObj ? dateObj.getFullYear() : null,
              mediaScore: parseInt(item["Media "]) || 0,
              solutionsScore: parseInt(item["Solutions "]) || 0,
              techScore: techValue
            };
          });
          
          setData(processedData);
          setFilteredData(processedData);
          calculateStats(processedData);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch CSAT data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  // Calculate statistics from data
  const calculateStats = (dataToAnalyze) => {
    if (!dataToAnalyze.length) {
      setStats({
        mediaAvg: 0,
        solutionsAvg: 0,
        techAvg: 0,
        overallAvg: 0,
        totalResponses: 0
      });
      return;
    }
    
    // Count unique phone numbers
    const uniqueNumbers = new Set();
    dataToAnalyze.forEach(item => {
      if (item.Number) {
        uniqueNumbers.add(item.Number);
      }
    });
    
    // Calculate averages using the correct property names
    const mediaSum = dataToAnalyze.reduce((sum, item) => sum + (item.mediaScore || 0), 0);
    const solutionsSum = dataToAnalyze.reduce((sum, item) => sum + (item.solutionsScore || 0), 0);
    const techSum = dataToAnalyze.reduce((sum, item) => sum + (item.techScore || 0), 0);
    
    const mediaAvg = (mediaSum / dataToAnalyze.length).toFixed(2);
    const solutionsAvg = (solutionsSum / dataToAnalyze.length).toFixed(2);
    const techAvg = (techSum / dataToAnalyze.length).toFixed(2);
    
    setStats({
      mediaAvg,
      solutionsAvg,
      techAvg,
      overallAvg: ((parseFloat(mediaAvg) + parseFloat(solutionsAvg) + parseFloat(techAvg)) / 3).toFixed(2),
      totalResponses: uniqueNumbers.size
    });
  };
  
  // Handle filtering by time period
  const handleFilterChange = (period) => {
    setActiveTab(period);
    
    let filtered = [...data];
    const now = new Date();
    
    if (period === 'today') {
      filtered = data.filter(item => {
        if (!item.dateObj) return false;
        return (
          item.dateObj.getDate() === now.getDate() &&
          item.dateObj.getMonth() === now.getMonth() &&
          item.dateObj.getFullYear() === now.getFullYear()
        );
      });
    } else if (period === 'week') {
      // Last 7 days
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      
      filtered = data.filter(item => {
        if (!item.dateObj) return false;
        return item.dateObj >= weekAgo;
      });
    } else if (period === 'month') {
      // Last 30 days
      const monthAgo = new Date();
      monthAgo.setDate(now.getDate() - 30);
      
      filtered = data.filter(item => {
        if (!item.dateObj) return false;
        return item.dateObj >= monthAgo;
      });
    } else if (period === 'quarter') {
      // Last 90 days
      const quarterAgo = new Date();
      quarterAgo.setDate(now.getDate() - 90);
      
      filtered = data.filter(item => {
        if (!item.dateObj) return false;
        return item.dateObj >= quarterAgo;
      });
    } else if (period === 'year') {
      // Last 365 days
      const yearAgo = new Date();
      yearAgo.setDate(now.getDate() - 365);
      
      filtered = data.filter(item => {
        if (!item.dateObj) return false;
        return item.dateObj >= yearAgo;
      });
    }
    
    setFilteredData(filtered);
    calculateStats(filtered);
  };

  // Render a simple bar for ratings
  const renderRatingBar = (value, max = 5) => {
    const percentage = (value / max) * 100;
    const color = percentage >= 60 ? 'bg-green-500' : percentage >= 40 ? 'bg-yellow-500' : 'bg-red-500';
    
    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div className={`${color} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
      </div>
    );
  };

  // Prepare monthly trend data
  const prepareMonthlyTrend = () => {
    if (!filteredData.length) return [];
    
    const monthData = {};
    
    filteredData.forEach(item => {
      if (!item.dateObj) return;
      
      const monthYear = `${item.month}/${item.year}`;
      
      if (!monthData[monthYear]) {
        monthData[monthYear] = {
          monthYear,
          count: 0,
          mediaSum: 0,
          solutionsSum: 0,
          techSum: 0,
          date: new Date(item.year, item.month - 1, 1) // For sorting
        };
      }
      
      monthData[monthYear].count++;
      monthData[monthYear].mediaSum += item.mediaScore || 0;
      monthData[monthYear].solutionsSum += item.solutionsScore || 0;
      monthData[monthYear].techSum += item.techScore || 0;
    });
    
    const result = Object.values(monthData).map(item => ({
      name: item.monthYear,
      mediaAvg: parseFloat((item.mediaSum / item.count).toFixed(2)) || 0,
      solutionsAvg: parseFloat((item.solutionsSum / item.count).toFixed(2)) || 0,
      techAvg: parseFloat((item.techSum / item.count).toFixed(2)) || 0,
      date: item.date
    }));
    
    // Sort by date
    return result.sort((a, b) => a.date - b.date);
  };

  // Render line chart
  const renderLineChart = () => {
    const monthlyData = prepareMonthlyTrend();
    if (!monthlyData.length) return <div className="text-center py-10">No data available for the selected time period</div>;
    
    const maxValue = Math.max(
      ...monthlyData.map(d => Math.max(d.mediaAvg, d.solutionsAvg, d.techAvg))
    );
    
    const chartHeight = 300;
    const chartWidth = monthlyData.length * 100;
    const paddingTop = 20;
    const paddingBottom = 40;
    const paddingLeft = 40;
    const paddingRight = 20;
    
    const graphHeight = chartHeight - paddingTop - paddingBottom;
    const graphWidth = Math.max(chartWidth, 600) - paddingLeft - paddingRight;
    
    // Scale values to fit in the chart
    const scaleY = (value) => {
      return graphHeight - (value / (maxValue || 5)) * graphHeight + paddingTop;
    };
    
    // Generate points for each line
    const generatePoints = (dataKey) => {
      const interval = graphWidth / (monthlyData.length - 1 || 1);
      return monthlyData.map((item, index) => {
        const x = index * interval + paddingLeft;
        const y = scaleY(item[dataKey]);
        return `${x},${y}`;
      }).join(' ');
    };
    
    const mediaPoints = generatePoints('mediaAvg');
    const solutionsPoints = generatePoints('solutionsAvg');
    const techPoints = generatePoints('techAvg');
    
    // Determine which rating has the highest average for each month
    const highestRatingByMonth = monthlyData.map(item => {
      const ratings = {
        media: item.mediaAvg,
        solutions: item.solutionsAvg,
        tech: item.techAvg
      };
      
      const highest = Object.entries(ratings).reduce((max, [key, value]) => 
        value > max.value ? { key, value } : max, { key: '', value: -Infinity }
      );
      
      return {
        month: item.name,
        highestRating: highest.key,
        value: highest.value
      };
    });
    
    return (
      <div className="relative">
        <div className="flex justify-end mb-4 space-x-2">
          <button 
            onClick={() => setChartType('line')} 
            className={`px-3 py-1 text-sm rounded ${chartType === 'line' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Line
          </button>
          <button 
            onClick={() => setChartType('bar')} 
            className={`px-3 py-1 text-sm rounded ${chartType === 'bar' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Bar
          </button>
          <button 
            onClick={() => setChartType('pie')} 
            className={`px-3 py-1 text-sm rounded ${chartType === 'pie' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Pie
          </button>
        </div>
        
    
        
        {chartType === 'bar' && (
          <div className="space-y-8">
            {monthlyData.map((item, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-medium mb-3">{item.name}</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Media</span>
                      <span className="text-sm font-medium text-gray-700">{item.mediaAvg}/5</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: `${(item.mediaAvg / 5) * 100}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Solutions</span>
                      <span className="text-sm font-medium text-gray-700">{item.solutionsAvg}/5</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${(item.solutionsAvg / 5) * 100}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Tech</span>
                      <span className="text-sm font-medium text-gray-700">{item.techAvg}/5</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${(item.techAvg / 5) * 100}%` }}></div>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    Highest Rating: <span className="font-medium">{item.highestRating === 'media' ? 'Media' : item.highestRating === 'solutions' ? 'Solutions' : 'Tech'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {chartType === 'pie' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {highestRatingByMonth.map((item, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow text-center">
                <h4 className="font-medium mb-2">{item.month}</h4>
                <div className="relative w-32 h-32 mx-auto">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      fill={
                        item.highestRating === 'media' ? '#8884d8' : 
                        item.highestRating === 'solutions' ? '#82ca9d' : 
                        '#FFBB28'
                      } 
                    />
                    <text 
                      x="50" 
                      y="50" 
                      textAnchor="middle" 
                      dominantBaseline="middle" 
                      fill="white"
                      fontSize="12"
                      fontWeight="bold"
                    >
                      {item.highestRating === 'media' ? 'Media' : 
                       item.highestRating === 'solutions' ? 'Solutions' : 
                       'Tech'}
                    </text>
                    <text 
                      x="50" 
                      y="65" 
                      textAnchor="middle" 
                      dominantBaseline="middle" 
                      fill="white"
                      fontSize="10"
                    >
                      {item.value}
                    </text>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex justify-center mt-4 space-x-6">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-purple-500 rounded-full mr-2"></div>
            <span className="text-sm">Media</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm">Solutions</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
            <span className="text-sm">Tech</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">CSAT Dashboard</h1>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
            {error}
          </div>
        ) : (
          <>
            {/* Time Period Filter Tabs */}
            <div className="mb-6">
              <div className="sm:hidden">
                <label htmlFor="timeFilter" className="sr-only">Select time period</label>
                <select
                  id="timeFilter"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={activeTab}
                  onChange={(e) => handleFilterChange(e.target.value)}
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                  <option value="year">This Year</option>
                </select>
              </div>
              <div className="hidden sm:block">
                <nav className="flex space-x-4 bg-white p-2 rounded-lg shadow" aria-label="Tabs">
                  <button
                    onClick={() => handleFilterChange('all')}
                    className={`px-3 py-2 font-medium text-sm rounded-md ${
                      activeTab === 'all'
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    All Time
                  </button>
                  <button
                    onClick={() => handleFilterChange('today')}
                    className={`px-3 py-2 font-medium text-sm rounded-md ${
                      activeTab === 'today'
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Today
                  </button>
                  <button
                    onClick={() => handleFilterChange('week')}
                    className={`px-3 py-2 font-medium text-sm rounded-md ${
                      activeTab === 'week'
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    This Week
                  </button>
                  <button
                    onClick={() => handleFilterChange('month')}
                    className={`px-3 py-2 font-medium text-sm rounded-md ${
                      activeTab === 'month'
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    This Month
                  </button>
                  <button
                    onClick={() => handleFilterChange('quarter')}
                    className={`px-3 py-2 font-medium text-sm rounded-md ${
                      activeTab === 'quarter'
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    This Quarter
                  </button>
                  <button
                    onClick={() => handleFilterChange('year')}
                    className={`px-3 py-2 font-medium text-sm rounded-md ${
                      activeTab === 'year'
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    This Year
                  </button>
                </nav>
              </div>
            </div>
            
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white overflow-hidden shadow-lg rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Responses</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalResponses}</dd>
                </div>
              </div>
              
              <div className="bg-white overflow-hidden shadow-lg rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">Average Media Rating</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.mediaAvg}</dd>
                  {renderRatingBar(stats.mediaAvg)}
                </div>
              </div>
              
              <div className="bg-white overflow-hidden shadow-lg rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">Average Solutions Rating</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.solutionsAvg}</dd>
                  {renderRatingBar(stats.solutionsAvg)}
                </div>
              </div>
              
              <div className="bg-white overflow-hidden shadow-lg rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">Average Tech Rating</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.techAvg}</dd>
                  {renderRatingBar(stats.techAvg)}
                </div>
              </div>
            </div>
            
            {/* Monthly Trends Chart */}
            {/* <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Rating Trends</h3>
              {renderLineChart()}
            </div> */}
            
            {/* Data Table */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                CSAT Data ({filteredData.length} records)
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Number
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Brand
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Technology
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Media
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Solutions
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredData.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                          No data available for the selected time period
                        </td>
                      </tr>
                    ) : (
                      filteredData.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.Name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.Number}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.Brand}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              item.Tech === "NA" ? 'bg-gray-100 text-gray-800' : 
                              item.techScore >= 3 ? 'bg-green-100 text-green-800' : 
                              'bg-red-100 text-red-800'
                            }`}>
                              {item.Tech}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              item.mediaScore >= 3 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {item["Media "]}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              item.solutionsScore >= 3 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {item["Solutions "]}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.Date}
                          </td>
                        </tr>
                      ))
                    )}
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
