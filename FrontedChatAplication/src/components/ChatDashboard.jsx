import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ConversationList from './ConversationList';
import ChatWindow from './ChatWindow';
import MessageInput from './MessageInput';
import './ChatDashboard.css';

const ChatDashboard = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
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

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    console.log('Conversación seleccionada en handleSelectConversation:', conversation);
  };

  const handleNewMessage = (message) => {
    setMessages(prevMessages => [...prevMessages, message]);
  };

  if (!currentUser) {
    return (
      <div>
        <p>Loading...</p>
        <p>Verificando autenticación del usuario...</p>
      </div>
    );
  }

  const handleLogout = () => {
    const token = localStorage.getItem('token');
    axios.post('/logout', {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      console.log('Logout successful', response);
      localStorage.removeItem('token');
      setCurrentUser(null);
      navigate('/login');
    })
    .catch(error => {
      console.error('There was an error logging out!', error);
    });
  };

  return (
    <div className="chat-dashboard">
      <div className="sidebar">
        <ConversationList 
          selectConversation={handleSelectConversation} 
          currentUser={currentUser} 
        />
        <button onClick={handleLogout}>Logout</button>
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
