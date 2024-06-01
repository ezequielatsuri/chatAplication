import React, { useState } from 'react';
import axios from 'axios';
import './MessageInput.css';

const MessageInput = ({ conversation, currentUser, onNewMessage }) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = async () => {
    if (!currentUser || !conversation) {
      console.error('currentUser or conversation is undefined');
      return;
    }

    const message = {
      sender_id: currentUser.id,
      receiver_id: conversation.user_id,
      content: newMessage,
    };

    try {
      const response = await axios.post('/messages', message);
      onNewMessage(response.data);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message', error);
    }
  };

  // Función para manejar la tecla presionada
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { // Verifica si la tecla presionada es Enter
      e.preventDefault(); // Previene el comportamiento por defecto del Enter (que podría ser un salto de línea)
      handleSendMessage(); // Llama a la función para enviar el mensaje
    }
  };

  return (
    <div className="message-input">
      <input 
        type="text" 
        value={newMessage} 
        onChange={(e) => setNewMessage(e.target.value)} 
        onKeyDown={handleKeyDown} // Añade el evento onKeyDown al campo de entrada
        placeholder="Type your message..."
        disabled={!conversation || !currentUser}
      />
      <button onClick={handleSendMessage} disabled={!conversation || !currentUser}>Send</button>
    </div>
  );
};

export default MessageInput;
