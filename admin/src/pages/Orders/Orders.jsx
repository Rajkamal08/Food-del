import React, { useState, useEffect } from 'react';
import "./Orders.css";
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  Package, 
  Phone, 
  MapPin, 
  User, 
  Clock, 
  Sparkles, 
  ChevronRight 
} from 'lucide-react';

const Orders = ({ url, adminToken }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAllOrders = async () => {
        try {
            setLoading(true);
            const response = await axios.get(url + "/api/order/list", {
                headers: { token: adminToken }
            });
            if (response.data.success) {
                setOrders(response.data.data);
            } else {
                toast.error("Error fetching orders");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load orders list.");
        } finally {
            setLoading(false);
        }
    };

    const statusHandler = async (event, orderId) => {
        const newStatus = event.target.value;
        try {
            const response = await axios.post(url + "/api/order/status", {
                orderId,
                status: newStatus
            }, {
                headers: { token: adminToken }
            });

            if (response.data.success) {
                toast.success(`Order status updated to "${newStatus}"`);
                await fetchAllOrders();
            } else {
                toast.error("Failed to update status.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error updating order status.");
        }
    };

    useEffect(() => {
        fetchAllOrders();
    }, []);

    // Get color code based on order status
    const getStatusColor = (status) => {
        switch (status) {
            case "Food Processing": return { bg: 'rgba(245, 158, 11, 0.08)', text: '#f59e0b', border: 'rgba(245, 158, 11, 0.2)' };
            case "Out For Delivery": return { bg: 'rgba(59, 130, 246, 0.08)', text: '#3b82f6', border: 'rgba(59, 130, 246, 0.2)' };
            case "Delivered": return { bg: 'rgba(34, 197, 94, 0.08)', text: '#22c55e', border: 'rgba(34, 197, 94, 0.2)' };
            default: return { bg: 'rgba(100, 116, 139, 0.08)', text: '#64748b', border: 'rgba(100, 116, 139, 0.2)' };
        }
    };

    return (
        <div className='orders-panel'>
            <div className='orders-panel__header'>
                <div className='orders-panel__title-row'>
                    <Sparkles size={18} className='orders-panel__title-icon' fill="currentColor" />
                    <h2>Active Orders Manager</h2>
                </div>
                <p className='orders-panel__subtitle'>Monitor customer purchases, coordinate deliveries, and track cooking progress.</p>
                {!loading && (
                    <span className='orders-panel__count-badge'>{orders.length} Active Orders</span>
                )}
            </div>

            {loading ? (
                <div className='orders-panel__loading'>
                    <div className='spinner' />
                    <p>Fetching active orders...</p>
                </div>
            ) : orders.length === 0 ? (
                <div className='orders-panel__empty'>
                    <Package size={44} className='orders-panel__empty-icon' />
                    <h3>No orders placed yet</h3>
                    <p>When customers buy items on your site, their orders will appear here in real time!</p>
                </div>
            ) : (
                <div className="orders-panel__list">
                    {orders.map((order, index) => {
                        const statusStyle = getStatusColor(order.status);
                        return (
                            <div key={order._id || index} className="order-card">
                                {/* Parcel status header */}
                                <div className="order-card__icon-wrap">
                                    <Package size={22} className="order-card__parcel-icon" />
                                    <span 
                                        className="order-card__status-pill"
                                        style={{ 
                                            backgroundColor: statusStyle.bg, 
                                            color: statusStyle.text, 
                                            borderColor: statusStyle.border 
                                        }}
                                    >
                                        {order.status}
                                    </span>
                                </div>

                                {/* Order details */}
                                <div className="order-card__details">
                                    {/* Food items summary list */}
                                    <div className="order-card__food-box">
                                        <p className="order-card__food-list">
                                            {order.items.map((item, idx) => (
                                                <span key={idx} className='food-item-tag'>
                                                    {item.name} <strong className='food-qty'>x {item.quantity}</strong>
                                                    {idx < order.items.length - 1 ? ', ' : ''}
                                                </span>
                                            ))}
                                        </p>
                                    </div>

                                    {/* Customer info */}
                                    <div className='order-card__customer'>
                                        <h4 className='order-card__customer-name'>
                                            <User size={13} />
                                            <span>{order.address.firstName + " " + order.address.lastName}</span>
                                        </h4>
                                        
                                        <div className='order-card__address'>
                                            <MapPin size={13} />
                                            <p>
                                                <span>{order.address.street}, </span>
                                                <span>{order.address.city}, {order.address.state}, {order.address.country} - {order.address.zipcode}</span>
                                            </p>
                                        </div>

                                        <p className='order-card__phone'>
                                            <Phone size={13} />
                                            <span>{order.address.phone}</span>
                                        </p>
                                    </div>
                                </div>

                                {/* Summary metrics */}
                                <div className='order-card__summary'>
                                    <div className='summary-metric'>
                                        <span className='summary-metric-label'>Total Items</span>
                                        <span className='summary-metric-value'>{order.items.reduce((acc, curr) => acc + curr.quantity, 0)}</span>
                                    </div>
                                    <div className='summary-metric'>
                                        <span className='summary-metric-label'>Invoice Amount</span>
                                        <span className='summary-metric-value text-primary'>₹{order.amount}</span>
                                    </div>
                                </div>

                                {/* Action Select Status */}
                                <div className='order-card__actions'>
                                    <label className='select-label'>Update Status</label>
                                    <div className='select-wrapper'>
                                        <select 
                                            onChange={(event) => statusHandler(event, order._id)} 
                                            value={order.status}
                                            className='status-select'
                                        >
                                            <option value="Food Processing">Food Processing</option>
                                            <option value="Out For Delivery">Out For Delivery</option>
                                            <option value="Delivered">Delivered</option>
                                        </select>
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

export default Orders;
