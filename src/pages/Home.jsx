import React, { useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, getDocs } from 'firebase/firestore';

const Home = () => {
  useEffect(() => {
    const testFirebase = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'test'));
        querySnapshot.forEach((doc) => {
          console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
        });
      } catch (error) {
        console.error('Error fetching test collection:', error);
      }
    };
    testFirebase();
  }, []);

  return (
    <div>
      <h1>Bienvenido a Fuaaa Menu App</h1>
      <p>Explora nuestro menú y realiza tu pedido.</p>
      <p>Revisa la consola para ver la conexión con Firebase.</p>
    </div>
  );
};

export default Home;