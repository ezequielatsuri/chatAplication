import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ConversationList.css';

const ConversationList = ({ selectConversation, currentUser, selectedConversation }) => {
  const [conversations, setConversations] = useState([]);
  const [newContact, setNewContact] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [addingContact, setAddingContact] = useState(false);
  const [error, setError] = useState('');
  const [showAddContact, setShowAddContact] = useState(false);

  useEffect(() => {
    if (currentUser) {
      getContacts();
      getContactsFromMessages(currentUser.id);
    }
  }, [currentUser]);

  const getContacts = () => {
    setLoading(true);
    setError('');
    axios.get('/contacts', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then((res) => {
        setConversations(res.data);
        console.log('Contacts fetched:', res.data);
      })
      .catch((err) => {
        console.error('Error fetching contacts:', err);
        setError('Error al cargar contactos');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const isDuplicate = (contact, conversations) => {
    return conversations.some(conv => conv.id === contact.id || conv.email === contact.email);
  };

  const getContactsFromMessages = (userId) => {
    axios.get(`/contacts/senders-from-messages/${userId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then((res) => {
        console.log(res.data, 'contactos de mensajes');
        const messageContacts = res.data.map(contact => ({
          id: contact.id,
          user_id: contact.id,
          name: contact.name,
          email: contact.email,
          fromMessages: true,
          is_temporary: contact.is_temporary || false
        }));

        setConversations(prevConversations => {
          const combinedConversations = [...prevConversations];

          messageContacts.forEach(contact => {
            if (!isDuplicate(contact, combinedConversations)) {
              combinedConversations.push(contact);
            }
          });

          return combinedConversations;
        });
      })
      .catch((err) => {
        console.error('Error fetching contacts from messages:', err);
      });
  };

  const handleAddContact = async (e) => {
    e.preventDefault();
    if (newContact.trim() && !addingContact) {
      setAddingContact(true);
      setError('');
      
      try {
        const response = await axios.post('/contacts', { email: newContact }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        const newContactData = {
          id: response.data.id,
          user_id: response.data.user_id,
          name: response.data.name,
          email: response.data.email,
          fromMessages: false
        };
        
        if (!isDuplicate(newContactData, conversations)) {
          setConversations(prevConversations => [
            newContactData,
            ...prevConversations
          ]);
        }
        
        setNewContact('');
        setShowAddContact(false);
        
        // Feedback visual de éxito
        const input = e.target.querySelector('.contact-input');
        if (input) {
          input.style.borderColor = '#00d4ff';
          input.style.boxShadow = '0 0 0 4px rgba(0, 212, 255, 0.2)';
          setTimeout(() => {
            input.style.borderColor = '';
            input.style.boxShadow = '';
          }, 2000);
        }
        
      } catch (error) {
        console.error('Error adding contact:', error);
        setError('Error al agregar contacto. Verifica que el email sea válido.');
        
        // Feedback visual de error
        const input = e.target.querySelector('.contact-input');
        if (input) {
          input.style.borderColor = '#ff3b30';
          input.style.boxShadow = '0 0 0 4px rgba(255, 59, 48, 0.2)';
          setTimeout(() => {
            input.style.borderColor = '';
            input.style.boxShadow = '';
          }, 3000);
        }
      } finally {
        setAddingContact(false);
      }
    }
  };

  const handleSelectConversation = (conversation) => {
    if (selectConversation) {
      selectConversation(conversation);
      console.log('Conversación seleccionada en ConversationList:', conversation);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setError(''); // Limpiar errores al buscar
  };

  const filteredConversations = conversations.filter(conversation =>
    conversation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conversation.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const toggleAddContact = () => {
    setShowAddContact(!showAddContact);
    setNewContact('');
    setError('');
  };

  return (
    <div className="conversation-list-container">
      {/* Header */}
      <div className="conversation-header">
        <h3>Conversaciones</h3>
        <div className="conversation-count">
          {conversations.length} contactos
        </div>
      </div>

      {/* Search and Add Contact */}
      <div className="search-container">
        <div className="search-input-wrapper">
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Buscar contactos..."
            className="search-input"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              className="clear-search-btn"
              title="Limpiar búsqueda"
            >
              <i className="fas fa-times"></i>
            </button>
          )}
          <button
            type="button"
            onClick={toggleAddContact}
            className="add-contact-btn-search"
            title="Agregar contacto"
          >
            <i className="fas fa-plus"></i>
          </button>
        </div>
        
        {/* Add Contact Form (conditional) */}
        {showAddContact && (
          <form onSubmit={handleAddContact} className="add-contact-form-inline">
            <div className="input-group">
              <input
                type="email"
                value={newContact}
                onChange={(e) => setNewContact(e.target.value)}
                placeholder="Email del contacto..."
                className="contact-input"
                disabled={addingContact}
                required
                autoFocus
              />
              <button 
                type="submit" 
                className="add-contact-btn-inline" 
                disabled={addingContact || !newContact.trim()}
                title={!newContact.trim() ? "Ingresa un email" : "Agregar contacto"}
              >
                {addingContact ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  <i className="fas fa-check"></i>
                )}
              </button>
              <button
                type="button"
                onClick={toggleAddContact}
                className="cancel-add-btn"
                title="Cancelar"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            {error && (
              <div className="error-message">
                <i className="fas fa-exclamation-circle"></i>
                {error}
              </div>
            )}
          </form>
        )}
      </div>

      {/* Conversations List */}
      <div className="conversation-list">
        {loading && conversations.length === 0 ? (
          <div className="loading-conversations">
            <div className="spinner"></div>
            <h4>Cargando contactos...</h4>
            <p>Obteniendo tu lista de contactos</p>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="empty-conversations">
            <div className="empty-icon">
              <i className="fas fa-users"></i>
            </div>
            <h4>
              {searchTerm ? 'No se encontraron contactos' : 'No hay contactos'}
            </h4>
            <p>
              {searchTerm 
                ? 'Intenta con otro término de búsqueda' 
                : 'Agrega un contacto para comenzar a chatear'
              }
            </p>
            {searchTerm && (
              <button 
                onClick={clearSearch}
                className="clear-search-link"
              >
                Limpiar búsqueda
              </button>
            )}
          </div>
        ) : (
          filteredConversations.map(conversation => (
            <div
              key={conversation.id}
              onClick={() => handleSelectConversation(conversation)}
              className={`conversation-item ${
                selectedConversation?.id === conversation.id ? 'selected' : ''
              } ${conversation.fromMessages ? 'from-messages' : ''}`}
              title={`Chatear con ${conversation.name}`}
            >
              <div className="conversation-avatar">
                <span>{getInitials(conversation.name)}</span>
              </div>
              <div className="conversation-info">
                <div className="conversation-name">
                  {conversation.name}
                  {conversation.fromMessages && (
                    <span className="message-indicator" title="Contacto de mensajes">
                      <i className="fas fa-comment"></i>
                    </span>
                  )}
                  {conversation.is_temporary && (
                    <span className="temporary-indicator" title="Usuario no registrado">
                      <i className="fas fa-user-clock"></i>
                    </span>
                  )}
                </div>
                <div className="conversation-email">
                  {conversation.email}
                  {conversation.is_temporary && (
                    <span className="temporary-badge" title="Usuario temporal">
                      Temporal
                    </span>
                  )}
                </div>
              </div>
              <div className="conversation-status">
                <div className="status-dot online" title="En línea"></div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConversationList;
