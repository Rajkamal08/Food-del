import React, { useContext, useState, useEffect } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext.jsx';
import { 
  Sparkles, 
  MapPin, 
  ChevronDown, 
  Search, 
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
    const { token, setToken, searchQuery, setSearchQuery, isDarkMode, setIsDarkMode, cartItems } = useContext(StoreContext);
    const navigate = useNavigate();
    const location = useLocation();

    // Total cart item count
    const cartCount = Object.values(cartItems).reduce((a, b) => a + b, 0);

    // Scroll effect for glassmorphism and shadow
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => { setMobileOpen(false); }, [location]);

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('cartItems');
        setToken('');
        navigate('/');
    };

    const handleAnchorClick = (e, href) => {
        if (location.pathname !== '/') {
            e.preventDefault();
            navigate('/');
            setTimeout(() => {
                const element = document.querySelector(href);
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    };

    const navLinks = [
        { label: 'Home', to: '/', type: 'link' },
        { label: 'Dishes', href: '#explore-menu', type: 'anchor' },
        { label: 'Restaurants', href: '#explore-menu', type: 'anchor' },
        { label: 'Offers', href: '#explore-menu', type: 'anchor' },
        { label: 'Track Order', to: '/myorders', type: 'link' },
    ];

    return (
        <>
            <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
                <div className='navbar__container container'>
                    {/* Brand Logo */}
                    <Link to='/' className='navbar__brand'>
                        <span className='navbar__brand-icon'>
                            <Sparkles size={16} fill="currentColor" />
                        </span>
                        <span className='navbar__brand-text'>
                            Feast<span className='navbar__brand-highlight'>Flow</span>
                        </span>
                    </Link>

                    {/* Location Selector */}
                    <div className='navbar__location' title='Select Location'>
                        <MapPin size={16} className='navbar__location-pin' />
                        <span className='navbar__location-name'>Bangalore, Koramangala</span>
                        <ChevronDown size={12} className='navbar__location-arrow' />
                    </div>

                    {/* Search Bar Input */}
                    <div className='navbar__search'>
                        <Search size={16} className='navbar__search-icon' />
                        <input
                            type='text'
                            placeholder='Search dishes...'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            aria-label='Search food'
                        />
                    </div>

                    {/* Desktop nav links */}
                    <ul className='navbar__links'>
                        {navLinks.map((link) =>
                            link.type === 'link' ? (
                                <li key={link.label}>
                                    <Link
                                        to={link.to}
                                        className={location.pathname === link.to ? 'active' : ''}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ) : (
                                <li key={link.label}>
                                    <a 
                                        href={link.href}
                                        onClick={(e) => handleAnchorClick(e, link.href)}
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
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            title='Toggle theme'
                            aria-label='Toggle theme'
                        >
                            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                        </button>

                        {/* Offers/Gift button */}
                        <Link to='/' className='navbar__icon-btn' title='Offers'>
                            <Gift size={18} />
                        </Link>

                        {/* Notification Bell */}
                        <button className='navbar__icon-btn navbar__bell-btn' title='Notifications'>
                            <Bell size={18} />
                            <span className='navbar__bell-dot' />
                        </button>

                        {/* Favorites */}
                        <Link to='/' className='navbar__icon-btn' title='Favorites'>
                            <Heart size={18} />
                        </Link>

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
                            <div className='navbar__profile'>
                                <div className='navbar__profile-trigger'>
                                    <User size={18} />
                                </div>
                                <ul className='navbar__dropdown'>
                                    <li className='navbar__dropdown-header'>
                                        <p className='navbar__dropdown-title'>Welcome Back!</p>
                                        <p className='navbar__dropdown-subtitle'>Happy Dining</p>
                                    </li>
                                    <hr />
                                    <li onClick={() => navigate('/myorders')}>
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
                                <Link key={link.label} to={link.to} onClick={() => setMobileOpen(false)}>
                                    {link.label}
                                </Link>
                            ) : (
                                <a 
                                    key={link.label} 
                                    href={link.href} 
                                    onClick={(e) => {
                                        handleAnchorClick(e, link.href);
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
