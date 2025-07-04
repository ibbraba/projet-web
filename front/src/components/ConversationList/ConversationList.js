// src/components/ConversationList/ConversationList.js
import React, { useState } from 'react';
import { FiSearch, FiPlus } from 'react-icons/fi';
import './ConversationList.css';

// 🔁 Données de base
const initialConversationsData = [
  { name: 'Lina Morel', message: 'À tout de suite', time: 'il y a 2 min', read: true },
  { name: 'Julien Bernard', message: 'Bonsoir, t’as eu mon mail ?', time: 'il y a 10 min', read: true, bold: true },
  { name: 'Camille Dupont', message: 'Vous: Ok merci !', time: 'il y a 1 h', read: true },
  { name: 'Jean Pierre', message: 'Parfait, je t envoie le lien dans quelques minutes', time: 'il y a 1 h', read: false },
  { name: 'Nora B.', message: 'On confirme pour demain ?', time: 'hier', read: true },
  { name: 'Selvia Bell', message: '💤', time: 'hier', read: true },
  { name: 'Alex Marchal', message: 'Vous: On se tient au courant', time: '2 jours', read: true },
  { name: 'Paul gerart', message: 'Vous: Merci encore pour tout', time: '2 jours', read: true },
  { name: 'Paul', message: 'Vous: Merci encore pour tout', time: '2 jours', read: true },
  { name: 'Alice Martin', message: 'Vous: J’ai bien reçu ton message', time: '3 jours', read: true },
  { name: 'Sophie L.', message: 'Vous: On se voit demain ?', time: '3 jours', read: true }
];

// 🔁 Liste de contacts fictifs
const availableContacts = [
  'Mickael Dupuis',
  'Inès Laurent',
  'Théo Martinez',
  'Manon Petit',
  'Lucas Caron'
];

const ConversationList = () => {
  const [conversations, setConversations] = useState(initialConversationsData);
  const [showContactList, setShowContactList] = useState(false);

  const handleAddConversation = (name) => {
    const exists = conversations.find(conv => conv.name === name);
    if (!exists) {
      setConversations([
        {
          name,
          message: 'Nouvelle conversation',
          time: 'maintenant',
          read: false,
          bold: true
        },
        ...conversations
      ]);
    }
    setShowContactList(false);
  };

  return (
    <div className="conversation-list">
      {/* Header */}
      <div className="conversation-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>Discussions</h1>
        <button 
          onClick={() => setShowContactList(!showContactList)} 
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          aria-label="Ajouter une conversation"
        >
          <FiPlus size={20} />
        </button>
      </div>

      {/* Liste de contacts à choisir */}
      {showContactList && (
        <div style={{ padding: '10px 0', borderBottom: '1px solid #ccc' }}>
          <p style={{ fontWeight: 'bold' }}>Choisir un contact :</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {availableContacts.map((contact, i) => (
              <li 
                key={i}
                style={{ padding: '6px 0', cursor: 'pointer' }}
                onClick={() => handleAddConversation(contact)}
              >
                {contact}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Search */}
      <div className="search-container">
        <FiSearch className="search-icon" />
        <input 
          type="text" 
          placeholder="Rechercher dans Messenger" 
          className="search-input"
        />
      </div>
      
      {/* Conversations */}
      <div className="conversation-items">
        {conversations.map((conv, index) => (
          <div 
            key={index} 
            className={`conversation-item ${conv.read ? 'read' : 'unread'}`}
          >
            <div className="conversation-content">
              <p className={`conversation-name ${conv.bold ? 'bold' : ''}`}>{conv.name}</p>
              <p className="conversation-message">
                {conv.message.includes('Vous: ') ? (
                  <>
                    <span className="you-prefix">Vous: </span>
                    {conv.message.replace('Vous: ', '')}
                  </>
                ) : (
                  conv.message
                )}
              </p>
            </div>
            <div className="conversation-time">{conv.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversationList;
