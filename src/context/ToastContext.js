import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/Toast';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  const addToast = useCallback((text, type = 'info') => {
    const id = Date.now() + Math.random();
    setMessages(prev => [...prev, { id, text, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setMessages(prev => prev.filter(m => m.id !== id));
  }, []);

  const toast = {
    success: (text) => addToast(text, 'success'),
    error: (text) => addToast(text, 'error'),
    info: (text) => addToast(text, 'info'),
    warning: (text) => addToast(text, 'warning'),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <Toast messages={messages} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
