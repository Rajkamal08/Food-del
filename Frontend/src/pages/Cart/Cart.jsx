import React, { useContext, useState, useMemo } from 'react';
import './Cart.css';
import { StoreContext } from '../../context/StoreContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../../components/Toast/Toast.jsx';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  Tag, 
  Percent, 
  Truck, 
  ArrowLeft, 
  ChevronRight, 
  FileText 
} from 'lucide-react';

const PROMO_CODES = { SAVE10: 0.10, FOODIE: 0.15, WELCOME20: 0.20 };
const FREE_DELIVERY_THRESHOLD = 300;

const Cart = () => {
    const { cartItems, food_list, removeFromCart, addToCart, getTotalCartAmount, url } = useContext(StoreContext);
    const navigate = useNavigate();
    const showToast = useToast();

    const [promoInput, setPromoInput] = useState('');
    const [appliedPromo, setAppliedPromo] = useState(null);
    const [promoError, setPromoError] = useState('');

    const cartFoodItems = useMemo(() => {
        return food_list.filter(item => (cartItems[item.id] ?? cartItems[item._id] ?? 0) > 0);
    }, [food_list, cartItems]);

    const subtotal = getTotalCartAmount();
    
    // Free delivery progress calculations
    const isFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;
    const progressPercent = Math.min((subtotal / FREE_DELIVERY_THRESHOLD) * 100, 100);
    const neededForFree = FREE_DELIVERY_THRESHOLD - subtotal;

    const deliveryFee = subtotal === 0 ? 0 : (isFreeDelivery ? 0 : 49);
    const discount = appliedPromo ? Math.round(subtotal * PROMO_CODES[appliedPromo]) : 0;
    
    // Taxes & Platform fees
    const platformFee = subtotal === 0 ? 0 : 5;
    const gstTax = subtotal === 0 ? 0 : Math.round(subtotal * 0.05); // 5% GST
    const total = subtotal + deliveryFee + platformFee + gstTax - discount;

    const applyPromo = () => {
        const code = promoInput.trim().toUpperCase();
        if (PROMO_CODES[code]) {
            setAppliedPromo(code);
            setPromoError('');
            showToast(`🎉 ${code} applied! ${(PROMO_CODES[code] * 100).toFixed(0)}% off`, 'success');
        } else {
            setPromoError('Invalid promo code');
            showToast('Invalid promo code. Try SAVE10, FOODIE, or WELCOME20', 'error');
        }
    };

    const handleRemoveAllQty = (itemId, name) => {
        const qty = cartItems[itemId] || 0;
        for (let i = 0; i < qty; i++) {
            removeFromCart(itemId);
        }
        showToast(`Removed all ${name} from cart`, 'info');
    };

    if (cartFoodItems.length === 0) {
        return (
            <div className='cart cart--empty'>
                <div className='cart__empty-graphic'>
                    <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="80" cy="80" r="70" stroke="var(--border)" strokeWidth="4" strokeDasharray="8 8" />
                        <path d="M45 60H115L105 110H55L45 60Z" fill="var(--bg-secondary)" stroke="var(--text-muted)" strokeWidth="4" strokeLinejoin="round" />
                        <circle cx="65" cy="125" r="8" fill="var(--text-muted)" />
                        <circle cx="95" cy="125" r="8" fill="var(--text-muted)" />
                        <path d="M45 60L55 35H105L115 60" stroke="var(--text-muted)" strokeWidth="4" strokeLinecap="round" />
                        <path d="M72 75V95" stroke="var(--primary)" strokeWidth="4" strokeLinecap="round" />
                        <path d="M88 75V95" stroke="var(--primary)" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                </div>
                <h2>Your cart is empty</h2>
                <p>Add fresh dishes to your cart and experience lightning-fast delivery.</p>
                <Link to='/' className='cart__empty-btn'>Browse Our Menu</Link>
            </div>
        );
    }

    return (
        <div className='cart'>
            <div className='cart__title-row'>
                <h1 className='cart__title'>Shopping Cart</h1>
                <span className='cart__title-count'>{cartFoodItems.length} Item{cartFoodItems.length !== 1 ? 's' : ''}</span>
            </div>

            <div className='cart__layout'>
                {/* Items grid */}
                <div className='cart__items-container'>
                    {/* Free Delivery Banner */}
                    <div className='cart__delivery-progress-card'>
                        <div className='cart__progress-text-row'>
                            <div className='cart__progress-title-wrap'>
                                <Truck size={16} className={isFreeDelivery ? 'text-success' : 'text-primary'} />
                                <span className='cart__progress-title'>
                                    {isFreeDelivery 
                                        ? "🎉 You've unlocked FREE delivery!" 
                                        : `Add ₹${neededForFree} more for FREE delivery`}
                                </span>
                            </div>
                            <span className='cart__progress-value'>{isFreeDelivery ? '100%' : `${Math.round(progressPercent)}%`}</span>
                        </div>
                        <div className='cart__progress-bar-bg'>
                            <div className='cart__progress-bar-fill' style={{ width: `${progressPercent}%` }} />
                        </div>
                    </div>

                    <div className='cart__items-list'>
                        {cartFoodItems.map(item => {
                            const itemId = item.id || item._id;
                            const qty = cartItems[itemId] || 0;
                            const imgSrc = item.image?.startsWith('http')
                                ? item.image
                                : `${url}/images/${item.image}`;
                            return (
                                <div key={itemId} className='cart__item-card'>
                                    <div className='cart__item-img-wrap'>
                                        <img src={imgSrc} alt={item.name} className='cart__item-img' />
                                    </div>
                                    <div className='cart__item-info'>
                                        <div className='cart__item-header'>
                                            <h3 className='cart__item-name'>{item.name}</h3>
                                            <button 
                                                className='cart__item-delete-btn'
                                                onClick={() => handleRemoveAllQty(itemId, item.name)}
                                                title='Delete item'
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                        <p className='cart__item-category'>{item.category}</p>
                                        
                                        <div className='cart__item-footer'>
                                            <div className='cart__item-price-wrap'>
                                                <span className='cart__item-price-val'>₹{item.price}</span>
                                                <span className='cart__item-qty-total'>Total: ₹{item.price * qty}</span>
                                            </div>

                                            {/* Quantity modifier controls */}
                                            <div className='cart__qty-ctrl'>
                                                <button onClick={() => removeFromCart(itemId)} aria-label='Decrease quantity'>
                                                    <Minus size={12} />
                                                </button>
                                                <span className='cart__qty-val'>{qty}</span>
                                                <button onClick={() => addToCart(itemId)} aria-label='Increase quantity'>
                                                    <Plus size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <Link to='/' className='cart__continue-shopping-btn'>
                        <ArrowLeft size={14} />
                        <span>Continue Shopping</span>
                    </Link>
                </div>

                {/* Billing Summary Panel Card */}
                <div className='cart__summary-card'>
                    {/* Promo validation */}
                    <div className='cart__promo-section'>
                        <div className='cart__section-title-wrap'>
                            <Tag size={16} className='cart__section-icon' />
                            <h3>Apply Promo Code</h3>
                        </div>
                        <div className='cart__promo-input-row'>
                            <input
                                type='text'
                                placeholder='Enter promo code'
                                value={promoInput}
                                onChange={e => { setPromoInput(e.target.value); setPromoError(''); }}
                                disabled={!!appliedPromo}
                            />
                            <button onClick={applyPromo} disabled={!!appliedPromo}>
                                {appliedPromo ? 'Applied' : 'Apply'}
                            </button>
                        </div>
                        {promoError && <p className='cart__promo-error'>{promoError}</p>}
                        {appliedPromo && (
                            <div className='cart__promo-success-badge'>
                                <div className='cart__success-text'>
                                    <Percent size={12} />
                                    <span>{appliedPromo} ({(PROMO_CODES[appliedPromo]*100).toFixed(0)}% Off) applied</span>
                                </div>
                                <button className='cart__promo-remove' onClick={() => { setAppliedPromo(null); setPromoInput(''); }}>
                                    Remove
                                </button>
                            </div>
                        )}
                        <p className='cart__promo-suggestions'>Try: SAVE10 (10% off) · FOODIE (15% off)</p>
                    </div>

                    {/* Cost Breakdown details */}
                    <div className='cart__bill-breakdown'>
                        <div className='cart__section-title-wrap'>
                            <FileText size={16} className='cart__section-icon' />
                            <h3>Payment Details</h3>
                        </div>

                        <div className='cart__bill-rows'>
                            <div className='cart__bill-row'>
                                <span>Cart Subtotal</span>
                                <span>₹{subtotal}</span>
                            </div>
                            {discount > 0 && (
                                <div className='cart__bill-row discount-row'>
                                    <span>Discount Applied</span>
                                    <span>−₹{discount}</span>
                                </div>
                            )}
                            <div className='cart__bill-row'>
                                <span>Delivery Fee</span>
                                <span>{deliveryFee === 0 ? <span className='free-tag'>FREE</span> : `₹${deliveryFee}`}</span>
                            </div>
                            <div className='cart__bill-row'>
                                <span>Platform Fee</span>
                                <span>₹{platformFee}</span>
                            </div>
                            <div className='cart__bill-row'>
                                <span>GST & Restaurant Charges</span>
                                <span>₹{gstTax}</span>
                            </div>
                            <hr className='cart__bill-divider' />
                            <div className='cart__bill-row grand-total-row'>
                                <span>Grand Total</span>
                                <span>₹{total}</span>
                            </div>
                        </div>

                        <button
                            className='cart__checkout-action-btn'
                            onClick={() => navigate('/order')}
                        >
                            <span>Proceed to Checkout</span>
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
