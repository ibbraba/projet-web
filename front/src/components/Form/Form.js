// src/components/Form/Form.js
import React from 'react';
import { FaFacebook } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Form.css';

const Form = () => {

  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    // Ici vous pourriez ajouter votre logique d'authentification
    // avant la redirection si nécessaire
    
    // Redirection vers la page Chat
    navigate('/');
  };

  const handleLoginClick = (e) => {
    e.preventDefault();
    navigate('/'); // Redirection vers la page d'inscription
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h1 className="logo">Blink</h1>
        <p className="signup-subtitle">Inscrivez-vous pour discuter avec vos amis.</p>
        
        {/* Formulaire d'inscription */}
        <form className="signup-form" onSubmit={handleSignup}>
          <div className="input-group">
            <input 
              type="text" 
              placeholder="Numéro de mobile ou e-mail" 
              className="signup-input"
            />
            <div className="input-line"></div>
          </div>
          
          <div className="input-group">
            <input 
              type="text" 
              placeholder="Nom complet" 
              className="signup-input"
            />
            <div className="input-line"></div>
          </div>
          
          <div className="input-group">
            <input 
              type="text" 
              placeholder="Nom d'utilisateur" 
              className="signup-input"
            />
            <div className="input-line"></div>
          </div>
          
          <div className="input-group">
            <input 
              type="password" 
              placeholder="Mot de passe" 
              className="signup-input"
            />
            <div className="input-line"></div>
          </div>
          
          <div className="terms-notice">
            <p>Les personnes qui utilisent notre service ont pu importer vos coordonnées sur Instagram. <a href="#" className="learn-more">En savoir plus</a></p>
            <p>En vous inscrivant, vous acceptez nos <a href="#" className="learn-more">Conditions</a>, notre <a href="#" className="learn-more">Politique de confidentialité</a> et notre <a href="#" className="learn-more">Politique en matière de cookies</a>.</p>
          </div>
          
          <button type="submit" className="signup-button">
            Inscription
          </button>
        </form>
      </div>
      
      {/* Lien vers la connexion */}
      <div className="login-redirect">
        <p>Vous avez un compte ? <a href="#" className="login-link" onClick={handleLoginClick}>Connectez-vous</a></p>
      </div>
    </div>
  );
};

export default Form;