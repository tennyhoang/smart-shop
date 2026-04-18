import React, { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import './Chatbot.css';

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Xin chào! 👋 Mình là trợ lý AI của Smart Shop. Mình có thể giúp bạn tư vấn sản phẩm, đặt hàng, hoặc giải đáp thắc mắc!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text }]);
    setLoading(true);
    try {
      const res = await api.post('/chat', { message: text });
      setMessages(prev => [...prev, { role: 'bot', text: res.data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại!' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  const quickReplies = ['Có những sản phẩm gì?', 'Chính sách đổi trả?', 'Cách đặt hàng?'];

  return (
    <>
      <button className={`chatbot__fab ${open ? 'chatbot__fab--open' : ''}`} onClick={() => setOpen(!open)}>
        {open ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
          </svg>
        )}
        {!open && <span className="chatbot__pulse" />}
      </button>

      {open && (
        <div className="chatbot__window">
          <div className="chatbot__header">
            <div className="chatbot__header-info">
              <div className="chatbot__avatar">AI</div>
              <div>
                <div className="chatbot__name">Smart Assistant</div>
                <div className="chatbot__status"><span className="chatbot__dot" />Trực tuyến</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="chatbot__close">✕</button>
          </div>

          <div className="chatbot__messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chatbot__msg chatbot__msg--${msg.role}`}>
                {msg.role === 'bot' && <div className="chatbot__msg-avatar">AI</div>}
                <div className="chatbot__bubble">{msg.text}</div>
              </div>
            ))}
            {loading && (
              <div className="chatbot__msg chatbot__msg--bot">
                <div className="chatbot__msg-avatar">AI</div>
                <div className="chatbot__bubble chatbot__bubble--loading">
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length <= 1 && (
            <div className="chatbot__quick">
              {quickReplies.map((q, i) => (
                <button key={i} className="chatbot__quick-btn" onClick={() => { setInput(q); }}>
                  {q}
                </button>
              ))}
            </div>
          )}

          <div className="chatbot__input-area">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Nhập tin nhắn..."
              className="chatbot__input"
              disabled={loading}
            />
            <button className="chatbot__send" onClick={sendMessage} disabled={!input.trim() || loading}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
