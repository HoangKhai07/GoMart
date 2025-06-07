<div align="center">
  <h1>
  <img src='./client/src/assets/logo_icon.png' width="50"/>
   GoMart - Modern E-commerce Platform</h1>
  <p>
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white"/>
    <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge"/>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB"/>
    <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white"/>
    <img src="https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white"/>
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white"/>
    <img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white"/>
  </p>
</div>

---

## 📚 Table of Contents

- [Overview](#-overview)
- [Entity Relationship Diagram](#-ERD)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Installation & Setup](#-installation--setup)
- [Payment System](#-payment-system)
- [Responsive Design](#-responsive-design)
- [Security Features](#-security-features)
- [Contributing](#-contributing)
- [License](#-license)

---

## 📝 Overview

**GoMart** is a modern e-commerce platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js), providing a seamless and secure online shopping experience. The platform features real-time communication, AI-powered chatbot assistance, secure payments with multiple options, and a comprehensive admin dashboard.

---

## ERD

![GoMart ERD](https://github.com/user-attachments/assets/38f69aac-76fa-425d-ab5a-25f5950e2d4d)

## ✨ Key Features

### 🛍️ Customer

- Intuitive, responsive UI
- Advanced product search & filtering
- Real-time cart updates, wishlist, reviews & ratings
- Secure authentication, order history, profile & address management
- Multiple payment methods (Stripe, VNPay), SSL encryption
- AI-powered chatbot customer support
- Real-time chat with support, notifications, "Typing..." indicators

### 👨‍💼 Admin

- Real-time analytics, sales stats, user activity, revenue reports
- Product, category, user, order, voucher, inventory management
- Customer chat, ticket system, feedback monitoring
- AI chatbot management and training

---

## 🛠️ Technology Stack

### Frontend

- React.js (Vite)
- Redux Toolkit
- TailwindCSS
- Socket.IO Client

### Backend

- Node.js (Express.js)
- MongoDB
- Socket.IO, JWT


## 🚀 Installation & Setup

### Prerequisites

- Node.js (v14+)
- MongoDB
- npm or yarn
- Git

### Frontend

```bash
cd client
npm install
npm run dev
```

### Backend

```bash
cd server
npm install
npm run dev
```

### Environment Variables

#### Client `.env`
```env
VITE_API_URL=your_api_url
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

#### Server `.env`
```env
FRONTEND_URL=your_port
MONGODB_URI=your_mongodb_uri
RESEND_API=your_resend_api
SECRET_KEY_ACCESS_TOKEN = your_secret_key_access_token
SECRET_KEY_REFRESH_TOKEN = Uyour_secret_key_refresh_token
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME = your_cloudinary_name
CLOUDINARY_API_KEY = your_cloudinary_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_ENDPOINT_WEBHOOK_SECRET =your_stripe_enpoint
VNPAY_TMN_CODE=your_vnpay_tmn_code
VNPAY_HASH_SECRET=your_vnpay_hash_secret
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=your_vnpay_return_url
GEMINI_API_KEY=your_gemini_api_key
```


## 💳 Payment System

### Supported Payment Methods

#### International Payments (Stripe)
- Credit/Debit cards (Visa, Mastercard, American Express)
- Digital wallets (Apple Pay, Google Pay)
- Bank transfers and ACH payments

#### Vietnam Domestic Payments (VNPay)
- ATM cards (Domestic Vietnamese banks)
- Internet Banking
- QR Code payments
- Mobile banking apps
- VNPay wallet

### Payment Features
- Secure payment processing with encryption
- Automatic currency conversion
- Refunds and partial refunds
- Transaction history and tracking
- Payment method preferences
- Multi-currency support (USD, VND)

---

## 📱 Responsive Design

- Mobile-first approach with touch-optimized UI
- Tablet & desktop optimized layouts
- Cross-browser compatibility
- Progressive Web App (PWA) features

---

## 🔐 Security Features

- JWT authentication with refresh tokens
- Password encryption (bcrypt)
- Role-based access control (RBAC)
- API rate limiting and DDoS protection
- XSS and CSRF protection
- PCI DSS compliant payment processing
- Secure webhook handling for payment confirmations
- Data encryption in transit and at rest

---


### Development Guidelines
- Follow ESLint and Prettier configurations
- Write unit tests for new features
- Update documentation for API changes
- Test payment integrations in sandbox mode
- Validate AI chatbot responses before deployment

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  Made with ❤️ by Khai
  <br/>
</div>