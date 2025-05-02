import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <h1>Bienvenidos a Fuaaa</h1>
      <p>Explora nuestro delicioso menú y realiza tu pedido fácilmente.</p>
      <div className="home-actions">
        <button
          onClick={() => navigate('/menu')}
          className="action-button"
        >
          Ver Menú
        </button>
        <button
          onClick={() => navigate('/login')}
          className="action-button secondary"
        >
          Iniciar Sesión (Admin)
        </button>
      </div>
    </div>
  );
};

export default Home;