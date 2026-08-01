import React, { useContext, useState, useEffect, useRef } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext.jsx';
import { useToast } from '../Toast/Toast.jsx';
import { 
  Sparkles, 
  MapPin, 
  ChevronDown, 
  Heart, 
  Bell, 
  ShoppingBag, 
  User, 
  Sun, 
  Moon, 
  Gift 
} from 'lucide-react';

const Navbar = ({ setShowLogin }) => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const { token, setToken, searchQuery, setSearchQuery, isDarkMode, setIsDarkMode, cartItems } = useContext(StoreContext);
    const navigate = useNavigate();
    const location = useLocation();
    const showToast = useToast();

    // Total cart item count
    const cartCount = Object.values(cartItems).reduce((a, b) => a + b, 0);

    // Scroll effect for glassmorphism and shadow
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu and dropdown on route change
    useEffect(() => { 
        setMobileOpen(false); 
        setShowDropdown(false);
    }, [location]);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('cartItems');
        setToken('');
        setShowDropdown(false);
        showToast("Logged out successfully.", "info");
        navigate('/');
    };

    const handleHomeClick = (e) => {
        if (location.pathname === '/') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleAnchorClick = (e, href) => {
        e.preventDefault();
        const targetId = href.startsWith('#') ? href.slice(1) : href;
        
        if (location.pathname === '/') {
            const element = document.getElementById(targetId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            navigate('/');
            setTimeout(() => {
                const element = document.getElementById(targetId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 150);
        }
    };

    const handleOffersClick = (e) => {
        e.preventDefault();
        showToast("🎉 Check out our best promo offers below!", "success");
        handleAnchorClick(e, '#explore-menu');
    };

    const handleNotificationsClick = () => {
        showToast("🔔 You're all caught up! No new notifications.", "info");
    };

    const handleFavoritesClick = (e) => {
        e.preventDefault();
        const favs = JSON.parse(localStorage.getItem('favorites') || '{}');
        const count = Object.keys(favs).length;
        if (count === 0) {
            showToast("You haven't added any favorites yet! Click the heart icon on any food item.", "info");
        } else {
            showToast(`💖 You have ${count} favorite dish${count === 1 ? '' : 'es'}! Look for the red hearts on the menu.`, "success");
            handleAnchorClick(e, '#explore-menu');
        }
    };

    const navLinks = [
        { label: 'Home', to: '/', type: 'link', onClick: handleHomeClick },
        { label: 'Dishes', href: '#explore-menu', type: 'anchor', onClick: (e) => handleAnchorClick(e, '#explore-menu') },
        { label: 'Restaurants', href: '#explore-menu', type: 'anchor', onClick: (e) => handleAnchorClick(e, '#explore-menu') },
        { label: 'Offers', href: '#explore-menu', type: 'anchor', onClick: handleOffersClick },
        { label: 'Track Order', to: '/myorders', type: 'link' },
    ];

    return (
        <>
            <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
                <div className='navbar__container container'>
                    {/* Brand Logo */}
                    <Link to='/' className='navbar__brand' onClick={handleHomeClick}>
                        <span className='navbar__brand-icon'>
                            <Sparkles size={16} fill="currentColor" />
                        </span>
                        <span className='navbar__brand-text'>
                            Feast<span className='navbar__brand-highlight'>Flow</span>
                        </span>
                    </Link>

                    {/* Location Selector */}
                    <div className='navbar__location' title='Select Location' onClick={() => showToast("📍 Deliveries configured for Bangalore, Koramangala area.", "info")}>
                        <MapPin size={16} className='navbar__location-pin' />
                        <span className='navbar__location-name'>Bangalore, Koramangala</span>
                        <ChevronDown size={12} className='navbar__location-arrow' />
                    </div>

                    {/* Desktop nav links */}
                    <ul className='navbar__links'>
                        {navLinks.map((link) =>
                            link.type === 'link' ? (
                                <li key={link.label}>
                                    <Link
                                        to={link.to}
                                        className={location.pathname === link.to ? 'active' : ''}
                                        onClick={link.onClick}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ) : (
                                <li key={link.label}>
                                    <a 
                                        href={link.href}
                                        onClick={link.onClick}
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            )
                        )}
                    </ul>

                    {/* Right section */}
                    <div className='navbar__right'>
                        {/* Dark mode toggle */}
                        <button
                            className='navbar__icon-btn'
                            onClick={() => {
                                setIsDarkMode(!isDarkMode);
                                showToast(`🌙 Theme switched to ${!isDarkMode ? 'Dark' : 'Light'} Mode.`, "info");
                            }}
                            title='Toggle theme'
                            aria-label='Toggle theme'
                        >
                            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                        </button>

                        {/* Offers/Gift button */}
                        <button 
                            className='navbar__icon-btn' 
                            title='Offers' 
                            onClick={handleOffersClick}
                            style={{ border: 'none', cursor: 'pointer' }}
                        >
                            <Gift size={18} />
                        </button>

                        {/* Notification Bell */}
                        <button 
                            className='navbar__icon-btn navbar__bell-btn' 
                            title='Notifications' 
                            onClick={handleNotificationsClick}
                        >
                            <Bell size={18} />
                            <span className='navbar__bell-dot' />
                        </button>

                        {/* Favorites */}
                        <button 
                            className='navbar__icon-btn' 
                            title='Favorites' 
                            onClick={handleFavoritesClick}
                            style={{ border: 'none', cursor: 'pointer' }}
                        >
                            <Heart size={18} />
                        </button>

                        {/* Cart */}
                        <Link to='/cart' className='navbar__cart' aria-label='Cart'>
                            <ShoppingBag size={18} />
                            {cartCount > 0 && (
                                <span className='navbar__cart-badge'>{cartCount}</span>
                            )}
                        </Link>

                        {/* Auth / Profile */}
                        {!token ? (
                            <button
                                className='navbar__signin-btn'
                                onClick={() => setShowLogin(true)}
                            >
                                Sign In
                            </button>
                        ) : (
                            <div className='navbar__profile' ref={dropdownRef}>
                                <button 
                                    className='navbar__profile-trigger' 
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    aria-label='User Profile'
                                    style={{ border: 'none', cursor: 'pointer' }}
                                >
                                    <User size={18} />
                                </button>
                                <ul className={`navbar__dropdown ${showDropdown ? 'navbar__dropdown--show' : ''}`}>
                                    <li className='navbar__dropdown-header'>
                                        <p className='navbar__dropdown-title'>Welcome Back!</p>
                                        <p className='navbar__dropdown-subtitle'>Happy Dining</p>
                                    </li>
                                    <hr />
                                    <li onClick={() => { navigate('/myorders'); setShowDropdown(false); }}>
                                        <ShoppingBag size={14} />
                                        <span>My Orders</span>
                                    </li>
                                    <hr />
                                    <li onClick={logout} className='navbar__dropdown-logout'>
                                        <span>Logout</span>
                                    </li>
                                </ul>
                            </div>
                        )}

                        {/* Hamburger */}
                        <button
                            className={`navbar__hamburger ${mobileOpen ? 'open' : ''}`}
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label='Toggle menu'
                        >
                            <span /><span /><span />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile drawer */}
            {mobileOpen && (
                <div className='navbar__mobile-drawer' onClick={() => setMobileOpen(false)}>
                    <div className='navbar__mobile-menu' onClick={e => e.stopPropagation()}>
                        <div className='navbar__mobile-brand'>
                            <Sparkles size={18} className='navbar__brand-icon' />
                            <span className='navbar__brand-text'>Feast<span className='navbar__brand-highlight'>Flow</span></span>
                        </div>
                        {navLinks.map((link) =>
                            link.type === 'link' ? (
                                <Link key={link.label} to={link.to} onClick={(e) => {
                                    if (link.onClick) link.onClick(e);
                                    setMobileOpen(false);
                                }}>
                                    {link.label}
                                </Link>
                            ) : (
                                <a 
                                    key={link.label} 
                                    href={link.href} 
                                    onClick={(e) => {
                                        if (link.onClick) link.onClick(e);
                                        setMobileOpen(false);
                                    }}
                                >
                                    {link.label}
                                </a>
                            )
                        )}
                        {!token ? (
                            <button onClick={() => { setShowLogin(true); setMobileOpen(false); }}>
                                Sign In
                            </button>
                        ) : (
                            <>
                                <a onClick={() => { navigate('/myorders'); setMobileOpen(false); }}>My Orders</a>
                                <a onClick={() => { logout(); setMobileOpen(false); }} className='logout-link'>Logout</a>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
