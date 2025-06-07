import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    content: {
        type: String,
        required: true
    },

    image: {
        type: String,
        default: "",
    },

    isRead: {
        type: Boolean,
        default: false
    },

    chatId: {
        type: String,
        required: true
    },

    isFromAI: {
        type: Boolean,
        default: false
    },

    needsAdminAttention: {
        type: Boolean,
        default: false
    }
},
{ timestamps: true}
)

messageSchema.index({chatId: 1})
messageSchema.index({senderId: 1, receiverId: 1})

const MessageModel = mongoose.model('Message', messageSchema)

export default MessageModel