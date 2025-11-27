import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', price: '', stock: '' });
  const [errors, setErrors] = useState({});
  const [editingProduct, setEditingProduct] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [productToDelete, setProductToDelete] = useState(null); 

  
  useEffect(() => {
    setTimeout(() => {
      setProducts([
        { id: 1, name: 'Laptop Gaming', price: 15000000, stock: 5 },
        { id: 2, name: 'Mouse Wireless', price: 250000, stock: 20 },
        { id: 3, name: 'Keyboard Mechanical', price: 500000, stock: 10 },
      ]);
      setLoading(false);
    }, 2000);
  }, []);

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Nama produk wajib diisi.';
    if (!formData.price.trim()) newErrors.price = 'Harga wajib diisi.';
    if (!formData.stock.trim()) newErrors.stock = 'Stok wajib diisi.';
    if (formData.price && (isNaN(formData.price) || parseFloat(formData.price) <= 0)) {
      newErrors.price = 'Harga harus angka positif.';
    }
    if (formData.stock && (isNaN(formData.stock) || parseInt(formData.stock) <= 0)) {
      newErrors.stock = 'Stok harus angka positif.';
    }
   
    const isNameUnique = !products.some(product =>
      product.name.toLowerCase() === formData.name.toLowerCase().trim() &&
      product.id !== (editingProduct ? editingProduct.id : null)
    );
    if (formData.name.trim() && !isNameUnique) {
      newErrors.name = 'Nama produk sudah ada (case-insensitive).';
    }
    return newErrors;
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      if (editingProduct) {
        setProducts(products.map(product =>
          product.id === editingProduct.id
            ? { ...product, name: formData.name.trim(), price: parseFloat(formData.price), stock: parseInt(formData.stock) }
            : product
        ));
        setEditingProduct(null);
      } else {
       
        const newProduct = {
          id: Date.now(),
          name: formData.name.trim(),
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
        };
        setProducts([...products, newProduct]);
      }
      setFormData({ name: '', price: '', stock: '' }); // Reset form
    }
  };

  
  const startEdit = (product) => {
    setEditingProduct(product);
    setFormData({ name: product.name, price: product.price.toString(), stock: product.stock.toString() });
  };

  
  const cancelEdit = () => {
    setEditingProduct(null);
    setFormData({ name: '', price: '', stock: '' });
    setErrors({});
  };

  // Buka modal hapus
  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setIsModalOpen(true);
  };

  // Konfirmasi hapus
  const confirmDelete = () => {
    setProducts(products.filter(product => product.id !== productToDelete.id));
    setIsModalOpen(false);
    setProductToDelete(null);
  };

  // Batal hapus
  const cancelDelete = () => {
    setIsModalOpen(false);
    setProductToDelete(null);
  };

  return (
    <div className="app-container">
      <div className="product-wrapper">
        <h1 className="title">Daftar Produk</h1>
        
        {/* Form Input/Edit */}
        <form onSubmit={handleSubmit} className="product-form">
          <h2>{editingProduct ? 'Edit Produk' : 'Tambah Produk'}</h2>
          <div className="form-group">
            <label>Nama Produk:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-msg">{errors.name}</span>}
          </div>
          <div className="form-group">
            <label>Harga:</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={errors.price ? 'error' : ''}
            />
            {errors.price && <span className="error-msg">{errors.price}</span>}
          </div>
          <div className="form-group">
            <label>Stok:</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className={errors.stock ? 'error' : ''}
            />
            {errors.stock && <span className="error-msg">{errors.stock}</span>}
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-btn">{editingProduct ? 'Update Produk' : 'Tambah Produk'}</button>
            {editingProduct && <button type="button" onClick={cancelEdit} className="cancel-btn">Batal Edit</button>}
          </div>
        </form>
        
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Memuat produk...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="empty">
            <p>Tidak ada produk tersedia.</p>
          </div>
        ) : (
          <div className="product-grid">
            {products.map(product => (
              <div key={product.id} className="product-card">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">Harga: Rp {product.price.toLocaleString()}</p>
                <p className="product-stock">Stok: {product.stock}</p>
                <div className="card-actions">
                  <button onClick={() => startEdit(product)} className="edit-btn">Edit</button>
                  <button onClick={() => openDeleteModal(product)} className="delete-btn">Hapus</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Konfirmasi Hapus</h3>
            <p>Apakah Anda yakin ingin menghapus produk "{productToDelete?.name}"?</p>
            <div className="modal-actions">
              <button onClick={confirmDelete} className="confirm-btn">Ya, Hapus</button>
              <button onClick={cancelDelete} className="cancel-btn">Batal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;