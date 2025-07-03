// src/pages/LoginPage.js
import React, { useState } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../../gql/queries'; // adapte le chemin si besoin
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    email: false,
    password: false
  });
  const [authStatus, setAuthStatus] = useState(null); // null, 'success', 'error'
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Apollo mutation hook
  const [loginMutation] = useLogin();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
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

    try {
      const { data } = await loginMutation({
        variables: { input: { email: credentials.email, password: credentials.password } }
      });

      if (data?.login?.access_token) {
        setAuthStatus('success');
        // Tu peux stocker le token dans localStorage ou contexte global ici
        localStorage.setItem('token', data.login.access_token);
        // Redirection après un court délai
        setTimeout(() => navigate('/chat'), 1500);
      } else {
        setAuthStatus('error');
      }
    } catch (error) {
      console.error("Erreur d'authentification:", error);
      setAuthStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupClick = (e) => {
    e.preventDefault();
    navigate('/signup');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="logo">Blink</h1>
        
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
              placeholder="e-mail" 
              className={`login-input ${errors.email ? 'error' : ''}`}
              value={credentials.email}
              onChange={handleChange}
              autoComplete="username"
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
              autoComplete="current-password"
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
