// src/components/ProfilePanel/ProfilePanel.js
import React from 'react';
import { FiUser, FiBellOff, FiSearch, FiMoreVertical, FiMail, FiPhone, FiCalendar, FiMapPin, FiEdit } from 'react-icons/fi';
import './ProfilePanel.css';
import { useNavigate } from 'react-router-dom';


const ProfilePanel = () => {

  const navigate = useNavigate();
    
   const handleEditProfile = (e) => {
     e.preventDefault();
     navigate('/editprofile'); // Redirection vers la page de profil
  };

   const handleLogout = (e) => {
     e.preventDefault();
     navigate('/');
  };

  return (
    <div className="profile-panel">
      {/* En-tête du profil */}
      <div className="profile-header">
        <h1>Selvia Bell</h1>
        <FiMoreVertical className="more-icon" />
      </div>

      {/* Options principales */}
      <div className="profile-options">
        <button className="edit-button" onClick={handleLogout}>
          <div className="edit-icon" />
          <span>Deconnexion</span>
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
              <div className="field-label">Email</div>
              <div className="field-value">selvia.bell@example.com</div>
            </div>
          </div>
          
          <div className="info-field">
            <FiPhone className="field-icon" />
            <div className="field-content">
              <div className="field-label">Téléphone</div>
              <div className="field-value">+33 6 12 34 56 78</div>
            </div>
          </div>
          
          <div className="info-field">
            <FiCalendar className="field-icon" />
            <div className="field-content">
              <div className="field-label">Date de naissance</div>
              <div className="field-value">15 mars 1990</div>
            </div>
          </div>
          
          <div className="info-field">
            <FiMapPin className="field-icon" />
            <div className="field-content">
              <div className="field-label">Localisation</div>
              <div className="field-value">Paris, France</div>
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