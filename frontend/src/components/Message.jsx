// Chat.jsx
import React from 'react';
import './Message.css'; // Puedes crear un archivo CSS para este componente


function Message({ userIcon, textMessage }) {
    let actualUser = 'Mario'
    
  return (
    <div className="message-container">
      <p>{textMessage}</p>
    </div>
  );
}

export default Message;