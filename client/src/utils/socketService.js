import { io } from 'socket.io-client';
import { baseURL } from '../common/SummaryApi';

let socket = null;

const getSocket = () => {
  if (!socket) {
    throw new Error('Socket not initialized');
  }
  return socket;
};

const initSocket = (token) => {
  if (socket && socket.connected) {
    return socket;
  }

  socket = io(baseURL, {
    auth: { token },
    withCredentials: true,
  });

  socket.on('connect', () => {
    console.log('Socket connected');
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error.message);
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
  });

  return socket;
};

const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

const joinChatRoom = (chatId) => {
  if (socket) {
    socket.emit('joinChatRoom', chatId);
  }
};

const leaveChatRoom = (chatId) => {
  if (socket) {
    socket.emit('leaveChatRoom', chatId);
  }
};

const sendTypingStatus = (chatId, isTyping) => {
  if (socket) {
    socket.emit('typing', { chatId, isTyping });
  }
};

export {
  getSocket,
  initSocket,
  disconnectSocket,
  joinChatRoom,
  leaveChatRoom,
  sendTypingStatus
}; 