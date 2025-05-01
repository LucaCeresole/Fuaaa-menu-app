import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Menu from './pages/Menu';
import OrderConfirmation from './pages/OrderConfirmation';
import OrdersDashboard from './pages/OrdersDashboard';
import './App.css';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
        <Route path="/orders-dashboard" element={<OrdersDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;