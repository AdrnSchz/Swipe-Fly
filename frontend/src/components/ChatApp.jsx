// ChatApp.jsx
import React, { useState } from 'react';
import Chatgroup from './Chatgroup';
import Chat from './Chat';

function ChatApp() {
  const [selectedGroup, setSelectedGroup] = useState(null);

  const handleGroupClick = (groupInfo) => {
    setSelectedGroup(groupInfo);
  };

  return (
    <div className='chat-app'>
      {selectedGroup ? (
        <Chat groupIcon={selectedGroup.icon} groupName={selectedGroup.name} />
      ) : (
        <Chatgroup onGroupClick={handleGroupClick} />
      )}
    </div>
  );
}

export default ChatApp;