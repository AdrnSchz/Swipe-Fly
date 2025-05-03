// Chatgroup.jsx
import './Chatgroup.css';
import Group from './Group';
import iconoGris from './../assets/images/iconoGris.png';

function Chatgroup({ onGroupClick }) {
  const groupsData = [
    { id: 1, name: 'Viaje verano', status: 'done', icon: iconoGris },
    { id: 2, name: 'Viaje semana santa', status: 'canceled', icon: iconoGris },
    { id: 3, name: 'Viaje navidades', status: 'planning', icon: iconoGris },
  ];

  return (
    <div className='chatgroup-container'>
      <div className='chatgroup-container-top'>
        <h2>Chats</h2>
        <button>Make your travel group</button>
      </div>
      <div className='chatgroup-container-bottom'>
        {groupsData.map((group) => (
          <Group
            key={group.id}
            imgSrc={group.icon}
            imgAlt={group.name}
            text={group.name}
            status={group.status}
            onClick={() => onGroupClick({ icon: group.icon, name: group.name })}
          />
        ))}
      </div>
    </div>
  );
}

export default Chatgroup;