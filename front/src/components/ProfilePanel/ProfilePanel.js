// src/components/ProfilePanel/ProfilePanel.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMoreVertical, FiMail, FiPhone, FiCalendar, FiMapPin, FiEdit } from 'react-icons/fi';
import { jwtDecode } from 'jwt-decode';
import { useGetUser } from '../../gql/queries'; // adapte le chemin si besoin
import './ProfilePanel.css';

const ProfilePanel = () => {
  const navigate = useNavigate();

  // 🔐 Récupérer le token depuis le localStorage
  const token = localStorage.getItem('token');
  let userId = null;

  try {
    const decoded = jwtDecode(token);
    userId = decoded?.sub || decoded?.id || decoded?.user?.id;
  } catch (error) {
    console.error('Token invalide :', error);
  }

  // 📡 Récupérer les infos utilisateur
  const { data, loading, error } = useGetUser(userId);

  if (loading) return <div>Chargement du profil...</div>;
  if (error || !data?.getUser) return <div>Erreur lors du chargement du profil</div>;

  const user = data.getUser;

  const handleEditProfile = (e) => {
    e.preventDefault();
    navigate('/editprofile');
  };

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="profile-panel">
      {/* En-tête du profil */}
      <div className="profile-header">
        <h1>{user.username}</h1>
        <FiMoreVertical className="more-icon" />
      </div>

      {/* Options principales */}
      <div className="profile-options">
        <button className="edit-button" onClick={handleLogout}>
          <div className="edit-icon" />
          <span>Déconnexion</span>
        </button>
      </div>

      <div className="divider"></div>

      {/* Informations du profil */}
      <div className="profile-info">
        <h2>Informations du profil</h2>
        <div className="info-section">
          <div className="info-field">
            <FiMail className="field-icon" />
            <div className="field-content">
              <div className="field-label">Mail</div>
              <div className="field-value">{user.mail}</div>
            </div>
          </div>

          {/* Placeholders pour téléphone/localisation si non dispo */}
          <div className="info-field">
            <FiPhone className="field-icon" />
            <div className="field-content">
              <div className="field-label">Téléphone</div>
              <div className="field-value">Non renseigné</div>
            </div>
          </div>

          <div className="info-field">
            <FiMapPin className="field-icon" />
            <div className="field-content">
              <div className="field-label">Localisation</div>
              <div className="field-value">Non renseignée</div>
            </div>
          </div>
        </div>

        {/* Bouton Modifier */}
        <button className="edit-button" onClick={handleEditProfile}>
          <FiEdit className="edit-icon" />
          <span>Modifier le profil</span>
        </button>
      </div>
    </div>
  );
};

export default ProfilePanel;
