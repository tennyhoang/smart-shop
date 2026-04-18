import React, { useEffect } from 'react';
import './Toast.css';

const Toast = ({ messages, removeToast }) => {
  return (
    <div className="toast-container">
      {messages.map(msg => (
        <ToastItem key={msg.id} msg={msg} onRemove={removeToast} />
      ))}
    </div>
  );
};

const ToastItem = ({ msg, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(msg.id), 3500);
    return () => clearTimeout(timer);
  }, [msg.id, onRemove]);

  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };

  return (
    <div className={`toast toast--${msg.type}`}>
      <span className="toast__icon">{icons[msg.type] || icons.info}</span>
      <span className="toast__msg">{msg.text}</span>
      <button className="toast__close" onClick={() => onRemove(msg.id)}>✕</button>
    </div>
  );
};

export default Toast;
