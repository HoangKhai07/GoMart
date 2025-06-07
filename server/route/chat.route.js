import { Router } from 'express'
import auth from '../middleware/auth.js'
import admin from '../middleware/admin.js'
import { 
    getAdminChatController, 
    getAllChatsController, 
    getChatsController, 
    getMessagesController, 
    getMessagesNeedingAttentionController, 
    markMessagesAsReadController, 
    sendImageMessageController, 
    sendMessageController 
} from '../controllers/chat.controller.js'

const chatRouter = Router()

chatRouter.post('/send', auth, sendMessageController)
chatRouter.post('/send-image', auth, sendImageMessageController)
chatRouter.get('/chats', auth, getChatsController)
chatRouter.get('/messages/:chatId', auth, getMessagesController)
chatRouter.put('/read/:chatId', auth, markMessagesAsReadController)
chatRouter.get('/admin-chat', auth, getAdminChatController)
chatRouter.get('/admin/all-chats', auth, admin, getAllChatsController)
chatRouter.get('/admin/attention-needed', auth, admin, getMessagesNeedingAttentionController)
export default chatRouter
