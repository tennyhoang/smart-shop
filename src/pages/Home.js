import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import './Home.css';

const ProductCard = ({ product }) => {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="product-card">
      <div className="product-card__img">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} />
        ) : (
          <div className="product-card__placeholder">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
        )}
        <div className="product-card__overlay">
          <button className="product-card__quick-add" onClick={handleAdd}>
            {added ? '✓ Đã thêm' : '+ Thêm vào giỏ'}
          </button>
        </div>
      </div>
      <div className="product-card__info">
        <p className="product-card__category">{product.category?.name || 'Sản phẩm'}</p>
        <h3 className="product-card__name">{product.name}</h3>
        <div className="product-card__bottom">
          <span className="product-card__price">
            {product.price?.toLocaleString('vi-VN')}₫
          </span>
          <span className="product-card__stock">Còn {product.stock}</span>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products').then(res => {
      setProducts(res.data.slice(0, 8));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero__bg">
          <div className="hero__circle hero__circle--1" />
          <div className="hero__circle hero__circle--2" />
          <div className="hero__circle hero__circle--3" />
        </div>
        <div className="container hero__content">
          <div className="hero__text">
            <div className="hero__badge">🛍️ Thời trang hiện đại</div>
            <h1 className="hero__title">
              Mua sắm thông minh<br />
              <span>cùng Smart Shop</span>
            </h1>
            <p className="hero__desc">
              Khám phá hàng nghìn sản phẩm thời trang chất lượng cao với giá cả hợp lý. Trợ lý AI sẵn sàng hỗ trợ bạn 24/7.
            </p>
            <div className="hero__actions">
              <Link to="/products" className="hero__btn-primary">
                Khám phá ngay
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
              <Link to="/register" className="hero__btn-outline">Đăng ký miễn phí</Link>
            </div>
            <div className="hero__stats">
              <div className="hero__stat"><strong>1,000+</strong><span>Sản phẩm</span></div>
              <div className="hero__stat-divider" />
              <div className="hero__stat"><strong>500+</strong><span>Khách hàng</span></div>
              <div className="hero__stat-divider" />
              <div className="hero__stat"><strong>AI</strong><span>Trợ lý 24/7</span></div>
            </div>
          </div>
          <div className="hero__visual">
            <div className="hero__card hero__card--main">
              <div className="hero__card-icon">👗</div>
              <div>
                <div className="hero__card-title">Bộ sưu tập mới</div>
                <div className="hero__card-sub">Summer 2025</div>
              </div>
            </div>
            <div className="hero__card hero__card--float">
              <span>🤖</span> AI tư vấn miễn phí
            </div>
            <div className="hero__card hero__card--float2">
              <span>🚚</span> Giao hàng toàn quốc
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="container features__grid">
          {[
            { icon: '🚀', title: 'Giao hàng nhanh', desc: 'Giao hàng trong 2-4 giờ tại TP.HCM' },
            { icon: '🔄', title: 'Đổi trả dễ dàng', desc: 'Đổi trả miễn phí trong 30 ngày' },
            { icon: '🔒', title: 'Thanh toán an toàn', desc: 'Mã hóa SSL 256-bit' },
            { icon: '🤖', title: 'AI hỗ trợ 24/7', desc: 'Trợ lý AI luôn sẵn sàng tư vấn' },
          ].map((f, i) => (
            <div key={i} className="feature-card" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="feature-card__icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="featured-products">
        <div className="container">
          <div className="section-header">
            <div>
              <p className="section-label">Được yêu thích nhất</p>
              <h2 className="section-title">Sản phẩm nổi bật</h2>
            </div>
            <Link to="/products" className="section-link">
              Xem tất cả →
            </Link>
          </div>
          {loading ? (
            <div className="products-grid">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="product-skeleton" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="products-grid">
              {products.map((p, i) => (
                <div key={p.id} style={{ animationDelay: `${i * 0.08}s` }} className="fade-in-up">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state__icon">📦</div>
              <h3>Chưa có sản phẩm</h3>
              <p>Hãy thêm sản phẩm qua API để hiển thị ở đây</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="container cta__inner">
          <div className="cta__text">
            <h2>Chưa có tài khoản?</h2>
            <p>Đăng ký ngay để nhận ưu đãi và trải nghiệm mua sắm thông minh!</p>
          </div>
          <Link to="/register" className="cta__btn">Đăng ký ngay →</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
