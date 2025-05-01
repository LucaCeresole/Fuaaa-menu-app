import React, { useEffect, useState } from 'react';
import { db } from '../services/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productsList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleQuantityChange = (productId, quantity) => {
    setOrder(prev => ({
      ...prev,
      [productId]: parseInt(quantity) || 0
    }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    try {
      const orderItems = Object.entries(order)
        .filter(([_, quantity]) => quantity > 0)
        .map(([productId, quantity]) => {
          const product = products.find(prod => prod.id === productId); // Cambiamos 'p' por 'prod'
          if (!product) {
            throw new Error(`Producto con ID ${productId} no encontrado`);
          }
          return { productId, name: product.name, quantity, price: product.price };
        });

      if (orderItems.length === 0) {
        alert('Selecciona al menos un producto.');
        return;
      }

      await addDoc(collection(db, 'orders'), {
        items: orderItems,
        timestamp: new Date(),
        status: 'pending'
      });

      setSuccessMessage('¡Pedido enviado con éxito!');
      setOrder({});
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Error al enviar el pedido: ' + error.message);
    }
  };

  if (loading) {
    return <div>Cargando menú...</div>;
  }

  return (
    <div>
      <h1>Nuestro Menú</h1>
      {successMessage && <p style={{ color: 'green', textAlign: 'center' }}>{successMessage}</p>}
      <form onSubmit={handleSubmitOrder}>
        <ul>
          {products.map(product => (
            <li key={product.id}>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>Precio: ${product.price}</p>
              <label>
                Cantidad:
                <input
                  type="number"
                  min="0"
                  value={order[product.id] || 0}
                  onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                />
              </label>
            </li>
          ))}
        </ul>
        <button type="submit">Enviar Pedido</button>
      </form>
      {products.length === 0 && <p>No hay productos disponibles.</p>}
    </div>
  );
};

export default Menu;