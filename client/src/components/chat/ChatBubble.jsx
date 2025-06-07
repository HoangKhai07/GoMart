import React, { useContext, useEffect, useRef, useState } from 'react';
import { IoChatbubblesOutline, IoClose, IoSendSharp, IoImageOutline } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import SummaryApi from '../../common/SummaryApi';
import { GlobalContext } from '../../provider/GlobalProvider';
import Axios from '../../utils/Axios';
import AxiosToastError from '../../utils/AxiosToastError';
import { getSocket, initSocket, joinChatRoom, sendTypingStatus } from '../../utils/socketService';
import { toast } from 'react-hot-toast';

const ChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [adminTyping, setAdminTyping] = useState(false);
  
  // Thêm state mới cho chức năng gửi hình ảnh
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [viewImageModal, setViewImageModal] = useState(null);
  
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const user = useSelector((state) => state.user);
  const isAuthenticated = !!user._id;
  const { isCartOpen } = useContext(GlobalContext);
  const [showFAQ, setShowFAQ] = useState(false);

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

  // Thêm function để xử lý chọn ảnh
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

  // Thêm function để xóa ảnh đã chọn
  const removeSelectedImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Thêm function để xử lý upload ảnh
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

  // Thêm function để gửi tin nhắn có hình ảnh
  const sendImageMessage = async (imageUrl) => {
    if (!chatId || !imageUrl) return;
    
    try {
      let adminId;

      if (messages.length > 0) {
        adminId = messages[0].senderId === user._id
          ? messages[0].receiverId
          : messages[0].senderId;
      } else {
        const response = await Axios({
          ...SummaryApi.get_admin_chat
        });

        if (response.data.success) {
          const participants = response.data.data.participants;
          adminId = participants.find(id => id !== user._id);
        }
      }

      if (!adminId) return;
      
      const messageContent = message.trim() ? message : "Đã gửi một hình ảnh";
      
      const response = await Axios({
       ...SummaryApi.send_image_message,
        data: {
          receiverId: adminId,
          content: messageContent,
          image: imageUrl
        }
      });
      
      if (response.data.success) {
        setMessage("");
      }
    } catch (error) {
      toast.error("Không thể gửi tin nhắn");
      AxiosToastError(error);
    }
  };



  // Function để hiển thị ảnh đầy đủ khi click vào
  const handleImageClick = (imageUrl) => {
    setViewImageModal(imageUrl);
  };

  // Function để đóng modal xem ảnh
  const closeImageModal = () => {
    setViewImageModal(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Nếu có ảnh được chọn, thực hiện upload ảnh
    if (selectedImage) {
      await handleImageUpload();
      return;
    }
    
    // Ngược lại gửi tin nhắn văn bản bình thường
    if (!message.trim() || !chatId) return;

    try {
      let adminId;

      if (messages.length > 0) {
        adminId = messages[0].senderId === user._id
          ? messages[0].receiverId
          : messages[0].senderId;
      } else {
        const response = await Axios({
          ...SummaryApi.get_admin_chat
        });

        if (response.data.success) {
          const participants = response.data.data.participants;
          adminId = participants.find(id => id !== user._id);
        }
      }

      if (!adminId) return;

      const response = await Axios({
        ...SummaryApi.send_message,
        data: {
          receiverId: adminId,
          content: message,
        },
      });

      if (response.data.success) {
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
          {
            messages.length === 0 ? (
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
            ) : (
              <div className='hidden'></div>
            )
          }

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
                  } p-3 px-4 break-words`}>
                
                {/* display image message */}
                {msg.image && (
                  <div className="mb-2">
                    <img
                      src={msg.image}
                      alt="Chat image"
                      className="max-w-full rounded-sm cursor-pointer hover: transition-opacity"
                      style={{background: 'transparent'}}
                      onClick={() => handleImageClick(msg.image)}
                    />
                  </div>
                )}
                
                {/* display message content */}
                {msg.content && msg.content !== "Đã gửi một hình ảnh" && (
                  <p>{msg.content}</p>
                )}

                <div
                  className={`text-xs mt-1 ${msg.senderId === user._id ? 'text-gray-200' : 'text-gray-500'
                    }`}>
                  <div className='flex justify-between'>
                  {msg.isFromAI && (
                    <span className='block text-xs italic text-gray-500'>Được gửi bởi trợ lý AI</span>
                  )}
                  {new Date(msg.createdAt).toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  
                  {msg.senderId === user._id && (
                    <span className="ml-1">{msg.isRead ? ' ✓✓' : ' ✓'}</span>
                  )}
                  </div>
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

          {/* Bottom Navigation */}
          <div className="border-t border-gray-100">
            <form onSubmit={handleSubmit} className="p-3 flex items-center">
              {/* send image button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-500 hover:text-green-600 focus:outline-none"
                disabled={!isAuthenticated || !chatId || isUploading}
                title="Gửi hình ảnh"
              >
                <IoImageOutline size={22} />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  accept="image/*"
                  className="hidden"
                  disabled={!isAuthenticated || !chatId || isUploading}
                />
              </button>
              
              <input
                type="text"
                value={message}
                onChange={handleInputChange}
                placeholder="Nhập tin nhắn..."
                className="flex-1 border border-gray-200 rounded-full p-2 px-4 focus:outline-none focus:ring-1 focus:ring-green-500"
                disabled={!isAuthenticated || !chatId || isUploading}
              />
              
              <button
                type="submit"
                className="bg-green-600 text-white p-2 rounded-full ml-2 hover:bg-green-700 focus:outline-none disabled:bg-gray-400"
                disabled={(!message.trim() && !selectedImage) || !isAuthenticated || !chatId || isUploading}
              >
                {isUploading ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <IoSendSharp size={20} />
                )}
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
      
      {/* Modal view image message */}
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

export default ChatBubble;