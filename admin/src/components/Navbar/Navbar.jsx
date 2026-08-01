import React from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Sparkles, ShieldCheck, LogOut } from 'lucide-react';

const Navbar = ({ setAdminToken }) => {
  const logout = () => {
    localStorage.removeItem("adminToken");
    setAdminToken("");
  };

  return (
    <div className='navbar'>
      <div className='navbar__brand'>
        <div className='navbar__brand-icon'>
          <Sparkles size={22} fill="currentColor" />
        </div>
        <h1 className='navbar__brand-text'>
          FeastFlow <span className='navbar__brand-highlight'>Admin</span>
        </h1>
        <span className='navbar__brand-badge'>
          <ShieldCheck size={10} /> Secure
        </span>
      </div>

      <div className='navbar__actions'>
        <button onClick={logout} className='navbar__logout-btn'>
          <LogOut size={16} /> Logout
        </button>
        <div className='navbar__profile-wrap'>
          <img className='profile' src={assets.profile_image} alt="Admin Profile" />
          <div className='navbar__profile-status'></div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
