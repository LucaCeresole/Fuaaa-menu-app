import React, { useEffect, useState } from 'react';
import { db } from '../services/firebase';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';

const OrdersDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const q = query(collection(db, 'orders'), where('status', '==', 'pending'));
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
  }, []);

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

  if (loading) {
    return <div>Cargando pedidos...</div>;
  }

  return (
    <div>
      <h1>Pedidos Pendientes</h1>
      {orders.length === 0 ? (
        <p>No hay pedidos pendientes.</p>
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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrdersDashboard;