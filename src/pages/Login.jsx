import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/orders-dashboard');
    } catch (err) {
      console.error('Firebase Auth Error:', err.code, err.message);
      switch (err.code) {
        case 'auth/invalid-credential':
          setError('Correo o contraseña incorrectos.');
          break;
        case 'auth/user-disabled':
          setError('Esta cuenta está deshabilitada.');
          break;
        case 'auth/too-many-requests':
          setError('Demasiados intentos. Intenta de nuevo más tarde.');
          break;
        default:
          setError('Error al iniciar sesión: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1>Iniciar Sesión</h1>
      <form onSubmit={handleLogin}>
        <label>
          Correo:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Contraseña:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button
          type="submit"
          className={`login-button ${loading ? 'loading' : ''}`}
          disabled={loading}
        >
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
};

export default Login;