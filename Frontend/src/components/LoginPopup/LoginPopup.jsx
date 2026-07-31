import React, { useContext, useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext.jsx';
import { useToast } from '../Toast/Toast.jsx';
import axios from 'axios';

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
                        <h2 className='login-popup__title'>{currState === 'Login' ? 'Welcome Back 👋' : 'Create Account 🎉'}</h2>
                        <p className='login-popup__subtitle'>
                            {currState === 'Login' ? 'Sign in to continue ordering' : 'Join thousands of food lovers'}
                        </p>
                    </div>
                    <button
                        type='button'
                        className='login-popup__close'
                        onClick={() => setShowLogin(false)}
                        aria-label='Close'
                    >
                        ×
                    </button>
                </div>

                {/* Fields */}
                <div className='login-popup__fields'>
                    {currState === 'Sign Up' && (
                        <div className='login-popup__field'>
                            <label>Full Name</label>
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
                    )}
                    <div className='login-popup__field'>
                        <label>Email Address</label>
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
                    <div className='login-popup__field'>
                        <label>Password</label>
                        <div className='login-popup__pass-wrap'>
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
                                className='login-popup__eye'
                                onClick={() => setShowPass(!showPass)}
                                aria-label={showPass ? 'Hide password' : 'Show password'}
                            >
                                {showPass ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Terms */}
                <label className='login-popup__terms'>
                    <input type='checkbox' required />
                    <span>I agree to the <a href='#'>Terms of Service</a> and <a href='#'>Privacy Policy</a></span>
                </label>

                {/* Submit */}
                <button type='submit' className='login-popup__submit' disabled={loading}>
                    {loading ? <span className='login-popup__spinner' /> : null}
                    {loading ? 'Please wait...' : currState === 'Login' ? 'Sign In' : 'Create Account'}
                </button>

                {/* Switch */}
                <p className='login-popup__switch'>
                    {currState === 'Login' ? (
                        <>Don&apos;t have an account? <span onClick={() => setCurrState('Sign Up')}>Sign Up</span></>
                    ) : (
                        <>Already have an account? <span onClick={() => setCurrState('Login')}>Sign In</span></>
                    )}
                </p>
            </form>
        </div>
    );
};

export default LoginPopup;
