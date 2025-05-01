import React, { useEffect, useState } from 'react';
import { db } from '../services/firebase';
import { collection, getDocs } from 'firebase/firestore';

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState([true]);

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
            console.error('Error fetching products', error);
            setLoading(false);
        }
    };
    fetchProducts();
  }, []);
  if (loading) {
    return <div>Cargando menú...</div>;
  }
  return (
    <div>
        <h1>Nuestro menú</h1>
        {products.length === 0 ? (
            <p>No hay productos disponibles</p>
        ) : (
            <ul>
                {products.map(product => (
                    <li key={product.id}>
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <p>Precio: ${product.price}</p>
                    </li>
                ))}
            </ul>
        )}
    </div>
  );
};

export default Menu