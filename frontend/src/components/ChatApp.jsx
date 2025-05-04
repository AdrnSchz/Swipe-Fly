// ChatApp.jsx
import React, { useState } from 'react';
import Chatgroup from './Chatgroup';
import Chat from './Chat';
import iconoGris from './../assets/images/iconoGris.png';

function ChatApp() {
  const [selectedGroup, setSelectedGroup] = useState(null);

  const handleGroupClick = (groupInfo) => {
    setSelectedGroup(groupInfo);
  };

  const handleBack = () => {
    setSelectedGroup(null);
  };

  return (
    <div className="chat-app">
      {selectedGroup ? (
        <Chat
          groupId={selectedGroup.id}
          groupIcon={selectedGroup.imageUrl || iconoGris}
          groupName={selectedGroup.name}
          onBack={handleBack}
        />
      ) : (
        <Chatgroup onGroupClick={handleGroupClick} />
      )}
    </div>
  );
}

export default ChatApp;
