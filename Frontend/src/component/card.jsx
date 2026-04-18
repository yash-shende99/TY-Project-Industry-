import { useNavigate } from "react-router-dom";
import React from 'react';
import { 
  FiFileText, 
  FiPlusCircle, 
  FiDollarSign, 
  FiBarChart2, 
  FiShoppingBag, 
  FiUser, 
  FiTruck, 
  FiGrid 
} from 'react-icons/fi';

const Card = (props) => {
  const navigate = useNavigate();

  // Map titles to corresponding icons
  const getIcon = () => {
    switch(props.title) {
      case 'Bill Generator':
        return <FiFileText className="w-12 h-12 mb-4 drop-shadow-[0_0_15px_rgba(59,130,246,0.8)] text-blue-400 group-hover:scale-110 transition-transform duration-300" />;
      case 'Add Products':
        return <FiPlusCircle className="w-12 h-12 mb-4 drop-shadow-[0_0_15px_rgba(16,185,129,0.8)] text-emerald-400 group-hover:rotate-90 transition-transform duration-500" />;
      case 'Show Bills':
        return <FiDollarSign className="w-12 h-12 mb-4 drop-shadow-[0_0_15px_rgba(168,85,247,0.8)] text-purple-400 group-hover:scale-110 transition-transform duration-300" />;
      case 'Stock Analysis':
        return <FiBarChart2 className="w-12 h-12 mb-4 drop-shadow-[0_0_15px_rgba(249,115,22,0.8)] text-orange-400 group-hover:-translate-y-2 transition-transform duration-300" />;
      case 'Shop Products':
        return <FiShoppingBag className="w-12 h-12 mb-4 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)] text-red-400 group-hover:scale-110 transition-transform duration-300" />;
      case 'Customer Account':
        return <FiUser className="w-12 h-12 mb-4 drop-shadow-[0_0_15px_rgba(99,102,241,0.8)] text-indigo-400 group-hover:-translate-y-2 transition-transform duration-300" />;
      case 'Supplier Data':
        return <FiTruck className="w-12 h-12 mb-4 drop-shadow-[0_0_15px_rgba(20,184,166,0.8)] text-teal-400 group-hover:translate-x-2 transition-transform duration-300" />;
      case 'Notes':
        return <FiGrid className="w-12 h-12 mb-4 drop-shadow-[0_0_15px_rgba(236,72,153,0.8)] text-pink-400 group-hover:rotate-180 transition-transform duration-500" />;
      default:
        return <FiGrid className="w-12 h-12 mb-4 drop-shadow-[0_0_15px_rgba(156,163,175,0.8)] text-gray-400" />;
    }
  };

  // Border hover effects and glow based on the card logic
  const getGlow = () => {
    switch(props.title) {
      case 'Bill Generator': return 'hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:border-blue-500/50';
      case 'Add Products': return 'hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:border-emerald-500/50';
      case 'Show Bills': return 'hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:border-purple-500/50';
      case 'Stock Analysis': return 'hover:shadow-[0_0_30px_rgba(249,115,22,0.3)] hover:border-orange-500/50';
      case 'Shop Products': return 'hover:shadow-[0_0_30px_rgba(239,68,68,0.3)] hover:border-red-500/50';
      case 'Customer Account': return 'hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:border-indigo-500/50';
      case 'Supplier Data': return 'hover:shadow-[0_0_30px_rgba(20,184,166,0.3)] hover:border-teal-500/50';
      case 'Notes': return 'hover:shadow-[0_0_30px_rgba(236,72,153,0.3)] hover:border-pink-500/50';
      default: return 'hover:border-white/30';
    }
  };

  const handleCardClick = () => {
    const routes = {
      'Bill Generator': '/billgenerator',
      'Add Products': '/inventorymanager',
      'Show Bills': '/showbills',
      'Stock Analysis': '/stockanalysis',
      'Shop Products': '/productlist',
      'Customer Account': '/customeraccount',
      'Supplier Data': '/supplierData',
      'Notes': '/notes'
    };
    
    if (routes[props.title]) {
      navigate(routes[props.title]);
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className={`group relative overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 w-full rounded-2xl flex flex-col items-center justify-center p-6 cursor-pointer transition-all duration-300 transform hover:-translate-y-2 text-white ${getGlow()}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      
      <div className="flex justify-center items-center relative z-10">
        {props.image ? (
          <img 
            src={props.image} 
            alt={props.title} 
            className="w-16 h-16 object-contain group-hover:scale-110 transition-transform duration-300" 
          />
        ) : (
          <div className="flex items-center justify-center">
            {getIcon()}
          </div>
        )}
      </div>
      
      <h3 className="text-xl font-bold text-center tracking-wide mb-2 relative z-10 group-hover:text-white transition-colors text-gray-200">
        {props.title}
      </h3>
      <p className="text-xs text-center text-gray-400 tracking-wider uppercase mb-6 relative z-10 group-hover:text-gray-300 transition-colors">
        {props.description || 'Access Module'}
      </p>
      
      <div className="mt-auto w-full relative z-10">
        <button className="w-full py-2 px-4 rounded-xl border border-white/10 bg-black/40 hover:bg-white/10 transition-all duration-300 text-sm font-bold tracking-widest uppercase">
          Launch
        </button>
      </div>
    </div>
  );
};

export default Card;