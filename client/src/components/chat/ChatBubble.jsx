import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { IoChatbubblesOutline, IoSendSharp, IoClose } from 'react-icons/io5';
import Axios from '../../utils/Axios';
import SummaryApi from '../../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../../utils/AxiosToastError';
import { initSocket, getSocket, joinChatRoom, sendTypingStatus } from '../../utils/socketService';
import { useContext } from 'react';
import { GlobalContext } from '../../provider/GlobalProvider';

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
  const { isCartOpen } = useContext(GlobalContext);

  // If cart is opened, close the chat
  useEffect(() => {
    if (isCartOpen && isOpen) {
      setIsOpen(false);
    }
  }, [isCartOpen]);

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
        const newMessage = response.data.data.message
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

  if (user.role === 'ADMIN' || isCartOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-white mb-16 shadow-lg rounded-2xl w-96 sm:w-96 flex flex-col h-[680px] border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-green-600 text-white py-6 px-5 flex flex-col">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-2">
                  <IoChatbubblesOutline size={20} />
                </div>
                <h3 className="font-medium text-sm">GoMart</h3>
              </div>
              <div className="flex">
                <div className="w-8 h-8 rounded-full overflow-hidden ml-1">
                  <img src="/src/assets/logo_icon.png" alt="admin" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            
            <h2 className="text-2xl font-medium mt-2">Hi {user.name || 'User'} 👋</h2>
            <p className="text-xl">Bạn cần hỗ trợ?</p>
            
          </div>

          {/* Recent Message Box */}
          <div>
            <div className="border border-gray-100 rounded-lg p-3 text-gray-700 flex justify-between items-center">
              <span>Chat với CSKH</span>
              <span className="text-green-600">↗</span>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-white">
            {loading && <div className="text-center py-2">Loading...</div>}

            {messages.length === 0 && !loading && (
              <div className="text-center text-gray-500 py-10">
                Hãy gửi cho chúng tôi một tin nhắn để hỗ trợ bạn
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={msg._id || index}
                className={`mb-3 max-w-[80%] ${msg.senderId === user._id
                  ? 'ml-auto bg-green-600 text-white rounded-2xl rounded-br-none'
                  : 'mr-auto bg-gray-100 text-gray-800 rounded-2xl rounded-bl-none'
                  } p-3 px-4 break-words`}
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
                Admin đang soạn tin...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Navigation */}
          <div className="border-t border-gray-100">
            <form onSubmit={handleSubmit} className="p-3 flex">
              <input
                type="text"
                value={message}
                onChange={handleInputChange}
                placeholder="Type a message..."
                className="flex-1 border border-gray-200 rounded-full p-2 px-4 focus:outline-none focus:ring-1 focus:ring-green-500"
                disabled={!isAuthenticated || !chatId}
              />
              <button
                type="submit"
                className="bg-green-600 text-white p-2 rounded-full ml-2 hover:bg-green-700 focus:outline-none disabled:bg-gray-400"
                disabled={!message.trim() || !isAuthenticated || !chatId}
              >
                <IoSendSharp size={20} />
              </button>
            </form>
          </div>
        </div>
        
      ) : (
        <button
          onClick={toggleChat}
          className="bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-colors duration-300 focus:outline-none"
        >
          <IoChatbubblesOutline size={28} />
        </button>
      )}
      
     
      {isOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-4 right-4 z-50 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-colors duration-300 focus:outline-none"
        >
          <IoClose size={28} />
        </button>
      )}
    </div>
  );
};

export default ChatBubble; 