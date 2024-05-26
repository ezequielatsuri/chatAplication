import React, { useState } from 'react';
import ConversationList from './ConversationList';
import ChatWindow from './ChatWindow';
import MessageInput from './MessageInput';
import './ChatDashboard.css';

const ChatDashboard = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  const handleNewMessage = (message) => {
    // Aquí puedes actualizar los mensajes en el estado del componente `ChatWindow`
  };

  return (
    <div className="chat-dashboard">
      <div className="sidebar">
        <ConversationList selectConversation={handleSelectConversation} />
      </div>
      <div className="main">
        <ChatWindow conversation={selectedConversation} />
        <MessageInput conversation={selectedConversation} onNewMessage={handleNewMessage} />
      </div>
    </div>
  );
}

export default ChatDashboard;
