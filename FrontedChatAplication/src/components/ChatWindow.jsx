import React from 'react';
import './ChatWindow.css';

const ChatWindow = ({ conversation, currentUser, messages }) => {
  return (
    <div className="chat-window">
      {conversation ? (
        <>
          <h2>{conversation.name}</h2>
          <div className="messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.sender_id == currentUser.id ? 'sent' : 'received'}`}>
                <p>{message.content}</p>
                {message.media && message.media.map((media, mediaIndex) => (
                  <img 
                    key={mediaIndex} 
                    className="message-image"
                    src={`http://localhost:8000/storage/${media.url}`} 
                    alt={`Media ${mediaIndex}`} 
                  />
                ))}
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
