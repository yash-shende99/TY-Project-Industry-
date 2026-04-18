import { FiHeart } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-black/20 border-t border-white/5 text-gray-500 py-12 mt-12 backdrop-blur-md relative z-10 w-full">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          <div className="flex space-x-6 mb-6">
            <a href="#" className="hover:text-pink-400 font-semibold tracking-wide transition-colors">Architecture</a>
            <a href="#" className="hover:text-pink-400 font-semibold tracking-wide transition-colors">Telemetry</a>
            <a href="#" className="hover:text-pink-400 font-semibold tracking-wide transition-colors">Documentation</a>
            <a href="#" className="hover:text-pink-400 font-semibold tracking-wide transition-colors">Support Node</a>
          </div>
          <div className="mb-6">
            <p className="flex items-center text-sm font-mono tracking-widest uppercase text-gray-400">
              Forged with <FiHeart className="mx-2 text-pink-500 animate-pulse" /> by Advanced Core
            </p>
          </div>
          <div className="text-xs tracking-widest uppercase text-gray-600">
            <p className="text-center mb-4">© {new Date().getFullYear()} Avadhoot Components. Secure Infrastructure.</p>
            <div className="flex justify-center space-x-4">
              <a href="#" className="hover:text-purple-400 transition-colors">Data Protocols</a>
              <span className="text-gray-800">|</span>
              <a href="#" className="hover:text-purple-400 transition-colors">System Integrity</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;