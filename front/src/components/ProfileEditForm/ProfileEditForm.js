// src/components/ProfileEditForm/ProfileEditForm.js
import React from 'react';
import { FiUser, FiMail, FiPhone, FiUsername, FiName, FiFirstname, FiLock } from 'react-icons/fi';
import './ProfileEditForm.css';
import { useNavigate } from 'react-router-dom';

const ProfileEditForm = () => {

    const navigate = useNavigate();
        
       const handleChat = (e) => {
         e.preventDefault();
         navigate('/chat'); // Redirection vers la page de profil
      };

  return (
    <div className="profile-edit-container">
      <div className="profile-edit-box">
        <h1 className="logo">Blink</h1>
        <p className="edit-subtitle">Modifier votre profil</p>
        
        <form className="edit-form">
          {/* Section Informations personnelles */}
          <div className="form-section">
            <h3 className="section-title">Informations personnelles</h3>
            
            <div className="form-field">
              <label className="field-label">
                <div className="field-icon" />
                Nom d'utilisateur
              </label>
              <input
                type="text"
                className="edit-input"
                defaultValue="John Doe"
              />
            </div>

            <div className="form-field">
              <label className="field-label">
                <div className="field-icon" />
                Nom
              </label>
              <input
                type="text"
                className="edit-input"
                defaultValue="John"
              />
            </div>

            <div className="form-field">
              <label className="field-label">
                <div className="field-icon" />
                Prenom
              </label>
              <input
                type="text"
                className="edit-input"
                defaultValue="Doe"
              />
            </div>
          </div>

          {/* Section Coordonnées */}
          <div className="form-section">
            <h3 className="section-title">Coordonnées</h3>
            
            <div className="form-field">
              <label className="field-label">
                <FiMail className="field-icon" />
                Adresse email
              </label>
              <input
                type="email"
                className="edit-input"
                defaultValue="john.doe@example.com"
              />
            </div>

            <div className="form-field">
              <label className="field-label">
                <FiPhone className="field-icon" />
                Téléphone
              </label>
              <input
                type="tel"
                className="edit-input"
                defaultValue="+33 6 12 34 56 78"
              />
            </div>
          </div>

          {/* Section Sécurité */}
          <div className="form-section">
            <h3 className="section-title">Sécurité</h3>
            
            <div className="form-field">
              <label className="field-label">
                <FiLock className="field-icon" />
                Mot de passe actuel
              </label>
              <input
                type="password"
                className="edit-input"
                placeholder="••••••••"
              />
            </div>

            <div className="form-field">
              <label className="field-label">
                <FiLock className="field-icon" />
                Nouveau mot de passe
              </label>
              <input
                type="password"
                className="edit-input"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="form-actions" onClick={handleChat}>
            <button type="button" className="cancel-button">
              Annuler
            </button>
            <button type="submit" className="save-button">
              Enregistrer les modifications
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditForm;