import React, { createContext, useContext, useState, useCallback } from 'react';
import './Toast.css';

const ToastContext = createContext(null);

export const useToast = () => useContext(ToastContext);

const ICONS = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'success', duration = 3000) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
    }, []);

    const remove = (id) => setToasts(prev => prev.filter(t => t.id !== id));

    return (
        <ToastContext.Provider value={showToast}>
            {children}
            <div className='toast-container' aria-live='polite'>
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`toast toast--${toast.type}`}
                        onClick={() => remove(toast.id)}
                        role='alert'
                    >
                        <span className='toast__icon'>{ICONS[toast.type]}</span>
                        <span className='toast__message'>{toast.message}</span>
                        <button className='toast__close' aria-label='Dismiss'>×</button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
