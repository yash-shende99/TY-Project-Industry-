import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { StoreContext } from '../Context/StoreContext';
import { FiSearch, FiTruck, FiPaperclip, FiCheckSquare, FiAlertCircle } from 'react-icons/fi';

const SupplierForm = () => {
  const {backend_url, token} = useContext(StoreContext);
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Manufacturing Raw Material Supplier State
  const [formData, setFormData] = useState({
    supplierName: '',
    contactPerson: '',
    phoneNumber: '',
    gstin: '',
    materialSupplied: '',
    lastPurchaseDate: '',
    ratePerKg: '',
    image: null
  });

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get(backend_url+'/api/supplier/suppliers', {
        headers: { Authorization: token }
      });
      setSuppliers(response.data.suppliers);
      setFilteredSuppliers(response.data.suppliers);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredSuppliers(suppliers);
    } else {
      const filtered = suppliers.filter(supplier =>
        supplier.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.materialSupplied?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSuppliers(filtered);
    }
  }, [searchTerm, suppliers]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const data = new FormData();
      data.append('supplierName', formData.supplierName);
      data.append('contactPerson', formData.contactPerson);
      data.append('phoneNumber', formData.phoneNumber);
      data.append('gstin', formData.gstin);
      data.append('materialSupplied', formData.materialSupplied);
      data.append('lastPurchaseDate', formData.lastPurchaseDate);
      data.append('ratePerKg', formData.ratePerKg);
      
      if (formData.image) {
        data.append('image', formData.image);
      }

      await axios.post(backend_url+'/api/supplier/supplier-data', data, {
        headers: {
          Authorization: token,
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('Raw Material Supplier added successfully!');
      setFormData({
        supplierName: '', contactPerson: '', phoneNumber: '', gstin: '', 
        materialSupplied: '', lastPurchaseDate: '', ratePerKg: '', image: null
      });
      if(document.getElementById('fileInput')) document.getElementById('fileInput').value = '';
      fetchSuppliers();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add supplier');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen dark-gradient p-4 md:p-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-6 mb-8 lg:items-center">
            <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent flex items-center gap-3">
                    <FiTruck className="text-indigo-500" /> Vendor Procurement
                </h1>
                <p className="text-gray-400 mt-2">Manage raw material suppliers, rates, and procurement history.</p>
            </div>
        </div>

        <div className="glass-panel p-8 mb-10 rounded-2xl animate-slide-down border-l-4 border-l-indigo-500 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10 relative z-10">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2"><FiTruck className="text-indigo-400" /> Register Raw Material Vendor</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Supplier Name *</label>
                <input type="text" name="supplierName" value={formData.supplierName} onChange={handleChange} className="w-full px-4 py-3 rounded-lg input-glow" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Contact Person</label>
                <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange} className="w-full px-4 py-3 rounded-lg input-glow" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Phone Number *</label>
                <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full px-4 py-3 rounded-lg input-glow" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">GSTIN *</label>
                <input type="text" name="gstin" value={formData.gstin} onChange={handleChange} className="w-full px-4 py-3 rounded-lg input-glow border-indigo-500/50 bg-indigo-900/10 focus:border-indigo-500 font-mono" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Material Supplied *</label>
                <input type="text" name="materialSupplied" placeholder="e.g. EN8 Round Bars" value={formData.materialSupplied} onChange={handleChange} className="w-full px-4 py-3 rounded-lg input-glow border-purple-500/50 bg-purple-900/10 focus:border-purple-500 text-purple-100" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Last Purchase Date</label>
                <input type="date" name="lastPurchaseDate" value={formData.lastPurchaseDate} onChange={handleChange} className="w-full px-4 py-3 rounded-lg input-glow" style={{ colorScheme: 'dark' }} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Rate per Kg (₹)</label>
                <input type="number" name="ratePerKg" value={formData.ratePerKg} onChange={handleChange} className="w-full px-4 py-3 rounded-lg input-glow font-mono" />
              </div>
              {/* Optional File Upload styled nicely */}
              <div className="col-span-1 md:col-span-2">
                <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Material Invoice Scan (Optional)</label>
                <div className="relative">
                    <input id="fileInput" type="file" accept="image/*" onChange={handleFileChange} className="block w-full text-sm text-gray-400 file:mr-4 file:py-3 file:px-4 file:rounded-l-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-500/20 file:text-indigo-300 hover:file:bg-indigo-500/30 bg-black/40 border border-white/10 rounded-lg cursor-pointer" />
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-white/10">
                <button type="submit" disabled={loading} className="btn-primary px-8 py-3 flex items-center justify-center min-w-[200px]">
                    {loading ? <><span className="animate-spin mr-2 border-2 border-white border-t-transparent rounded-full w-5 h-5"></span> Registering...</> : <><FiCheckSquare className="mr-2" /> Register Vendor</>}
                </button>
            </div>
          </form>
        </div>

        <div className="glass-panel rounded-2xl shadow-2xl overflow-hidden p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4 border-b border-white/10 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">Raw Material Suppliers</h2>
            <div className="relative w-full md:w-72 group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiSearch className="text-indigo-400 group-focus-within:text-purple-400 transition-colors" />
                </div>
              <input type="text" placeholder="Search by name or material..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="block w-full pl-11 pr-4 py-2 border border-white/10 bg-black/40 rounded-full focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-500 outline-none" />
            </div>
          </div>

          {filteredSuppliers.length === 0 ? (
            <div className="text-center py-12 flex flex-col items-center">
                <FiAlertCircle size={48} className="text-gray-500 opacity-50 mb-4" />
                <p className="text-gray-400">No raw material suppliers found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/10">
                <thead className="bg-[#1a1625]/80 backdrop-blur-sm">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-indigo-300 uppercase tracking-wider">Vendor Entity</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-indigo-300 uppercase tracking-wider">GSTIN</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-indigo-300 uppercase tracking-wider">Contracted Material</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-indigo-300 uppercase tracking-wider">Negotiated Rate/Kg</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-indigo-300 uppercase tracking-wider">Contact Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredSuppliers.map((supplier) => (
                    <tr key={supplier._id} className="hover:bg-white/5 transition-all duration-300 group">
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center">
                          {supplier.imageUrl ? (
                            <img className="h-12 w-12 border border-indigo-500/30 rounded-lg object-cover mr-4 cursor-pointer transform group-hover:scale-110 transition-transform shadow-[0_0_10px_rgba(99,102,241,0.2)]" src={`${supplier.imageUrl}`} alt="Scan" onClick={() => window.open(supplier.imageUrl, '_blank')} title="View Scan" />
                          ) : (
                            <div className="h-12 w-12 border border-indigo-500/30 rounded-lg bg-indigo-500/10 mr-4 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                              <FiPaperclip className="text-indigo-400" />
                            </div>
                          )}
                          <div>
                            <div className="text-base font-bold text-white shadow-sm">{supplier.supplierName}</div>
                            <div className="text-xs text-gray-500 tracking-wide mt-1">Since: {supplier.lastPurchaseDate ? new Date(supplier.lastPurchaseDate).toLocaleDateString() : 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                          <span className="text-sm font-mono text-gray-300 border border-white/10 bg-black/40 px-3 py-1.5 rounded-lg inline-block shadow-inner group-hover:border-indigo-500/30 transition-colors">{supplier.gstin}</span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-indigo-400">
                        {supplier.materialSupplied}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-200">
                        <span className="bg-purple-500/10 text-purple-300 border border-purple-500/20 px-3 py-1 rounded font-mono">
                            ₹{supplier.ratePerKg || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-right text-sm">
                        <div className="text-gray-300 font-medium">{supplier.contactPerson}</div>
                        <div className="text-gray-500 mt-1">{supplier.phoneNumber}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplierForm;