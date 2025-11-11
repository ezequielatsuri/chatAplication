import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ConversationList from './ConversationList';
import ChatWindow from './ChatWindow';
import MessageInput from './MessageInput';
import Navbar from './Navbar';
import './ChatDashboard.css';

const ChatDashboard = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    axios.get('/user', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      setCurrentUser(response.data);
      console.log('Usuario recuperado:', response.data);
    })
    .catch(error => {
      console.error('Error fetching current user', error);
      navigate('/login');
    });
  }, [navigate]);

  useEffect(() => {
    if (currentUser) {
      console.log('currentUser ha cambiado:', currentUser);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && selectedConversation) {
      console.log('selectedConversation ha cambiado:', selectedConversation);
      axios.get(`/messages/between/${currentUser.id}/${selectedConversation.user_id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(response => {
        if (Array.isArray(response.data)) {
          setMessages(response.data);
          console.log('Mensajes recuperados:', response.data);
        } else {
          setMessages([]);
          console.error('Unexpected response data format:', response.data);
        }
      })
      .catch(error => {
        setMessages([]);
        console.error('Error fetching messages:', error);
      });
    }
  }, [selectedConversation, currentUser]);

  const handleClearNotifications = () => setNotificationCount(0);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    setNotificationCount(0); // Limpiar notificaciones al abrir conversación
    // Marcar mensajes como leídos al abrir la conversación
    setUnreadMessages(prev => prev.filter(msg => msg.sender_id !== conversation.user_id));
    console.log('Conversación seleccionada en handleSelectConversation:', conversation);
  };

  const handleNewMessage = (message) => {
    console.log('ChatDashboard - handleNewMessage llamado con:', message);
    console.log('ChatDashboard - message.sender_id:', message.sender_id, 'currentUser.id:', currentUser.id);
    setMessages(prevMessages => [...prevMessages, message]);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedConversation(null);
    setMessages([]);
  };

  if (!currentUser) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container chat-page">
      <Navbar currentUser={currentUser} onLogout={handleLogout} notificationCount={notificationCount} onClearNotifications={handleClearNotifications} recentNotifications={unreadMessages} />
      
      <main className="main-content">
        <div className="chat-dashboard">
                <div className="sidebar">
        <ConversationList 
          selectConversation={handleSelectConversation} 
          currentUser={currentUser}
          selectedConversation={selectedConversation}
        />
      </div>
          <div className="main">
            <ChatWindow 
              conversation={selectedConversation} 
              currentUser={currentUser} 
              messages={messages} 
              onNewNotification={(msg) => {
                console.log('Mensaje recibido para notificación:', msg);
                console.log('Sender ID:', msg.sender_id, 'Current User ID:', currentUser.id);
                if (msg.sender_id !== currentUser.id) {
                  console.log('Agregando a notificaciones - mensaje de otro usuario');
                  setNotificationCount(c => c + 1);
                  setUnreadMessages(prev => [msg, ...prev]);
                } else {
                  console.log('No agregando a notificaciones - mensaje propio');
                }
              }}
            />
            <MessageInput 
              conversation={selectedConversation} 
              currentUser={currentUser} 
              onNewMessage={handleNewMessage} 
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatDashboard;
