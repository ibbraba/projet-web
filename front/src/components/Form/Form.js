// src/components/Form/Form.js
import React, { useState } from 'react';
import { FaFacebook } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useCreateUser } from '../../gql/queries'; // adapte le chemin si besoin
import './Form.css';

const Form = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  
  const [createUser, { loading, error, data }] = useCreateUser();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      await createUser({ variables: { input: { username, mail, password, isAdmin: false } } });
      // Après création, tu peux rediriger
      navigate('/');
    } catch (err) {
      // Optionnel : afficher l'erreur dans le formulaire
      console.error(err);
    }
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
              placeholder="e-mail" 
              className="signup-input"
              value={mail}
              onChange={(e) => setMail(e.target.value)}
              required
            />
            <div className="input-line"></div>
          </div>
          
          <div className="input-group">
            <input 
              type="text" 
              placeholder="Nom d'utilisateur" 
              className="signup-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <div className="input-line"></div>
          </div>
          
          <div className="input-group">
            <input 
              type="password" 
              placeholder="Mot de passe" 
              className="signup-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="input-line"></div>
          </div>

          {error && <p className="error-message">Erreur : {error.message}</p>}
          {loading && <p>Inscription en cours...</p>}
          {data && <p className="success-message">Inscription réussie !</p>}
          
          <div className="terms-notice">
            <p>Les personnes qui utilisent notre service ont pu importer vos coordonnées sur Instagram. <a href="#" className="learn-more">En savoir plus</a></p>
            <p>En vous inscrivant, vous acceptez nos <a href="#" className="learn-more">Conditions</a>, notre <a href="#" className="learn-more">Politique de confidentialité</a> et notre <a href="#" className="learn-more">Politique en matière de cookies</a>.</p>
          </div>
          
          <button type="submit" className="signup-button" disabled={loading}>
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
