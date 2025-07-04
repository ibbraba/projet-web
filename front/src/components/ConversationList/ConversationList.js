// src/components/ConversationList/ConversationList.js
import React, { useState } from 'react';
import { FiSearch, FiPlus, FiX } from 'react-icons/fi';
import { useGetUserConversations, useGetUsers, useCreateConversation } from '../../gql/queries';
import { jwtDecode } from 'jwt-decode';
import './ConversationList.css';

const ConversationList = () => {
  const [showUserList, setShowUserList] = useState(false);
  const token = localStorage.getItem('token');

  // 🔐 Décodage du token
  let userId = null;
  try {
    const decoded = jwtDecode(token);
    userId = decoded?.sub || decoded?.id || decoded?.user?.id;
  } catch (err) {
    console.error('Token invalide', err);
  }

  // 📡 Récupération des conversations
  const { data, loading, error } = useGetUserConversations(userId);
  const { data: usersData, loading: loadingUsers, error: errorUsers } = useGetUsers();
  const [createConversation] = useCreateConversation();

  const conversations = data?.getUserConversations || [];
  const users = usersData?.getUsers || [];

  // ➕ Créer une conversation
  const handleCreateConversation = async (targetUserId) => {
    const targetUser = users.find((u) => u.id === targetUserId);

    const title =
      targetUser?.firstName && targetUser?.lastName
        ? `${targetUser.firstName} ${targetUser.lastName}`
        : targetUser?.username || 'Nouvelle conversation';

    try {
      const res = await createConversation({
        variables: {
          input: {
            participantIds: [userId, targetUserId],
            title,
          },
        },
      });
      console.log('✅ Conversation créée :', res.data.createConversation);
      setShowUserList(false);
    } catch (err) {
      console.error('❌ Erreur création conversation', err);
      alert("Erreur lors de la création de la conversation.");
    }
  };

  if (loading) return <p>Chargement des conversations...</p>;
  if (error) return <p>Erreur lors du chargement des conversations.</p>;

  return (
    <div className="conversation-list">
      {/* Header */}
      <div className="conversation-header">
        <h1>Discussions</h1>
        {showUserList ? (
          <FiX
            className="add-icon"
            onClick={() => setShowUserList(false)}
            style={{ cursor: 'pointer', marginLeft: '10px' }}
          />
        ) : (
          <FiPlus
            className="add-icon"
            onClick={() => setShowUserList(true)}
            style={{ cursor: 'pointer', marginLeft: '10px' }}
          />
        )}
      </div>

      {/* Liste des utilisateurs pour démarrer une conversation */}
      {showUserList && (
        <div className="user-dropdown">
          {loadingUsers && <p>Chargement des utilisateurs...</p>}
          {errorUsers && <p>Erreur chargement utilisateurs</p>}
          {!loadingUsers && users
            .filter((u) => u.id !== userId)
            .map((user) => (
              <div
                key={user.id}
                className="user-dropdown-item"
                onClick={() => handleCreateConversation(user.id)}
              >
                {user.firstName || user.lastName
                  ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                  : user.username || user.email || 'Utilisateur inconnu'}
              </div>
            ))}
        </div>
      )}

      {/* Search bar */}
      <div className="search-container">
        <FiSearch className="search-icon" />
        <input
          type="text"
          placeholder="Rechercher une conversation"
          className="search-input"
        />
      </div>

      {/* Liste des conversations */}
      <div className="conversation-items">
        {conversations.map((conv) => (
          <div key={conv.id} className="conversation-item read">
            <div className="conversation-content">
              <p className="conversation-name">
                {conv.title || conv.participants?.map((p) => p.username).join(', ') || 'Sans titre'}
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
