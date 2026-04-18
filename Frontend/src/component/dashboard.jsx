import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import Card from "./card";
import Footer from "./footer";
import { ToastContainer } from 'react-toastify';
import { 
  FiTrendingUp, 
  FiDollarSign, 
  FiPackage, 
  FiUsers, 
  FiPieChart,
  FiShoppingBag,
  FiFileText,
  FiClock,
  FiBarChart2,
  FiShoppingCart,
  FiBookmark,
  FiActivity
} from 'react-icons/fi';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30'); // Defaulting to 30 to show off the expanded data

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/dashboard/stats", {
          headers: {
            "Authorization": localStorage.getItem("token")
          }
        });
        const result = await response.json();
        if (response.ok) {
          setData(result);
        } else {
          console.error("Failed to fetch dashboard stats", result);
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  const stats = data && data.stats ? [
    { title: "Today's Engine", value: `₹${data.stats.todaysSales || 0}`, icon: <FiTrendingUp className="text-pink-400 relative z-10 w-8 h-8 group-hover:scale-110 transition-transform duration-300" />, glow: "bg-pink-500/20" },
    { title: "Monthly Velocity", value: `₹${data.stats.monthlyRevenue || 0}`, icon: <FiDollarSign className="text-purple-400 relative z-10 w-8 h-8 group-hover:scale-110 transition-transform duration-300" />, glow: "bg-purple-500/20" },
    { title: "Component Models", value: data.stats.totalProducts || 0, icon: <FiPackage className="text-blue-400 relative z-10 w-8 h-8 group-hover:scale-110 transition-transform duration-300" />, glow: "bg-blue-500/20" },
    { title: "Network Partners", value: data.stats.activeSuppliers || 0, icon: <FiUsers className="text-emerald-400 relative z-10 w-8 h-8 group-hover:scale-110 transition-transform duration-300" />, glow: "bg-emerald-500/20" }
  ] : [
    { title: "Today's Engine", value: "₹0", icon: <FiTrendingUp className="text-pink-400 relative z-10 w-8 h-8" />, glow: "bg-pink-500/20" },
    { title: "Monthly Velocity", value: "₹0", icon: <FiDollarSign className="text-purple-400 relative z-10 w-8 h-8" />, glow: "bg-purple-500/20" },
    { title: "Component Models", value: "0", icon: <FiPackage className="text-blue-400 relative z-10 w-8 h-8" />, glow: "bg-blue-500/20" },
    { title: "Network Partners", value: "0", icon: <FiUsers className="text-emerald-400 relative z-10 w-8 h-8" />, glow: "bg-emerald-500/20" }
  ];

  const recentData = data?.recentActivities || [];

  const recentActivities = recentData.map(activity => {
      let icon, colorClass, gradientClass;
      if (activity.type === 'sale') {
        icon = <FiShoppingCart className="text-blue-300 relative z-10" />;
        colorClass = "border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.5)]";
        gradientClass = "bg-blue-500/20";
      } else if (activity.type === 'stock') {
        icon = <FiPackage className="text-orange-300 relative z-10" />;
        colorClass = "border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.5)]";
        gradientClass = "bg-orange-500/20";
      } else {
        icon = <FiUsers className="text-emerald-300 relative z-10" />;
        colorClass = "border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.5)]";
        gradientClass = "bg-emerald-500/20";
      }
      
      const dateObj = new Date(activity.time);
      const timeStr = dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

      return {
          id: activity.id,
          type: activity.type,
          title: activity.title,
          details: activity.details,
          time: timeStr,
          icon: icon,
          colorClass,
          gradientClass
      };
  });

  const inventorySummary = data?.inventorySummary || { lowStockItems: 0, totalCategories: 0, topSellingTotal: 0 };

  // Custom Tooltip for Recharts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel p-4 border border-white/20 bg-black/80 rounded-xl shadow-[0_0_20px_rgba(236,72,153,0.3)]">
          <p className="text-gray-300 font-mono text-xs mb-1">{`Date: ${label}`}</p>
          <p className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 font-bold text-lg">
            {`₹ ${payload[0].value.toFixed(2)}`}
          </p>
          <p className="text-gray-500 text-xs uppercase tracking-widest mt-1">Net Sales</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen dark-gradient text-white pb-12 overflow-x-hidden pt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 mt-4">
        
        {/* Welcome Header */}
        <div className="glass-panel rounded-3xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center relative overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-pink-600/10 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none"></div>
          <div className="relative z-10 flex-1">
            <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-2 flex items-center gap-4 hover:scale-[1.01] transition-transform origin-left">
              Overview Matrix
              {loading ? (
                <div className="animate-pulse flex space-x-2">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
              ) : (
                <FiActivity className="text-pink-500 animate-pulse w-8 h-8" />
              )}
            </h1>
            <p className="text-gray-400 text-sm tracking-widest uppercase font-medium">Facility operations and economic telemetry</p>
          </div>
          <div className="relative z-10 mt-6 md:mt-0 bg-black/40 border border-white/10 rounded-2xl p-5 backdrop-blur-md hover:border-pink-500/30 transition-colors group">
            <div className="text-center">
              <p className="text-xs text-pink-400 uppercase tracking-widest mb-1 group-hover:animate-pulse">Active Instance Time</p>
              <p className="text-xl font-bold font-mono text-gray-200">
                {new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Nav Cards */}
        <div>
          <div className="flex justify-between items-center mb-6 pl-2">
            <h2 className="text-2xl font-bold text-white tracking-wide">Command Nodes</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            <Card title="Add Products" description="Component Engineering" />
            <Card title="Customer Account" description="Partner Operations" />
            <Card title="Bill Generator" description="Dispatch Invoices" />
            <Card title="Supplier Data" description="Raw Material Logistics" />
          </div>
        </div>

        {/* KPI Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="glass-panel rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-500 transform hover:-translate-y-2 group relative overflow-hidden bg-white/5">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="flex justify-between items-start relative z-10">
                <div className="relative">
                  <div className={`absolute inset-0 blur-lg rounded-full opacity-50 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500 ${stat.glow}`}></div>
                  <div className="p-3 bg-black/40 border border-white/10 rounded-2xl relative z-10 backdrop-blur-xl">
                    {stat.icon}
                  </div>
                </div>
              </div>
              <div className="mt-6 relative z-10">
                <h3 className="text-3xl font-black text-white font-mono tracking-tight mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">{stat.value}</h3>
                <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">{stat.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts & Timeline Sector */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Sales Chart */}
          <div className="glass-panel bg-white/5 lg:col-span-2 rounded-3xl p-6 border border-white/10 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 relative z-10">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-wide">Revenue Telemetry</h2>
                <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Operational Income Visualization</p>
              </div>
              <select 
                className="bg-black/60 border border-pink-500/30 text-white text-xs font-bold tracking-widest uppercase rounded-xl px-4 py-3 focus:outline-none focus:border-pink-500 hover:bg-black/80 transition-colors"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="7">Trailing 7 Days</option>
                <option value="30">Monthly Horizon</option>
                <option value="90">Quarterly Matrix</option>
              </select>
            </div>
            
            <div className="h-[350px] w-full relative z-10">
              {data && (timeRange === '7' ? data.chartData7 : timeRange === '30' ? data.chartData30 : data.chartData90)?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timeRange === '7' ? data.chartData7 : timeRange === '30' ? data.chartData30 : data.chartData90} margin={{ top: 20, right: 10, left: 10, bottom: 20 }}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ec4899" stopOpacity={1}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                      </linearGradient>
                      <linearGradient id="colorSalesHover" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f472b6" stopOpacity={1}/>
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0.8}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff" opacity={0.05} />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#9ca3af', fontSize: timeRange === '90' ? 9 : 12, fontWeight: 600}} 
                      dy={15} 
                      minTickGap={15} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#9ca3af', fontSize: 11, fontWeight: 600}} 
                      tickFormatter={(value) => `₹ ${value >= 1000 ? (value/1000).toFixed(1)+'k' : value}`} 
                      dx={-10}
                    />
                    <Tooltip cursor={{fill: 'rgba(255,255,255,0.02)'}} content={<CustomTooltip />} />
                    <Bar 
                      dataKey="sales" 
                      fill="url(#colorSales)" 
                      radius={[6, 6, 0, 0]} 
                      barSize={timeRange === '7' ? 40 : timeRange === '30' ? 15 : 6}
                      activeBar={<Cell fill="url(#colorSalesHover)" />}
                    >
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full flex items-center justify-center opacity-50">
                  <p className="text-gray-400 font-mono tracking-widest text-sm uppercase">Awaiting Matrix Data</p>
                </div>
              )}
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="glass-panel bg-white/5 rounded-3xl p-6 border border-white/10 flex flex-col h-full max-h-[480px]">
             <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10 shrink-0">
               <div>
                 <h2 className="text-xl font-bold text-white tracking-wide">Activity Log</h2>
                 <p className="text-xs text-gray-500 tracking-widest uppercase mt-1">Live Subsystem Events</p>
               </div>
               <FiClock className="text-pink-500 animate-pulse" size={24} />
             </div>
             
             <div className="overflow-y-auto pr-2 space-y-4 custom-scrollbar flex-1 relative">
               {recentActivities.length > 0 ? recentActivities.map((activity) => (
                 <div key={activity.id} className="group flex items-start p-3 hover:bg-white/5 border border-transparent hover:border-white/10 rounded-2xl transition-all duration-300 cursor-pointer">
                   <div className="relative mr-4 shrink-0 flex items-center justify-center">
                     <div className={`absolute inset-0 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${activity.gradientClass}`}></div>
                     <div className={`p-3 bg-black/60 border rounded-xl relative z-10 transition-transform duration-300 group-hover:scale-110 ${activity.colorClass}`}>
                       {activity.icon}
                     </div>
                   </div>
                   <div className="flex-1 transform transition-transform duration-300 group-hover:translate-x-2">
                     <h4 className="font-bold text-gray-200 text-sm group-hover:text-white transition-colors">{activity.title}</h4>
                     <p className="text-xs text-gray-400 mt-1 mb-2 line-clamp-2 leading-relaxed">{activity.details}</p>
                     <span className="text-[10px] text-gray-500 font-mono font-semibold uppercase tracking-widest bg-black/40 px-2 py-1 rounded inline-block">
                       {activity.time}
                     </span>
                   </div>
                 </div>
               )) : (
                 <div className="py-12 text-center h-full flex items-center justify-center">
                   <p className="text-gray-500 text-sm uppercase tracking-widest">No recent nodes activated</p>
                 </div>
               )}
             </div>
          </div>

        </div>

        {/* Global Inventory Status */}
        <div className="glass-panel bg-gradient-to-br from-black/60 to-[#1a1625]/80 rounded-3xl p-8 border border-white/10 relative overflow-hidden hover:shadow-[0_0_50px_rgba(139,92,246,0.15)] transition-shadow duration-500 mt-8">
           <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px] pointer-events-none"></div>
           <h2 className="text-2xl font-bold text-white tracking-wide mb-6 relative z-10 flex items-center gap-3">
             <FiPackage className="text-purple-400" /> Component Repository Status
           </h2>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
             
             <div className="bg-black/40 backdrop-blur-md border border-red-500/20 hover:border-red-500/50 p-6 rounded-2xl group transition-all duration-300">
               <div className="flex justify-between items-start mb-4">
                 <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl group-hover:bg-red-500/20 transition-colors">
                   <FiTrendingUp className="text-red-400 w-6 h-6 rotate-180" />
                 </div>
               </div>
               <div>
                  <p className="text-4xl font-black text-white font-mono mb-1 group-hover:text-red-400 transition-colors">{inventorySummary.lowStockItems}</p>
                  <h3 className="font-bold text-gray-300 tracking-wide uppercase text-sm mb-1">Depleted Inventory</h3>
                  <p className="text-xs text-gray-500">Items triggering warning levels</p>
               </div>
             </div>

             <div className="bg-black/40 backdrop-blur-md border border-purple-500/20 hover:border-purple-500/50 p-6 rounded-2xl group transition-all duration-300">
               <div className="flex justify-between items-start mb-4">
                 <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl group-hover:bg-purple-500/20 transition-colors">
                   <FiShoppingBag className="text-purple-400 w-6 h-6" />
                 </div>
               </div>
               <div>
                  <p className="text-4xl font-black text-white font-mono mb-1 group-hover:text-purple-400 transition-colors">{inventorySummary.topSellingTotal}</p>
                  <h3 className="font-bold text-gray-300 tracking-wide uppercase text-sm mb-1">Max Velocity Flow</h3>
                  <p className="text-xs text-gray-500">Highest grossing component output</p>
               </div>
             </div>

             <div className="bg-black/40 backdrop-blur-md border border-teal-500/20 hover:border-teal-500/50 p-6 rounded-2xl group transition-all duration-300">
               <div className="flex justify-between items-start mb-4">
                 <div className="p-3 bg-teal-500/10 border border-teal-500/30 rounded-xl group-hover:bg-teal-500/20 transition-colors">
                   <FiPieChart className="text-teal-400 w-6 h-6" />
                 </div>
               </div>
               <div>
                  <p className="text-4xl font-black text-white font-mono mb-1 group-hover:text-teal-400 transition-colors">{inventorySummary.totalCategories}</p>
                  <h3 className="font-bold text-gray-300 tracking-wide uppercase text-sm mb-1">Manufacturing Sectors</h3>
                  <p className="text-xs text-gray-500">Distinct category variants</p>
               </div>
             </div>
             
           </div>
        </div>

      </div>
      
      <Footer />
      <ToastContainer theme="dark" />
    </div>
  );
}

export default Dashboard;