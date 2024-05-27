import React, { useState } from 'react';
import ConversationList from './ConversationList';
import ChatWindow from './ChatWindow';
import MessageInput from './MessageInput';
import './ChatDashboard.css';

const ChatDashboard = () => {
  const currentUser = { id: 1, name: 'Current User' }; // Simulación de datos del usuario actual
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    axios.get(`/api/messages/between/${currentUser.id}/${conversation.id}`)
      .then(response => {
        if (Array.isArray(response.data)) {
          setMessages(response.data);
        } else {
          setMessages([]);
          console.error('Unexpected response data format:', response.data);
        }
      })
      .catch(error => {
        setMessages([]);
        console.error('Error fetching messages', error);
      });
  };

  const handleNewMessage = (message) => {
    setMessages(prevMessages => [...prevMessages, message]);
  };

  return (
    <div className="chat-dashboard">
      <div className="sidebar">
        <ConversationList selectConversation={handleSelectConversation} />
      </div>
      <div className="main">
        <ChatWindow 
          conversation={selectedConversation} 
          currentUser={currentUser} 
          messages={messages} 
        />
        <MessageInput 
          conversation={selectedConversation} 
          currentUser={currentUser} 
          onNewMessage={handleNewMessage} 
        />
      </div>
    </div>
  );
};

export default ChatDashboard;
