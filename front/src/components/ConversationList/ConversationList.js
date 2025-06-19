// src/components/ConversationList/ConversationList.js
import React from 'react';
import { FiSearch } from 'react-icons/fi';
import './ConversationList.css';

const ConversationList = () => {
  const conversations = [
    { name: 'Mervie Werns', message: 'Oki', time: '1 an', read: true },
    { name: 'Sergio Djingou', message: 'Bonsoir', time: '1 an', read: false, bold: true },
    { name: 'Marlène Ngoy Ngalula', message: 'Vous: Ok', time: '1 an', read: true },
    { name: 'Utilisateur Facebook', message: 'Message indisponible', time: '1 an', read: false },
    { name: 'Ines Meffope', message: 'Surement', time: '1 an', read: true },
    { name: 'Selvia Bell', message: '💤', time: '2 ans', read: true },
    { name: 'Peter Faber', message: 'Vous: D\'accord', time: '2 ans', read: true },
    { name: 'Utilisateur Facebook', message: 'Vous: S\'il vous plaît c\'est possi...', time: '2 ans', read: true }
  ];

  return (
    <div className="conversation-list">
      {/* Header */}
      <div className="conversation-header">
        <h1>Discussions</h1>
      </div>
      
      {/* Search */}
      <div className="search-container">
        <FiSearch className="search-icon" />
        <input 
          type="text" 
          placeholder="Rechercher dans Messenger" 
          className="search-input"
        />
      </div>
      
      {/* Conversation items */}
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