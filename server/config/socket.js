import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'

let io

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL,
            method: ['GET', 'POST'],
            credentials: true
        }
    })

    //middelware
    io.use((socket, next) => {
        const token = socket.handshake.auth.token
        if(!token) {
            return next(new Error("Authentication error"))
        }

        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN)
            socket.userId = decoded.userId
            next()
        } catch (error) {
            next(new Error("Authentication error"))
        }
    })

    //handle user conect information
    const connectedUsers = new Map()
    const userRooms = new Map() 
    
    io.on('connection', (socket)=> {
        const userId = socket.userId

        // Join user into your room 
        socket.join(`user_${userId}`)
        
        connectedUsers.set(userId, socket.id)

        console.log(`User connected: ${userId}, Socket ID: ${socket.id}`)
        
        // Broadcast user online status
        io.emit('userStatus', {userId, status: 'online'})

        // Handle user typing
        socket.on('typing', ({chatId, isTyping}) => {
            // Get all users in the chat
            const roomName = `chat_${chatId}`
            console.log(`User ${userId} is ${isTyping ? 'typing' : 'stopped typing'} in ${roomName}`)
            // Broadcast to all users in the chat except the sender
            socket.to(roomName).emit('userTyping', {userId, isTyping})
        })

        // Handle join chat room
        socket.on('joinChatRoom', (chatId) => {
            const roomName = `chat_${chatId}`
            
            // Keep track of user's rooms
            if (!userRooms.has(userId)) {
                userRooms.set(userId, new Set())
            }
            userRooms.get(userId).add(roomName)
            
            socket.join(roomName)
            console.log(`User ${userId} joined chat room: ${roomName}`)
        })

        // Handle leave chat room
        socket.on('leaveChatRoom', (chatId) => {
            const roomName = `chat_${chatId}`
            
            // Update user's rooms
            if (userRooms.has(userId)) {
                userRooms.get(userId).delete(roomName)
            }
            
            socket.leave(roomName)
            console.log(`User ${userId} left chat room: ${roomName}`)
        })

        // Handle user disconnect
        socket.on('disconnect', ()=> {
            console.log(`User disconnected: ${userId}`)
            
            // Leave all rooms
            if (userRooms.has(userId)) {
                for (const room of userRooms.get(userId)) {
                    socket.leave(room)
                }
                userRooms.delete(userId)
            }
            
            connectedUsers.delete(userId)
            io.emit('userStatus', {userId, status: 'offline'})
        })
    })
}

export const getIO = () => {
    if(!io){
        throw new Error("Socket.io not initialized")
    }
    return io
}
