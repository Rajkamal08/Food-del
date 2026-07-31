import React, { useContext, useState, useEffect } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext.jsx';

const Navbar = ({ setShowLogin }) => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { token, setToken, searchQuery, setSearchQuery, isDarkMode, setIsDarkMode, cartItems } = useContext(StoreContext);
    const navigate = useNavigate();
    const location = useLocation();

    // Total cart item count
    const cartCount = Object.values(cartItems).reduce((a, b) => a + b, 0);

    // Scroll effect for glassmorphism
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
        { label: 'Dishes Menu', href: '#explore-menu', type: 'anchor' },
        { label: 'AI Recommender', href: '#food-display', type: 'anchor' },
        { label: 'Track Orders', to: '/myorders', type: 'link' },
    ];

    return (
        <>
            <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
                <div className='navbar__container container'>
                    {/* CSS Brand Logo */}
                    <Link to='/' className='navbar__brand'>
                        <span className='navbar__brand-icon'>🍕</span>
                        <span className='navbar__brand-text'>
                            Feast<span className='navbar__brand-highlight'>Flow</span>
                        </span>
                    </Link>

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
                            title='Toggle dark mode'
                            aria-label='Toggle dark mode'
                        >
                            {isDarkMode ? '☀️' : '🌙'}
                        </button>

                        {/* Search bar */}
                        <div className='navbar__search'>
                            <img src={assets.search_icon} alt='search' className='navbar__search-icon' />
                            <input
                                type='text'
                                placeholder='Search dishes...'
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                aria-label='Search food'
                            />
                        </div>

                        {/* Cart */}
                        <Link to='/cart' className='navbar__cart' aria-label='Cart'>
                            <img src={assets.basket_icon} alt='cart' />
                            {cartCount > 0 && (
                                <span className='navbar__cart-badge'>{cartCount}</span>
                            )}
                        </Link>

                        {/* Auth */}
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
                                    <img src={assets.profile_icon} alt='profile' />
                                </div>
                                <ul className='navbar__dropdown'>
                                    <li className='navbar__dropdown-header'>
                                        <p className='navbar__dropdown-title'>Welcome Back!</p>
                                        <p className='navbar__dropdown-subtitle'>Happy Dining</p>
                                    </li>
                                    <hr />
                                    <li onClick={() => navigate('/myorders')}>
                                        <img src={assets.bag_icon} alt='' />
                                        <span>My Orders</span>
                                    </li>
                                    <hr />
                                    <li onClick={logout} className='navbar__dropdown-logout'>
                                        <img src={assets.logout_icon} alt='' />
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
                            <span className='navbar__brand-icon'>🍕</span>
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
