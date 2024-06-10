import React from 'react';
import './Notification.css';

const Notification = ({ message, onUndo, onClose }) => {
  return (
    <div className="notification">
      <span>{message}</span>
      <div className="notification-actions">
        <button className="btn btn-secondary text-dark hov" onClick={onUndo}>Undo</button>
        <button className="btn btn-light" onClick={onClose}>✖</button>
      </div>
    </div>
  );
};

export default Notification;
