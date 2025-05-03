import React, { useState } from 'react';
import './Chat.css';
import Message from './Message';
import icon from './../assets/images/iconoGris.png';
import send from './../assets/images/enviar.png';
import SwipeAndFlyScreen from './SwipeAndFlyScreen'; // Importa el nuevo componente

function Chat({ groupIcon, groupName }) {
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
        {showSwipeScreen && (
          <button className="secondary-button" onClick={handleGoBackToChat}>
            Volver al Chat
          </button>
        )}
      </div>
      <div className="chat-body">
        {!showSwipeScreen ? (
          <>
            <button className='primary-button' onClick={handleStartSwipes}>START SWIPES</button>
            <Message userIcon={icon} userName='Marc' textMessage='Guys what about Grece?' />
            <Message userIcon={icon} userName='Adrian' textMessage='I prefer Portugal' />
            <Message userIcon={icon} userName='Denis' textMessage='I will start the swipes' />
            <Message userIcon={icon} userName='Mario' textMessage='Yeahhh!!!' />
          </>
        ) : (
          <SwipeAndFlyScreen />
        )}
      </div>
      {!showSwipeScreen && (
        <div className="chat-footer">
          {/* Aquí irán los controles para enviar mensajes */}
          <input type="text" placeholder="Escribe un mensaje..." />
          <button><img src={send} alt="enviar" /></button>
        </div>
      )}
    </div>
  );
}

export default Chat;