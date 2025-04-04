import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { IoChatbubblesOutline, IoSendSharp, IoClose } from 'react-icons/io5';
import Axios from '../../utils/Axios';
import SummaryApi from '../../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../../utils/AxiosToastError';
import { initSocket, getSocket, joinChatRoom, sendTypingStatus } from '../../utils/socketService';

const ChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [adminTyping, setAdminTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const user = useSelector((state) => state.user);
  const isAuthenticated = !!user._id;

  // Fetch or create admin chat when the component mounts
  useEffect(() => {
    if (isAuthenticated && isOpen) {
      getAdminChat();
    }
  }, [isAuthenticated, isOpen]);


  useEffect(() => {
    if (isAuthenticated && isOpen) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        initSocket(token);

        const socket = getSocket();
        socket.on('newMessage', handleNewMessage);

        socket.on('userTyping', handleUserTyping);

        socket.on('messagesRead', handleMessagesRead);

        return () => {
          socket.off('newMessage', handleNewMessage);
          socket.off('userTyping', handleUserTyping);
          socket.off('messagesRead', handleMessagesRead);
        };
      }
    }
  }, [isAuthenticated, isOpen, chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Join chat room when chatId is available
  useEffect(() => {
    if (chatId && isOpen) {
      joinChatRoom(chatId);
      loadMessages();
    }
  }, [chatId, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNewMessage = (data) => {
    if (data.chat === chatId) {
      setMessages((prev) => [...prev, data.message]);
      markMessagesAsRead();
    }
  };

  const handleUserTyping = (data) => {
    if (data.isTyping) {
      setAdminTyping(true);
    } else {
      setAdminTyping(false);
    }
  };

  const handleMessagesRead = (data) => {
    if (data.chatId === chatId) {
      setMessages((prev) =>
        prev.map((msg) => ({
          ...msg,
          isRead: true,
        }))
      );
    }
  };

  const getAdminChat = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.get_admin_chat,
      });

      if (response.data.success) {
        setChatId(response.data.data._id);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.get_messages,
        url: `${SummaryApi.get_messages.url}/${chatId}`,
      });

      if (response.data.success) {
        setMessages(response.data.data.reverse());
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const markMessagesAsRead = async () => {
    try {
      await Axios({
        ...SummaryApi.mark_messages_read,
        url: `${SummaryApi.mark_messages_read.url}/${chatId}`,
      });
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || !chatId) return;

    try {
      const admin = messages.length > 0
        ? messages[0].senderId === user._id
          ? messages[0].receiverId
          : messages[0].senderId
        : null;

      if (!admin) return;

      const response = await Axios({
        ...SummaryApi.send_message,
        data: {
          receiverId: admin,
          content: message,
        },
      });

      if (response.data.success) {
        // Add message to the messages array immediately
        const newMessage = response.data.data.message;
        setMessages((prev) => [...prev, newMessage]);
        setMessage('');
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);

    // Handle typing status
    if (!typing) {
      setTyping(true);
      sendTypingStatus(chatId, true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setTyping(false);
      sendTypingStatus(chatId, false);
    }, 2000);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  if (user.role === 'ADMIN') return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-white shadow-lg rounded-lg w-80 sm:w-96 flex flex-col h-[450px] border border-gray-200">
          <div className="bg-primary-light text-white p-3 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">Chat với quản trị viên</h3>
            <button onClick={toggleChat} className="text-white hover:text-gray-200">
              <IoClose size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 bg-gray-50">
            {loading && <div className="text-center py-2">Đang tải...</div>}

            {messages.length === 0 && !loading && (
              <div className="text-center text-gray-500 py-10">
                Gửi tin nhắn cho chúng tôi để được hỗ trợ
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={msg._id || index}
                className={`mb-2 max-w-[80%] ${msg.senderId === user._id
                    ? 'ml-auto bg-primary-light text-white rounded-l-lg rounded-tr-lg'
                    : 'mr-auto bg-gray-200 text-gray-800 rounded-r-lg rounded-tl-lg'
                  } p-2 px-3 break-words`}
              >
                {msg.content}
                <div
                  className={`text-xs mt-1 ${msg.senderId === user._id ? 'text-gray-200' : 'text-gray-500'
                    }`}
                >
                  {new Date(msg.createdAt).toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  {msg.senderId === user._id && (
                    <span className="ml-1">{msg.isRead ? ' ✓✓' : ' ✓'}</span>
                  )}
                </div>
              </div>
            ))}

            {adminTyping && (
              <div className="text-gray-500 text-sm italic ml-2">
                Quản trị viên đang nhập...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="border-t border-gray-200 p-2 flex">
            <input
              type="text"
              value={message}
              onChange={handleInputChange}
              placeholder="Nhập tin nhắn..."
              className="flex-1 border border-gray-300 rounded-l-md p-2 focus:outline-none focus:ring-1 focus:ring-primary-light"
              disabled={!isAuthenticated || !chatId}
            />
            <button
              type="submit"
              className="bg-primary-light text-white px-3 rounded-r-md hover:bg-primary-dark focus:outline-none disabled:bg-gray-400"
              disabled={!message.trim() || !isAuthenticated || !chatId}
            >
              <IoSendSharp size={20} />
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={toggleChat}
          className="bg-primary-light text-white p-3 rounded-full shadow-lg hover:bg-primary-dark transition-colors duration-300 focus:outline-none"
        >
          <IoChatbubblesOutline size={28} />
        </button>
      )}
    </div>
  );
};

export default ChatBubble; 