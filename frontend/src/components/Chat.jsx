// Chat.jsx
import React, { useState } from 'react';
import './Chat.css';
import Message from './Message';
import icon from './../assets/images/iconoGris.png';
import send from './../assets/images/enviar.png';
import SwipeAndFlyScreen from './SwipeAndFlyScreen';

function Chat({ groupId, groupIcon, groupName, onBack }) {
  const [showSwipeScreen, setShowSwipeScreen] = useState(false);

  const handleStartSwipes = () => {
    setShowSwipeScreen(true);
  };

  const handleGoBackToChat = () => {
    setShowSwipeScreen(false);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <img src={groupIcon} alt={groupName} className="chat-icon" />
        <h2>{groupName}</h2>
        {showSwipeScreen ? (
          <button className="secondary-button" onClick={handleGoBackToChat}>
            RETURN
          </button>
        ) : (
          <button className="secondary-button" onClick={onBack}>
            ← Back to Groups
          </button>
        )}
      </div>

      <div className="chat-body">
        {!showSwipeScreen ? (
          <>
            <button className="primary-button" onClick={handleStartSwipes}>
              START SWIPES
            </button>
            <Message userIcon={icon} userName="Marc" textMessage="Guys what about Greece?" />
            <Message userIcon={icon} userName="Adrian" textMessage="I prefer Portugal" />
            <Message userIcon={icon} userName="Denis" textMessage="I will start the swipes" />
            <Message userIcon={icon} userName="Mario" textMessage="Yeahhh!!!" />
          </>
        ) : (
          <SwipeAndFlyScreen groupId={groupId} />
        )}
      </div>

      {!showSwipeScreen && (
        <div className="chat-footer">
          <input type="text" placeholder="Escribe un mensaje..." />
          <button>
            <img src={send} alt="enviar" />
          </button>
        </div>
      )}
    </div>
  );
}

export default Chat;
  