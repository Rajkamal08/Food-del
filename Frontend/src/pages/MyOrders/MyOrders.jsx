import React, { useState, useContext, useEffect, useMemo } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../context/StoreContext.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../components/Toast/Toast.jsx';
import { 
  Package, 
  RefreshCw, 
  ChevronRight, 
  Download, 
  Calendar, 
  RotateCcw,
  CheckCircle2,
  Clock,
  MapPin,
  Truck
} from 'lucide-react';

const STATUS_STEPS = ['Order Placed', 'Processing', 'Out for Delivery', 'Delivered'];

const STATUS_MAP = {
    'Food Processing':    { step: 1, color: '#f59e0b', icon: Clock },
    'Out for Delivery':   { step: 2, color: '#3b82f6', icon: Truck },
    'Delivered':          { step: 3, color: '#22c55e', icon: CheckCircle2 },
};

const getStatus = (status) => STATUS_MAP[status] || { step: 0, color: '#ff6b35', icon: Package };

const SkeletonOrder = () => (
    <div className='my-orders__skeleton'>
        <div className='my-orders__skeleton-header'>
            <div className='skeleton my-orders__skeleton-icon' />
            <div className='my-orders__skeleton-meta'>
                <div className='skeleton my-orders__skeleton-line my-orders__skeleton-line--title' />
                <div className='skeleton my-orders__skeleton-line' />
            </div>
            <div className='skeleton my-orders__skeleton-badge' />
        </div>
        <div className='my-orders__skeleton-timeline'>
            <div className='skeleton my-orders__skeleton-timeline-inner' />
        </div>
    </div>
);

const MyOrders = () => {
    const { url, token, addToCart } = useContext(StoreContext);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const showToast = useToast();

    const fetchOrders = async () => {
        try {
            const response = await axios.post(url + '/api/order/userorders', {}, { headers: { token } });
            // Sort by latest order first
            const sortedData = (response.data.data || []).reverse();
            setData(sortedData);
        } catch (err) {
            console.error('Failed to fetch orders:', err);
            showToast('Failed to load your orders. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleReorder = (items) => {
        items.forEach(item => {
            addToCart(item.id || item._id);
        });
        showToast('All items added to cart! Redirecting...', 'success');
        navigate('/cart');
    };

    useEffect(() => {
        if (token) fetchOrders();
        else { setLoading(false); }
    }, [token]);

    return (
        <div className='my-orders'>
            <div className='my-orders__header-row'>
                <div className='my-orders__title-group'>
                    <Package size={24} className='my-orders__title-icon' />
                    <h1 className='my-orders__title'>Order History</h1>
                </div>
                <button className='my-orders__refresh-btn' onClick={fetchOrders}>
                    <RefreshCw size={14} />
                    <span>Refresh</span>
                </button>
            </div>

            {/* Loading Skeletons */}
            {loading && (
                <div className='my-orders__list'>
                    {[1, 2, 3].map(i => <SkeletonOrder key={i} />)}
                </div>
            )}

            {/* Empty state SVG illustration */}
            {!loading && data.length === 0 && (
                <div className='my-orders__empty'>
                    <div className='my-orders__empty-graphic'>
                        <svg width="140" height="140" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="70" cy="70" r="60" stroke="var(--border)" strokeWidth="4" strokeDasharray="8 8" />
                            <path d="M40 50L70 30L100 50L100 95C100 100.523 95.5228 105 90 105H50C44.4772 105 40 100.523 40 95V50Z" fill="var(--bg-secondary)" stroke="var(--text-muted)" strokeWidth="4" />
                            <path d="M40 50H100" stroke="var(--text-muted)" strokeWidth="4" />
                            <path d="M70 30V105" stroke="var(--text-muted)" strokeWidth="2" strokeDasharray="4 4" />
                            <circle cx="70" cy="65" r="12" fill="var(--border)" stroke="var(--text-muted)" strokeWidth="3" />
                            <path d="M66 65L74 65" stroke="var(--text)" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                    </div>
                    <h2>No orders placed yet</h2>
                    <p>Looks like you haven't ordered any meals yet. Explore our delicious menu today!</p>
                    <button onClick={() => navigate('/')} className='my-orders__empty-btn'>
                        Order Now
                    </button>
                </div>
            )}

            {/* Orders List */}
            {!loading && data.length > 0 && (
                <div className='my-orders__list'>
                    {data.map((order, index) => {
                        const st = getStatus(order.status);
                        const StatusIcon = st.icon;
                        
                        // Fake purchase date for presentation
                        const orderDate = new Date(Date.now() - (index * 24 * 60 * 60 * 1000)).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                        });

                        return (
                            <div key={index} className='my-orders__card'>
                                {/* Header section */}
                                <div className='my-orders__card-header'>
                                    <div className='my-orders__card-meta'>
                                        <div className='my-orders__id-row'>
                                            <span className='my-orders__id'>Order #{String(data.length - index).padStart(4, '0')}</span>
                                            <span className='my-orders__date-wrap'>
                                                <Calendar size={12} />
                                                <span>{orderDate}</span>
                                            </span>
                                        </div>
                                        <p className='my-orders__items-list-text'>
                                            {order.items.map(i => `${i.name} × ${i.quantity}`).join(' · ')}
                                        </p>
                                    </div>
                                    
                                    <div className='my-orders__card-header-right'>
                                        <span className='my-orders__amount'>₹{order.amount}</span>
                                        <span
                                            className='my-orders__status-badge'
                                            style={{ background: st.color + '12', color: st.color, borderColor: st.color + '30' }}
                                        >
                                            <StatusIcon size={12} className='status-icon' />
                                            <span>{order.status || 'Order Placed'}</span>
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

                                {/* Actions footer */}
                                <div className='my-orders__card-footer'>
                                    <span className='my-orders__items-count'>Total items: {order.items.length}</span>
                                    <div className='my-orders__actions-group'>
                                        <button className='my-orders__reorder-btn' onClick={() => handleReorder(order.items)}>
                                            <RotateCcw size={13} />
                                            <span>Reorder Items</span>
                                        </button>
                                        <button className='my-orders__invoice-btn' onClick={() => showToast('Invoice download started...', 'success')}>
                                            <Download size={13} />
                                            <span>Invoice</span>
                                        </button>
                                        <button className='my-orders__track-action-btn' onClick={fetchOrders}>
                                            <span>Track Live</span>
                                            <ChevronRight size={13} />
                                        </button>
                                    </div>
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
