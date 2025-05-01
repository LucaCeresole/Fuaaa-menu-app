import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [showNotification, setShowNotification] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotification(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

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
      <h1>¡Pedido Confirmado!</h1>
      <p>Tu pedido ha sido recibido con éxito.</p>
      <p><strong>ID del Pedido:</strong> {orderId}</p>
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