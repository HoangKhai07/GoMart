# GoMart - Nền tảng Thương mại điện tử

GoMart là một nền tảng thương mại điện tử hiện đại được xây dựng với công nghệ MERN Stack (MongoDB, Express.js, React.js, Node.js), cung cấp trải nghiệm mua sắm trực tuyến mượt mà và an toàn.

## 🌟 Tính năng chính

### Dành cho Khách hàng
- 🛒 Mua sắm trực tuyến với giao diện thân thiện
- 💳 Thanh toán an toàn qua Stripe
- 💬 Chat trực tiếp với nhân viên hỗ trợ
- 🔍 Tìm kiếm và lọc sản phẩm nâng cao
- 📱 Giao diện responsive trên mọi thiết bị
- 🛍️ Quản lý đơn hàng và lịch sử mua hàng

### Dành cho Admin
- 📊 Dashboard quản lý với biểu đồ thống kê
- 📦 Quản lý sản phẩm và danh mục
- 👥 Quản lý người dùng
- 💬 Hệ thống chat hỗ trợ khách hàng
- 📈 Theo dõi đơn hàng và doanh số
- 🔐 Phân quyền admin

## 🔧 Công nghệ sử dụng

### Frontend
- React.js với Vite
- Redux Toolkit cho state management
- TailwindCSS và Material UI cho styling
- Socket.IO Client cho real-time features
- Chart.js cho data visualization
- React Router DOM cho routing
- Framer Motion cho animations

### Backend
- Node.js với Express.js
- MongoDB với Mongoose
- Socket.IO cho real-time communication
- JWT cho authentication
- Stripe cho payment processing

## 🚀 Cài đặt và Chạy dự án

### Yêu cầu hệ thống
- Node.js (version 14 trở lên)
- MongoDB
- npm hoặc yarn

### Cài đặt Frontend
```bash
cd client
npm install
npm run dev
```

### Cài đặt Backend
```bash
cd server
npm install
npm run dev
```

### Cấu hình môi trường
Tạo file `.env` trong thư mục client và server:

#### Client `.env`
```env
VITE_API_URL=http://localhost:5000
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

#### Server `.env`
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
```

## 📱 Tính năng Real-time

### Chat System
- Chat trực tiếp giữa khách hàng và admin
- Hiển thị trạng thái "đang nhập..."
- Thông báo tin nhắn mới
- Đánh dấu tin nhắn đã đọc

### Notifications
- Cập nhật trạng thái đơn hàng real-time
- Thông báo khi có tin nhắn mới
- Cập nhật giỏ hàng real-time

## 💳 Hệ thống Thanh toán

- Tích hợp Stripe cho thanh toán an toàn
- Hỗ trợ nhiều phương thức thanh toán
- Xử lý hoàn tiền tự động
- Lịch sử giao dịch chi tiết


## Cảm ơn bạn đã ghé qua :3


