import React from 'react';
import { useParams, Link } from 'react-router-dom';

const OrderConfirmation = () => {
  const { orderId } = useParams();

  return (
    <div>
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