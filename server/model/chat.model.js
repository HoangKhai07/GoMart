import mongoose from 'mongoose'

const chatSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    lastMessage: {
        type: String,
        default: ""
    },

     lastMessageTime: {
        type: Date,
        default: Date.now
    },

    unreadCount: {
        type: Number,
        default: 0
    },
}, {
    timestamps: true}
)

const ChatModel = mongoose.model("Chat", chatSchema)

export default ChatModel
