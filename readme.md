# 🛒 ShopManager – Smart Inventory Management System

**ShopManager** is an intuitive inventory and billing system designed specifically for small and medium merchant stores. It helps merchants efficiently manage stock, sales, and billing while automating key tasks to save time and reduce errors.

---

## 🚀 Features

- 🧾 **Borrow Account Management**: Track credit and customer borrow history seamlessly.
- 📄 **Fast Bill Generation**: Generate bills quickly using scanner input.
- 📦 **Barcode Generation**: Generate and print barcode labels for different products.
- ⏰ **Expiry Date Reminders**: Automated alerts for products nearing expiry to take timely action.
- 📲 **WhatsApp Integration**: Send bills and invoices directly to customers via WhatsApp.
- 📊 **Interactive Dashboards**: Dynamic sales and product dashboards featuring:
  - Daily, weekly, and monthly sales analysis.
  - Product stock levels and inventory turnover tracking.
  - Comprehensive insights into overall store performance.
- 📝 **Product Remarks**: Note-taking feature to add remarks for finished or returned products.
- 🔍 **User-Friendly Interface**: An easy-to-use aesthetic interface for seamless stock and sales management.

---

## 🛠️ Tech Stack

### Frontend
- **React.js**
- **Tailwind CSS**
- **Vite**

### Backend
- **Node.js** & **Express.js**
- **MongoDB** & **Mongoose**
- **Cloudinary** (Image Storage)
- **Twilio** (WhatsApp integration)
- **JWT** (Authentication)

---

## 🔗 Live Preview

- 🚀 [ShopManager Live Demo](https://smart-inventory-management-system-frontend.vercel.app/) 

---

## 💻 Running Locally

Follow these steps to set up the project on your local machine.

### 1. Clone the repository
```bash
git clone <repository-url>
cd ShopManager-Smart-Inventory-Management-App
```

### 2. Backend Setup
Navigate to the backend directory and configure the environment:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory and add the necessary variables:
```env
PORT=8080
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Start the backend development server:
```bash
npm run server
```

### 3. Frontend Setup
Open a new terminal, navigate to the Frontend directory, and start the app:
```bash
cd Frontend
npm install
npm run dev
```

The frontend will start on your local Vite server (typically `http://localhost:5173`).
