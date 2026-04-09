# 🏭 Avadhoot Auto Components – B2B Manufacturing & Inventory Management System

**Avadhoot Auto Components** is a high-end, "Industrial Midnight" B2B manufacturing and inventory management platform designed for precision manufacturing operations. Featuring a premium glassmorphic UI, this system handles everything from deep inventory tracking to automated billing for enterprise and medium-scale manufacturing clients.

---

## 🚀 Key Features

- 🧾 **B2B Supplier & Customer Management**: Keep precise track of supplier deliveries, manufacturer credits, and large-scale borrowing histories.
- 📄 **Rapid Industrial Billing**: High-speed, robust bill generator optimized for wholesale auto component distribution with barcode scanning capabilities.
- 📦 **Barcode Infrastructure**: Generate and print industry-standard barcode labels for auto components for seamless tracking.
- ⏰ **Quality Control & Expiry Reminders**: Automated tracking and alerts for component quality assurance and warranty periods.
- 📲 **WhatsApp Invoicing Integration**: Dispatch quotes, formal invoices, and bills directly to manufacturing clients via WhatsApp.
- 📊 **Executive Analytics Dashboard**: Dynamic, data-dense reporting metrics featuring:
  - Daily, weekly, and monthly wholesale revenue analysis.
  - Granular stock levels and inventory turnover rate insights.
- 📝 **Quality Assurance Remarks**: Comprehensive note-taking mechanisms for finished components, client returns, or defective parts tracking.
- 🔍 **Premium "Industrial Midnight" UI**: A dark-mode, precision-focused interface explicitly designed to empower productivity in professional manufacturing environments.

---

## 🛠️ Tech Stack & Architecture

### Frontend
- **React.js** (UI Logic & Component Structure)
- **Tailwind CSS** (Industrial Midnight UI/UX Styling)
- **Vite** (High-performance build tooling)

### Backend
- **Node.js** & **Express.js** (Robust backend API layer)
- **MongoDB** & **Mongoose** (Scalable document database)
- **Cloudinary** (Cloud repository for component images)
- **Twilio** (Real-time WhatsApp communications)
- **JWT** (Secure, token-based authentication)

---

## 💻 Local Development Setup

Follow these steps to deploy the Avadhoot Auto Components system in your local environment.

### 1. Repository Access
```bash
git clone <repository-url>
cd ShopManager-Smart-Inventory-Management-App
```

### 2. Backend Initialization
Navigate to the backend directory to configure environment logic:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory and add the necessary API configurations:
```env
PORT=8080
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Launch the backend API layer:
```bash
npm run server
```

### 3. Frontend Initialization
Open a new terminal window, navigate to the Frontend directory, and initialize the client:
```bash
cd Frontend
npm install
npm run dev
```

The enterprise frontend interface will start on your local Vite server (typically accessible at `http://localhost:5173`).
