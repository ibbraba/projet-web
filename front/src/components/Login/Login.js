// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { useLoginMutation } from '../../graphql/generated';
import './Login.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: false, password: false });
  const [authStatus, setAuthStatus] = useState(null); // null | 'success' | 'error'
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [loginMutation, { loading }] = useLoginMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      email: !credentials.email,
      password: !credentials.password,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthStatus(null);

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await loginMutation({ variables: { input: credentials } });
      if (response?.data?.login?.access_token) {
        setAuthStatus('success');
        localStorage.setItem('token', response.data.login.access_token);
        setTimeout(() => navigate('/chat'), 1500);
      } else {
        setAuthStatus('error');
      }
    } catch (error) {
      setAuthStatus('error');
      console.error('Erreur d’authentification:', error);
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

          <button type="submit" className="login-button" disabled={isSubmitting || loading}>
            {isSubmitting || loading ? 'Connexion en cours...' : 'Se connecter'}
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

export default LoginPage;