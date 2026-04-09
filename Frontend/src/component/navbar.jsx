import { useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiFileText, FiPackage, FiUsers, FiUser, FiPieChart, FiLogOut } from 'react-icons/fi';
import { useState } from 'react';

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const NavLink = ({ to, icon, text }) => {
    const isActive = location.pathname === to;
    return (
      <button
        onClick={() => {
          navigate(to);
          setMobileMenuOpen(false);
        }}
        className={`flex items-center px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
          isActive 
            ? 'bg-white/10 text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.3)] border border-pink-500/30' 
            : 'text-gray-300 hover:bg-white/5 hover:text-white hover:scale-105'
        }`}
      >
        <span className={`mr-2 ${isActive ? 'animate-pulse' : ''}`}>{icon}</span>
        {text}
      </button>
    );
  };

  return (
    <nav className="glass-panel sticky top-0 z-50 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center shadow-[0_0_20px_rgba(217,70,239,0.5)] animate-pulse-glow">
                 <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                 </svg>
              </div>
              <span className="text-2xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent hover:from-pink-400 hover:to-purple-400 transition-all duration-500">
                Avadhoot Components
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" icon={<FiHome size={18} />} text="Dashboard" />
                <NavLink to="/billgenerator" icon={<FiFileText size={18} />} text="Invoices" />
                <NavLink to="/inventorymanager" icon={<FiPackage size={18} />} text="Inventory" />
                <NavLink to="/customeraccount" icon={<FiUsers size={18} />} text="Clients" />
                <NavLink to="/supplierdata" icon={<FiPackage size={18} />} text="Suppliers" />
                <div className="h-8 w-px bg-white/20 mx-2"></div>
                <NavLink to="/profile" icon={<FiUser size={18} />} text="Profile" />
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 rounded-full text-sm font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300 hover:scale-105 border border-transparent hover:border-red-500/30"
                >
                  <span className="mr-2"><FiLogOut size={18} /></span>
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/" icon={<FiHome size={18} />} text="Home" />
                <NavLink to="/about" icon={<FiPieChart size={18} />} text="About" />
                <button onClick={() => navigate('/login')} className="ml-4 btn-primary px-6 py-2">
                  Portal Login
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-white/10 focus:outline-none transition-colors duration-200"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-white/10 absolute w-full left-0 mt-1 pb-4 shadow-2xl">
          <div className="px-4 pt-4 pb-3 space-y-2 flex flex-col items-start w-full">
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" icon={<FiHome size={18} />} text="Dashboard" />
                <NavLink to="/billgenerator" icon={<FiFileText size={18} />} text="Invoices" />
                <NavLink to="/inventorymanager" icon={<FiPackage size={18} />} text="Inventory" />
                <NavLink to="/customeraccount" icon={<FiUsers size={18} />} text="Clients" />
                <NavLink to="/supplierdata" icon={<FiPackage size={18} />} text="Suppliers" />
                <NavLink to="/profile" icon={<FiUser size={18} />} text="Profile" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-3 mt-2 rounded-lg text-sm font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-all duration-300"
                >
                  <span className="mr-2"><FiLogOut size={18} /></span>
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/" icon={<FiHome size={18} />} text="Home" />
                <NavLink to="/about" icon={<FiPieChart size={18} />} text="About" />
                <button onClick={() => {navigate('/login'); setMobileMenuOpen(false);}} className="w-full mt-4 btn-primary px-6 py-3">
                  Portal Login
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;