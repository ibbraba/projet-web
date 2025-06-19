// src/pages/LoginPage.js
import React from 'react';
import { FaFacebook } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Ici vous pourriez ajouter votre logique d'authentification
    // avant la redirection si nécessaire
    
    // Redirection vers la page Chat
    navigate('/chat');
  };

  const handleSignupClick = (e) => {
    e.preventDefault();
    navigate('/signup'); // Redirection vers la page d'inscription
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="logo">Blink</h1>
        
        {/* Formulaire de connexion */}
        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-group">
            <input 
              type="text" 
              placeholder="Num. téléphone, nom de profil ou e-mail" 
              className="login-input"
            />
            <div className="input-line"></div>
          </div>
          
          <div className="input-group">
            <input 
              type="password" 
              placeholder="Mot de passe" 
              className="login-input"
            />
            <div className="input-line"></div>
          </div>
          
          <button type="submit" className="login-button">
            Se connecter
          </button>
        </form>
        
        {/* Lien mot de passe oublié */}
        <a href="#" className="forgot-password">
          Mot de passe oublié ?
        </a>
      </div>
      
      {/* Footer */}
      <div className="login-footer">
        <p className="legal-text">
          Vous pouvez également signaler le contenu que vous pensez illégal dans votre pays sans vous connecter.
        </p>
        <p className="signup-text">
          Vous n'avez pas de compte ? <a href="#" className="signup-link" onClick={handleSignupClick}>Inscrivez-vous</a>
        </p>
      </div>
    </div>
  );
};

export default Login;