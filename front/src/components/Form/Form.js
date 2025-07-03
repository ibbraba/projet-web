// src/components/Form/Form.js
import React, { useState } from 'react';
import { FaFacebook, FaCheck, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useCreateUserMutation } from '../../graphql/generated'; // adapte ce chemin
import './Form.css';

const Form = () => {
  const navigate = useNavigate();
  const [createUser, { loading, error }] = useCreateUserMutation();

  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    email: false,
    fullName: false,
    username: false,
    password: false
  });
  const [registrationStatus, setRegistrationStatus] = useState(null); // null, 'success', 'error'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
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
      email: !formData.email,
      fullName: !formData.fullName,
      username: !formData.username,
      password: !formData.password
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setRegistrationStatus(null);

    if (!validateForm()) {
      return;
    }

    try {
      const response = await createUser({
        variables: {
          input: {
            email: formData.email,
            username: formData.username,
            password: formData.password
          }
        }
      });

      if (response.data?.createUser?.id) {
        setRegistrationStatus('success');
        setTimeout(() => navigate('/'), 2000); // Redirection après succès
      } else {
        setRegistrationStatus('error');
      }
    } catch (err) {
      setRegistrationStatus('error');
      console.error("Erreur d'inscription:", err);
    }
  };

  const handleLoginClick = (e) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h1 className="logo">Blink</h1>
        <p className="signup-subtitle">Inscrivez-vous pour discuter avec vos amis.</p>

        {/* Notification d'inscription */}
        {registrationStatus && (
          <div className={`registration-notification ${registrationStatus}`}>
            {registrationStatus === 'success' ? (
              <>
                <FaCheck className="notification-icon" />
                <span>Compte créé avec succès! Redirection en cours...</span>
              </>
            ) : (
              <>
                <FaTimes className="notification-icon" />
                <span>Erreur lors de l'inscription. Veuillez réessayer.</span>
              </>
            )}
          </div>
        )}

        {/* Affiche aussi erreur GraphQL si présente */}
        {error && (
          <div className="registration-notification error">
            <FaTimes className="notification-icon" />
            <span>Erreur serveur : {error.message}</span>
          </div>
        )}

        <form className="signup-form" onSubmit={handleSignup}>
          <div className="input-group">
            <input
              type="text"
              name="email"
              placeholder="e-mail"
              className={`signup-input ${errors.email ? 'error' : ''}`}
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
            <div className="input-line"></div>
            {errors.email && <span className="error-message">Ce champ est requis</span>}
          </div>

          <div className="input-group">
            <input
              type="text"
              name="username"
              placeholder="Nom d'utilisateur"
              className={`signup-input ${errors.username ? 'error' : ''}`}
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
            />
            <div className="input-line"></div>
            {errors.username && <span className="error-message">Ce champ est requis</span>}
          </div>

          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Mot de passe"
              className={`signup-input ${errors.password ? 'error' : ''}`}
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
            <div className="input-line"></div>
            {errors.password && <span className="error-message">Ce champ est requis</span>}
          </div>

          <div className="terms-notice">
            <p>
              Les personnes qui utilisent notre service ont pu importer vos coordonnées sur Instagram.{' '}
              <a href="#" className="learn-more">En savoir plus</a>
            </p>
            <p>
              En vous inscrivant, vous acceptez nos{' '}
              <a href="#" className="learn-more">Conditions</a>, notre{' '}
              <a href="#" className="learn-more">Politique de confidentialité</a> et notre{' '}
              <a href="#" className="learn-more">Politique en matière de cookies</a>.
            </p>
          </div>

          <button
            type="submit"
            className="signup-button"
            disabled={loading}
          >
            {loading ? 'Inscription en cours...' : 'Inscription'}
          </button>
        </form>
      </div>

      <div className="login-redirect">
        <p>
          Vous avez un compte ?{' '}
          <a href="#" className="login-link" onClick={handleLoginClick}>
            Connectez-vous
          </a>
        </p>
      </div>
    </div>
  );
};

export default Form;
