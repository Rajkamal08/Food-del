import React from 'react';
import './Navbar.css';
import { assets } from "../../assets/assets";
import { Sparkles, Shield } from 'lucide-react';

const Navbar = () => {
    return (
        <div className='navbar'>
            <div className='navbar__brand'>
                <span className='navbar__brand-icon'>
                    <Sparkles size={16} fill="currentColor" />
                </span>
                <span className='navbar__brand-text'>
                    Feast<span className='navbar__brand-highlight'>Flow</span>
                    <span className='navbar__brand-badge'>
                        <Shield size={10} />
                        <span>Admin</span>
                    </span>
                </span>
            </div>
            
            <div className='navbar__profile-wrap'>
                <div className='navbar__profile-status' />
                <img className="profile" src={assets.profile_image} alt="Admin profile" />
            </div>
        </div>
    );
};

export default Navbar;
