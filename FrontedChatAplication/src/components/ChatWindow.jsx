import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ChatWindow.css';

const ChatWindow = ({ conversation, currentUser, messages }) => {
  
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
