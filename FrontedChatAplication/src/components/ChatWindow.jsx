import React, { useEffect, useRef } from 'react';
import './ChatWindow.css';
import { toast } from 'react-toastify';

const ChatWindow = ({ conversation, currentUser, messages, onNewNotification }) => {
  const messagesEndRef = useRef(null);
  const lastProcessedMessageId = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      
      // Solo procesar si es un mensaje nuevo que no hemos visto antes
      if (lastMessage.id !== lastProcessedMessageId.current) {
        // Solo notificar si el mensaje no es propio
        if (String(lastMessage.sender_id) !== String(currentUser.id)) {
          if (onNewNotification) onNewNotification(lastMessage);
          toast.info(`Nuevo mensaje de ${conversation?.name || 'usuario'}`);
        }
        lastProcessedMessageId.current = lastMessage.id;
      }
    }
    scrollToBottom();
  }, [messages, currentUser.id, conversation?.name, onNewNotification]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ayer';
    } else {
      return date.toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      });
    }
  };

  const renderMessage = (message, index) => {
    const isOwnMessage = message.sender_id == currentUser.id;
    const showDate = index === 0 || 
      formatDate(message.created_at) !== formatDate(messages[index - 1]?.created_at);

    return (
      <div key={index}>
        {showDate && (
          <div className="message-date">
            <span>{formatDate(message.created_at)}</span>
          </div>
        )}
        <div className={`message ${isOwnMessage ? 'own' : 'other'}`}>
          <div className="message-content">
            <p>{message.content}</p>
            {message.media && message.media.length > 0 && (
              <div className="message-media">
                {message.media.map((media, mediaIndex) => (
                  <div key={mediaIndex} className="media-item">
                    {media.type?.startsWith('image/') ? (
                      <img 
                        className="message-image"
                        src={`http://localhost:8000/storage/${media.url}`} 
                        alt={`Media ${mediaIndex}`} 
                        onClick={() => window.open(`http://localhost:8000/storage/${media.url}`, '_blank')}
                      />
                    ) : (
                      <div className="file-attachment">
                        <i className="fas fa-file"></i>
                        <span>{media.filename || 'Archivo'}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="message-time">
            {formatTime(message.created_at)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="chat-window">
      {conversation ? (
        <>
          <div className="chat-header">
            <div className="chat-user-info">
              <div className="user-avatar">
                <i className="fas fa-user"></i>
              </div>
              <div className="user-details">
                <h3>{conversation.name}</h3>
                <span className="user-status">En línea</span>
              </div>
            </div>
            <div className="chat-actions">
              <button className="chat-action-btn" title="Llamada de voz">
                <i className="fas fa-phone"></i>
              </button>
              <button className="chat-action-btn" title="Llamada de video">
                <i className="fas fa-video"></i>
              </button>
              <button className="chat-action-btn" title="Más opciones">
                <i className="fas fa-ellipsis-v"></i>
              </button>
            </div>
          </div>
          
          <div className="messages">
            {messages.length > 0 ? (
              messages.map((message, index) => renderMessage(message, index))
            ) : (
              <div className="empty-chat">
                <div className="empty-chat-icon">
                  <i className="fas fa-comments"></i>
                </div>
                <h3>Inicia una conversación</h3>
                <p>Envía un mensaje para comenzar a chatear con {conversation.name}</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </>
      ) : (
        <div className="no-conversation">
          <div className="no-conversation-icon">
            <i className="fas fa-comment-dots"></i>
          </div>
          <h3>Selecciona una conversación</h3>
          <p>Elige un contacto de la lista para comenzar a chatear</p>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
