import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Auth.css';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/register', form);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-deco">
        <div className="auth-deco__circle auth-deco__circle--1" />
        <div className="auth-deco__circle auth-deco__circle--2" />
        <div className="auth-brand">
          <div className="auth-brand__logo">S</div>
          <h2>Smart<strong>Shop</strong></h2>
          <p>Tạo tài khoản và bắt đầu mua sắm ngay hôm nay!</p>
          <div className="auth-brand__features">
            {['🎁 Ưu đãi thành viên mới', '🛍️ Hàng nghìn sản phẩm', '📦 Theo dõi đơn hàng dễ dàng'].map((f, i) => (
              <div key={i} className="auth-brand__feature">{f}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-form-card fade-in">
          <h1 className="auth-title">Tạo tài khoản mới</h1>
          <p className="auth-subtitle">Miễn phí và chỉ mất 1 phút</p>

          {error && <div className="auth-error">⚠️ {error}</div>}
          {success && <div className="auth-success">✅ Đăng ký thành công! Đang chuyển hướng...</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Họ và tên</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Nguyễn Văn A"
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="your@email.com"
                required
              />
            </div>
            <div className="form-group">
              <label>Mật khẩu</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="Tối thiểu 6 ký tự"
                required
                minLength={6}
              />
            </div>
            <button type="submit" className="auth-submit" disabled={loading || success}>
              {loading ? <span className="auth-loading" /> : 'Đăng ký'}
            </button>
          </form>

          <p className="auth-switch">
            Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
