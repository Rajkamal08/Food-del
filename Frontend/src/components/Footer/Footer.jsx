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
            <div className='footer__inner'>
                <div className='footer__top'>
                    {/* Brand */}
                    <div className='footer__brand'>
                        <img src={assets.logo} alt='FoodDel' className='footer__logo' />
                        <p className='footer__brand-desc'>
                            Delivering happiness to your doorstep since 2024. Fresh ingredients,
                            expert chefs, and lightning-fast delivery — every single time.
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
                        <h4>Company</h4>
                        <ul>
                            <li><a href='/'>Home</a></li>
                            <li><a href='#explore-menu'>Menu</a></li>
                            <li><a href='#'>About Us</a></li>
                            <li><a href='#'>Careers</a></li>
                            <li><a href='#'>Privacy Policy</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className='footer__col'>
                        <h4>Get In Touch</h4>
                        <ul>
                            <li>📞 +91-7836390903</li>
                            <li>✉️ support@fooddel.com</li>
                            <li>📍 Mumbai, India</li>
                            <li>🕐 24/7 Support</li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className='footer__newsletter'>
                        <h4>Stay Updated 🍕</h4>
                        <p>Get exclusive deals and new dish alerts straight to your inbox.</p>
                        {subscribed ? (
                            <div className='footer__subscribed'>
                                ✅ You're subscribed! Welcome aboard.
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
                    <p>© 2024 FoodDel — All Rights Reserved. Made with ❤️ in India.</p>
                    <div className='footer__bottom-links'>
                        <a href='#'>Terms</a>
                        <a href='#'>Privacy</a>
                        <a href='#'>Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
