import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { db } from './services/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Menu from './pages/Menu';
import OrderConfirmation from './pages/OrderConfirmation';
import './App.css';

const App = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'test'));
        querySnapshot.forEach(doc => {
          console.log(`${doc.id} =>`, doc.data());
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
      </Routes>
    </Router>
  );
};

export default App;