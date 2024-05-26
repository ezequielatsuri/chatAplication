import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ConversationList.css';

const ConversationList = ({ selectConversation }) => {
  const [conversations, setConversations] = useState([]);
  const [newContact, setNewContact] = useState('');
  const [profile, setProfile] = useState({ name: 'John Doe', email: 'john.doe@example.com' });

  const getUser = () => {
    axios.get('/user')
      .then((res) => {
        console.log(res);
        setProfile({
          name: res.data.name,
          email: res.data.email
        });
      })
      .catch((err) => {
        console.error('Error fetching the user:', err);
      });
  };

  const getContacts = () => {
    axios.get('/contacts')
      .then((res) => {
        console.log('Contacts fetched', res);
        setConversations(res.data);
      })
      .catch((err) => {
        console.error('Error fetching contacts:', err);
      });
  };

  useEffect(() => {
    getUser();
    getContacts();
  }, []);

  const handleAddContact = (e) => {
    e.preventDefault();
    if (newContact.trim()) {
      axios.post('/contacts', { email: newContact })
        .then(response => {
          console.log('Contact added', response);
          setConversations([
            ...conversations,
            { id: response.data.id, name: response.data.name, email: response.data.email }
          ]);
          setNewContact('');
        })
        .catch(error => {
          console.error('Error adding contact:', error);
        });
    }
  };

  const handleSelectConversation = (conversation) => {
    try {
      if (selectConversation) {
        selectConversation(conversation);
      }
    } catch (error) {
      console.error('Error selecting conversation:', error);
    }
  };

  return (
    <div className="conversation-list-container">
      <div className="profile-container">
        <div className="profile-info">
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
        </div>
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
            className="conversation-item"
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
