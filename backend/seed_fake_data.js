import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
// Import Models
import User from './models/User.js';
import Product from './models/Product.js';
import Invoice from './models/Bill.js';
import Customer from './models/Customer.js';
import Supplier from './models/supplier.js';

dotenv.config();

const MONGO_URL = process.env.MONGO_URL;
const TARGET_EMAIL = 'yash.22310893@viit.ac.in';

async function seedData() {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(MONGO_URL);
        console.log('Connected.');

        console.log(`Clearing existing data for ${TARGET_EMAIL}...`);
        await Product.deleteMany({ owner: TARGET_EMAIL });
        await Invoice.deleteMany({ owner: TARGET_EMAIL });
        await Customer.deleteMany({ owner: TARGET_EMAIL });
        await Supplier.deleteMany({ owner: TARGET_EMAIL });

        // Ensure user exists
        let user = await User.findOne({ email: TARGET_EMAIL });
        if (!user) {
            const hashedPassword = await bcrypt.hash('password123', 10);
            user = new User({
                name: 'Yash',
                email: TARGET_EMAIL,
                password: hashedPassword,
                phoneNumber: '9876543210'
            });
            await user.save();
        }

        console.log('Seeding Customers/Clients...');
        const customerData = [
            { owner: TARGET_EMAIL, companyName: 'Tata Motors', contactPersonName: 'Rajesh Kumar', phoneNumber: '9123456780', gstin: '27AADCB2230M1Z2', industryType: 'Automotive' },
            { owner: TARGET_EMAIL, companyName: 'Mahindra & Mahindra', contactPersonName: 'Sanjay Patil', phoneNumber: '9876543211', gstin: '27AAACM1458D1Z2', industryType: 'Automotive' },
            { owner: TARGET_EMAIL, companyName: 'L&T Heavy Engineering', contactPersonName: 'Amit Singh', phoneNumber: '9988776655', gstin: '27AAACL0204R1Z0', industryType: 'Construction' },
            { owner: TARGET_EMAIL, companyName: 'Bajaj Auto', contactPersonName: 'Kiran Desai', phoneNumber: '9000100012', gstin: '27AAACB2192G1Z9', industryType: 'Automotive' },
            { owner: TARGET_EMAIL, companyName: 'JCB India Ltd', contactPersonName: 'Nitin Gadkari', phoneNumber: '9911882233', gstin: '06AAACJ3294P1ZC', industryType: 'Construction' },
            { owner: TARGET_EMAIL, companyName: 'Hero MotoCorp', contactPersonName: 'Priya Sharma', phoneNumber: '9765432109', gstin: '07AAACH0426P1Z7', industryType: 'Automotive' },
            { owner: TARGET_EMAIL, companyName: 'BEML Limited', contactPersonName: 'Vikram Joshi', phoneNumber: '9845012345', gstin: '29AAACB1455L1Z1', industryType: 'OEM' },
            { owner: TARGET_EMAIL, companyName: 'Ashok Leyland', contactPersonName: 'Manoj Tiwari', phoneNumber: '9840123456', gstin: '33AAACA3254P1Z3', industryType: 'Automotive' },
            { owner: TARGET_EMAIL, companyName: 'Escorts Kubota', contactPersonName: 'Raghav Khanna', phoneNumber: '9999888877', gstin: '06AAACE0058C1Z6', industryType: 'Construction' },
            { owner: TARGET_EMAIL, companyName: 'Bosch Chassis Systems', contactPersonName: 'Anil Mehta', phoneNumber: '9122334455', gstin: '27AAACB0395D1Z5', industryType: 'Vendor' }
        ];
        const customers = await Customer.insertMany(customerData);

        console.log('Seeding Suppliers...');
        const supplierData = [
            { owner: TARGET_EMAIL, supplierName: 'JSW Steel', contactPerson: 'Nitin', phoneNumber: '9888877777', gstin: '27AAACJ4008K1Z5', materialSupplied: 'EN8 Round Bars', ratePerKg: 75, lastPurchaseDate: new Date('2026-02-15') },
            { owner: TARGET_EMAIL, supplierName: 'Vedanta Resources', contactPerson: 'Arun', phoneNumber: '9111122222', gstin: '27AAACV5646A1Z4', materialSupplied: 'Brass Ingots', ratePerKg: 450, lastPurchaseDate: new Date('2026-02-20') },
            { owner: TARGET_EMAIL, supplierName: 'Tata Steel Long Products', contactPerson: 'Sumit Banerji', phoneNumber: '9900990099', gstin: '21AAACT0803L1Z6', materialSupplied: 'EN19 Alloys', ratePerKg: 105, lastPurchaseDate: new Date('2026-03-05') },
            { owner: TARGET_EMAIL, supplierName: 'Jindal Stainless', contactPerson: 'Neha Gupta', phoneNumber: '9818123456', gstin: '06AAACJ0158F1ZT', materialSupplied: '304/316 SS Sheets', ratePerKg: 280, lastPurchaseDate: new Date('2026-03-12') },
            { owner: TARGET_EMAIL, supplierName: 'Hindalco Industries', contactPerson: 'Ravi Kumar', phoneNumber: '9222333444', gstin: '27AAACH0098F1Z9', materialSupplied: 'Aluminium Extrusions', ratePerKg: 210, lastPurchaseDate: new Date('2026-04-01') },
            { owner: TARGET_EMAIL, supplierName: 'Mukand Ltd', contactPerson: 'Vikas Sharma', phoneNumber: '9002003004', gstin: '27AAACM0402K1Z9', materialSupplied: 'High Speed Steel', ratePerKg: 520, lastPurchaseDate: new Date('2026-01-28') },
            { owner: TARGET_EMAIL, supplierName: 'Prakash Industries', contactPerson: 'Rohit Verma', phoneNumber: '8888777766', gstin: '07AAACP1208D1Z2', materialSupplied: 'Mild Steel Tubes', ratePerKg: 65, lastPurchaseDate: new Date('2026-03-25') },
            { owner: TARGET_EMAIL, supplierName: 'Essar Steel India', contactPerson: 'Arvind Patel', phoneNumber: '7776665554', gstin: '24AAACE0316N1Z7', materialSupplied: 'Hot Rolled Coils', ratePerKg: 58, lastPurchaseDate: new Date('2026-02-10') }
        ];
        const suppliers = await Supplier.insertMany(supplierData);

        console.log('Seeding Inventory Products...');
        const productData = [
            // Structural & Major
            { owner: TARGET_EMAIL, name: 'Precision Shaft', category: 'Shaft & King Pins', productCode: 'PS-101', materialType: 'EN8', dimensions: '50mm', drawingNumber: 'DRW-001', manufacturingDate: new Date('2026-01-15'), status: 'Ready', quantity: 1500, minStockLevel: 500 },
            { owner: TARGET_EMAIL, name: 'King Pin Assy', category: 'Shaft & King Pins', productCode: 'KP-102', materialType: 'EN19', dimensions: '80mmx120mm', drawingNumber: 'DRW-015', manufacturingDate: new Date('2026-02-01'), status: 'In Production', quantity: 450, minStockLevel: 200 },
            { owner: TARGET_EMAIL, name: 'Boom Pin', category: 'Attachment & Boom Pins', productCode: 'BP-103', materialType: 'MS', dimensions: '100mmx250mm', drawingNumber: 'DRW-022', manufacturingDate: new Date('2026-01-10'), status: 'Ready', quantity: 85, minStockLevel: 100 }, // Low Stock
            
            // Connectors & Hardware
            { owner: TARGET_EMAIL, name: 'Sensor Sleeve', category: 'Sensor Sleeves', productCode: 'SS-202', materialType: 'Brass', dimensions: '12mm', drawingNumber: 'DRW-002', manufacturingDate: new Date('2026-01-20'), status: 'Ready', quantity: 200, minStockLevel: 300 }, // Low stock
            { owner: TARGET_EMAIL, name: 'Heavy Duty Cotter', category: 'Cotter Pins', productCode: 'CP-303', materialType: 'MS', dimensions: '8mm', drawingNumber: 'DRW-003', manufacturingDate: new Date('2026-02-05'), status: 'In Production', quantity: 5000, minStockLevel: 1000 },
            { owner: TARGET_EMAIL, name: 'Standard Cotter Pin', category: 'Cotter Pins', productCode: 'CP-304', materialType: 'SS', dimensions: '5mm', drawingNumber: 'DRW-031', manufacturingDate: new Date('2026-03-05'), status: 'Ready', quantity: 8500, minStockLevel: 2000 },
            { owner: TARGET_EMAIL, name: 'Banjo Bolt M10', category: 'Banjo Bolts', productCode: 'BB-404', materialType: 'EN19', dimensions: 'M10', drawingNumber: 'DRW-004', manufacturingDate: new Date('2026-02-10'), status: 'Ready', quantity: 800, minStockLevel: 200 },
            { owner: TARGET_EMAIL, name: 'Banjo Bolt M14', category: 'Banjo Bolts', productCode: 'BB-405', materialType: 'EN8', dimensions: 'M14', drawingNumber: 'DRW-045', manufacturingDate: new Date('2026-03-12'), status: 'Ready', quantity: 500, minStockLevel: 150 },
            
            // Fluid/Pneumatic Systems
            { owner: TARGET_EMAIL, name: 'Fuel Injector Nozzle', category: 'Fuel Line Components', productCode: 'FIN-505', materialType: 'Stainless Steel', dimensions: '5mm', drawingNumber: 'DRW-005', manufacturingDate: new Date('2026-03-01'), status: 'Ready', quantity: 45, minStockLevel: 100 }, // Low stock item
            { owner: TARGET_EMAIL, name: 'Fuel Line Adaptor', category: 'Adaptors', productCode: 'FA-506', materialType: 'Brass', dimensions: '3/8" NPT', drawingNumber: 'DRW-078', manufacturingDate: new Date('2026-01-25'), status: 'Ready', quantity: 1200, minStockLevel: 400 },
            { owner: TARGET_EMAIL, name: 'Hydraulic Connector', category: 'Connectors', productCode: 'HC-507', materialType: 'SS 316', dimensions: '1/2" JIC', drawingNumber: 'DRW-088', manufacturingDate: new Date('2026-02-18'), status: 'In Production', quantity: 320, minStockLevel: 250 },
            
            // Specialized/Forged
            { owner: TARGET_EMAIL, name: 'Differential Spider', category: 'Forged Components', productCode: 'FC-601', materialType: 'Forged Steel', dimensions: 'Various', drawingNumber: 'DRW-112', manufacturingDate: new Date('2026-02-28'), status: 'Ready', quantity: 180, minStockLevel: 50 },
            { owner: TARGET_EMAIL, name: 'Connecting Rod', category: 'Forged Components', productCode: 'FC-602', materialType: 'Forged Alloy', dimensions: 'Custom', drawingNumber: 'DRW-119', manufacturingDate: new Date('2026-03-15'), status: 'Dispatched', quantity: 0, minStockLevel: 40 }, // Depleted Stock
            { owner: TARGET_EMAIL, name: 'Grease Nipple M8', category: 'Grease Nipples', productCode: 'GN-701', materialType: 'MS / Zinc Plated', dimensions: 'M8', drawingNumber: 'DRW-144', manufacturingDate: new Date('2026-01-05'), status: 'Ready', quantity: 14000, minStockLevel: 5000 },
            { owner: TARGET_EMAIL, name: 'Precision Dowel Pin', category: 'Precision Pins', productCode: 'PP-801', materialType: 'SS', dimensions: '6mm x 30mm', drawingNumber: 'DRW-166', manufacturingDate: new Date('2026-02-08'), status: 'Ready', quantity: 6500, minStockLevel: 1500 }
        ];
        const insertedProducts = await Product.insertMany(productData);

        console.log('Seeding Invoices (scaling to 100+ invoices)...');
        
        const generateDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        
        let invoiceCount = 1001;
        const invoices = [];

        // Generate 120 invoices
        for(let i = 0; i < 120; i++) {
            // Distribute dates: Heavily before March (Jan/Feb), some in March/April
            let date;
            if (i < 80) {
                date = generateDate(new Date('2026-01-01'), new Date('2026-02-28'));
            } else if (i < 105) {
                date = generateDate(new Date('2026-03-01'), new Date('2026-03-31'));
            } else {
                const today = new Date();
                const past = new Date();
                past.setDate(today.getDate() - 10); // Spread across last 10 days
                date = generateDate(past, today);
                if(i === 119) date = new Date(); // Right now for today's sales
            }

            const customer = customers[Math.floor(Math.random() * customers.length)];
            
            // 1 to 5 items per invoice
            const numItems = Math.floor(Math.random() * 4) + 1;
            const items = [];
            let subTotal = 0;
            let netQuantity = 0;
            
            for(let j=0; j<numItems; j++) {
                const prod = insertedProducts[Math.floor(Math.random() * insertedProducts.length)];
                const quantity = Math.floor(Math.random() * 200) + 10;
                // random rate between 15 and 800 depending on item
                const rate = Math.floor(Math.random() * 500) + 20;
                const total = quantity * rate;
                
                // Ensure no complete item duplicates per invoice
                if(!items.find(it => it.productName === prod.name)) {
                    items.push({
                        productName: prod.name,
                        drawingNumber: prod.drawingNumber,
                        batchNumber: 'B-' + Math.floor(Math.random()*2000),
                        quantity,
                        rate,
                        total
                    });
                    subTotal += total;
                    netQuantity += quantity;
                }
            }

            if (items.length > 0) {
                const taxAmount = subTotal * 0.18;
                const grandTotal = subTotal + taxAmount;

                invoices.push({
                    owner: TARGET_EMAIL,
                    billNumber: `INV-${invoiceCount}`,
                    invoiceNumber: `INV-${invoiceCount}`,
                    date: date,
                    dispatchDate: new Date(date.getTime() + 86400000), // Next day
                    vehicleNumber: ['MH 14 CX 9900', 'MH 12 AB 1234', 'GJ 01 XX 0987', 'KA 03 DF 4432', 'TN 09 MM 1122'][Math.floor(Math.random() * 5)],
                    clientName: customer.companyName,
                    customerName: customer.companyName,
                    clientGstin: customer.gstin,
                    customerId: customer._id,
                    phoneNumber: customer.phoneNumber,
                    poNumber: `PO-2026-${Math.floor(Math.random() * 900) + 100}`,
                    items: items,
                    subTotal: subTotal,
                    gstAmount: taxAmount,
                    grandTotal: grandTotal,
                    netQuantity: netQuantity
                });
                invoiceCount++;
            }
        }

        await Invoice.insertMany(invoices);
        console.log(`Successfully inserted ${invoices.length} invoices.`);

        console.log('Seed Complete! You now have a massive, heavily populated industrial dashboard.');
        process.exit(0);

    } catch (e) {
        console.error('Error seeding data:', e);
        process.exit(1);
    }
}

seedData();
