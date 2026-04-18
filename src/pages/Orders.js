import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Orders.css';

const statusConfig = {
  PENDING: { label: 'Chờ xử lý', color: '#f59e0b', bg: '#fef3c7', icon: '⏳' },
  PROCESSING: { label: 'Đang xử lý', color: '#3b82f6', bg: '#dbeafe', icon: '🔄' },
  SHIPPED: { label: 'Đang giao', color: '#8b5cf6', bg: '#ede9fe', icon: '🚚' },
  DELIVERED: { label: 'Đã giao', color: '#10b981', bg: '#d1fae5', icon: '✅' },
  CANCELLED: { label: 'Đã hủy', color: '#ef4444', bg: '#fee2e2', icon: '❌' },
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) return;
    api.get('/orders/my').then(res => setOrders(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isLoggedIn]);

  if (!isLoggedIn) return (
    <div className="orders-login">
      <div>🔐</div>
      <h2>Vui lòng đăng nhập</h2>
      <p>Đăng nhập để xem đơn hàng của bạn</p>
      <Link to="/login" className="orders-login__btn">Đăng nhập</Link>
    </div>
  );

  return (
    <div className="orders-page">
      <div className="orders-page__hero">
        <div className="container">
          <h1>Đơn hàng của tôi</h1>
          <p>{orders.length} đơn hàng</p>
        </div>
      </div>

      <div className="container orders-body">
        {loading ? (
          <div className="orders-loading">
            {[1,2,3].map(i => <div key={i} className="order-skeleton" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="orders-empty">
            <div>📦</div>
            <h3>Chưa có đơn hàng nào</h3>
            <p>Hãy mua sắm để tạo đơn hàng đầu tiên!</p>
            <Link to="/products" className="orders-empty__btn">Mua sắm ngay →</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order, i) => {
              const status = statusConfig[order.status] || statusConfig.PENDING;
              return (
                <div key={order.id} className="order-card fade-in-up" style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className="order-card__header">
                    <div className="order-card__id">
                      <span className="order-label">Đơn hàng</span>
                      <strong>#SS-{String(order.id).padStart(4, '0')}</strong>
                    </div>
                    <div className="order-card__date">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString('vi-VN', {
                        day: '2-digit', month: '2-digit', year: 'numeric'
                      }) : 'Vừa đặt'}
                    </div>
                    <div
                      className="order-status"
                      style={{ color: status.color, background: status.bg }}
                    >
                      {status.icon} {status.label}
                    </div>
                  </div>

                  {order.orderItems && order.orderItems.length > 0 && (
                    <div className="order-card__items">
                      {order.orderItems.map(item => (
                        <div key={item.id} className="order-item">
                          <div className="order-item__img">🛍️</div>
                          <div className="order-item__info">
                            <span>{item.product?.name || 'Sản phẩm'}</span>
                            <span>× {item.quantity}</span>
                          </div>
                          <span className="order-item__price">
                            {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="order-card__footer">
                    <div className="order-card__total">
                      <span>Tổng cộng:</span>
                      <strong>{order.totalPrice?.toLocaleString('vi-VN')}₫</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
