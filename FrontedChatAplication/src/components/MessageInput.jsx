import React, { useState, useRef } from 'react';
import axios from 'axios';
import './MessageInput.css';

const MessageInput = ({ conversation, currentUser, onNewMessage }) => {
  const [newMessage, setNewMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef(null);

  const handleSendMessage = async () => {
    if (!currentUser || !conversation || !newMessage.trim() && selectedFiles.length === 0) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    setIsSending(true);

    const formData = new FormData();
    formData.append('sender_id', currentUser.id);
    formData.append('receiver_id', conversation.user_id);
    formData.append('content', newMessage.trim());

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
      setNewMessage('');
      setSelectedFiles([]);
    } catch (error) {
      console.error('Error sending message', error);
      if (error.response && error.response.data) {
        if (error.response.data.errors) {
          // Errores de validación
          const errorMessages = Object.values(error.response.data.errors).flat();
          alert('Errores de validación:\n' + errorMessages.join('\n'));
        } else if (error.response.data.message) {
          // Mensaje de error general
          alert('Error: ' + error.response.data.message);
        } else {
          alert('Error al enviar el mensaje. Inténtalo de nuevo.');
        }
      } else {
        alert('Error al enviar el mensaje. Inténtalo de nuevo.');
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert(`El archivo ${file.name} es demasiado grande. Máximo 5MB.`);
        return false;
      }
      return true;
    });
    
    setSelectedFiles(prev => [...prev, ...validFiles].slice(0, 5)); // Máximo 5 archivos
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isDisabled = !conversation || !currentUser || isSending;
  const canSend = newMessage.trim() || selectedFiles.length > 0;

  return (
    <div className="message-input">
      {/* Selected Files Preview */}
      {selectedFiles.length > 0 && (
        <div className="file-preview">
          {selectedFiles.map((file, index) => (
            <div key={index} className="file-item">
              <div className="file-info">
                <i className="fas fa-file"></i>
                <span className="file-name">{file.name}</span>
                <span className="file-size">({formatFileSize(file.size)})</span>
              </div>
              <button 
                className="remove-file-btn"
                onClick={() => removeFile(index)}
                disabled={isDisabled}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="input-area">
        <div className="input-wrapper">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={conversation ? `Escribe un mensaje a ${conversation.name}...` : "Selecciona una conversación..."}
            disabled={isDisabled}
            rows="1"
            className="message-textarea"
          />
          
          <div className="input-actions">
            <button
              type="button"
              onClick={handleFileSelect}
              disabled={isDisabled}
              className="action-btn file-btn"
              title="Adjuntar archivo"
            >
              <i className="fas fa-paperclip"></i>
            </button>
            
            <button
              type="button"
              onClick={handleSendMessage}
              disabled={isDisabled || !canSend}
              className="action-btn send-btn"
              title="Enviar mensaje"
            >
              {isSending ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                <i className="fas fa-paper-plane"></i>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileChange}
        disabled={isDisabled}
        style={{ display: 'none' }}
        accept="image/*,.pdf,.doc,.docx,.txt"
      />
    </div>
  );
};

export default MessageInput;
