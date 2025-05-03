// Chat.jsx
import React from 'react';
import './Chat.css'; // Puedes crear un archivo CSS para este componente
import Message from './Message'
import icon from './../assets/images/iconoGris.png'

function Chat({ groupIcon, groupName }) {
  return (
    <div className="chat-container">
      <div className="chat-header">
        <img src={groupIcon} alt={groupName} className="chat-icon" />
        <h2>{groupName}</h2>
      </div>
      <div className="chat-body">
        <button className='primary-button'>START SWIPES</button>
        <Message userIcon='icon' userName='Marc'   textMessage='Guys what about Grece?'/>
        <Message userIcon='icon' userName='Adrian' textMessage='I prefer Portugal'/>
        <Message userIcon='icon' userName='Denis'  textMessage='I will start the swipes'/>
        <Message userIcon='icon' userName='Mario'  textMessage='Yeahhh!!!'/>
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