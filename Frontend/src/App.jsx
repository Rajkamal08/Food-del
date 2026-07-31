import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar/Navbar';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import Footer from './components/Footer/Footer';
import LoginPopup from './components/LoginPopup/LoginPopup';
import Verify from './pages/Verify/Verify';
import MyOrders from './pages/MyOrders/MyOrders';
import { ToastProvider } from './components/Toast/Toast.jsx';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [pathname]);
  return null;
};

const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <ToastProvider>
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      <div className='app'>
        <ScrollToTop />
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path='/'         element={<Home />} />
          <Route path='/cart'     element={<Cart />} />
          <Route path='/Cart'     element={<Cart />} />
          <Route path='/order'    element={<PlaceOrder />} />
          <Route path='/Order'    element={<PlaceOrder />} />
          <Route path='/verify'   element={<Verify />} />
          <Route path='/myorders' element={<MyOrders />} />
          <Route path='/myOrders' element={<MyOrders />} />
        </Routes>
      </div>
      <Footer />
    </ToastProvider>
  );
};

export default App;
