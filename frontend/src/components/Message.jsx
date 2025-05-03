// Chat.jsx
import React from 'react';
import './Message.css'; // Puedes crear un archivo CSS para este componente


function Message({ userIcon, userName, textMessage }) {
  let actualUser = 'Mario';
  const isCurrentUser = userName === actualUser;
  const messageClassName = isCurrentUser ? 'message-container current-user' : 'message-container';

  return (
    <div className={messageClassName}>
      <img src={userIcon} alt={userName} />
      <p>{textMessage}</p>
    </div>
  );
}

export default Message;