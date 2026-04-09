import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { handleSuccess, handleError } from '../utils';
import { ToastContainer } from 'react-toastify';
import { StoreContext } from '../Context/StoreContext';
import { useContext } from 'react';
import { FiSearch, FiPlus, FiX, FiUsers, FiBriefcase, FiEye } from 'react-icons/fi';

const CustomerAccount = () => {
    const { fetchCustomers, customerData, backend_url, token } = useContext(StoreContext);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newCustomer, setNewCustomer] = useState({
        companyName: '',
        contactPersonName: '',
        phoneNumber: '',
        email: '',
        address: '',
        gstin: '',
        industryType: 'Automotive'
    });
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCustomers();
    }, []);

    useEffect(() => {
        if (searchTerm === '') {
            setFilteredCustomers(customerData);
        } else {
            const filtered = customerData.filter(customer =>
                customer.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                customer.gstin?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredCustomers(filtered);
        }
    }, [searchTerm, customerData]);

    const handleViewHistory = (customerId) => {
        navigate(`/customer/${encodeURIComponent(customerId)}`);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCustomer(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddCustomer = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!newCustomer.companyName.trim() || !newCustomer.contactPersonName.trim() || !newCustomer.gstin.trim()) {
            handleError('Company Name, Contact Person, and GSTIN are required');
            setLoading(false);
            return;
        }

        try {
            await axios.post(
                backend_url+'/api/customer/add',
                newCustomer,
                { headers: { Authorization: token } }
            );

            handleSuccess('Customer added successfully');
            await fetchCustomers();

            setShowAddForm(false);
            setNewCustomer({ companyName: '', contactPersonName: '', phoneNumber: '', email: '', address: '', gstin: '', industryType: 'Automotive' });
        } catch (error) {
            handleError(error.response?.data?.message || 'Failed to add customer');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen dark-gradient p-4 md:p-8 animate-fade-in">
            <ToastContainer theme="dark" />
            
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between gap-6 mb-8 lg:items-center">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent flex items-center gap-3">
                            <FiBriefcase className="text-blue-500" /> B2B Client Directory
                        </h1>
                        <p className="text-gray-400 mt-2">Manage OEM partners, vendors, and industrial clients</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <div className="relative group flex-1">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <FiSearch className="text-blue-400 group-focus-within:text-purple-400 transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by company or GSTIN..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-black/40 border border-white/10 rounded-full focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-white placeholder-gray-500 outline-none transition-all shadow-inner"
                            />
                        </div>
                        
                        <button
                            onClick={() => setShowAddForm(!showAddForm)}
                            className="btn-primary flex items-center justify-center px-6 py-3 min-w-[200px]"
                        >
                            <FiPlus className="mr-2" size={20} />
                            {showAddForm ? 'Cancel Entry' : 'Add New Client'}
                        </button>
                    </div>
                </div>

                {/* Add Customer Form */}
                {showAddForm && (
                    <div className="glass-panel p-8 mb-10 rounded-2xl animate-slide-down border-l-4 border-l-blue-500 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                        <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2"><FiUsers className="text-blue-400" /> Register Client</h2>
                            <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-white transition-colors"><FiX size={24} /></button>
                        </div>
                        
                        <form onSubmit={handleAddCustomer} className="space-y-6 relative z-10">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Company Name *</label>
                                    <input type="text" name="companyName" value={newCustomer.companyName} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg input-glow" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">GSTIN *</label>
                                    <input type="text" name="gstin" value={newCustomer.gstin} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg input-glow border-blue-500/50 bg-blue-900/10 focus:border-blue-500 font-mono" required />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Contact Person *</label>
                                    <input type="text" name="contactPersonName" value={newCustomer.contactPersonName} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg input-glow" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Phone Number *</label>
                                    <input type="tel" name="phoneNumber" value={newCustomer.phoneNumber} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg input-glow" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Industry Type</label>
                                    <select name="industryType" value={newCustomer.industryType} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg input-glow [&>option]:text-gray-900">
                                        <option value="Automotive">Automotive</option>
                                        <option value="Construction">Construction</option>
                                        <option value="OEM">OEM</option>
                                        <option value="Vendor">Vendor</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4 border-t border-white/10 space-x-4">
                                <button type="button" onClick={() => setShowAddForm(false)} className="px-6 py-3 rounded-lg font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors">Cancel</button>
                                <button type="submit" className="btn-primary px-8 py-3 flex items-center" disabled={loading}>
                                    {loading ? (
                                        <><span className="animate-spin mr-2 border-2 border-white border-t-transparent rounded-full w-5 h-5"></span> Registering...</>
                                    ) : 'Complete Registration'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Customers Table */}
                <div className="glass-panel rounded-2xl shadow-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-white/10">
                            <thead className="bg-[#1a1625]/80 backdrop-blur-sm">
                                <tr>
                                    <th className="px-6 py-5 text-left text-xs font-bold text-blue-300 uppercase tracking-wider">Partner Entity</th>
                                    <th className="px-6 py-5 text-left text-xs font-bold text-blue-300 uppercase tracking-wider">Tax ID (GSTIN)</th>
                                    <th className="px-6 py-5 text-left text-xs font-bold text-blue-300 uppercase tracking-wider">Operations Contact</th>
                                    <th className="px-6 py-5 text-right text-xs font-bold text-blue-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {filteredCustomers.length > 0 ? (
                                    filteredCustomers.map((customer) => (
                                        <tr key={customer._id} className="hover:bg-white/5 transition-all duration-300 group">
                                            <td className="px-6 py-5 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                                                        <span className="text-blue-400 font-extrabold text-lg">
                                                            {customer.companyName?.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="ml-5">
                                                        <div className="text-base font-bold text-white tracking-wide">{customer.companyName}</div>
                                                        <div className="text-xs text-blue-400 mt-1 uppercase tracking-widest">{customer.industryType}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap">
                                                <div className="text-sm font-mono text-gray-300 border border-white/10 bg-black/40 px-3 py-1.5 rounded-lg inline-block shadow-inner group-hover:border-blue-500/30 transition-colors">
                                                    {customer.gstin}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap">
                                                <div className="text-sm text-gray-200 font-medium flex items-center gap-2"><FiUser className="text-gray-500" /> {customer.contactPersonName}</div>
                                                <div className="text-xs text-gray-500 mt-1">{customer.phoneNumber}</div>
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap text-right">
                                                <button
                                                    onClick={() => handleViewHistory(customer._id)}
                                                    className="inline-flex items-center px-4 py-2 border border-blue-500/30 text-sm font-bold rounded-lg text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 hover:text-blue-300 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                                                >
                                                    <FiEye className="mr-2" size={16} /> Ledger
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                                    <FiUsers className="h-10 w-10 text-gray-500 opacity-50" />
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-300">
                                                    {searchTerm ? 'No matching partners found' : 'No clients registered'}
                                                </h3>
                                                <p className="mt-2 text-sm text-gray-500 max-w-sm">
                                                    {searchTerm ? 'Adjust your search queries.' : 'Begin your B2B journey by onboarding your first industrial client.'}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerAccount;