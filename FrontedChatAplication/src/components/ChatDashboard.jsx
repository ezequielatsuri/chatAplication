import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ConversationList from './ConversationList';
import ChatWindow from './ChatWindow';
import MessageInput from './MessageInput';
import './ChatDashboard.css';

const ChatDashboard = () => {
  const [currentUser, setCurrentUser] = useState(null); // Estado para el usuario actual
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    axios.get('/user') // Endpoint para obtener el usuario actual
      .then(response => {
        setCurrentUser(response.data);
        console.log('Usuario recuperado:', response.data);
      })
      .catch(error => {
        console.error('Error fetching current user', error);
      });
  }, []);

  useEffect(() => {
    if (currentUser) {
      console.log('currentUser ha cambiado:', currentUser);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && selectedConversation) {
      console.log('selectedConversation ha cambiado:', selectedConversation);
      axios.get(`/messages/between/${currentUser.id}/${selectedConversation.user_id}`)
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
    }
  }, [selectedConversation, currentUser]);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    console.log('Conversación seleccionada en handleSelectConversation:', conversation);
  };

  const handleNewMessage = (message) => {
    setMessages(prevMessages => [...prevMessages, message]);
  };

  if (!currentUser) {
    return <div>Loading...</div>; // Muestra un mensaje de carga mientras se obtiene el usuario actual
  }

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
