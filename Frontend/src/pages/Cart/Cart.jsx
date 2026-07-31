import React, { useContext, useState } from 'react';
import './Cart.css';
import { StoreContext } from '../../context/StoreContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../../components/Toast/Toast.jsx';

const PROMO_CODES = { SAVE10: 0.10, FOODIE: 0.15, WELCOME20: 0.20 };

const Cart = () => {
    const { cartItems, food_list, removeFromCart, addToCart, getTotalCartAmount, url } = useContext(StoreContext);
    const navigate = useNavigate();
    const showToast = useToast();

    const [promoInput, setPromoInput] = useState('');
    const [appliedPromo, setAppliedPromo] = useState(null);
    const [promoError, setPromoError] = useState('');

    const cartFoodItems = food_list.filter(item => (cartItems[item.id] ?? cartItems[item._id] ?? 0) > 0);
    const subtotal = getTotalCartAmount();
    const deliveryFee = subtotal === 0 ? 0 : 49;
    const discount = appliedPromo ? Math.round(subtotal * PROMO_CODES[appliedPromo]) : 0;
    const total = subtotal + deliveryFee - discount;

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

    if (cartFoodItems.length === 0) {
        return (
            <div className='cart cart--empty'>
                <div className='cart__empty-icon'>🛒</div>
                <h2>Your cart is empty</h2>
                <p>Looks like you haven't added anything yet. Explore our menu!</p>
                <Link to='/' className='cart__empty-btn'>Browse Menu →</Link>
            </div>
        );
    }

    return (
        <div className='cart'>
            <h1 className='cart__title'>Your Cart 🛒</h1>

            {/* Cart items */}
            <div className='cart__items'>
                {cartFoodItems.map(item => {
                    const itemId = item.id || item._id;
                    const qty = cartItems[itemId] || 0;
                    const imgSrc = item.image?.startsWith('http')
                        ? item.image
                        : `${url}/images/${item.image}`;
                    return (
                        <div key={itemId} className='cart__item'>
                            <img src={imgSrc} alt={item.name} className='cart__item-img' />
                            <div className='cart__item-info'>
                                <p className='cart__item-name'>{item.name}</p>
                                <p className='cart__item-price'>₹{item.price} each</p>
                            </div>
                            <div className='cart__item-qty'>
                                <button onClick={() => removeFromCart(itemId)} aria-label='Remove one'>−</button>
                                <span>{qty}</span>
                                <button onClick={() => addToCart(itemId)} aria-label='Add one'>+</button>
                            </div>
                            <p className='cart__item-total'>₹{item.price * qty}</p>
                            <button
                                className='cart__item-remove'
                                onClick={() => { for(let i = 0; i < qty; i++) removeFromCart(itemId); }}
                                aria-label='Remove item'
                            >
                                ×
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Bottom section */}
            <div className='cart__bottom'>
                {/* Promo code */}
                <div className='cart__promo'>
                    <h3>🏷️ Promo Code</h3>
                    <p className='cart__promo-hint'>Try: SAVE10 · FOODIE · WELCOME20</p>
                    <div className='cart__promo-input'>
                        <input
                            type='text'
                            placeholder='Enter promo code'
                            value={promoInput}
                            onChange={e => { setPromoInput(e.target.value); setPromoError(''); }}
                            disabled={!!appliedPromo}
                        />
                        <button onClick={applyPromo} disabled={!!appliedPromo}>
                            {appliedPromo ? '✓ Applied' : 'Apply'}
                        </button>
                    </div>
                    {promoError && <p className='cart__promo-error'>{promoError}</p>}
                    {appliedPromo && (
                        <p className='cart__promo-success'>
                            🎉 {appliedPromo} — {(PROMO_CODES[appliedPromo]*100).toFixed(0)}% discount applied!
                            <span onClick={() => { setAppliedPromo(null); setPromoInput(''); }}>Remove</span>
                        </p>
                    )}
                </div>

                {/* Order summary */}
                <div className='cart__summary'>
                    <h3>Order Summary</h3>
                    <div className='cart__summary-rows'>
                        <div className='cart__summary-row'>
                            <span>Subtotal</span>
                            <span>₹{subtotal}</span>
                        </div>
                        {discount > 0 && (
                            <div className='cart__summary-row cart__summary-row--discount'>
                                <span>Discount ({appliedPromo})</span>
                                <span>−₹{discount}</span>
                            </div>
                        )}
                        <div className='cart__summary-row'>
                            <span>Delivery Fee</span>
                            <span>{subtotal === 0 ? 'Free' : `₹${deliveryFee}`}</span>
                        </div>
                        <hr />
                        <div className='cart__summary-row cart__summary-row--total'>
                            <span>Total</span>
                            <span>₹{total}</span>
                        </div>
                    </div>
                    <button
                        className='cart__checkout-btn'
                        onClick={() => navigate('/order')}
                    >
                        Proceed to Checkout →
                    </button>
                    <Link to='/' className='cart__continue'>← Continue Shopping</Link>
                </div>
            </div>
        </div>
    );
};

export default Cart;
