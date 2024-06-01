import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ConversationList.css';

const ConversationList = ({ selectConversation, currentUser }) => {
  const [conversations, setConversations] = useState([]);
  const [newContact, setNewContact] = useState('');
  const [profile, setProfile] = useState({ name: 'John Doe', email: 'john.doe@example.com' });

  useEffect(() => {
    getUser();
    getContacts();
  }, []);

  useEffect(() => {
    if (currentUser) {
      console.log('Fetching contacts from messages for user', currentUser.id);
      getContactsFromMessages(currentUser.id);
    }
  }, [currentUser]);

  const getUser = () => {
    axios.get('/user')
      .then((res) => {
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
        setConversations(res.data);
      })
      .catch((err) => {
        console.error('Error fetching contacts:', err);
      });
  };

  // Function to check if a contact is a duplicate
  const isDuplicate = (contact, conversations) => {
    // Checks if any conversation has the same id or email as the contact
    return conversations.some(conv => conv.id === contact.id || conv.email === contact.email);
  };

  const getContactsFromMessages = (userId) => {
    axios.get(`/contacts/senders-from-messages/${userId}`)
      .then((res) => {
        console.log(res.data, 'contactos de mensajes');
        const messageContacts = res.data.map(contact => ({
          id: contact.id,
          user_id: contact.id,
          name: contact.name,
          email: contact.email,
          fromMessages: true
        }));

        // Avoid duplicates by checking before adding
        setConversations(prevConversations => {
          const combinedConversations = [...prevConversations];

          messageContacts.forEach(contact => {
            // Add only if contact is not a duplicate
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
      axios.post('/contacts', { email: newContact })
        .then(response => {
          const newContactData = {
            id: response.data.id,
            user_id: response.data.user_id,
            name: response.data.name,
            email: response.data.email,
            fromMessages: false
          };
          // Check for duplicates before adding the new contact
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
