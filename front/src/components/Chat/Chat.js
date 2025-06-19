import React from 'react';
import { FiMoreVertical, FiPaperclip, FiMic, FiSmile } from 'react-icons/fi';
import './Chat.css';
import { useNavigate } from 'react-router-dom';


const Chat = () => {

    const navigate = useNavigate();
  
    const handleEditProfile = (e) => {
      e.preventDefault();
      navigate('/editprofile'); // Redirection vers la page de profil
    };
  const messages = [
    {
      id: 1,
      text: "Vous pouvez maintenant vous envoyer des messages, vous appeler et voir les informations concernant le statut En ligne et la lecture des messages.",
      date: "09/11/2022 12:09",
      isSystem: true
    },
    {
      id: 2,
      text: "Comment vas tu ??",
      date: "09/11/2022 13:16",
      isReceived: true
    },
    {
      id: 3,
      text: "Ça va\nTu sais qui c'est ??",
      date: "09/11/2022 13:18",
      isSent: true
    },
    {
      id: 4,
      text: "Sonia\nAa",
      date: "09/11/2022 13:20",
      isReceived: true
    }
  ];

  return (
    <div className="chat-panel">
      {/* Chat Header */}
      <div className="chat-header">
        <div className="contact-info">
          <div className="contact-avatar"></div>
          <div>
            <h2>Selvia Bell</h2>
            <p className="status">En ligne</p>
          </div>
        </div>
        <div className="header-actions">
          <FiMoreVertical className="action-icon" />
        </div>
      </div>

      {/* Messages Container */}
      <div className="messages-container">
        {messages.map((message) => (
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