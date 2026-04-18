import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './AdminPanel.css';

const initialForm = { name: '', description: '', price: '', stock: '', imageUrl: '', categoryId: '' };

const AdminPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.role !== 'ADMIN') { navigate('/'); return; }
    loadAll();
  }, [user]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([api.get('/products'), api.get('/categories')]);
      setProducts(pRes.data);
      setCategories(cRes.data);
    } catch {}
    setLoading(false);
  };

  const loadOrders = async () => {
    try {
      const res = await api.get('/orders/all');
      setOrders(res.data);
    } catch {}
  };

  const handleTabChange = (t) => {
    setTab(t);
    if (t === 'orders') loadOrders();
  };

  const openCreate = () => {
    setEditProduct(null);
    setForm(initialForm);
    setShowForm(true);
  };

  const openEdit = (p) => {
    setEditProduct(p);
    setForm({
      name: p.name || '',
      description: p.description || '',
      price: p.price || '',
      stock: p.stock || '',
      imageUrl: p.imageUrl || '',
      categoryId: p.category?.id || '',
    });
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, price: parseFloat(form.price), stock: parseInt(form.stock), categoryId: form.categoryId ? parseInt(form.categoryId) : null };
      if (editProduct) {
        await api.put(`/products/${editProduct.id}`, payload);
        toast.success('Cập nhật sản phẩm thành công!');
      } else {
        await api.post('/products', payload);
        toast.success('Thêm sản phẩm thành công!');
      }
      setShowForm(false);
      loadAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra!');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (p) => {
    if (!window.confirm(`Xóa sản phẩm "${p.name}"?`)) return;
    try {
      await api.delete(`/products/${p.id}`);
      toast.success('Đã xóa sản phẩm!');
      loadAll();
    } catch {
      toast.error('Không thể xóa sản phẩm!');
    }
  };

  const handleStatusChange = async (orderId, status) => {
  try {
    await api.put(`/orders/${orderId}/status`, null, { params: { status } });
    toast.success('Cập nhật trạng thái thành công!');
    await loadOrders(); // await để đợi load xong
  } catch {
    toast.error('Cập nhật thất bại!');
  }
};

  if (user?.role !== 'ADMIN') return null;

  const statusConfig = {
    PENDING: 'Chờ xử lý', PROCESSING: 'Đang xử lý',
    SHIPPED: 'Đang giao', DELIVERED: 'Đã giao', CANCELLED: 'Đã hủy'
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="container admin-header__inner">
          <div>
            <h1>Admin Panel</h1>
            <p>Quản lý Smart Shop</p>
          </div>
          <div className="admin-stats">
            <div className="admin-stat"><strong>{products.length}</strong><span>Sản phẩm</span></div>
            <div className="admin-stat"><strong>{categories.length}</strong><span>Danh mục</span></div>
          </div>
        </div>
      </div>

      <div className="container admin-body">
        <div className="admin-tabs">
          {['products', 'orders'].map(t => (
            <button key={t} className={`admin-tab ${tab === t ? 'active' : ''}`} onClick={() => handleTabChange(t)}>
              {t === 'products' ? '📦 Sản phẩm' : '🛍️ Đơn hàng'}
            </button>
          ))}
        </div>

        {tab === 'products' && (
          <div className="admin-section">
            <div className="admin-toolbar">
              <h2>Danh sách sản phẩm ({products.length})</h2>
              <button className="admin-add-btn" onClick={openCreate}>+ Thêm sản phẩm</button>
            </div>

            {loading ? (
              <div className="admin-loading">Đang tải...</div>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Sản phẩm</th>
                      <th>Danh mục</th>
                      <th>Giá</th>
                      <th>Kho</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id}>
                        <td>
                          <div className="admin-product-cell">
                            {p.imageUrl ? (
                              <img src={p.imageUrl} alt={p.name} className="admin-product-img" />
                            ) : (
                              <div className="admin-product-img-placeholder">📦</div>
                            )}
                            <div>
                              <div className="admin-product-name">{p.name}</div>
                              <div className="admin-product-desc">{p.description?.substring(0, 40)}...</div>
                            </div>
                          </div>
                        </td>
                        <td><span className="admin-cat-badge">{p.category?.name || '—'}</span></td>
                        <td><strong className="admin-price">{p.price?.toLocaleString('vi-VN')}₫</strong></td>
                        <td>
                          <span className={`admin-stock ${p.stock <= 5 ? 'low' : ''}`}>{p.stock}</span>
                        </td>
                        <td>
                          <div className="admin-actions">
                            <button className="admin-btn-edit" onClick={() => openEdit(p)}>✏️ Sửa</button>
                            <button className="admin-btn-delete" onClick={() => handleDelete(p)}>🗑️ Xóa</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === 'orders' && (
          <div className="admin-section">
            <h2>Quản lý đơn hàng</h2>
            {orders.length === 0 ? (
              <div className="admin-empty">Chưa có đơn hàng nào</div>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Đơn hàng</th>
                      <th>Khách hàng</th>
                      <th>Tổng tiền</th>
                      <th>Trạng thái</th>
                      <th>Cập nhật</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o.id}>
                        <td><strong>#SS-{String(o.id).padStart(4,'0')}</strong></td>
                        <td>{o.user?.name || o.user?.email}</td>
                        <td><strong>{o.totalPrice?.toLocaleString('vi-VN')}₫</strong></td>
                        <td><span className={`admin-order-status admin-order-status--${o.status?.toLowerCase()}`}>{statusConfig[o.status]}</span></td>
                        <td>
                          <select
                            value={o.status}
                            onChange={e => handleStatusChange(o.id, e.target.value)}
                            className="admin-status-select"
                          >
                            {Object.entries(statusConfig).map(([k, v]) => (
                              <option key={k} value={k}>{v}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="admin-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h3>{editProduct ? '✏️ Sửa sản phẩm' : '➕ Thêm sản phẩm mới'}</h3>
              <button onClick={() => setShowForm(false)}>✕</button>
            </div>
            <form onSubmit={handleSave} className="admin-form">
              <div className="admin-form-grid">
                <div className="form-group">
                  <label>Tên sản phẩm *</label>
                  <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required placeholder="Áo thun basic..." />
                </div>
                <div className="form-group">
                  <label>Danh mục</label>
                  <select value={form.categoryId} onChange={e => setForm({...form, categoryId: e.target.value})}>
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Giá (₫) *</label>
                  <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required placeholder="150000" min="0" />
                </div>
                <div className="form-group">
                  <label>Tồn kho *</label>
                  <input type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} required placeholder="50" min="0" />
                </div>
                <div className="form-group form-group--full">
                  <label>URL hình ảnh</label>
                  <input value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} placeholder="https://..." />
                </div>
                <div className="form-group form-group--full">
                  <label>Mô tả</label>
                  <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Mô tả sản phẩm..." rows={3} />
                </div>
              </div>
              {form.imageUrl && (
                <div className="admin-img-preview">
                  <img src={form.imageUrl} alt="preview" />
                </div>
              )}
              <div className="admin-form-actions">
                <button type="button" className="admin-btn-cancel" onClick={() => setShowForm(false)}>Hủy</button>
                <button type="submit" className="admin-btn-save" disabled={saving}>
                  {saving ? 'Đang lưu...' : editProduct ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
