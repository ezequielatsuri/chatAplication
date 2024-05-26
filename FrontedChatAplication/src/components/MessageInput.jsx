import React, { useState } from 'react';
import axios from 'axios';
import './MessageInput.css';

const MessageInput = ({ conversation, onNewMessage }) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    const message = {
      content: newMessage,
      conversationId: conversation.id,
      // Agrega otros campos necesarios
    };

    axios.post('http://localhost:8000/api/messages', message)
      .then(response => {
        onNewMessage(response.data);
        setNewMessage('');
      })
      .catch(error => {
        console.error('Error sending message', error);
      });
  };

  return (
    <div className="message-input">
      <input 
        type="text" 
        value={newMessage} 
        onChange={(e) => setNewMessage(e.target.value)} 
        placeholder="Type your message..."
        disabled={!conversation}
      />
      <button onClick={handleSendMessage} disabled={!conversation}>Send</button>
    </div>
  );
};

export default MessageInput;
