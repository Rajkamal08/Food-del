import React, { useContext, useState, useMemo } from 'react';
import './LoginPopup.css';
import { StoreContext } from '../../context/StoreContext.jsx';
import { useToast } from '../Toast/Toast.jsx';
import axios from 'axios';
import { 
  Eye, 
  EyeOff, 
  User, 
  Mail, 
  Lock, 
  X, 
  ShieldCheck
} from 'lucide-react';

const LoginPopup = ({ setShowLogin }) => {
    const { url, setToken } = useContext(StoreContext);
    const showToast = useToast();

    const [currState, setCurrState] = useState('Login');
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [data, setData] = useState({ name: '', email: '', password: '' });

    const onChangeHandler = (e) => {
        setData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // Calculate password strength
    const passwordStrength = useMemo(() => {
        const pass = data.password;
        if (!pass) return { score: 0, text: '', color: '' };
        if (pass.length < 6) return { score: 1, text: 'Weak (min 6 chars)', color: '#ef4444' };
        
        // Simple strength check
        const hasLetters = /[a-zA-Z]/.test(pass);
        const hasNumbers = /[0-9]/.test(pass);
        const hasSpecial = /[^a-zA-Z0-9]/.test(pass);

        if (hasLetters && hasNumbers && hasSpecial && pass.length >= 8) {
            return { score: 3, text: 'Strong Secure Password', color: '#22c55e' };
        }
        return { score: 2, text: 'Medium Strength', color: '#f59e0b' };
    }, [data.password]);

    const onLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const endpoint = currState === 'Login' ? '/api/user/login' : '/api/user/register';
            const response = await axios.post(url + endpoint, data);
            if (response.data.success) {
                setToken(response.data.token);
                localStorage.setItem('token', response.data.token);
                setShowLogin(false);
                showToast(
                    currState === 'Sign Up' ? '🎉 Account created! Welcome aboard!' : '👋 Welcome back!',
                    'success'
                );
            } else {
                showToast(response.data.message, 'error');
            }
        } catch (err) {
            showToast('Something went wrong. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='login-popup' onClick={() => setShowLogin(false)}>
            <form
                className='login-popup__card'
                onSubmit={onLogin}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className='login-popup__header'>
                    <div>
                        <h2 className='login-popup__title'>{currState === 'Login' ? 'Welcome Back' : 'Create Account'}</h2>
                        <p className='login-popup__subtitle'>
                            {currState === 'Login' ? 'Sign in to continue ordering' : 'Join thousands of food lovers'}
                        </p>
                    </div>
                    <button
                        type='button'
                        className='login-popup__close-btn'
                        onClick={() => setShowLogin(false)}
                        aria-label='Close'
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Social Logins Mockup */}
                <div className='login-popup__socials'>
                    <button type='button' className='login-popup__social-btn' onClick={() => showToast('Google login simulated', 'info')}>
                        <img src="https://docs.kodular.io/guides/component-properties/google-sign-in/google-logo.png" alt="Google" className='social-logo' />
                        <span>Continue with Google</span>
                    </button>
                </div>

                <div className='login-popup__divider'>
                    <span className='line' />
                    <span className='text'>or</span>
                    <span className='line' />
                </div>

                {/* Fields */}
                <div className='login-popup__fields'>
                    {currState === 'Sign Up' && (
                        <div className='login-popup__field'>
                            <label>Full Name</label>
                            <div className='login-popup__input-wrap'>
                                <User size={15} className='input-icon' />
                                <input
                                    name='name'
                                    type='text'
                                    placeholder='John Doe'
                                    value={data.name}
                                    onChange={onChangeHandler}
                                    required
                                    autoComplete='name'
                                />
                            </div>
                        </div>
                    )}
                    
                    <div className='login-popup__field'>
                        <label>Email Address</label>
                        <div className='login-popup__input-wrap'>
                            <Mail size={15} className='input-icon' />
                            <input
                                name='email'
                                type='email'
                                placeholder='you@example.com'
                                value={data.email}
                                onChange={onChangeHandler}
                                required
                                autoComplete='email'
                            />
                        </div>
                    </div>

                    <div className='login-popup__field'>
                        <label>Password</label>
                        <div className='login-popup__input-wrap'>
                            <Lock size={15} className='input-icon' />
                            <input
                                name='password'
                                type={showPass ? 'text' : 'password'}
                                placeholder='Min. 6 characters'
                                value={data.password}
                                onChange={onChangeHandler}
                                required
                                minLength={6}
                                autoComplete={currState === 'Login' ? 'current-password' : 'new-password'}
                            />
                            <button
                                type='button'
                                className='login-popup__eye-btn'
                                onClick={() => setShowPass(!showPass)}
                                aria-label={showPass ? 'Hide password' : 'Show password'}
                            >
                                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                        </div>

                        {/* Password strength indicator */}
                        {data.password && currState === 'Sign Up' && (
                            <div className='login-popup__strength'>
                                <div className='strength-bar-bg'>
                                    <div 
                                        className='strength-bar-fill' 
                                        style={{ 
                                            width: `${(passwordStrength.score / 3) * 100}%`,
                                            backgroundColor: passwordStrength.color 
                                        }} 
                                    />
                                </div>
                                <span className='strength-text' style={{ color: passwordStrength.color }}>
                                    {passwordStrength.text}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Terms agreement */}
                <label className='login-popup__terms-checkbox'>
                    <input type='checkbox' required />
                    <span>I agree to the <a href='#'>Terms of Service</a> and <a href='#'>Privacy Policy</a></span>
                </label>

                {/* Submit action */}
                <button type='submit' className='login-popup__submit-btn' disabled={loading}>
                    {loading ? (
                        <span>Please wait...</span>
                    ) : (
                        <span>{currState === 'Login' ? 'Sign In' : 'Create Account'}</span>
                    )}
                </button>

                {/* Switch states link */}
                <p className='login-popup__switch-text'>
                    {currState === 'Login' ? (
                        <>Don&apos;t have an account? <span onClick={() => setCurrState('Sign Up')}>Sign Up</span></>
                    ) : (
                        <>Already have an account? <span onClick={() => setCurrState('Login')}>Sign In</span></>
                    )}
                </p>

                <div className='login-popup__secure-footer'>
                    <ShieldCheck size={12} />
                    <span>SSL Secure Authentication</span>
                </div>
            </form>
        </div>
    );
};

export default LoginPopup;
