import React from 'react';
import AdminChat from '../../components/admin/AdminChat';

const AdminChatPage = () => {
  return (

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Trò chuyện với khách hàng</h1>
        <AdminChat />
      </div>

  );
};

export default AdminChatPage