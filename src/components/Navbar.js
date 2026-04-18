import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isLoggedIn } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleLogout = () => { logout(); navigate('/'); };
  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo">
          <div className="navbar__logo-icon">S</div>
          <span>Smart<strong>Shop</strong></span>
        </Link>

        <div className="navbar__links">
          <Link to="/" className={`navbar__link ${isActive('/') ? 'active' : ''}`}>Trang chủ</Link>
          <Link to="/products" className={`navbar__link ${isActive('/products') ? 'active' : ''}`}>Sản phẩm</Link>
          {isLoggedIn && (
            <Link to="/orders" className={`navbar__link ${isActive('/orders') ? 'active' : ''}`}>Đơn hàng</Link>
          )}
          {user?.role === 'ADMIN' && (
            <Link to="/admin" className={`navbar__link navbar__link--admin ${isActive('/admin') ? 'active' : ''}`}>
              ⚙️ Admin
            </Link>
          )}
        </div>

        <div className="navbar__actions">
          <Link to="/cart" className="navbar__cart">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            {count > 0 && <span className="navbar__badge">{count}</span>}
          </Link>

          {isLoggedIn ? (
            <div className="navbar__user">
              <button className="navbar__avatar" onClick={() => setMenuOpen(!menuOpen)}>
                {user?.name?.charAt(0).toUpperCase()}
              </button>
              {menuOpen && (
                <div className="navbar__dropdown">
                  <div className="navbar__dropdown-header">
                    <strong>{user?.name}</strong>
                    <span>{user?.email}</span>
                    {user?.role === 'ADMIN' && <span className="navbar__role-badge">ADMIN</span>}
                  </div>
                  <Link to="/orders">📦 Đơn hàng của tôi</Link>
                  {user?.role === 'ADMIN' && <Link to="/admin">⚙️ Quản lý Admin</Link>}
                  <button onClick={handleLogout}>🚪 Đăng xuất</button>
                </div>
              )}
            </div>
          ) : (
            <div className="navbar__auth">
              <Link to="/login" className="btn-outline">Đăng nhập</Link>
              <Link to="/register" className="btn-primary">Đăng ký</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
