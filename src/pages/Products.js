import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const { addItem } = useCart();
  const toast = useToast();
  const navigate = useNavigate();
  const [added, setAdded] = useState({});

  useEffect(() => {
    Promise.all([api.get('/products'), api.get('/categories')])
      .then(([pRes, cRes]) => {
        setProducts(pRes.data);
        setCategories(cRes.data);
      }).catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = (e, product) => {
    e.stopPropagation();
    addItem(product);
    toast.success(`Đã thêm "${product.name}" vào giỏ hàng!`);
    setAdded(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => setAdded(prev => ({ ...prev, [product.id]: false })), 1500);
  };

  const filtered = products
    .filter(p => selectedCat === 'all' || p.category?.id === parseInt(selectedCat))
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <div className="products-page">
      <div className="products-page__hero">
        <div className="container">
          <h1>Tất cả sản phẩm</h1>
          <p>Khám phá bộ sưu tập thời trang đa dạng</p>
        </div>
      </div>

      <div className="container products-page__body">
        <aside className="products-sidebar">
          <div className="sidebar-section">
            <h3>Danh mục</h3>
            <div className="category-list">
              <button className={`category-item ${selectedCat === 'all' ? 'active' : ''}`} onClick={() => setSelectedCat('all')}>
                <span>🛍️</span> Tất cả
                <span className="count">{products.length}</span>
              </button>
              {categories.map(cat => (
                <button key={cat.id} className={`category-item ${selectedCat === String(cat.id) ? 'active' : ''}`} onClick={() => setSelectedCat(String(cat.id))}>
                  <span>📦</span> {cat.name}
                  <span className="count">{products.filter(p => p.category?.id === cat.id).length}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <main className="products-main">
          <div className="products-toolbar">
            <div className="search-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm sản phẩm..." />
            </div>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="sort-select">
              <option value="default">Mặc định</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
              <option value="name">Tên A-Z</option>
            </select>
            <span className="products-count">{filtered.length} sản phẩm</span>
          </div>

          {loading ? (
            <div className="products-grid-main">
              {[...Array(8)].map((_, i) => <div key={i} className="product-skeleton-main" />)}
            </div>
          ) : filtered.length > 0 ? (
            <div className="products-grid-main">
              {filtered.map((p, i) => (
                <div
                  key={p.id}
                  className="product-card-main fade-in-up"
                  style={{ animationDelay: `${i * 0.06}s` }}
                  onClick={() => navigate(`/products/${p.id}`)}
                >
                  <div className="pcm__img">
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt={p.name} />
                    ) : (
                      <div className="pcm__placeholder">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                          <polyline points="21 15 16 10 5 21"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="pcm__info">
                    <span className="pcm__cat">{p.category?.name}</span>
                    <h3 className="pcm__name">{p.name}</h3>
                    <p className="pcm__desc">{p.description || 'Sản phẩm chất lượng cao'}</p>
                    <div className="pcm__bottom">
                      <div>
                        <div className="pcm__price">{p.price?.toLocaleString('vi-VN')}₫</div>
                        <div className="pcm__stock">Kho: {p.stock}</div>
                      </div>
                      <button
                        className={`pcm__add ${added[p.id] ? 'added' : ''}`}
                        onClick={(e) => handleAdd(e, p)}
                        disabled={p.stock <= 0}
                      >
                        {added[p.id] ? '✓' : '+'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-products">
              <div>🔍</div>
              <h3>Không tìm thấy sản phẩm</h3>
              <p>Thử từ khóa khác hoặc chọn danh mục khác</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;
