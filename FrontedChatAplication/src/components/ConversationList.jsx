import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ConversationList.css';

const initialConversations = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  // Puedes agregar más conversaciones aquí
];

const ConversationList = ({ selectConversation }) => {
  const [conversations, setConversations] = useState(initialConversations);
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

  useEffect(() => {
    getUser();
  }, []);

  const handleAddContact = (e) => {
    e.preventDefault();
    if (newContact.trim()) {
      setConversations([
        ...conversations,
        { id: conversations.length + 1, name: newContact }
      ]);
      setNewContact('');
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
          placeholder="Add new contact"
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
            {conversation.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversationList;
