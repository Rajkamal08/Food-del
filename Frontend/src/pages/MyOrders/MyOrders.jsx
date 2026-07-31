import React, { useState, useContext, useEffect } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../context/StoreContext.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const STATUS_STEPS = ['Order Placed', 'Processing', 'Out for Delivery', 'Delivered'];

const STATUS_MAP = {
    'Food Processing':    { step: 1, color: '#f59e0b', icon: '👨‍🍳' },
    'Out for Delivery':   { step: 2, color: '#3b82f6', icon: '🛵' },
    'Delivered':          { step: 3, color: '#22c55e', icon: '✅' },
};

const getStatus = (status) => STATUS_MAP[status] || { step: 0, color: '#9ca3af', icon: '📋' };

const SkeletonOrder = () => (
    <div className='my-orders__skeleton'>
        <div className='skeleton my-orders__skeleton-img' />
        <div className='my-orders__skeleton-body'>
            <div className='skeleton my-orders__skeleton-line my-orders__skeleton-line--title' />
            <div className='skeleton my-orders__skeleton-line' />
            <div className='skeleton my-orders__skeleton-line my-orders__skeleton-line--short' />
        </div>
    </div>
);

const MyOrders = () => {
    const { url, token } = useContext(StoreContext);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchOrders = async () => {
        try {
            const response = await axios.post(url + '/api/order/userorders', {}, { headers: { token } });
            setData(response.data.data);
        } catch (err) {
            console.error('Failed to fetch orders:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchOrders();
        else { setLoading(false); }
    }, [token]);

    return (
        <div className='my-orders'>
            <div className='my-orders__header'>
                <h1>My Orders 📦</h1>
                <button className='my-orders__refresh' onClick={fetchOrders}>
                    🔄 Refresh
                </button>
            </div>

            {/* Loading */}
            {loading && (
                <div className='my-orders__list'>
                    {[1,2,3].map(i => <SkeletonOrder key={i} />)}
                </div>
            )}

            {/* Empty */}
            {!loading && data.length === 0 && (
                <div className='my-orders__empty'>
                    <div className='my-orders__empty-icon'>📦</div>
                    <h2>No orders yet</h2>
                    <p>You haven't placed any orders. Start exploring our menu!</p>
                    <button onClick={() => navigate('/')} className='my-orders__empty-btn'>
                        Browse Menu →
                    </button>
                </div>
            )}

            {/* Orders */}
            {!loading && data.length > 0 && (
                <div className='my-orders__list'>
                    {data.map((order, index) => {
                        const st = getStatus(order.status);
                        return (
                            <div key={index} className='my-orders__card'>
                                {/* Header */}
                                <div className='my-orders__card-header'>
                                    <div className='my-orders__order-icon'>{st.icon}</div>
                                    <div className='my-orders__order-meta'>
                                        <p className='my-orders__order-id'>Order #{String(index + 1).padStart(4, '0')}</p>
                                        <p className='my-orders__order-items'>
                                            {order.items.map(i => `${i.name} × ${i.quantity}`).join(' · ')}
                                        </p>
                                    </div>
                                    <div className='my-orders__order-right'>
                                        <p className='my-orders__order-amount'>₹{order.amount}</p>
                                        <span
                                            className='my-orders__status-badge'
                                            style={{ background: st.color + '20', color: st.color, border: `1px solid ${st.color}40` }}
                                        >
                                            {order.status || 'Order Placed'}
                                        </span>
                                    </div>
                                </div>

                                {/* Progress timeline */}
                                <div className='my-orders__timeline'>
                                    {STATUS_STEPS.map((step, i) => (
                                        <React.Fragment key={step}>
                                            <div className={`my-orders__step ${i <= st.step ? 'active' : ''}`}>
                                                <div className='my-orders__step-dot'>
                                                    {i <= st.step ? '✓' : i + 1}
                                                </div>
                                                <span className='my-orders__step-label'>{step}</span>
                                            </div>
                                            {i < STATUS_STEPS.length - 1 && (
                                                <div className={`my-orders__step-line ${i < st.step ? 'active' : ''}`} />
                                            )}
                                        </React.Fragment>
                                    ))}
                                </div>

                                <div className='my-orders__card-footer'>
                                    <span>Items: {order.items.length}</span>
                                    <button className='my-orders__track-btn' onClick={fetchOrders}>
                                        🔄 Track Order
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyOrders;
