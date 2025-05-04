// Chatgroup.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import './Chatgroup.css';
import Group from './Group';
import iconoGris from './../assets/images/iconoGris.png';

function Chatgroup({ onGroupClick }) {
  const [groupsData, setGroupsData] = useState([]);
  const stored = localStorage.getItem('userInfo');

  useEffect(() => {
    if (!stored) return;

    const user = JSON.parse(stored);
    const userId = user.id;

    axios
      .get(`http://localhost:4000/api/users/${userId}`)
      .then(response => {
        // response.data.groups es el array de grupos del usuario
        setGroupsData(response.data.groups || []);
      })
      .catch(err => {
        console.error('Error fetching groups:', err);
      });
  }, [stored]);

  return (
    <div className="chatgroup-container">
      <div className="chatgroup-container-top">
        <h2>Chats</h2>
        <button onClick={() => onGroupClick(null)}>
          Make your travel group
        </button>
      </div>
      <div className="chatgroup-container-bottom">
        {groupsData.map(group => (
          <Group
            key={group.id}
            imgSrc={group.imageUrl || iconoGris}
            imgAlt={group.name}
            text={group.name}
            status={group.status}  // asume que tu API devuelve un campo `status`
            onClick={() => onGroupClick(group)}
          />
        ))}
      </div>
    </div>
  );
}

export default Chatgroup;
