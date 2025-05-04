// Group.jsx
import React from 'react';
import './Group.css';

function Group(props) {
  let backgroundColor;

  switch (props.status) {
    case 'planning':
      backgroundColor = 'var(--color-secondary)';
      break;
    case 'done':
      backgroundColor = 'var(--color-selected)';
      break;
    case 'canceled':
      backgroundColor = 'lightgrey';
      break;
    default:
      backgroundColor = 'white';
  }

  return (
    <div className="group" onClick={props.onClick} style={{ cursor: 'pointer' }}>
      <img className='group-image' src={props.imgSrc} alt={props.imgAlt} />
      <p>{props.text}</p>
      <div className='group-status' style={{ backgroundColor: backgroundColor }}></div>
    </div >
  );
}

export default Group;