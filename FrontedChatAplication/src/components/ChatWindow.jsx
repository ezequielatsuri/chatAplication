import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ChatWindow.css';

const ChatWindow = ({ conversation }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (conversation) {
      // Cargar mensajes desde el backend
      axios.get(`http://localhost:8000/api/messages/${conversation.id}`)
        .then(response => {
          setMessages(response.data);
        })
        .catch(error => {
          console.error('Error fetching messages', error);
        });
    }
  }, [conversation]);

  return (
    <div className="chat-window">
      {conversation ? (
        <>
          <h2>{conversation.name}</h2>
          <div className="messages">
            {messages.map((message, index) => (
              <div key={index} className="message">
                {message.content}
              </div>
            ))}
          </div>
        </>
      ) : (
        <p>Select a conversation</p>
      )}
    </div>
  );
};

export default ChatWindow;
