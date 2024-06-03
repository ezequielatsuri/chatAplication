import React, { useState } from 'react';
import axios from 'axios';
import './MessageInput.css';

const MessageInput = ({ conversation, currentUser, onNewMessage }) => {
  const [newMessage, setNewMessage] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);

  const handleSendMessage = async () => {
    if (!currentUser || !conversation) {
      console.error('currentUser or conversation is undefined');
      return;
    }

    const token = localStorage.getItem('token'); // Obtener el token del almacenamiento local
    if (!token) {
      console.error('No token found');
      return;
    }

    const formData = new FormData();
    formData.append('sender_id', currentUser.id);
    formData.append('receiver_id', conversation.user_id);
    formData.append('content', newMessage);

    selectedImages.forEach((image, index) => {
      formData.append(`images[${index}]`, image);
    });

    try {
      const response = await axios.post('/messages', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      onNewMessage(response.data);
      setNewMessage('');
      setSelectedImages([]);
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

  const handleImageChange = (e) => {
    setSelectedImages(Array.from(e.target.files));
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
        onChange={handleImageChange} 
        disabled={!conversation || !currentUser}
        style={{ display: 'none' }} // Esconde el input de archivo original
        id="fileInput"
      />
      <button 
        onClick={() => document.getElementById('fileInput').click()}
        disabled={!conversation || !currentUser}
      >
        Select Images
      </button>
      <button onClick={handleSendMessage} disabled={!conversation || !currentUser}>Send</button>
    </div>
  );
};

export default MessageInput;
