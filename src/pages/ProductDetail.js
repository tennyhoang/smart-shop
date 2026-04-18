import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const toast = useToast();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleAdd = () => {
    setAdding(true);
    addItem(product, qty);
    toast.success(`Đã thêm ${qty} "${product.name}" vào giỏ hàng!`);
    setTimeout(() => setAdding(false), 1000);
  };

  if (loading) return (
    <div className="pd-loading">
      <div className="pd-skeleton__img" />
      <div className="pd-skeleton__info">
        <div className="pd-skeleton__line" style={{width:'60%'}} />
        <div className="pd-skeleton__line" style={{width:'40%'}} />
        <div className="pd-skeleton__line" style={{width:'80%'}} />
      </div>
    </div>
  );

  if (!product) return null;

  return (
    <div className="pd-page">
      <div className="container pd-breadcrumb">
        <span onClick={() => navigate('/')}>Trang chủ</span>
        <span>›</span>
        <span onClick={() => navigate('/products')}>Sản phẩm</span>
        <span>›</span>
        <span className="active">{product.name}</span>
      </div>

      <div className="container pd-layout">
        <div className="pd-img-wrap">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="pd-img" />
          ) : (
            <div className="pd-img-placeholder">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </div>
          )}
          <div className="pd-badge">{product.category?.name || 'Sản phẩm'}</div>
        </div>

        <div className="pd-info">
          <div className="pd-cat">{product.category?.name}</div>
          <h1 className="pd-name">{product.name}</h1>
          <div className="pd-price">{product.price?.toLocaleString('vi-VN')}₫</div>

          <div className="pd-stock">
            <span className={`pd-stock-dot ${product.stock > 0 ? 'in' : 'out'}`} />
            {product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng'}
          </div>

          {product.description && (
            <div className="pd-desc">
              <h3>Mô tả sản phẩm</h3>
              <p>{product.description}</p>
            </div>
          )}

          <div className="pd-qty-row">
            <span>Số lượng:</span>
            <div className="pd-qty">
              <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}>+</button>
            </div>
          </div>

          <div className="pd-actions">
            <button
              className={`pd-add-btn ${adding ? 'added' : ''}`}
              onClick={handleAdd}
              disabled={product.stock <= 0 || adding}
            >
              {adding ? '✓ Đã thêm vào giỏ!' : '🛒 Thêm vào giỏ hàng'}
            </button>
            <button className="pd-back-btn" onClick={() => navigate('/products')}>
              ← Quay lại
            </button>
          </div>

          <div className="pd-features">
            {['🚚 Giao hàng miễn phí', '🔄 Đổi trả 30 ngày', '🔒 Thanh toán an toàn'].map((f, i) => (
              <div key={i} className="pd-feature">{f}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
