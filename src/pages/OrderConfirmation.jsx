import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [showNotification, setShowNotification] = useState(true);
  const [orderStatus, setOrderStatus] = useState('pending');
  const [statusNotification, setStatusNotification] = useState(false);

  useEffect(() => {
    // Notificación inicial
    const timer = setTimeout(() => {
      setShowNotification(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Consultar estado del pedido cada 10 segundos
    const checkOrderStatus = async () => {
      try {
        const orderRef = doc(db, 'orders', orderId);
        const orderSnap = await getDoc(orderRef);
        if (orderSnap.exists()) {
          const status = orderSnap.data().status;
          setOrderStatus(status);
          if (status === 'completed') {
            setStatusNotification(true);
            setTimeout(() => setStatusNotification(false), 5000);
          }
        }
      } catch (error) {
        console.error('Error checking order status:', error);
      }
    };

    checkOrderStatus(); // Consulta inicial
    const interval = setInterval(checkOrderStatus, 10000); // Cada 10 segundos
    return () => clearInterval(interval);
  }, [orderId]);

  return (
    <div>
      {showNotification && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: '#27ae60',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: '5px',
            zIndex: 1000,
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)'
          }}
        >
          ¡Tu pedido #{orderId} ha sido recibido!
        </div>
      )}
      {statusNotification && (
        <div
          style={{
            position: 'fixed',
            top: '80px',
            right: '20px',
            backgroundColor: '#219653',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: '5px',
            zIndex: 1000,
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)'
          }}
        >
          ¡Tu pedido #{orderId} está listo!
        </div>
      )}
      <h1>¡Pedido Confirmado!</h1>
      <p>Tu pedido ha sido recibido con éxito.</p>
      <p><strong>ID del Pedido:</strong> {orderId}</p>
      <p><strong>Estado:</strong> {orderStatus === 'pending' ? 'Pendiente' : 'Completado'}</p>
      <p>Gracias por tu orden. Te notificaremos cuando esté listo.</p>
      <Link
        to="/menu"
        style={{
          display: 'inline-block',
          padding: '10px 20px',
          backgroundColor: '#2c3e50',
          color: '#fff',
          textDecoration: 'none',
          borderRadius: '5px',
          marginTop: '20px'
        }}
      >
        Volver al Menú
      </Link>
    </div>
  );
};

export default OrderConfirmation;