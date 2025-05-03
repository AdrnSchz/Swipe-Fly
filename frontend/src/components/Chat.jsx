// Chat.jsx
import React from 'react';
import './Chat.css'; // Puedes crear un archivo CSS para este componente

function Chat({ groupIcon, groupName }) {
  return (
    <div className="chat-container">
      <div className="chat-header">
        <img src={groupIcon} alt={groupName} className="chat-icon" />
        <h2>{groupName}</h2>
      </div>
      <div className="chat-body">
        <p>¡Bienvenido al chat de {groupName}!</p>
      </div>
      <div className="chat-footer">
        {/* Aquí irán los controles para enviar mensajes */}
        <input type="text" placeholder="Escribe un mensaje..." />
        <button>Enviar</button>
      </div>
    </div>
  );
}

export default Chat;