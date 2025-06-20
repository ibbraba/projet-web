// src/pages/LoginPage.js
import React, { useState } from 'react';
import { FaFacebook, FaCheck, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: 'junior',
    password: 'junior'
  });
  const [errors, setErrors] = useState({
    email: false,
    password: false
  });
  const [authStatus, setAuthStatus] = useState(null); // null, 'success', 'error'
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    // Reset error when typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: false
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      email: !credentials.email,
      password: !credentials.password
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthStatus(null);
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simuler une requête API
    try {
      // Remplacez ceci par votre vraie logique d'authentification
      const isAuthenticated = await mockAuthAPI(credentials.email, credentials.password);
      
      if (isAuthenticated) {
        setAuthStatus('success');
        setTimeout(() => navigate('/chat'), 1500); // Redirection après notification
      } else {
        setAuthStatus('error');
      }
    } catch (error) {
      setAuthStatus('error');
      console.error("Erreur d'authentification:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fonction de simulation d'API
  const mockAuthAPI = (email, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulation: valide si email contient '@' et password > 5 caractères
        resolve(email.includes('@') && password.length > 5);
      }, 1000);
    });
  };

  const handleSignupClick = (e) => {
    e.preventDefault();
    navigate('/signup');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="logo">Blink</h1>
        
        {/* Notification d'authentification */}
        {authStatus && (
          <div className={`auth-notification ${authStatus}`}>
            {authStatus === 'success' ? (
              <>
                <FaCheck className="notification-icon" />
                <span>Connexion réussie!</span>
              </>
            ) : (
              <>
                <FaTimes className="notification-icon" />
                <span>Échec de l'authentification. Veuillez réessayer.</span>
              </>
            )}
          </div>
        )}
        
        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-group">
            <input 
              type="text" 
              name="email"
              placeholder="Num. téléphone, nom de profil ou e-mail" 
              className={`login-input ${errors.email ? 'error' : ''}`}
              value={credentials.email}
              onChange={handleChange}
            />
            <div className="input-line"></div>
            {errors.email && <span className="error-message">Ce champ est requis</span>}
          </div>
          
          <div className="input-group">
            <input 
              type="password" 
              name="password"
              placeholder="Mot de passe" 
              className={`login-input ${errors.password ? 'error' : ''}`}
              value={credentials.password}
              onChange={handleChange}
            />
            <div className="input-line"></div>
            {errors.password && <span className="error-message">Ce champ est requis</span>}
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>
        
        <a href="#" className="forgot-password">
          Mot de passe oublié ?
        </a>
      </div>
      
      <div className="login-footer">
        <p className="legal-text">
          Vous pouvez également signaler le contenu que vous pensez illégal dans votre pays sans vous connecter.
        </p>
        <p className="signup-text">
          Vous n'avez pas de compte ?{' '}
          <a href="#" className="signup-link" onClick={handleSignupClick}>
            Inscrivez-vous
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;