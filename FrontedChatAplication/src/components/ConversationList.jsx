import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ConversationList.css';

const ConversationList = ({ selectConversation, currentUser }) => {
  const [conversations, setConversations] = useState([]);
  const [newContact, setNewContact] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      getContacts();
      getContactsFromMessages(currentUser.id);
    }
  }, [currentUser]);

  const getContacts = () => {
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
          fromMessages: true
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

  const handleAddContact = (e) => {
    e.preventDefault();
    if (newContact.trim()) {
      axios.post('/contacts', { email: newContact }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(response => {
          const newContactData = {
            id: response.data.id,
            user_id: response.data.user_id,
            name: response.data.name,
            email: response.data.email,
            fromMessages: false
          };
          if (!isDuplicate(newContactData, conversations)) {
            setConversations(prevConversations => [
              ...prevConversations,
              newContactData
            ]);
          }
          setNewContact('');
        })
        .catch(error => {
          console.error('Error adding contact:', error);
        });
    }
  };

  const handleSelectConversation = (conversation) => {
    if (selectConversation) {
      selectConversation(conversation);
      console.log('Conversación seleccionada en ConversationList:', conversation);
    }
  };

  const handleLogout = () => {
    axios.post('/logout', {}, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(() => {
        localStorage.removeItem('token');
        navigate('/login');
      })
      .catch((err) => {
        console.error('Error during logout:', err);
      });
  };

  return (
    <div className="conversation-list-container">
      <div className="profile-container">
        <div className="profile-info">
          {currentUser ? (
            <>
              <p><strong>Name:</strong> {currentUser.name}</p>
              <p><strong>Email:</strong> {currentUser.email}</p>
            </>
          ) : (
            <p>Loading profile...</p>
          )}
        </div>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
      <form onSubmit={handleAddContact} className="add-contact-form">
        <input
          type="text"
          value={newContact}
          onChange={(e) => setNewContact(e.target.value)}
          placeholder="Add new contact (email)"
        />
        <button type="submit">Add</button>
      </form>
      <div className="conversation-list">
        {conversations.map(conversation => (
          <div
            key={conversation.id}
            onClick={() => handleSelectConversation(conversation)}
            className={`conversation-item ${conversation.fromMessages ? 'from-messages' : ''}`}
          >
            <p><strong>Name:</strong> {conversation.name}</p>
            <p><strong>Email:</strong> {conversation.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversationList;
