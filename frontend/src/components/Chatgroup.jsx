// Chatgroup.jsx
import React, { useState } from 'react';
import './Chatgroup.css';
import Group from './Group';
import iconoGris from './../assets/images/iconoGris.png';
import Chat from './Chat'; // Importa el componente Chat

function Chatgroup() {
  const [groupsData, setGroupsData] = useState([
    { id: 1, name: 'Summer Trip', status: 'planning', icon: iconoGris },
    { id: 2, name: 'Easter Trip', status: 'canceled', icon: iconoGris },
    { id: 3, name: 'Christmas Trip', status: 'done', icon: iconoGris },
  ]);
  const [currentChat, setCurrentChat] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  const handleGroupClick = (group) => {
    setCurrentChat(group);
  };

  const handleGoBackToGroupList = () => {
    setCurrentChat(null);
  };

  const handleMakeGroupClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setNewGroupName('');
  };

  const handleGroupNameChange = (event) => {
    setNewGroupName(event.target.value);
  };

  const handleCreateGroup = () => {
    if (newGroupName.trim() !== '') {
      const newGroup = {
        id: Date.now(),
        name: newGroupName,
        status: 'planning',
        icon: iconoGris,
      };
      setGroupsData([...groupsData, newGroup]);
      setShowPopup(false);
      setNewGroupName('');
    } else {
      alert('Please enter a group name.');
    }
  };

  return (
    <div className='chatgroup-container'>
      {!currentChat ? (
        <>
          <div className='chatgroup-container-top'>
            <h2>Chats</h2>
            <button onClick={handleMakeGroupClick}>Make your travel group</button>
          </div>
          <div className='chatgroup-container-bottom'>
            {groupsData.map((group) => (
              <Group
                key={group.id}
                imgSrc={group.icon}
                imgAlt={group.name}
                text={group.name}
                status={group.status}
                onClick={() => handleGroupClick({ icon: group.icon, name: group.name })}
              />
            ))}
          </div>

          {showPopup && (
            <div className="popup-overlay">
              <div className="popup-container">
                <h3>Create New Travel Group</h3>
                <label htmlFor="groupName">Group Name:</label>
                <input
                  type="text"
                  id="groupName"
                  value={newGroupName}
                  onChange={handleGroupNameChange}
                />
                <div className="popup-buttons">
                  <button onClick={handleCreateGroup}>Create</button>
                  <button onClick={handleClosePopup}>Cancel</button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <Chat
          groupIcon={currentChat.icon}
          groupName={currentChat.name}
          onGoBack={handleGoBackToGroupList}
        />
      )}
    </div>
  );
}

export default Chatgroup;