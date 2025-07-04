import React from 'react';
import { FiMail, FiPhone, FiLock } from 'react-icons/fi';
import './ProfileEditForm.css';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';  // Import correct
import { useGetUser } from '../../gql/queries'; // adapte le chemin si besoin

const ProfileEditForm = () => {
  const navigate = useNavigate();

  // Récupération et décodage du token
  const token = localStorage.getItem('token');

  let userId = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      // Même logique que dans ProfilePanel
      userId = decoded.sub || decoded.id || decoded.user?.id || null;
    } catch (err) {
      console.error('Erreur décodage token:', err);
      userId = null;
    }
  }

  // Utilisation du hook pour récupérer les données user uniquement si userId existe
  const { data, loading, error } = useGetUser(userId, { skip: !userId });

  // Si besoin, tu peux afficher un loader ou message d’erreur
  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur lors du chargement du profil.</p>;

  // Données utilisateur récupérées
  const user = data?.getUser;

  // Handler pour revenir au chat
  const handleChat = (e) => {
    e.preventDefault();
    navigate('/chat');
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
              <label className="field-label">Nom d'utilisateur</label>
              <input
                type="text"
                className="edit-input"
                defaultValue={user?.username || ''}
              />
            </div>

            <div className="form-field">
              <label className="field-label">Nom</label>
              <input
                type="text"
                className="edit-input"
                defaultValue={user?.name || ''}
              />
            </div>

            <div className="form-field">
              <label className="field-label">Prénom</label>
              <input
                type="text"
                className="edit-input"
                defaultValue={user?.firstName || ''}
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
                defaultValue={user?.mail || ''}
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
                defaultValue={user?.phone || ''}
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
