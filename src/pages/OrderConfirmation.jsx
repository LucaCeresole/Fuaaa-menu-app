import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../services/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [notification, setNotification] = useState('¡Tu pedido #' + orderId + ' ha sido recibido!');

  useEffect(() => {
    const orderRef = doc(db, 'orders', orderId);
    const unsubscribe = onSnapshot(orderRef, (doc) => {
      if (doc.exists()) {
        setOrder({ id: doc.id, ...doc.data() });
        if (doc.data().status === 'completed') {
          setNotification('¡Tu pedido #' + orderId + ' está listo!');
          setTimeout(() => setNotification(''), 5000);
        }
      }
    });

    setTimeout(() => {
      if (notification === '¡Tu pedido #' + orderId + ' ha sido recibido!') {
        setNotification('');
      }
    }, 5000);

    return () => unsubscribe();
  }, [orderId, notification]);

  if (!order) {
    return <div className="page-container">Cargando...</div>;
  }

  return (
    <div className="page-container">
      <h1>Confirmación del Pedido</h1>
      {notification && (
        <div className="notification">
          {notification}
        </div>
      )}
      <h2>Detalles del Pedido</h2>
      <p>ID: <strong>#{orderId}</strong></p>
      <p><strong>Cliente/Mesa:</strong> {order.customerInfo}</p>
      <h3>Productos:</h3>
      <ul>
        {order.items.map((item, index) => (
          <li key={index}>
            {item.name} x{item.quantity} - ${item.price * item.quantity}
          </li>
        ))}
      </ul>
      <p><strong>Total:</strong> ${order.total}</p>
      <p><strong>Estado:</strong> {order.status === 'pending' ? 'Pendiente' : 'Completado'}</p>
    </div>
  );
};

export default OrderConfirmation;