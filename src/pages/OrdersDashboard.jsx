import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../services/firebase';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

const OrdersDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [userEmail, setUserEmail] = useState('');
  const [buttonLoading, setButtonLoading] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.currentUser) {
      setUserEmail(auth.currentUser.email);
    }

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
    setButtonLoading(prev => ({ ...prev, [orderId]: true }));
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: 'completed' });
      setOrders(prev => prev.filter(order => order.id !== orderId));
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error al actualizar el estado del pedido: ' + error.message);
    } finally {
      setButtonLoading(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="page-container">Cargando pedidos...</div>;
  }

  return (
    <div className="page-container">
      <div className="dashboard-container">
        <h1>Panel de Pedidos</h1>
        <div className="dashboard-header">
          <p>Bienvenido, {userEmail}</p>
          <button
            onClick={handleLogout}
            className={`logout-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            Cerrar Sesión
          </button>
        </div>
        <div className="filter-container">
          <label>
            Filtrar por estado:
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option value="pending">Pendientes</option>
              <option value="completed">Completados</option>
            </select>
          </label>
        </div>
        {orders.length === 0 ? (
          <p>No hay pedidos {filter === 'pending' ? 'pendientes' : 'completados'}.</p>
        ) : (
          <div className="table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente/Mesa</th>
                  <th>Total</th>
                  <th>Productos</th>
                  <th>Fecha</th>
                  {filter === 'pending' && <th>Acción</th>}
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.customerInfo}</td>
                    <td>${order.total}</td>
                    <td>
                      <ul className="dashboard-items">
                        {order.items.map(item => (
                          <li key={item.productId}>
                            {item.name} x{item.quantity} - ${item.price * item.quantity}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td>{new Date(order.timestamp.seconds * 1000).toLocaleString()}</td>
                    {filter === 'pending' && (
                      <td>
                        <button
                          onClick={() => handleCompleteOrder(order.id)}
                          className={`complete-button ${buttonLoading[order.id] ? 'loading' : ''}`}
                          disabled={buttonLoading[order.id]}
                          title="Marcar como completado"
                        >
                          ✔️
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersDashboard;