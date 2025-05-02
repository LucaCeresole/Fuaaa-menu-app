import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../services/firebase';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [customerInfo, setCustomerInfo] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [orderSummary, setOrderSummary] = useState([]);
  const [total, setTotal] = useState(0);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productsList);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const handleQuantityChange = (productId, value) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(0, parseInt(value) || 0)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (customerInfo.trim().length < 3) {
      newErrors.customerInfo = 'El nombre o mesa debe tener al menos 3 caracteres.';
    }
    const selectedItems = Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
    if (selectedItems === 0) {
      newErrors.items = 'Debes seleccionar al menos un producto.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReviewOrder = () => {
    if (!validateForm()) return;

    const summary = products
      .filter(product => quantities[product.id] > 0)
      .map(product => ({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: quantities[product.id]
      }));
    const orderTotal = summary.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setOrderSummary(summary);
    setTotal(orderTotal);
    setShowModal(true);
  };

  const handleConfirmOrder = async () => {
    setLoading(true);
    try {
      const orderData = {
        customerInfo,
        items: orderSummary,
        total,
        status: 'pending',
        timestamp: serverTimestamp()
      };
      const docRef = await addDoc(collection(db, 'orders'), orderData);
      setShowModal(false);
      setQuantities({});
      setCustomerInfo('');
      navigate(`/order-confirmation/${docRef.id}`);
    } catch (error) {
      console.error('Error confirming order:', error);
      alert('Error al confirmar el pedido: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1>Menú</h1>
      <form>
        <label>
          Nombre o Mesa:
          <input
            type="text"
            value={customerInfo}
            onChange={(e) => setCustomerInfo(e.target.value)}
            placeholder="Ej. Mesa 5"
          />
          {errors.customerInfo && <p className="error-message">{errors.customerInfo}</p>}
        </label>
        <h2>Productos</h2>
        <ul className="product-list">
          {products.map(product => (
            <li key={product.id} className="product-card">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="product-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div
                  className="product-image"
                  style={{ background: '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  Sin imagen
                </div>
              )}
              <div className="product-info">
                <h3>{product.name}</h3>
                <p>Precio: ${product.price}</p>
                <label>
                  Cantidad:
                  <input
                    type="number"
                    min="0"
                    value={quantities[product.id] || ''}
                    onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                  />
                </label>
              </div>
            </li>
          ))}
        </ul>
        {errors.items && <p className="error-message">{errors.items}</p>}
        <div className="form-actions">
          <button
            type="button"
            onClick={handleReviewOrder}
            disabled={loading}
            className={loading ? 'loading' : ''}
          >
            Revisar Pedido
          </button>
        </div>
      </form>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Resumen del Pedido</h2>
            <p><strong>Cliente/Mesa:</strong> {customerInfo}</p>
            <h3>Productos:</h3>
            <ul>
              {orderSummary.map(item => (
                <li key={item.productId}>
                  {item.name} x{item.quantity} - ${item.price * item.quantity}
                </li>
              ))}
            </ul>
            <p><strong>Total:</strong> ${total}</p>
            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <button
                onClick={handleConfirmOrder}
                disabled={loading}
                className={loading ? 'loading' : ''}
              >
                Confirmar Pedido
              </button>
              <button
                onClick={() => setShowModal(false)}
                disabled={loading}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;