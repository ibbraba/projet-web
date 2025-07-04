// src/components/ConversationList/ConversationList.js
import React from 'react';
import { FiSearch } from 'react-icons/fi';
import { useGetUserConversations } from '../../gql/queries'; // adapte le chemin si besoin
import { jwtDecode } from 'jwt-decode'; // ✅ Attention : import avec { } pour cette lib
import './ConversationList.css';

const ConversationList = () => {
  // 🔐 Récupération du token
  const token = localStorage.getItem('token');

  // 🧠 Décodage pour extraire l'userId
  let userId = null;
  try {
    const decoded = jwtDecode(token);
    userId = decoded?.sub || decoded?.id || decoded?.user?.id;
  } catch (err) {
    console.error('Token invalide', err);
  }

  // 📡 Appel de la query (envoie rien si userId est nul)
  const { data, loading, error } = useGetUserConversations(userId);

  if (loading) return <p>Chargement des conversations...</p>;
  if (error) return <p>Erreur lors du chargement des conversations.</p>;

  const conversations = data?.getUserConversations || [];

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
          placeholder="Rechercher une conversation" 
          className="search-input"
        />
      </div>

      {/* Conversation items */}
      <div className="conversation-items">
        {conversations.map((conv) => (
          <div key={conv.id} className="conversation-item read">
            <div className="conversation-content">
              <p className="conversation-name">
                {conv.title || conv.participants?.map(p => p.username).join(', ') || 'Sans titre'}
              </p>
              <p className="conversation-message">Aucun message disponible</p>
            </div>
            <div className="conversation-time">
              {conv.createdAt ? new Date(conv.createdAt).toLocaleDateString() : '—'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversationList;
