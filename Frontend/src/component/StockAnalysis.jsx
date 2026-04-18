import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, 
  PieChart, Pie, Cell, LineChart, Line, Legend 
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

const StockAnalysis = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('both');
  const [chartHeight, setChartHeight] = useState(400);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setChartHeight(300);
      else if (window.innerWidth < 1024) setChartHeight(350);
      else setChartHeight(400);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const loadAnalysisData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:3000/api/analysis/data", {
          headers: {
            "Authorization": localStorage.getItem("token")
          }
        });
        const result = await response.json();
        if (response.ok) {
          setData(result);
        } else {
          console.error("Failed to fetch analysis dashboard data", result);
        }
      } catch (error) {
        console.error("Failed to load charts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadAnalysisData();
  }, []);

  const renderTooltip = (props) => {
    const { active, payload, label } = props;
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-md text-sm">
          <p className="font-bold text-gray-800">{label || payload[0].name}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name === 'revenue' 
                ? `${entry.name}: ₹${entry.value}` 
                : `${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      {isLoading && (
        <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
          <div className="text-center p-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 border-t-2 border-b-2 border-blue-600 mb-3"></div>
            <p className="text-base sm:text-lg text-blue-800 font-medium">Loading analysis engine instantly...</p>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center mb-4 sm:mb-6 lg:mb-8 animate-fadeIn">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-indigo-900 bg-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-lg shadow-md border-b-4 border-indigo-600 mb-3 sm:mb-4 text-center">
            📊 Inventory & Sales Dashboard
          </h2>
          
          <div className="bg-white rounded-full shadow-md p-1 flex space-x-1 overflow-x-auto w-full max-w-xs sm:max-w-md justify-center">
            <button onClick={() => setActiveSection('both')} className={`px-3 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${activeSection === 'both' ? 'bg-indigo-600 text-white' : 'bg-transparent text-gray-700 hover:bg-gray-100'}`}>All</button>
            <button onClick={() => setActiveSection('products')} className={`px-3 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${activeSection === 'products' ? 'bg-blue-600 text-white' : 'bg-transparent text-gray-700 hover:bg-gray-100'}`}>Products</button>
            <button onClick={() => setActiveSection('sales')} className={`px-3 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${activeSection === 'sales' ? 'bg-purple-600 text-white' : 'bg-transparent text-gray-700 hover:bg-gray-100'}`}>Sales</button>
          </div>
        </div>
        
        {/* Products Dashboard Section */}
        {(activeSection === 'both' || activeSection === 'products') && data && (
          <div className="mb-8 lg:mb-12">
            <div className="flex items-center mb-4 sm:mb-6 animate-slideInLeft">
              <div className="h-8 sm:h-10 lg:h-12 w-1 sm:w-2 bg-blue-600 mr-2 sm:mr-3 rounded-full"></div>
              <h3 className="text-xl sm:text-2xl font-semibold text-blue-800">Products Dashboard</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {/* Product Stock Levels */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-3 sm:p-4 text-white font-medium flex items-center justify-between">
                  <h3>📊 Current Stock vs Reorder</h3><span className="bg-white bg-opacity-20 rounded-full px-2 text-xs">LIVE</span>
                </div>
                <div className="p-4" style={{ height: chartHeight }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.stockLevels} margin={{ top: 20, right: 30, left: -20, bottom: 50 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip content={renderTooltip} />
                      <Legend verticalAlign="top" height={36} />
                      <Bar dataKey="quantity" fill="#0088FE" name="Quantity" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="threshold" fill="#FF8042" name="Min Threshold" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Status Overview Pie Chart */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-3 sm:p-4 text-white font-medium flex items-center justify-between">
                  <h3>📈 Stock Status Overview</h3><span className="bg-white bg-opacity-20 rounded-full px-2 text-xs">LIVE</span>
                </div>
                <div className="p-4" style={{ height: chartHeight }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={data.stockStatus} cx="50%" cy="50%" labelLine={false} label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                        {data.stockStatus.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                      </Pie>
                      <Tooltip content={renderTooltip} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Category Breakdown Pie Chart */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-3 sm:p-4 text-white font-medium flex items-center justify-between">
                  <h3>⏱ Inventory by Category</h3><span className="bg-white bg-opacity-20 rounded-full px-2 text-xs">LIVE</span>
                </div>
                <div className="p-4" style={{ height: chartHeight }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={data.categories} cx="50%" cy="50%" labelLine={false} label={({name, value}) => `${name}`} outerRadius={80} fill="#8884d8" dataKey="value">
                        {data.categories.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />)}
                      </Pie>
                      <Tooltip content={renderTooltip} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          </div>
        )}
        
        {/* Sales Dashboard Section */}
        {(activeSection === 'both' || activeSection === 'sales') && data && (
          <div>
            <div className="flex items-center mb-4 sm:mb-6 animate-slideInRight">
              <div className="h-8 sm:h-10 lg:h-12 w-1 sm:w-2 bg-indigo-600 mr-2 sm:mr-3 rounded-full"></div>
              <h3 className="text-xl sm:text-2xl font-semibold text-indigo-800">Sales Dashboard</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              
              {/* Daily Revenue Timeline */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-500 p-3 sm:p-4 text-white font-medium flex items-center justify-between">
                  <h3>💰 Rolling Daily Revenue (30 Days)</h3><span className="bg-white bg-opacity-20 rounded-full px-2 text-xs">LIVE</span>
                </div>
                <div className="p-4" style={{ height: chartHeight }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.salesTimeline} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" tick={{fontSize: 10}} minTickGap={20} />
                      <YAxis tickFormatter={(val) => `₹${val}`} width={80} tick={{fontSize: 10}} />
                      <Tooltip content={renderTooltip} />
                      <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenue" strokeWidth={3} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Transactions Timeline */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-500 p-3 sm:p-4 text-white font-medium flex items-center justify-between">
                  <h3>📅 Transactions Volume (30 Days)</h3><span className="bg-white bg-opacity-20 rounded-full px-2 text-xs">LIVE</span>
                </div>
                <div className="p-4" style={{ height: chartHeight }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.salesTimeline} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" tick={{fontSize: 10}} minTickGap={20} />
                      <YAxis tick={{fontSize: 12}} />
                      <Tooltip content={renderTooltip} />
                      <Bar dataKey="transactions" fill="#82ca9d" name="Transactions" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top Products */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 md:col-span-2">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-500 p-3 sm:p-4 text-white font-medium flex items-center justify-between">
                  <h3>🏆 Top Selling Products (All Time)</h3><span className="bg-white bg-opacity-20 rounded-full px-2 text-xs">LIVE</span>
                </div>
                <div className="p-4" style={{ height: chartHeight }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.topProducts} margin={{ top: 20, right: 30, left: 10, bottom: 50 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" angle={-15} textAnchor="end" height={60} tick={{fontSize: 11}} />
                      <YAxis yAxisId="left" tick={{fontSize: 12}} />
                      <YAxis yAxisId="right" orientation="right" tickFormatter={(val) => `₹${val}`} tick={{fontSize: 12}} width={80} />
                      <Tooltip content={renderTooltip} />
                      <Legend verticalAlign="top" height={36} />
                      <Bar yAxisId="left" dataKey="quantitySold" fill="#FFBB28" name="Quantity Sold" radius={[2, 2, 0, 0]} />
                      <Bar yAxisId="right" dataKey="revenue" fill="#00C49F" name="Total Revenue" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          </div>
        )}
        
        <div className="mt-8 lg:mt-12 text-center text-gray-500 text-xs sm:text-sm animate-fadeIn">
          <p className="font-medium">All charts load instantly via native Recharts JSON Aggregation.</p>
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes slideInLeft {
          from { transform: translateX(-50px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(50px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.8s ease-out forwards;
        }
        .animate-slideInRight {
          animation: slideInRight 0.8s ease-out forwards;
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default StockAnalysis;
