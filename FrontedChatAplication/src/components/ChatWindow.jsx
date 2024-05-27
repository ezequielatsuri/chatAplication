import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ChatWindow.css';

const ChatWindow = ({ conversation, currentUser, messages }) => {
  useEffect(() => {
    if (conversation && currentUser) {
      axios.get(`/api/messages/between/${currentUser.id}/${conversation.id}`)
        .then(response => {
          setMessages(response.data);
        })
        .catch(error => {
          console.error('Error fetching messages', error);
        });
    }
  }, [conversation, currentUser]);

  return (
    <div className="chat-window">
      {conversation ? (
        <>
          <h2>{conversation.name}</h2>
          <div className="messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.sender_id === currentUser.id ? 'sent' : 'received'}`}>
                <p>{message.content}</p>
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
