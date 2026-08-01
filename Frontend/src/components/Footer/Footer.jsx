import React, { useState } from 'react';
import './Footer.css';
import { assets } from '../../assets/assets';
import { 
  Sparkles, 
  Globe, 
  ChevronDown,
  Mail,
  Share2
} from 'lucide-react';

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
                {/* Top Section */}
                <div className='footer__top'>
                    {/* Brand column */}
                    <div className='footer__brand'>
                        <div className='navbar__brand'>
                            <span className='navbar__brand-icon'>
                                <Sparkles size={14} fill="currentColor" />
                            </span>
                            <span className='navbar__brand-text' style={{ color: '#ffffff' }}>
                                Feast<span className='navbar__brand-highlight'>Flow</span>
                            </span>
                        </div>
                        <p className='footer__brand-desc'>
                            Fresh ingredients, expert chefs, and lightning-fast delivery to your doorstep. Satisfying your cravings since 2026.
                        </p>
                        <div className='footer__socials'>
                            <a href='#' aria-label='Share' className='footer__social-btn'>
                                <Share2 size={15} />
                            </a>
                            <a href='#' aria-label='Website' className='footer__social-btn'>
                                <Globe size={15} />
                            </a>
                            <a href='#' aria-label='Email' className='footer__social-btn'>
                                <Mail size={15} />
                            </a>
                        </div>
                    </div>

                    {/* Links Column 1: Company */}
                    <div className='footer__col'>
                        <h4>Company</h4>
                        <ul>
                            <li><a href='#'>About Us</a></li>
                            <li><a href='#'>Careers</a></li>
                            <li><a href='#'>Blog</a></li>
                            <li><a href='#'>Help Center</a></li>
                        </ul>
                    </div>

                    {/* Links Column 2: Legal */}
                    <div className='footer__col'>
                        <h4>Legal</h4>
                        <ul>
                            <li><a href='#'>Terms of Service</a></li>
                            <li><a href='#'>Privacy Policy</a></li>
                            <li><a href='#'>Cookies Settings</a></li>
                        </ul>
                    </div>

                    {/* Newsletter and App Download */}
                    <div className='footer__newsletter'>
                        <h4>Stay Updated</h4>
                        {subscribed ? (
                            <div className='footer__subscribed'>
                                🎉 Subscribed!
                            </div>
                        ) : (
                            <form className='footer__newsletter-form' onSubmit={handleSubscribe}>
                                <div className='footer__newsletter-input-wrap'>
                                    <Mail size={13} className='mail-icon' />
                                    <input
                                        type='email'
                                        placeholder='your@email.com'
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                        aria-label='Email for newsletter'
                                    />
                                    <button type='submit'>Join</button>
                                </div>
                            </form>
                        )}
                        
                        {/* Compact Play Store / App Store graphics */}
                        <div className='footer__apps'>
                            <img src={assets.play_store} alt="Google Play Store" className='footer__app-img' />
                            <img src={assets.app_store} alt="Apple App Store" className='footer__app-img' />
                        </div>
                    </div>
                </div>

                <div className='footer__divider' />

                {/* Bottom Section */}
                <div className='footer__bottom'>
                    <p className='footer__copyright'>© 2026 FeastFlow Inc. All Rights Reserved.</p>
                    
                    {/* Country & Language selector mockups */}
                    <div className='footer__selectors'>
                        <div className='footer__selector' title='Select Country'>
                            <Globe size={13} />
                            <span>India</span>
                            <ChevronDown size={10} />
                        </div>
                        <div className='footer__selector' title='Select Language'>
                            <span>English</span>
                            <ChevronDown size={10} />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
