import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Sparkles, Mail, Lock, LogIn } from 'lucide-react';

const Login = ({ setAdminToken, url }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${url}/api/user/login`, {
        email,
        password
      });

      if (response.data.success) {
        // Assume the backend login was successful.
        // We set the token here. The backend routes (`/add`, `/list`)
        // are protected by `adminAuth` middleware which explicitly checks
        // if this token belongs to a user with role === "Admin".
        setAdminToken(response.data.token);
        localStorage.setItem("adminToken", response.data.token);
        toast.success("Welcome back to the Admin Dashboard!");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='login-page'>
      <div className='login-card'>
        <div className='login-header'>
          <div className='login-logo'>
            <Sparkles size={28} className='login-icon' fill="currentColor" />
          </div>
          <h2>Admin Portal</h2>
          <p>Sign in to manage FeastFlow operations.</p>
        </div>

        <form onSubmit={onSubmitHandler} className='login-form'>
          <div className='login-field'>
            <label>Email Address</label>
            <div className='login-input-wrap'>
              <Mail size={16} className='input-icon' />
              <input
                type='email'
                placeholder='admin@feastflow.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className='login-field'>
            <label>Password</label>
            <div className='login-input-wrap'>
              <Lock size={16} className='input-icon' />
              <input
                type='password'
                placeholder='••••••••'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type='submit' className='login-submit' disabled={loading}>
            {loading ? <div className='login-spinner' /> : <><LogIn size={18} /> Secure Login</>}
          </button>
        </form>

        <div className='login-footer'>
          <p>Secured by FeastFlow RBAC</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
