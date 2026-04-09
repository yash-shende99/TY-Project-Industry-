import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const wipeDatabase = async () => {
    try {
        console.log("Connecting to " + process.env.MONGO_URL);
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to MongoDB');

        console.log("Wiping collections...");
        await mongoose.connection.collection('products').deleteMany({}).catch(e => console.log('Products empty'));
        await mongoose.connection.collection('customers').deleteMany({}).catch(e => console.log('Customers empty'));
        await mongoose.connection.collection('suppliers').deleteMany({}).catch(e => console.log('Suppliers empty'));
        await mongoose.connection.collection('bills').deleteMany({}).catch(e => console.log('Bills empty'));
        await mongoose.connection.collection('categories').deleteMany({}).catch(e => console.log('Categories empty'));

        console.log('Successfully wiped old retail records from databases!');
        process.exit(0);
    } catch (err) {
        console.error('Error wiping database:', err);
        process.exit(1);
    }
};

wipeDatabase();
