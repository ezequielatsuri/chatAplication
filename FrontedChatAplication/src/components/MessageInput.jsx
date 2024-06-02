import React, { useState } from 'react';
import axios from 'axios';
import './MessageInput.css';

const MessageInput = ({ conversation, currentUser, onNewMessage }) => {
  const [newMessage, setNewMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleSendMessage = async () => {
    if (!currentUser || !conversation) {
      console.error('currentUser or conversation is undefined');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    const formData = new FormData();
    formData.append('sender_id', currentUser.id);
    formData.append('receiver_id', conversation.user_id);
    formData.append('content', newMessage);
    selectedFiles.forEach((file, index) => {
      formData.append(`images[${index}]`, file);
    });

    try {
      const response = await axios.post('/messages', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      onNewMessage(response.data);
      console.log(response.data,'este el mensaje enviado')
      setNewMessage('');
      setSelectedFiles([]);
    } catch (error) {
      console.error('Error sending message', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  return (
    <div className="message-input">
      <input 
        type="text" 
        value={newMessage} 
        onChange={(e) => setNewMessage(e.target.value)} 
        onKeyDown={handleKeyDown} 
        placeholder="Type your message..."
        disabled={!conversation || !currentUser}
      />
      <input 
        type="file" 
        multiple 
        onChange={handleFileChange} 
        style={{ display: 'none' }} 
        id="fileInput"
      />
      <button onClick={() => document.getElementById('fileInput').click()} disabled={!conversation || !currentUser}>
        Select Images
      </button>
      <button onClick={handleSendMessage} disabled={!conversation || !currentUser}>Send</button>
    </div>
  );
};

export default MessageInput;
