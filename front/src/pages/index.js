import React from 'react';
import ConversationList from '../components/ConversationList/ConversationList';
import ChatHeader from '../components/ProfilePanel/ProfilePanel';
import Chat from '../components/Chat/Chat';
import './index.css';

const Index = () => {
  return (
    <div className="messenger-layout">
      {/* Colonne 1 - Liste des conversations */}
      <div className="conversation-column">
        <ConversationList />
      </div>
      
      {/* Colonne 2 - Chat principal */}
      <div className="chat-column">
        <Chat />
      </div>
      
      {/* Colonne 3 - Profil */}
      <div className="profile-column">
        <ChatHeader />
      </div>
    </div>
  );
};

export default Index;