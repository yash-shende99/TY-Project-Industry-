import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';
import jsPDF from 'jspdf';
import { Plus, Trash2, Printer, Download, FileText, Send, Building, Truck, Box } from 'lucide-react';
import { ToastContainer } from 'react-toastify';
import { handleSuccess, handleError } from "../utils.js";
import { StoreContext } from '../Context/StoreContext.jsx';
import 'react-toastify/dist/ReactToastify.css';

function InvoiceGenerator() {
    const { fetchCustomers, customerData, backend_url, token } = useContext(StoreContext);
    const [products, setProducts] = useState([]);
    const [items, setItems] = useState([]);
    const [invoice, setInvoice] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    // Customer Info
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [customerGstin, setCustomerGstin] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    
    // Dispatch Info
    const [poNumber, setPoNumber] = useState('');
    const [poDate, setPoDate] = useState('');
    const [dispatchDate, setDispatchDate] = useState('');
    const [vehicleNumber, setVehicleNumber] = useState('');
    
    // Add Item Controls
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantityInput, setQuantityInput] = useState();
    const [rateInput, setRateInput] = useState();
    
    const invoiceRef = useRef();

    useEffect(() => {
        fetchCustomers();
        fetchProducts();
    }, []);

    useEffect(() => {
        if (selectedCustomer) {
            const customer = customerData.find(c => c._id === selectedCustomer);
            if (customer) {
                setCompanyName(customer.companyName || customer.customerName);
                setCustomerGstin(customer.gstin || '');
                setPhoneNumber(customer.phoneNumber || '');
            }
        }
    }, [selectedCustomer, customerData]);

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(backend_url + '/api/inventory/list', { headers: { "Authorization": token } });
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching components', error);
        } finally {
            setIsLoading(false);
        }
    };

    const addItem = () => {
        if (!selectedProduct || !quantityInput || !rateInput) {
            handleError('Please select a product, enter quantity, and enter a rate.');
            return;
        }

        const product = products.find(p => p._id === selectedProduct);
        if (!product) return;

        const quantityNum = parseFloat(quantityInput);
        const rateNum = parseFloat(rateInput);
        
        if (quantityNum <= 0 || rateNum <= 0) {
            handleError('Quantity and Rate must be greater than zero.');
            return;
        }

        const existingItemIndex = items.findIndex(item => item.productId === selectedProduct);

        if (existingItemIndex !== -1) {
            const updatedItems = [...items];
            updatedItems[existingItemIndex].quantity += quantityNum;
            updatedItems[existingItemIndex].price = rateNum;
            updatedItems[existingItemIndex].total = updatedItems[existingItemIndex].quantity * rateNum;
            setItems(updatedItems);
            handleSuccess(`Updated ${product.name} quantity.`);
        } else {
            setItems([...items, {
                productId: product._id,
                productName: product.name,
                drawingNumber: product.drawingNumber,
                quantity: quantityNum,
                price: rateNum,
                total: rateNum * quantityNum
            }]);
            handleSuccess(`Added ${product.name} to invoice.`);
        }

        setSelectedProduct('');
        setQuantityInput('');
        setRateInput('');
    };

    const removeItem = (index) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    };

    const generateInvoice = async () => {
        if (!companyName || items.length === 0) {
            handleError('Company name and at least one component are required.');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(backend_url + '/api/bill/create', {
                customerName: companyName, // Map backwards compatibility
                companyName: companyName,
                phoneNumber: phoneNumber,
                gstin: customerGstin,
                poNumber: poNumber,
                poDate: poDate || new Date().toISOString(),
                dispatchDate: dispatchDate || new Date().toISOString(),
                vehicleNumber: vehicleNumber,
                items: items,
                subTotal: items.reduce((acc, item) => acc + item.total, 0),
                taxAmount: items.reduce((acc, item) => acc + item.total, 0) * 0.18,
                grandTotal: items.reduce((acc, item) => acc + item.total, 0) * 1.18,
                customerId: selectedCustomer || null
            }, { headers: { "Authorization": token } });

            setInvoice(response.data);
            handleSuccess('Tax Invoice generated securely');
        } catch (error) {
            handleError("Error in generating invoice.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setItems([]);
        setCompanyName('');
        setCustomerGstin('');
        setPhoneNumber('');
        setPoNumber('');
        setPoDate('');
        setDispatchDate('');
        setVehicleNumber('');
        setSelectedCustomer('');
        setInvoice(null);
    }

    const handlePrint = useReactToPrint({
        content: () => invoiceRef.current,
        documentTitle: `Tax_Invoice_${invoice?.billNumber || 'New'}`,
    });

    const saveAsPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.text("AVADHOOT AUTO COMPONENTS", 105, 20, { align: "center" });
        doc.setFontSize(12);
        doc.text("TAX INVOICE", 105, 30, { align: "center" });
        doc.line(20, 35, 190, 35);

        doc.setFontSize(10);
        doc.text(`Company Name: ${invoice.companyName || invoice.customerName}`, 20, 45);
        doc.text(`GSTIN: ${invoice.gstin || 'N/A'}`, 20, 50);
        doc.text(`Invoice No: ${invoice.billNumber}`, 140, 45);
        doc.text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`, 140, 50);
        doc.text(`PO Number: ${invoice.poNumber || 'N/A'}`, 20, 60);

        doc.setFillColor(230, 230, 230);
        doc.rect(20, 70, 170, 8, "F");
        doc.text("Description", 22, 75);
        doc.text("Draw No.", 90, 75);
        doc.text("Qty", 130, 75);
        doc.text("Rate", 150, 75);
        doc.text("Total", 175, 75);

        let y = 85;
        invoice.items.forEach((item) => {
            doc.text(item.productName, 22, y);
            doc.text(item.drawingNumber || '-', 90, y);
            doc.text(item.quantity.toString(), 130, y);
            doc.text(item.price.toFixed(2), 150, y);
            doc.text(item.total.toFixed(2), 175, y);
            y += 8;
        });

        doc.line(20, y+5, 190, y+5);
        
        y += 15;
        let subTotal = invoice.subTotal || invoice.items.reduce((a, b) => a + b.total, 0);
        let tax = subTotal * 0.18;
        let grandTotal = subTotal + tax;

        doc.text(`Sub Total: Rs. ${subTotal.toFixed(2)}`, 140, y);
        doc.text(`CGST (9%): Rs. ${(tax/2).toFixed(2)}`, 140, y+8);
        doc.text(`SGST (9%): Rs. ${(tax/2).toFixed(2)}`, 140, y+16);
        doc.setFont(undefined, 'bold');
        doc.text(`Grand Total: Rs. ${grandTotal.toFixed(2)}`, 140, y+24);
        doc.setFont(undefined, 'normal');
        
        doc.save(`Invoice_${invoice.billNumber}.pdf`);
    };

    const subTotal = items.reduce((acc, item) => acc + item.total, 0);
    const taxAmount = subTotal * 0.18;
    const finalTotal = subTotal + taxAmount;

    return (
        <div className="min-h-screen dark-gradient p-4 md:p-8 animate-fade-in">
            <div className="max-w-6xl mx-auto rounded-3xl glass-panel overflow-hidden shadow-[0_0_50px_rgba(236,72,153,0.15)] relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-pink-600/10 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none"></div>
                <div className="bg-[#1a1625]/80 backdrop-blur-md p-8 border-b border-white/10 flex items-center justify-between relative z-10">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500 flex items-center gap-3">
                            <FileText size={32} className="text-pink-500" /> Executive Dispatch & Billing
                        </h1>
                        <p className="text-gray-400 mt-2 text-sm tracking-wide uppercase">Generate B2B GST Invoices & Dispatch Notes</p>
                    </div>
                </div>

                <div className="p-8 relative z-10">
                    {!invoice ? (
                        <div className="space-y-8 animate-slide-down">
                            {/* B2B Customer & Dispatch Info */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="glass-panel p-6 rounded-2xl bg-white/5 border border-white/10">
                                    <h2 className="text-xl font-bold text-white border-b border-white/10 pb-4 mb-6 flex items-center"><Building className="text-pink-400 mr-2" size={20} /> Client Details</h2>
                                    <div className="space-y-5">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Select Client Profile</label>
                                            <select value={selectedCustomer} onChange={(e) => setSelectedCustomer(e.target.value)} className="w-full px-4 py-3 border border-white/10 rounded-xl bg-black/40 text-white focus:ring-2 focus:ring-pink-500 outline-none [&>option]:text-gray-900 transition-all">
                                                <option value="">-- Manual Entity Entry --</option>
                                                {customerData.map(c => <option key={c._id} value={c._id}>{c.companyName || c.customerName} ({c.gstin})</option>)}
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-2 gap-5">
                                            <div className="col-span-2">
                                                <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Company Name *</label>
                                                <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className="w-full px-4 py-3 rounded-xl input-glow bg-black/40" required />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-pink-400 mb-2 uppercase tracking-wider">GSTIN *</label>
                                                <input type="text" value={customerGstin} onChange={e => setCustomerGstin(e.target.value)} className="w-full px-4 py-3 rounded-xl input-glow border-pink-500/50 bg-pink-900/10 focus:border-pink-500 text-white font-mono uppercase" required />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Contact No.</label>
                                                <input type="text" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} className="w-full px-4 py-3 rounded-xl input-glow bg-black/40" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="glass-panel p-6 rounded-2xl bg-white/5 border border-white/10">
                                    <h2 className="text-xl font-bold text-white border-b border-white/10 pb-4 mb-6 flex items-center"><Truck className="text-purple-400 mr-2" size={20} /> Logistics & PO</h2>
                                    <div className="grid grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">PO Number</label>
                                            <input type="text" value={poNumber} onChange={e => setPoNumber(e.target.value)} className="w-full px-4 py-3 rounded-xl input-glow bg-black/40 font-mono" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">PO Date</label>
                                            <input type="date" value={poDate} onChange={e => setPoDate(e.target.value)} className="w-full px-4 py-3 rounded-xl input-glow bg-black/40" style={{ colorScheme: 'dark' }} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Dispatch Date</label>
                                            <input type="date" value={dispatchDate} onChange={e => setDispatchDate(e.target.value)} className="w-full px-4 py-3 rounded-xl input-glow bg-black/40" style={{ colorScheme: 'dark' }} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Vehicle Reg No.</label>
                                            <input type="text" value={vehicleNumber} onChange={e => setVehicleNumber(e.target.value)} className="w-full px-4 py-3 rounded-xl input-glow bg-black/40 uppercase font-mono tracking-widest text-purple-300" placeholder="MH 12 AB 1234" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Components Selection */}
                            <div className="glass-panel p-6 rounded-2xl bg-white/5 border border-white/10">
                                <h2 className="text-xl font-bold text-white border-b border-white/10 pb-4 mb-6 flex items-center"><Box className="text-blue-400 mr-2" size={20} /> Component Roster</h2>
                                
                                <div className="p-5 rounded-xl border border-blue-500/30 bg-blue-500/5 flex flex-col md:flex-row gap-4 items-end mb-8">
                                    <div className="flex-grow w-full">
                                        <label className="block text-xs font-semibold text-blue-300 mb-2 uppercase tracking-wider">Insert Component from Active Inventory</label>
                                        <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} className="w-full px-4 py-3 rounded-xl input-glow bg-black/60 text-white font-medium border border-blue-500/50 [&>option]:text-gray-900">
                                            <option value="">-- Await Component Selection --</option>
                                            {products.map(p => (
                                                <option key={p._id} value={p._id}>{p.name} | Drw: {p.drawingNumber || 'N/A'}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="w-full md:w-32">
                                        <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Volume</label>
                                        <input type="number" value={quantityInput} onChange={e => setQuantityInput(e.target.value)} min="1" className="w-full px-4 py-3 rounded-xl input-glow bg-black/40 text-center font-mono" placeholder="Qty" />
                                    </div>
                                    <div className="w-full md:w-48">
                                        <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Negotiated Rate (₹)</label>
                                        <input type="number" value={rateInput} onChange={e => setRateInput(e.target.value)} min="0.01" step="0.01" className="w-full px-4 py-3 rounded-xl input-glow bg-black/40 text-right font-mono" placeholder="₹ 0.00" />
                                    </div>
                                    <button onClick={addItem} className="btn-primary w-full md:w-auto px-8 py-3 flex-shrink-0 flex justify-center shadow-[0_0_20px_rgba(217,70,239,0.3)]">
                                        <Plus size={20} className="mr-2" /> Inject
                                    </button>
                                </div>

                                {/* Items Table */}
                                <div className="border border-white/10 rounded-xl overflow-hidden shadow-inner">
                                    <table className="min-w-full divide-y divide-white/10">
                                        <thead className="bg-black/60">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Component Nomenclature</th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Drawing Ref.</th>
                                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Vol</th>
                                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Rate</th>
                                                <th className="px-6 py-4 text-right text-xs font-bold text-pink-400 uppercase tracking-wider">Subtotal (₹)</th>
                                                <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Del</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5 bg-black/20">
                                            {items.length > 0 ? items.map((item, index) => (
                                                <tr key={index} className="hover:bg-white/5 transition-colors group">
                                                    <td className="px-6 py-4 text-sm font-bold text-white tracking-wide">{item.productName}</td>
                                                    <td className="px-6 py-4 text-sm font-mono text-gray-500">{item.drawingNumber || '-'}</td>
                                                    <td className="px-6 py-4 text-sm text-right text-gray-300 font-mono">{item.quantity}</td>
                                                    <td className="px-6 py-4 text-sm text-right text-gray-300 font-mono">₹{item.price.toFixed(2)}</td>
                                                    <td className="px-6 py-4 text-sm text-right font-bold text-pink-300 font-mono">₹{item.total.toFixed(2)}</td>
                                                    <td className="px-6 py-4 text-center">
                                                        <button onClick={() => removeItem(index)} className="p-2 text-gray-600 hover:text-red-400 bg-transparent hover:bg-red-500/10 rounded-lg transition-all border border-transparent hover:border-red-500/30 inline-block mx-auto">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            )) : <tr><td colSpan="6" className="text-center py-12 text-gray-500">No components scheduled for dispatch.</td></tr>}
                                        </tbody>
                                        {items.length > 0 && (
                                            <tfoot className="bg-black/60 border-t border-white/20">
                                                <tr>
                                                    <td colSpan="4" className="px-6 py-4 text-right font-medium text-gray-400 uppercase text-xs tracking-wider">Taxable Assessment:</td>
                                                    <td className="px-6 py-4 text-right font-bold text-white font-mono text-lg">₹{subTotal.toFixed(2)}</td>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <td colSpan="4" className="px-6 py-3 text-right font-medium text-purple-400 uppercase text-xs tracking-wider">GST Impact (18%):</td>
                                                    <td className="px-6 py-3 text-right font-bold text-purple-300 font-mono">₹{taxAmount.toFixed(2)}</td>
                                                    <td></td>
                                                </tr>
                                                <tr className="border-t border-white/10 bg-gradient-to-r from-transparent to-pink-900/20">
                                                    <td colSpan="4" className="px-6 py-6 text-right font-extrabold text-pink-400 tracking-widest uppercase">Computed Grand Total:</td>
                                                    <td className="px-6 py-6 text-right font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 text-2xl font-mono">₹{finalTotal.toFixed(2)}</td>
                                                    <td></td>
                                                </tr>
                                            </tfoot>
                                        )}
                                    </table>
                                </div>
                            </div>

                            <div className="flex justify-end mt-8">
                                <button onClick={generateInvoice} disabled={items.length === 0 || isLoading} className="btn-primary px-10 py-4 flex items-center justify-center min-w-[300px] text-lg disabled:opacity-50 disabled:grayscale">
                                    {isLoading ? <span className="animate-pulse">Synthesizing...</span> : <><Send size={20} className="mr-3" /> Authorize & Imprint Invoice</>}
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* INVOICE PREVIEW & ACTIONS */
                        <div className="animate-fade-in">
                            <div className="mb-8 flex flex-col md:flex-row gap-4 border-b border-white/10 pb-8 bg-black/20 p-6 rounded-2xl">
                                <button onClick={handlePrint} className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 outline outline-transparent hover:outline-blue-500 text-white font-bold rounded-xl flex items-center justify-center transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)]">
                                    <Printer size={20} className="mr-2" /> Execute Print
                                </button>
                                <button onClick={saveAsPDF} className="flex-1 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 outline outline-transparent hover:outline-emerald-500 text-white font-bold rounded-xl flex items-center justify-center transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                                    <Download size={20} className="mr-2" /> Export to PDF
                                </button>
                                <button onClick={resetForm} className="flex-1 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 flex items-center justify-center transition-all">
                                    <Plus size={20} className="mr-2" /> Start New Iteration
                                </button>
                            </div>

                            {/* PRINTABLE AREA - KEEPS LIGHT THEME */}
                            <div className="bg-gray-100 p-4 rounded-xl">
                                <div ref={invoiceRef} className="p-10 border border-gray-300 bg-white text-black shadow-2xl print:shadow-none print:border-none mx-auto print:p-0" style={{maxWidth: '800px'}}>
                                    <div className="text-center mb-8 pb-6 border-b-2 border-gray-900">
                                        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-1">AVADHOOT AUTO COMPONENTS</h1>
                                        <p className="text-sm font-bold text-gray-700 tracking-wide">Manufacturer of Precision Machined Components</p>
                                        <p className="text-xs text-gray-600 mt-1">Gat No. 123, Industrial Area, Pune</p>
                                        <p className="text-xs text-gray-600">Phone: 9876543210 | Email: avadhootcomponents@gmail.com</p>
                                        <div className="mt-6 inline-block border-2 border-gray-900 rounded-lg px-6 py-2">
                                            <h2 className="text-xl font-bold uppercase tracking-widest text-gray-900 m-0 leading-none">Tax Invoice</h2>
                                        </div>
                                    </div>

                                    <div className="flex justify-between mb-8 text-sm">
                                        <div className="w-1/2 pr-4">
                                            <p className="font-bold text-gray-600 uppercase text-xs mb-2 tracking-wider">Billed To (Consignee)</p>
                                            <p className="font-bold text-gray-900 text-lg mb-1">{invoice.companyName || invoice.customerName}</p>
                                            <p className="text-gray-800 font-mono font-medium mb-1">GSTIN: {invoice.gstin || 'UNREGISTERED'}</p>
                                            {invoice.phoneNumber && <p className="text-gray-700">Contact: {invoice.phoneNumber}</p>}
                                        </div>
                                        <div className="w-1/2 pl-4">
                                            <table className="w-full border-collapse border border-gray-300">
                                                <tbody>
                                                    <tr>
                                                        <td className="border border-gray-300 p-2 font-bold text-xs uppercase bg-gray-50 text-gray-600 w-1/3">Invoice No.</td>
                                                        <td className="border border-gray-300 p-2 font-bold text-gray-900">{invoice.billNumber}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="border border-gray-300 p-2 font-bold text-xs uppercase bg-gray-50 text-gray-600">Date</td>
                                                        <td className="border border-gray-300 p-2 font-medium">{new Date(invoice.createdAt).toLocaleDateString()}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="border border-gray-300 p-2 font-bold text-xs uppercase bg-gray-50 text-gray-600">PO Ref.</td>
                                                        <td className="border border-gray-300 p-2 font-medium">{invoice.poNumber || '-'}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="border border-gray-300 p-2 font-bold text-xs uppercase bg-gray-50 text-gray-600">Vehicle No.</td>
                                                        <td className="border border-gray-300 p-2 font-medium uppercase tracking-wider">{invoice.vehicleNumber || '-'}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <table className="w-full text-sm border-collapse border border-gray-900 mb-8">
                                        <thead>
                                            <tr className="bg-gray-100 border-b border-gray-900">
                                                <th className="border-r border-gray-900 px-3 py-3 text-center font-bold text-gray-800 w-10">Sr</th>
                                                <th className="border-r border-gray-900 px-3 py-3 text-left font-bold text-gray-800">Description of Goods</th>
                                                <th className="border-r border-gray-900 px-3 py-3 text-center font-bold text-gray-800 w-24">Drawing No.</th>
                                                <th className="border-r border-gray-900 px-3 py-3 text-right font-bold text-gray-800 w-20">Qty</th>
                                                <th className="border-r border-gray-900 px-3 py-3 text-right font-bold text-gray-800 w-24">Rate (₹)</th>
                                                <th className="px-3 py-3 text-right font-bold text-gray-800 w-32">Amount (₹)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {invoice.items.map((it, idx) => (
                                                <tr key={idx} className="border-b border-gray-300">
                                                    <td className="border-r border-gray-900 px-3 py-2 text-center text-gray-700">{idx + 1}</td>
                                                    <td className="border-r border-gray-900 px-3 py-2 font-bold text-gray-900">{it.productName}</td>
                                                    <td className="border-r border-gray-900 px-3 py-2 text-center font-mono text-xs text-gray-600">{it.drawingNumber || '-'}</td>
                                                    <td className="border-r border-gray-900 px-3 py-2 text-right font-medium">{it.quantity}</td>
                                                    <td className="border-r border-gray-900 px-3 py-2 text-right">{it.price.toFixed(2)}</td>
                                                    <td className="px-3 py-2 text-right font-medium">{(it.total).toFixed(2)}</td>
                                                </tr>
                                            ))}
                                            <tr style={{height: '100px'}}>
                                                <td className="border-r border-gray-900"></td><td className="border-r border-gray-900"></td><td className="border-r border-gray-900"></td><td className="border-r border-gray-900"></td><td className="border-r border-gray-900"></td><td></td>
                                            </tr>
                                        </tbody>
                                        <tfoot>
                                            {(() => {
                                                const sTotal = invoice.subTotal || invoice.items.reduce((a,b) => a+b.total, 0);
                                                const tax = sTotal * 0.18;
                                                const gTotal = sTotal + tax;
                                                return (
                                                <>
                                                    <tr className="border-t border-gray-900">
                                                        <td colSpan="5" className="border-r border-gray-900 px-3 py-2 text-right font-bold text-gray-800 uppercase text-xs">Sub Total</td>
                                                        <td className="px-3 py-2 text-right font-bold text-gray-900">₹{sTotal.toFixed(2)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td colSpan="5" className="border-r border-gray-900 px-3 py-2 text-right font-bold text-gray-600 text-xs">CGST / IGST @ 18%</td>
                                                        <td className="px-3 py-2 text-right font-medium text-gray-800">₹{tax.toFixed(2)}</td>
                                                    </tr>
                                                    <tr className="border-t-2 border-gray-900 bg-gray-100">
                                                        <td colSpan="4" className="border-r border-gray-900 px-3 py-3 text-right">
                                                            <span className="text-[10px] text-gray-500 font-bold block uppercase tracking-widest text-center">SUBJECT TO PUNE JURISDICTION</span>
                                                        </td>
                                                        <td className="border-r border-gray-900 px-3 py-3 text-right font-black text-gray-900 uppercase">Grand Total</td>
                                                        <td className="px-3 py-3 text-right font-black text-gray-900 text-lg">₹{gTotal.toFixed(2)}</td>
                                                    </tr>
                                                </>
                                                )
                                            })()}
                                        </tfoot>
                                    </table>

                                    <div className="grid grid-cols-2 gap-4 mt-12">
                                        <div className="text-sm border border-gray-400 p-4 rounded-lg bg-gray-50">
                                            <p className="font-bold uppercase text-xs text-gray-500 mb-2 tracking-wider border-b border-gray-300 pb-1">Bank Remittance Details</p>
                                            <p className="font-bold text-gray-900">HDFC Bank Ltd</p>
                                            <p className="text-gray-700 font-mono mt-1">A/C No: 12345678901234</p>
                                            <p className="text-gray-700 font-mono mt-1">IFSC: HDFC0001234</p>
                                        </div>
                                        <div className="text-right flex flex-col justify-end items-end h-full">
                                            <p className="font-bold text-gray-900 mb-12">For AVADHOOT AUTO COMPONENTS</p>
                                            <p className="text-xs font-bold uppercase tracking-widest text-gray-600 border-t-2 border-gray-900 pt-2 px-4 inline-block">Authorized Signatory</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={3000} theme="dark" />
        </div>
    );
}

export default InvoiceGenerator;