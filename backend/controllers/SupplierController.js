import Supplier from "../models/supplier.js";
import path from "path"
import { uploadOnCloudinary } from "../config/cloudinary.js";

// Correct controller function signature
const addSupplier = async (req, res) => {  // Make sure to include req and res parameters
  try {
    const owner = req.user.email
    const { supplierName, contactPerson, phoneNumber, address, gstin, materialSupplied, ratePerKg, lastPurchaseDate, totalPayment, depositAmount } = req.body;
    let imageUrl = null;
    if (req.file && req.file.path) {
        const imageUpload = await uploadOnCloudinary(req.file.path);
        if (imageUpload && imageUpload.secure_url) {
            imageUrl = imageUpload.secure_url;
        }
    }

    if (!supplierName || !phoneNumber || !gstin || !materialSupplied) {
      return res.status(400).json({
        success: false,
        message: 'Supplier name, phone, gstin, and material supplied are required fields'
      });
    }

    const supplierData = new Supplier({
      owner,
      supplierName,
      contactPerson,
      phoneNumber,
      address,
      gstin,
      materialSupplied,
      ratePerKg: parseFloat(ratePerKg || 0),
      lastPurchaseDate: lastPurchaseDate ? new Date(lastPurchaseDate) : null,
      totalPayment: parseFloat(totalPayment || 0),
      depositAmount: parseFloat(depositAmount || 0),
      imageUrl: imageUrl
    });



    await supplierData.save();

    return res.status(201).json({  // Proper response
      success: true,
      message: "Supplier added successfully",
      data: supplierData
    });

  } catch (error) {
    console.error('Error adding supplier:', error);
    return res.status(500).json({  // Error response
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

const getSupplier = async (req, res) => {
  try {
    const owner = req.user.email;

    // Corrected the find query to search by owner field
    const suppliers = await Supplier.find({ owner });

    return res.status(200).json({
      success: true,
      count: suppliers.length,  // Added count of suppliers
      suppliers
    });

  } catch (error) {
    console.error('Error fetching suppliers:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch suppliers'
    });
  }
};

// Export both functions together
export { addSupplier, getSupplier };