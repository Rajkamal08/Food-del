import React, { useState } from 'react';
import './Footer.css';
import { assets } from '../../assets/assets';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email) { setSubscribed(true); setEmail(''); }
    };

    return (
        <footer className='footer' id='footer'>
            <div className='footer__inner container'>
                <div className='footer__top'>
                    {/* Brand */}
                    <div className='footer__brand'>
                        <div className='navbar__brand'>
                            <span className='navbar__brand-icon'>🍕</span>
                            <span className='navbar__brand-text' style={{ color: '#fff' }}>
                                Feast<span className='navbar__brand-highlight'>Flow</span>
                            </span>
                        </div>
                        <p className='footer__brand-desc'>
                            Fresh ingredients, expert chefs, and lightning-fast delivery to your doorstep.
                        </p>
                        <div className='footer__socials'>
                            <a href='#' aria-label='Facebook' className='footer__social-btn'>
                                <img src={assets.facebook_icon} alt='Facebook' />
                            </a>
                            <a href='#' aria-label='Twitter' className='footer__social-btn'>
                                <img src={assets.twitter_icon} alt='Twitter' />
                            </a>
                            <a href='#' aria-label='LinkedIn' className='footer__social-btn'>
                                <img src={assets.linkedin_icon} alt='LinkedIn' />
                            </a>
                        </div>
                    </div>

                    {/* Company */}
                    <div className='footer__col'>
                        <h4>Links</h4>
                        <ul>
                            <li><a href='/'>Home</a></li>
                            <li><a href='#explore-menu'>Menu</a></li>
                            <li><a href='/myorders'>Track Orders</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className='footer__col'>
                        <h4>Contact</h4>
                        <ul>
                            <li>✉️ support@feastflow.com</li>
                            <li>📞 +91-7836390903</li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className='footer__newsletter'>
                        <h4>Newsletter</h4>
                        {subscribed ? (
                            <div className='footer__subscribed'>
                                🎉 Subscribed!
                            </div>
                        ) : (
                            <form className='footer__newsletter-form' onSubmit={handleSubscribe}>
                                <input
                                    type='email'
                                    placeholder='your@email.com'
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    aria-label='Email for newsletter'
                                />
                                <button type='submit'>Subscribe</button>
                            </form>
                        )}
                    </div>
                </div>

                <div className='footer__divider' />

                <div className='footer__bottom'>
                    <p>© 2026 FeastFlow. All Rights Reserved.</p>
                    <div className='footer__bottom-links'>
                        <a href='#'>Privacy Policy</a>
                        <a href='#'>Terms of Use</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
