import MessageModel from '../model/message.model.js'
import ChatModel from '../model/chat.model.js'
import UserModel from '../model/user.model.js'
import { getIO } from '../config/socket.js'

// Lấy danh sách chat của user
export const getChatsController = async (req, res) => {
    try {
        const userId = req.userId
        const chats = await ChatModel.find({
            participants: userId
        }).populate({
            path: 'participants',
            select: 'name avatar role'
        }).sort({ lastMessage: -1})

        return res.json({
            message: "Get chats successfully",
            error: false,
            success: true,
            data: chats
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

// Lấy tin nhắn của chat
export const getMessagesController = async (req, res) => {
    try {
        const { chatId } = req.params
        const userId = req.userId

        if (!chatId) {
            return res.status(400).json({
                message: "Chat ID is required",
                error: true,
                success: false
            })
        }

        const messages = await MessageModel.find({ chatId }).sort({ createdAt: -1})

        // Đánh dấu tin nhắn là đã đọc
        await MessageModel.updateMany(
            {chatId, receiverId: userId, isRead: false},
            {isRead: true}
        )

        // Cập nhật số tin nhắn chưa đọc
        await ChatModel.findByIdAndUpdate(
            chatId,
            {$set: {unreadCount: 0 }}
        )

        // Thông báo cho người gửi biết tin nhắn đã được đọc
        const chat = await ChatModel.findById(chatId)
        if (chat) {
            const senderId = chat.participants.find(id => id.toString() !== userId.toString())
            
            if (senderId) {
                const io = getIO()
                io.to(`user_${senderId}`).emit('messagesRead', { chatId })
            }
        }

        return res.json({
            message: "Get messages successfully",
            error: false,
            success: true,
            data: messages
        })
        
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

// Tạo chat mới
export const sendMessageController = async (req, res) => {
    try {
        const { receiverId, content }= req.body
        const senderId = req.userId

        let chat = await ChatModel.findOne({
            participants: {$all: [senderId, receiverId]}
        })

        if(!chat){
            chat = new ChatModel({
                participants: [senderId, receiverId],
                lastMessage: content,
                lastMessageTime: new Date()
            })
            await chat.save()
        } else {
            chat.lastMessage = content
            chat.lastMessageTime = new Date()
            chat.unreadCount += 1 
            await chat.save()
        }

        const message = new MessageModel({
            senderId,
            receiverId,
            content,
            chatId: chat._id
        })

        const saveData = await message.save()

        // Gửi tin nhắn real-time với Socket.IO
        const io = getIO()
        
        // Broadcast đến room chat chung
        io.to(`chat_${chat._id}`).emit('newMessage', {
            senderId,
            message: saveData,
            chat: chat._id
        })
        
        // Broadcast đến room riêng của user nếu họ không ở trong chat_room
        io.to(`user_${receiverId}`).emit('newMessage', {
            senderId,
            message: saveData,
            chat: chat._id
        })

        return res.json({
            message: "Send message successfully",
            error: false,
            success: true,
            data: {
                message: saveData,
                chat: chat._id
            }
        })
        
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

// Thêm function đánh dấu tin nhắn đã đọc
export const markMessagesAsReadController = async (req, res) => {
    try {
        const { chatId } = req.params
        const userId = req.userId
        
        // Đánh dấu tin nhắn đã đọc
        const result = await MessageModel.updateMany(
            { chatId, receiverId: userId, isRead: false },
            { isRead: true }
        )
        
        // Reset số tin nhắn chưa đọc về 0
        await ChatModel.findByIdAndUpdate(
            chatId,
            { $set: { unreadCount: 0 } }
        )
        
        // Thông báo cho người gửi biết tin nhắn đã được đọc
        if (result.modifiedCount > 0) {
            const chat = await ChatModel.findById(chatId)
            const receiverId = chat.participants.find(id => id.toString() !== userId.toString())
            
            const io = getIO()
            io.to(`user_${receiverId}`).emit('messagesRead', { chatId })
        }
        
        return res.json({
            message: "Messages marked as read",
            error: false,
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const getAdminChatController = async (req, res) => {
    try {
        const userId = req.userId

        const admin = await UserModel.findOne({role: 'ADMIN'})
        if(!admin){
            return res.status(400).json({
                message: "Admin not found",
                error: true,
                success: false
            })
        }

        let chat = await ChatModel.findOne({
            participants: {$all: [userId, admin._id]}
        })

        if(!chat){
            chat = new ChatModel({
                participants: [userId, admin._id],
                lastMessage: '',
                lastMessageTime: new Date()
            })
        }

        const chatData = await chat.save()

        return res.json({
            message: 'get admin chat successfully',
            error: false,
            success: true,
            data: chatData
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const getAllChatsController = async (req, res) => {
    try {
        const userId = req.userId

        const chats = await ChatModel.find({
            participants: userId
        }).populate({
            path: 'participants',
            select: 'name avatar role'
        }).sort({lastMessageTime: -1})

        return res.json({
            message: 'Get all conversation successfully',
            error: false,
            success: true,
            data: chats 
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
