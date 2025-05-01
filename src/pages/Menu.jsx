import React, { useEffect, useState } from 'react';
import { db } from '../services/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState({});
  const [customerInfo, setCustomerInfo] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productsList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleQuantityChange = (productId, quantity) => {
    setOrder(prev => ({
      ...prev,
      [productId]: parseInt(quantity) || 0
    }));
  };

  const handleCustomerInfoChange = (e) => {
    setCustomerInfo(e.target.value);
    setErrorMessage('');
  };

  const calculateTotal = () => {
    return Object.entries(order)
      .reduce((total, [productId, quantity]) => {
        if (quantity > 0) {
          const product = products.find(prod => prod.id === productId);
          return total + (product ? product.price * quantity : 0);
        }
        return total;
      }, 0);
  };

  const getOrderItems = () => {
    return Object.entries(order)
      .filter(([_, quantity]) => quantity > 0)
      .map(([productId, quantity]) => {
        const product = products.find(prod => prod.id === productId);
        if (!product) {
          throw new Error(`Producto con ID ${productId} no encontrado`);
        }
        return { productId, name: product.name, quantity, price: product.price };
      });
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      if (!customerInfo.trim()) {
        setErrorMessage('Por favor, ingresa tu nombre o número de mesa.');
        return;
      }

      const orderItems = getOrderItems();

      if (orderItems.length === 0) {
        setErrorMessage('Selecciona al menos un producto.');
        return;
      }

      setShowSummary(true);
    } catch (error) {
      console.error('Error preparing order:', error);
      setErrorMessage('Error al preparar el pedido: ' + error.message);
    }
  };

  const confirmOrder = async () => {
    try {
      const orderItems = getOrderItems();

      await addDoc(collection(db, 'orders'), {
        customerInfo: customerInfo.trim(),
        items: orderItems,
        total: calculateTotal(),
        timestamp: new Date(),
        status: 'pending'
      });

      setSuccessMessage('¡Pedido enviado con éxito!');
      setOrder({});
      setCustomerInfo('');
      setShowSummary(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error submitting order:', error);
      setErrorMessage('Error al enviar el pedido: ' + error.message);
      setShowSummary(false);
    }
  };

  const cancelOrder = () => {
    setShowSummary(false);
    setErrorMessage('');
  };

  if (loading) {
    return <div>Cargando menú...</div>;
  }

  return (
    <div>
      <h1>Nuestro Menú</h1>
      {successMessage && <p style={{ color: 'green', textAlign: 'center' }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</p>}
      <form onSubmit={handleSubmitOrder}>
        <div style={{ marginBottom: '20px' }}>
          <label>
            Nombre o Número de Mesa:
            <input
              type="text"
              value={customerInfo}
              onChange={handleCustomerInfoChange}
              placeholder="Ej. Juan o Mesa 5"
              style={{ marginLeft: '10px', padding: '5px', width: '200px' }}
              required
            />
          </label>
        </div>
        <ul>
          {products.map(product => (
            <li key={product.id}>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>Precio: ${product.price}</p>
              <label>
                Cantidad:
                <input
                  type="number"
                  min="0"
                  value={order[product.id] || 0}
                  onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                  style={{ marginLeft: '10px', padding: '5px', width: '60px' }}
                />
              </label>
            </li>
          ))}
        </ul>
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: '#2c3e50',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Revisar Pedido
        </button>
      </form>
      {products.length === 0 && <p>No hay productos disponibles.</p>}

      {showSummary && (
        <div
          style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '10px',
              maxWidth: '500px',
              width: '90%'
            }}
          >
            <h2>Resumen del Pedido</h2>
            <p><strong>Nombre/Mesa:</strong> {customerInfo}</p>
            <h3>Productos:</h3>
            <ul>
              {getOrderItems().map(item => (
                <li key={item.productId}>
                  {item.name} x{item.quantity} - ${item.price * item.quantity}
                </li>
              ))}
            </ul>
            <p><strong>Total:</strong> ${calculateTotal()}</p>
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <button
                onClick={confirmOrder}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#2c3e50',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  marginRight: '10px',
                  cursor: 'pointer'
                }}
              >
                Confirmar Pedido
              </button>
              <button
                onClick={cancelOrder}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#e74c3c',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
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