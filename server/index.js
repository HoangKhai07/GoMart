import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import connectDB from './config/connectDB.js'
import { initSocket } from './config/socket.js'
import addressRouter from './route/address.route.js'
import cartRouter from './route/cart.route.js'
import categoryRouter from './route/category.route.js'
import chatRouter from './route/chat.route.js'
import favoriteRouter from './route/favorite.route.js'
import orderRouter from './route/order.route.js'
import productRouter from './route/product.route.js'
import reviewRouter from './route/review.route.js'
import statisticRouter from './route/statistic.route.js'
import subCategoryRouter from './route/subCategory.route.js'
import uploadRouter from './route/upload.route.js'
import userRouter from './route/user.route.js'
import vnpayRouter from './route/vnpay.router.js'
import voucherRouter from './route/voucher.route.js'
import flashSaleRouter from './route/flashSale.route.js'

dotenv.config()
const app = express()
app.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_URL
}))

app.use(express.json())
app.use(cookieParser())
app.use(morgan())
app.use(helmet({
    crossOriginOpenerPolicy: false
}))

const PORT = 8080 || process.env.PORT

app.get("/",(request, response)=> {
    ///server to client
    response.json({
        message: "Sever is running " + PORT
    })
}) 

const server = app.listen(PORT, ()=>{ 
    console.log("Server is running", PORT)
})

// Khởi tạo Socket.IO
initSocket(server)

connectDB();

app.use('/api/user', userRouter)
app.use('/api/category', categoryRouter)
app.use('/api/file',uploadRouter)
app.use('/api/subCategory', subCategoryRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/address', addressRouter)
app.use('/api/order', orderRouter)
app.use('/api/review', reviewRouter)
app.use('/api/chat', chatRouter)
app.use('/api/favorite', favoriteRouter)
app.use('/api/statistic', statisticRouter)
app.use('/api/voucher', voucherRouter)
app.use('/api/vnpay', vnpayRouter)
app.use('/api/flashSale', flashSaleRouter)
