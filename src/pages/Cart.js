import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import './Cart.css';

const Cart = () => {
  const { items, removeItem, updateQuantity, clearCart, total } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [ordering, setOrdering] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleOrder = async () => {
    if (!isLoggedIn) { navigate('/login'); return; }
    setOrdering(true);
    try {
      const orderItems = items.map(i => ({ productId: i.id, quantity: i.quantity }));
      await api.post('/orders', { items: orderItems });
      clearCart();
      setSuccess(true);
      toast.success('Đặt hàng thành công! 🎉');
    } catch (err) {
      toast.error('Đặt hàng thất bại: ' + (err.response?.data?.message || 'Lỗi server'));
    } finally {
      setOrdering(false);
    }
  };

  if (success) return (
    <div className="cart-success">
      <div className="cart-success__icon">🎉</div>
      <h2>Đặt hàng thành công!</h2>
      <p>Cảm ơn bạn đã mua sắm tại Smart Shop. Đơn hàng đang được xử lý!</p>
      <div className="cart-success__actions">
        <Link to="/orders" className="btn-view-orders">Xem đơn hàng</Link>
        <Link to="/products" className="btn-continue">Tiếp tục mua sắm</Link>
      </div>
    </div>
  );

  if (items.length === 0) return (
    <div className="cart-empty">
      <div className="cart-empty__icon">🛒</div>
      <h2>Giỏ hàng trống</h2>
      <p>Hãy thêm sản phẩm vào giỏ hàng để tiến hành thanh toán</p>
      <Link to="/products" className="cart-empty__btn">Khám phá sản phẩm →</Link>
    </div>
  );

  return (
    <div className="cart-page">
      <div className="cart-page__hero">
        <div className="container">
          <h1>Giỏ hàng của bạn</h1>
          <p>{items.length} sản phẩm</p>
        </div>
      </div>

      <div className="container cart-layout">
        <div className="cart-items">
          {items.map(item => (
            <div key={item.id} className="cart-item fade-in-up">
              <div className="cart-item__img">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} />
                ) : (
                  <div className="cart-item__placeholder">🛍️</div>
                )}
              </div>
              <div className="cart-item__info">
                <span className="cart-item__cat">{item.category?.name}</span>
                <h3 className="cart-item__name">{item.name}</h3>
                <div className="cart-item__price">{item.price?.toLocaleString('vi-VN')}₫</div>
              </div>
              <div className="cart-item__qty">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              </div>
              <div className="cart-item__subtotal">
                {(item.price * item.quantity).toLocaleString('vi-VN')}₫
              </div>
              <button className="cart-item__remove" onClick={() => { removeItem(item.id); toast.info('Đã xóa sản phẩm khỏi giỏ hàng'); }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="cart-summary__card">
            <h3>Tóm tắt đơn hàng</h3>
            <div className="cart-summary__rows">
              {items.map(item => (
                <div key={item.id} className="cart-summary__row">
                  <span>{item.name} × {item.quantity}</span>
                  <span>{(item.price * item.quantity).toLocaleString('vi-VN')}₫</span>
                </div>
              ))}
              <div className="cart-summary__divider" />
              <div className="cart-summary__row cart-summary__row--ship">
                <span>Vận chuyển</span>
                <span className="free">Miễn phí</span>
              </div>
              <div className="cart-summary__total">
                <span>Tổng cộng</span>
                <strong>{total.toLocaleString('vi-VN')}₫</strong>
              </div>
            </div>
            <button className="cart-order-btn" onClick={handleOrder} disabled={ordering}>
              {ordering ? 'Đang xử lý...' : isLoggedIn ? '🛍️ Đặt hàng ngay' : '🔐 Đăng nhập để đặt hàng'}
            </button>
            <Link to="/products" className="cart-continue">← Tiếp tục mua sắm</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
