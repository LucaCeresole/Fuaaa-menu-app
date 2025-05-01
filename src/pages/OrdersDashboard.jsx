import React, { useEffect, useState } from 'react';
import { db } from '../services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrdersDashboard;