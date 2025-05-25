import logo

<div align="center">
  <h1>🛒 GoMart - Modern E-commerce Platform</h1>
  <p>
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white"/>
    <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge"/>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB"/>
    <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white"/>
    <img src="https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white"/>
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white"/>
    <img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white"/>
    <img src="https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=google-gemini&logoColor=white"/>
    <img src="https://img.shields.io/badge/VNPay-FF6600?style=for-the-badge&logo=&logoColor=white"/>
  </p>
</div>

---

## 📚 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Installation & Setup](#-installation--setup)
- [Real-time Features](#-real-time-features)
- [AI Chatbot](#-ai-chatbot)
- [Payment System](#-payment-system)
- [Responsive Design](#-responsive-design)
- [Security Features](#-security-features)
- [Contributing](#-contributing)
- [License](#-license)

---

## 📝 Overview

**GoMart** is a modern e-commerce platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js), providing a seamless and secure online shopping experience. The platform features real-time communication, AI-powered chatbot assistance, secure payments with multiple options, and a comprehensive admin dashboard.

---

## ✨ Key Features

### 🛍️ Customer

- Intuitive, responsive UI
- Advanced product search & filtering
- Real-time cart updates, wishlist, reviews & ratings
- Secure authentication, order history, profile & address management
- Multiple payment methods (Stripe, VNPay), SSL encryption
- AI-powered chatbot for 24/7 customer support
- Real-time chat with support, notifications, "Typing..." indicators
- Intelligent product recommendations via AI

### 👨‍💼 Admin

- Real-time analytics, sales stats, user activity, revenue reports
- Product, category, user, order, voucher, inventory management
- Customer chat, ticket system, feedback monitoring
- AI chatbot management and training
- Payment analytics for both Stripe and VNPay transactions

---

## 🛠️ Technology Stack

### Frontend

- React.js (Vite)
- Redux Toolkit
- TailwindCSS, Material UI
- Socket.IO Client, Chart.js, React Router DOM, Framer Motion

### Backend

- Node.js, Express.js
- MongoDB, Mongoose
- Socket.IO, JWT
- Google Gemini AI API
- Stripe API, VNPay API
- Resend API

### AI & Payments

- **AI Chatbot**: Google Gemini Pro for intelligent customer support
- **Payments**: Stripe (International), VNPay (Vietnam domestic)

---

## 🚀 Installation & Setup

### Prerequisites

- Node.js (v14+)
- MongoDB
- npm or yarn
- Git
- Google Gemini API Key
- Stripe Account
- VNPay Merchant Account

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
VITE_VNPAY_RETURN_URL=your_vnpay_return_url
```

#### Server `.env`
```env
PORT=your_port
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret

# Payment Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key
VNPAY_TMN_CODE=your_vnpay_tmn_code
VNPAY_HASH_SECRET=your_vnpay_hash_secret
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=your_vnpay_return_url
VNPAY_IPN_URL=your_vnpay_ipn_url

# AI Configuration
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-pro

# ...other variables
```

---

## 🔄 Real-time Features

- Live customer-admin chat, typing indicators, read receipts, online status
- Real-time order status, message, cart, and price change notifications
- Instant AI chatbot responses with context awareness
- Live payment status updates for both Stripe and VNPay

---

## 🤖 AI Chatbot

### Features
- **24/7 Customer Support**: AI-powered assistance using Google Gemini
- **Product Recommendations**: Intelligent suggestions based on user preferences
- **Order Assistance**: Help with order tracking, returns, and general inquiries
- **Multi-language Support**: Vietnamese and English language support
- **Context Awareness**: Maintains conversation context for better assistance
- **Seamless Handoff**: Easy transition to human support when needed

### AI Capabilities
- Natural language understanding
- Product search and recommendations
- Order status inquiries
- FAQ responses
- Shopping assistance
- Troubleshooting support

---

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

## 🤝 Contributing

Contributions are welcome! Please fork the repo and submit a pull request.

1. Fork this repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Create a new Pull Request

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
  <em>Powered by AI & Modern Payment Solutions</em>
</div>