import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../services/firebase';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

const OrdersDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const q = query(collection(db, 'orders'), where('status', '==', filter));
        const querySnapshot = await getDocs(q);
        const ordersList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setOrders(ordersList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };
    fetchOrders();
  }, [filter]);

  const handleCompleteOrder = async (orderId) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: 'completed' });
      setOrders(prev => prev.filter(order => order.id !== orderId));
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error al actualizar el estado del pedido: ' + error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return <div>Cargando pedidos...</div>;
  }

  return (
    <div>
      <h1>Pedidos</h1>
      <button
        onClick={handleLogout}
        style={{
          padding: '8px 16px',
          backgroundColor: '#e74c3c',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        Cerrar Sesión
      </button>
      <div style={{ marginBottom: '20px' }}>
        <label>
          Filtrar por estado:
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px' }}
          >
            <option value="pending">Pendientes</option>
            <option value="completed">Completados</option>
          </select>
        </label>
      </div>
      {orders.length === 0 ? (
        <p>No hay pedidos {filter === 'pending' ? 'pendientes' : 'completados'}.</p>
      ) : (
        <ul>
          {orders.map(order => (
            <li key={order.id}>
              <h3>Pedido #{order.id}</h3>
              <p><strong>Cliente/Mesa:</strong> {order.customerInfo}</p>
              <p><strong>Total:</strong> ${order.total}</p>
              <h4>Productos:</h4>
              <ul>
                {order.items.map(item => (
                  <li key={item.productId}>
                    {item.name} x{item.quantity} - ${item.price * item.quantity}
                  </li>
                ))}
              </ul>
              <p><strong>Fecha:</strong> {new Date(order.timestamp.seconds * 1000).toLocaleString()}</p>
              {filter === 'pending' && (
                <button
                  onClick={() => handleCompleteOrder(order.id)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#27ae60',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginTop: '10px'
                  }}
                >
                  Marcar como Completado
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrdersDashboard;