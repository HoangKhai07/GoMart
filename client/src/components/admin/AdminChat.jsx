import React, { useEffect, useRef, useState } from 'react';
import { FaCircle } from 'react-icons/fa';
import { IoClose, IoImageOutline } from 'react-icons/io5';
import { BiSolidSend } from "react-icons/bi";
import { useSelector } from 'react-redux';
import SummaryApi from '../../common/SummaryApi';
import Axios from '../../utils/Axios';
import AxiosToastError from '../../utils/AxiosToastError';
import { getSocket, initSocket, joinChatRoom, leaveChatRoom, sendTypingStatus } from '../../utils/socketService';

const AdminChat = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [typing, setTyping] = useState(false);
  const [userTyping, setUserTyping] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(null);
  const [viewImageModal, setViewImageModal] = useState(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const socketInitialized = useRef(false);
  const user = useSelector((state) => state.user);
  const fileInputRef = useRef(null);

  // Initialize socket when component mounts
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token && !socketInitialized.current) {
      initSocket(token);
      socketInitialized.current = true;

      const socket = getSocket();

      // Clean up previous listeners to avoid duplicates
      socket.off('newMessage');
      socket.off('userTyping');
      socket.off('messagesRead');

      // Add new listeners
      socket.on('newMessage', handleNewMessage);
      socket.on('userTyping', handleUserTyping);
      socket.on('messagesRead', handleMessagesRead);

      return () => {
        socket.off('newMessage', handleNewMessage);
        socket.off('userTyping', handleUserTyping);
        socket.off('messagesRead', handleMessagesRead);
      };
    }
  }, []);

  // Fetch all chats when component mounts
  useEffect(() => {
    getAdminChats();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Join chat room when chat is selected
  useEffect(() => {
    if (selectedChat) {
      if (selectedChat._id) {
        // Leave previous chat room if there was one
        if (selectedChat._id !== selectedChat._id) {
          leaveChatRoom(selectedChat._id);
        }

        joinChatRoom(selectedChat._id);
        loadMessages(selectedChat._id);
      }
    }

    return () => {
      if (selectedChat && selectedChat._id) {
        leaveChatRoom(selectedChat._id);
      }
    };
  }, [selectedChat]);

  const handleNewMessage = (data) => {
    console.log('Admin received new message:', data);

    if (selectedChat && data.chat === selectedChat._id) {
      setMessages((prev) => {
        const exists = prev.some(msg => msg._id === data.message._id);
        if (exists) return prev;
        return [...prev, data.message];
      });

      markMessagesAsRead(selectedChat._id);
    }

    setChats((prevChats) => {
      return prevChats.map((chat) => {
        if (chat._id === data.chat) {
          return {
            ...chat,
            lastMessage: data.message.content,
            lastMessageTime: data.message.createdAt,
            unreadCount: selectedChat && selectedChat._id === chat._id ? 0 :
              (data.message.senderId !== user._id ? (chat.unreadCount || 0) + 1 : chat.unreadCount || 0)
          };
        }
        return chat;
      });
    });
  };

  const handleUserTyping = (data) => {
    setUserTyping((prev) => ({
      ...prev,
      [data.userId]: data.isTyping
    }));
  };

  const handleMessagesRead = (data) => {
    if (selectedChat && data.chatId === selectedChat._id) {
      setMessages((prev) =>
        prev.map((msg) => ({
          ...msg,
          isRead: true
        }))
      );
    }
  };

  const getAdminChats = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.get_all_admin_chats
      });

      if (response.data.success) {
        setChats(response.data.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (chatId) => {
    try {
      setLoadingMessages(true);
      const response = await Axios({
        ...SummaryApi.get_messages,
        url: `${SummaryApi.get_messages.url}/${chatId}`
      });

      if (response.data.success) {
        setMessages(response.data.data.reverse());
        markMessagesAsRead(chatId);
        setChats((prevChats) => {
          return prevChats.map((chat) => {
            if (chat._id === chatId) {
              return { ...chat, unreadCount: 0 };
            }
            return chat;
          });
        });
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const markMessagesAsRead = async (chatId) => {
    try {
      await Axios({
        ...SummaryApi.mark_messages_read,
        url: `${SummaryApi.mark_messages_read.url}/${chatId}`
      });
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const handleChatSelect = (chat) => {
    if (selectedChat && selectedChat._id === chat._id) return;

    if (selectedChat && selectedChat._id) {
      leaveChatRoom(selectedChat._id);
    }

    setSelectedChat(chat);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Hình ảnh không được vượt quá 5MB');
        return;
      }
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", selectedImage);

      const response = await Axios({
        url: SummaryApi.upload_image.url,
        method: SummaryApi.upload_image.method,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      if (response.data.success) {
        // Upload successful, now send image message
        await sendImageMessage(response.data.data.secure_url);
        // Clear the image preview and selected image
        removeSelectedImage();
      }
    } catch (error) {
      toast.error("Không thể tải ảnh lên, vui lòng thử lại sau");
      AxiosToastError(error);
    } finally {
      setIsUploading(false);
    }
  };

  const sendImageMessage = async (imageUrl) => {
    if (!selectedChat || !imageUrl) return;

    try {
      const receiverId = selectedChat.participants.find(
        (participant) => participant._id !== user._id
      )._id;

      const messageContent = message.trim() ? message : "Đã gửi một hình ảnh";

      const response = await Axios({
        ...SummaryApi.send_image_message,
        data: {
          receiverId: receiverId,
          content: messageContent,
          image: imageUrl
        }
      });

      if (response.data.success) {
        const newMessage = response.data.data.message;
        setMessages((prev) => [...prev, newMessage]);
        setChats((prevChats) => {
          return prevChats.map((chat) => {
            if (chat._id === selectedChat._id) {
              return {
                ...chat,
                lastMessage: "Đã gửi một hình ảnh",
                lastMessageTime: new Date()
              };
            }
            return chat;
          });
        });

        setMessage('');
      }
    } catch (error) {
      toast.error("Không thể gửi tin nhắn");
      AxiosToastError(error);
    }
  };

  // function handle show full image
  const handleImageClick = (imageUrl) => {
    setViewImageModal(imageUrl);
  };

  // function handle close image modal
  const closeImageModal = () => {
    setViewImageModal(null);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedImage) {
      await handleImageUpload();
      return;
    }

    if (!message.trim() || !selectedChat) return;

    try {
      const receiverId = selectedChat.participants.find(
        (participant) => participant._id !== user._id
      )._id;

      const response = await Axios({
        ...SummaryApi.send_message,
        data: {
          receiverId,
          content: message
        }
      });

      if (response.data.success) {
        const newMessage = response.data.data.message;
        setMessages((prev) => [...prev, newMessage]);

        setChats((prevChats) => {
          return prevChats.map((chat) => {
            if (chat._id === selectedChat._id) {
              return {
                ...chat,
                lastMessage: message,
                lastMessageTime: new Date()
              };
            }
            return chat;
          });
        });

        setMessage('');
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);

    if (!typing && selectedChat) {
      setTyping(true);
      sendTypingStatus(selectedChat._id, true);
    }


    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setTyping(false);
      if (selectedChat) {
        sendTypingStatus(selectedChat._id, false);
      }
    }, 2000);
  };

  const isUserTyping = selectedChat && selectedChat.participants &&
    selectedChat.participants.find(p => p._id !== user._id)?._id;

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="h-[calc(98vh-98px)] border flex bg-white rounded-lg shadow-md overflow-hidden">
      {/* Chat list sidebar */}
      <div className="w-full md:w-1/3 lg:w-1/4 border-r border-gray-200 bg-gray-300">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-base pb-1 font-semibold">Tin nhắn từ khách hàng</h2>
        </div>

        <div className="overflow-y-auto h-[calc(100%-64px)]">
          {loading && <div className="text-center py-4">Đang tải...</div>}

          {!loading && chats.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Chưa có tin nhắn nào
            </div>
          )}

          {chats.map((chat) => {
            const otherUser = chat.participants.find(
              (participant) => participant._id !== user._id
            );

            const lastMessageTime = new Date(chat.lastMessageTime);
            const now = new Date();
            const diffMs = now - lastMessageTime;
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

            let timeStr;
            if (diffDays > 0) {
              timeStr = `${diffDays} ngày trước`;
            } else {
              timeStr = formatTime(lastMessageTime);
            }

            return (
              <div
                key={chat._id}
                className={`p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-100 ${selectedChat && selectedChat._id === chat._id ? 'bg-gray-200' : ''
                  }`}
                onClick={() => handleChatSelect(chat)}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={otherUser?.avatar || 'https://via.placeholder.com/40'}
                      alt={otherUser?.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {chat.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {chat.unreadCount}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <h3 className="font-medium truncate">{otherUser?.name}</h3>
                      <span className="text-xs text-gray-500">{timeStr}</span>
                    </div>
                    <p className="text-gray-600 truncate text-sm">{chat.lastMessage}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat messages */}
      <div className="hidden md:flex md:flex-col md:w-2/3 lg:w-3/4">
        {selectedChat ? (
          <>
            {/* Chat header */}
            <div className="p-3 border-b border-gray-200 flex items-center gap-3">
              {selectedChat.participants.find(p => p._id !== user._id) && (
                <>
                  <img
                    src={selectedChat.participants.find(p => p._id !== user._id)?.avatar || 'https://via.placeholder.com/40'}
                    alt={selectedChat.participants.find(p => p._id !== user._id)?.name}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-medium">
                      {selectedChat.participants.find(p => p._id !== user._id)?.name}
                    </h3>
                  </div>
                </>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {loadingMessages && <div className="text-center py-4">Đang tải tin nhắn...</div>}

              {!loadingMessages && messages.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Chưa có tin nhắn nào
                </div>
              )}

              {messages.map((msg, index) => (
                <div
                  key={msg._id || index}
                  className={`mb-3 max-w-[70%] ${msg.senderId === user._id
                      ? 'ml-auto bg-primary-light text-white rounded-l-lg rounded-tr-lg'
                      : 'mr-auto bg-gray-200 text-gray-800 rounded-r-lg rounded-tl-lg'
                    } p-3 break-words`}
                >
                  {/* display image */}
                  {msg.image && (
                    <div className="mb-2">
                      <img
                        src={msg.image}
                        alt="Chat image"
                        className="max-w-full rounded-sm cursor-pointer hover: transition-opacity"
                        style={{ background: 'transparent' }}
                        onClick={() => handleImageClick(msg.image)}
                      />
                    </div>
                  )}

                  {msg.content}
                  <div
                    className={`text-xs mt-1 flex justify-between items-center ${msg.senderId === user._id ? 'text-gray-200' : 'text-gray-500'
                      }`}
                  >
                    {formatTime(msg.createdAt)}
                    {msg.isFromAI && (
                      <span className='block text-xs italic text-white'>Được gửi bởi trợ lý AI</span>
                    )}
                    {msg.senderId === user._id && (
                      <span className="ml-1">{msg.isRead ? ' ✓✓' : ' ✓'}</span>
                    )}
                    {msg.needsAdminAttention && (
                      <span className="block text-xs font-bold text-yellow-600 mt-1">⚠️ Cần chú ý</span>
                    )}
                  </div>
                </div>
              ))}

              {isUserTyping && userTyping[isUserTyping] && (
                <div className="text-gray-500 text-sm italic ml-2 flex items-center gap-1">
                  <FaCircle className="animate-pulse text-gray-400" size={8} />
                  <FaCircle className="animate-pulse text-gray-400 animate-delay-200" size={8} />
                  <FaCircle className="animate-pulse text-gray-400 animate-delay-300" size={8} />
                  <span className="ml-1">Đang nhập tin nhắn...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* view image preview */}
            {imagePreview && (
              <div className="px-3 pt-2">
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Xem trước"
                    className="h-20 rounded-lg border border-gray-200"
                  />
                  <button
                    onClick={removeSelectedImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    title="Xóa ảnh"
                  >
                    <IoClose size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Message input */}
            <form onSubmit={handleSubmit} className="border border-gray-200 p-2 flex">
              <input
                type="text"
                value={message}
                onChange={handleInputChange}
                placeholder="Nhập tin nhắn..."
                className="flex-1  rounded-l-md p-2 focus:outline-none"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-500 hover:text-green-600 focus:outline-none"
                disabled={isUploading}
                title="Gửi hình ảnh"
              >
                <IoImageOutline size={25} />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  accept="image/*"
                  className="hidden"
                  disabled={isUploading}
                />
              </button>

              <button
                type="submit"
                title="Gửi"
                className="text-primary-light hover:text-green-600 cursor-pointer px-4 rounded-r-md hover:bg-primary-dark focus:outline-none disabled:text-gray-400"
                disabled={!message.trim()}
              >
                <BiSolidSend size={30} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Chọn một cuộc trò chuyện để bắt đầu
          </div>
        )}
      </div>

      {/* Mobile view - show chat details if selected */}
      {selectedChat && (
        <div className="fixed inset-0 bg-white z-50 md:hidden flex flex-col">
          <div className="p-3 border-b border-gray-200 flex items-center gap-3">
            <button
              onClick={() => setSelectedChat(null)}
              className="text-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <img
              src={selectedChat.participants.find(p => p._id !== user._id)?.avatar || 'https://via.placeholder.com/40'}
              alt={selectedChat.participants.find(p => p._id !== user._id)?.name}
              className="w-10 h-10 rounded-full object-cover"
            />

            <h3 className="font-medium">
              {selectedChat.participants.find(p => p._id !== user._id)?.name}
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {loadingMessages && <div className="text-center py-4">Đang tải tin nhắn...</div>}

            {!loadingMessages && messages.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Chưa có tin nhắn nào
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={msg._id || index}
                className={`mb-3 max-w-[70%] ${msg.senderId === user._id
                    ? 'ml-auto bg-primary-light text-white rounded-l-lg rounded-tr-lg'
                    : 'mr-auto bg-gray-200 text-gray-800 rounded-r-lg rounded-tl-lg'
                  } p-3 break-words`}
              >
                {msg.content}
                <div
                  className={`text-xs mt-1 ${msg.senderId === user._id ? 'text-gray-200' : 'text-gray-500'
                    }`}
                >
                  {formatTime(msg.createdAt)}
                  {msg.senderId === user._id && (
                    <span className="ml-1">{msg.isRead ? ' ✓✓' : ' ✓'}</span>
                  )}
                </div>
              </div>
            ))}

            {isUserTyping && userTyping[isUserTyping] && (
              <div className="text-gray-500 text-sm italic ml-2">
                Đang nhập tin nhắn...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="border-t border-gray-200 p-3 flex">


            <input
              type="text"
              value={message}
              onChange={handleInputChange}
              placeholder="Nhập tin nhắn..."
              className=" flex-1 border border-gray-300 rounded-l-md p-2 focus:outline-none focus:ring-1 focus:ring-primary-light"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-500 hover:text-green-600 focus:outline-none"
              disabled={isUploading}
              title="Gửi hình ảnh"
            >
              <IoImageOutline size={22} />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                className="hidden"
                disabled={isUploading}
              />
            </button>

            <button
              type="submit"
              title="Gửi"

              className="text-primary-light cursor-pointer px-4 rounded-r-md hover:bg-primary-dark focus:outline-none disabled:bg-gray-400"
              disabled={!message.trim()}
            >
              <BiSolidSend size={20} />
            </button>
          </form>
        </div>
      )}

      {viewImageModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center"
          onClick={closeImageModal}
        >
          <div className="max-w-4xl max-h-[90vh] p-2" onClick={(e) => e.stopPropagation()}>
            <img
              src={viewImageModal}
              alt="Xem đầy đủ"
              className="max-w-full max-h-[85vh] object-contain"
            />
            <button
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70"
              onClick={closeImageModal}
            >
              <IoClose size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminChat; 