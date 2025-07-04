// Chat.js
import React from 'react';
import { FiMoreVertical, FiPaperclip, FiMic, FiSmile } from 'react-icons/fi';
import './Chat.css';
import { useNavigate } from 'react-router-dom';

// 🔁 Données de messages stockées dans un tableau séparé
const initialMessages = [
  {
    id: 1,
    text: "Bienvenue sur le chat ! Vous pouvez maintenant discuter librement.",
    date: "03/07/2025 09:00",
    isSystem: true
  },
  {
    id: 2,
    text: "Salut ! Tu es dispo pour une réunion aujourd'hui ?",
    date: "03/07/2025 09:15",
    isReceived: true
  },
  {
    id: 3,
    text: "Oui, je suis libre vers 10h. On fait ça sur Zoom ?",
    date: "03/07/2025 09:17",
    isSent: true
  },
  {
    id: 4,
    text: "Parfait, je t'envoie le lien dans quelques minutes.",
    date: "03/07/2025 09:18",
    isReceived: true
  }
];

const Chat = () => {
  const navigate = useNavigate();

  const handleEditProfile = (e) => {
    e.preventDefault();
    navigate('/editprofile');
  };

  return (
    <div className="chat-panel">
      {/* Chat Header */}
      <div className="chat-header">
        <div className="contact-info">
          <div className="contact-avatar"></div>
          <div>
            <h2>Jean Pierre</h2>
            <p className="status">En ligne</p>
          </div>
        </div>
        <div className="header-actions">
          <FiMoreVertical className="action-icon" />
        </div>
      </div>

      {/* Messages Container */}
      <div className="messages-container">
        {initialMessages.map((message) => (
          <div 
            key={message.id} 
            className={`message ${message.isSystem ? 'system' : ''} ${message.isReceived ? 'received' : ''} ${message.isSent ? 'sent' : ''}`}
          >
            <div className="message-content">
              {message.text.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
            <div className="message-date">{message.date}</div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="message-input-container">
        <div className="input-actions">
          <FiSmile className="input-icon" />
          <FiPaperclip className="input-icon" />
        </div>
        <input 
          type="text" 
          placeholder="Écrire un message"
          className="message-input"
        />
        <FiMic className="input-icon" />
      </div>
    </div>
  );
};

export default Chat;
