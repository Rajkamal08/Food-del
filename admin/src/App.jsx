import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Routes, Route } from 'react-router-dom'
import Orders from './pages/Orders/Orders'
import List from './pages/List/List'
import Add from './pages/Add/Add'
import Login from './pages/Login/Login'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  const url = "https://food-del-backend-fsk9.onrender.com"
  const [adminToken, setAdminToken] = useState("");

  useEffect(() => {
    // Restore token on reload
    const token = localStorage.getItem("adminToken");
    if (token) {
      setAdminToken(token);
    }
  }, []);

  return (
    <div>
      <ToastContainer />
      {adminToken === "" ? (
        <Login setAdminToken={setAdminToken} url={url} />
      ) : (
        <>
          <Navbar setAdminToken={setAdminToken} />
          <hr />
          <div className='app-content'>
            <Sidebar />
            <Routes>
              <Route path="/add" element={<Add url={url} adminToken={adminToken} />} />
              <Route path="/list" element={<List url={url} adminToken={adminToken} />} />
              <Route path="/orders" element={<Orders url={url} adminToken={adminToken} />} />
            </Routes>
          </div>
        </>
      )}
    </div>
  )
}

export default App
