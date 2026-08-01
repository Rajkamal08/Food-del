import React, { useContext, useEffect, useState, useMemo } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext.jsx';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../../components/Toast/Toast.jsx';
import { 
  User, 
  Mail, 
  MapPin, 
  Phone, 
  CreditCard, 
  Lock, 
  Gift, 
  ArrowLeft, 
  Info,
  ShieldCheck
} from 'lucide-react';

const PlaceOrder = () => {
    const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);
    const navigate = useNavigate();
    const showToast = useToast();

    const [driverTip, setDriverTip] = useState(0); // 0, 20, 30, 50
    const [submitting, setSubmitting] = useState(false);
    
    // Address Book states
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [saveNewAddress, setSaveNewAddress] = useState(false);
    const [addressTag, setAddressTag] = useState("Home");

    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
        phone: ""
    });

    const subtotal = getTotalCartAmount();
    const deliveryFee = subtotal >= 300 ? 0 : 49;
    const platformFee = 5;
    const gstTax = Math.round(subtotal * 0.05);
    const grandTotal = subtotal + deliveryFee + platformFee + gstTax + driverTip;

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    // Calculate item quantities for placing order
    const orderItems = useMemo(() => {
        let items = [];
        food_list.forEach((item) => {
            const qty = cartItems[item.id] || cartItems[item._id] || 0;
            if (qty > 0) {
                let itemInfo = { ...item };
                itemInfo["quantity"] = qty;
                items.push(itemInfo);
            }
        });
        return items;
    }, [food_list, cartItems]);

    const handleSubmitOrder = async (event) => {
        event.preventDefault();
        
        if (data.phone.length < 10) {
            showToast("Please enter a valid 10-digit phone number.", "warning");
            return;
        }
        if (data.zipcode.length < 5) {
            showToast("Please enter a valid Zip code.", "warning");
            return;
        }

        setSubmitting(true);

        // Optionally save this new address to the address book
        if (saveNewAddress) {
            try {
                await axios.post(
                    url + "/api/user/address/add", 
                    { addressData: { ...data, tag: addressTag } }, 
                    { headers: { token } }
                );
                showToast("Address saved to your address book!", "success");
            } catch (err) {
                console.error("Failed to save address", err);
            }
        }

        const orderData = {
            address: data,
            items: orderItems,
            amount: grandTotal
        };

        try {
            const response = await axios.post(
                url + "/api/order/place", 
                orderData, 
                { headers: { token } }
            );

            if (response.data.success) {
                const { session_url } = response.data;
                showToast("Order initialized! Redirecting to secure payment...", "success");
                window.location.replace(session_url);
            } else {
                showToast(response.data.message || "Failed to place order.", "error");
                setSubmitting(false);
            }
        } catch (error) {
            console.error("Order error:", error);
            showToast(
                error.response?.data?.message || error.message || "Failed to place order.", 
                "error"
            );
            setSubmitting(false);
        }
    };

    // Fetch saved addresses
    useEffect(() => {
        const fetchAddresses = async () => {
            if (token) {
                try {
                    const response = await axios.get(url + "/api/user/address/list", { headers: { token } });
                    if (response.data.success) {
                        setSavedAddresses(response.data.data);
                    }
                } catch (error) {
                    console.error("Could not fetch addresses", error);
                }
            }
        };
        fetchAddresses();
    }, [token, url]);

    // Safeguard: Redirect if cart is empty or not logged in
    useEffect(() => {
        if (!token || subtotal === 0) {
            showToast("Your cart is empty or you need to Sign In first.", "warning");
            navigate('/cart');
        }
    }, [token, subtotal, navigate]);

    // Helper to auto-fill address form
    const selectSavedAddress = (addr) => {
        setData({
            firstName: addr.firstName || data.firstName,
            lastName: addr.lastName || data.lastName,
            email: addr.email || data.email,
            street: addr.street || "",
            city: addr.city || "",
            state: addr.state || "",
            zipcode: addr.zipcode || "",
            country: addr.country || "",
            phone: addr.phone || ""
        });
        showToast(`Auto-filled address from ${addr.tag}`, "success");
    };

    return (
        <form onSubmit={handleSubmitOrder} className='place-order'>
            {/* Left: Address delivery details */}
            <div className='place-order__left'>
                <div className='place-order__header'>
                    <Link to='/cart' className='place-order__back-link'>
                        <ArrowLeft size={16} />
                        <span>Back to Cart</span>
                    </Link>
                    <h1 className='place-order__title'>Delivery Information</h1>
                </div>

                <div className='place-order__form-card'>
                    <div className="place-order__form-section">
                        <div className='place-order__section-title'>
                            <User size={16} />
                            <span>Contact Details</span>
                        </div>
                        <div className="place-order__fields-row">
                            <input 
                                name="firstName" 
                                onChange={onChangeHandler} 
                                value={data.firstName} 
                                type="text" 
                                placeholder='First Name' 
                                required 
                            />
                            <input 
                                name="lastName" 
                                onChange={onChangeHandler} 
                                value={data.lastName} 
                                type="text" 
                                placeholder='Last Name' 
                                required 
                            />
                        </div>
                        <div className="place-order__fields-row">
                            <div className='place-order__input-icon-wrap'>
                                <Mail size={14} className='input-icon' />
                                <input 
                                    name="email" 
                                    onChange={onChangeHandler} 
                                    value={data.email} 
                                    type="email" 
                                    placeholder='Email Address' 
                                    required 
                                />
                            </div>
                            <div className='place-order__input-icon-wrap'>
                                <Phone size={14} className='input-icon' />
                                <input 
                                    name="phone" 
                                    onChange={onChangeHandler} 
                                    value={data.phone} 
                                    type="tel" 
                                    placeholder='Phone Number' 
                                    required 
                                />
                            </div>
                        </div>
                    </div>

                    <div className="place-order__form-section">
                        <div className='place-order__section-title'>
                            <MapPin size={16} />
                            <span>Delivery Address</span>
                        </div>

                        {/* Address Book Widget */}
                        {savedAddresses.length > 0 && (
                            <div className="place-order__address-book">
                                <p className="place-order__address-book-label">Select a saved address:</p>
                                <div className="place-order__address-cards">
                                    {savedAddresses.map((addr, idx) => (
                                        <button 
                                            key={idx} 
                                            type="button"
                                            className="place-order__saved-card"
                                            onClick={() => selectSavedAddress(addr)}
                                        >
                                            <div className="saved-card-header">
                                                <MapPin size={12} />
                                                <strong>{addr.tag}</strong>
                                            </div>
                                            <div className="saved-card-body">
                                                <p>{addr.street}</p>
                                                <p>{addr.city}, {addr.zipcode}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <input 
                            name="street" 
                            onChange={onChangeHandler} 
                            value={data.street} 
                            type="text" 
                            placeholder='Street Address' 
                            required 
                            className='full-width-input'
                        />
                        <div className="place-order__fields-row">
                            <input 
                                name="city" 
                                onChange={onChangeHandler} 
                                value={data.city} 
                                type="text" 
                                placeholder='City' 
                                required 
                            />
                            <input 
                                name="state" 
                                onChange={onChangeHandler} 
                                value={data.state} 
                                type="text" 
                                placeholder='State' 
                                required
                            />
                        </div>
                        <div className="place-order__fields-row">
                            <input 
                                name="zipcode" 
                                onChange={onChangeHandler} 
                                value={data.zipcode} 
                                type="text" 
                                placeholder='Zip Code' 
                                required 
                            />
                            <input 
                                name="country" 
                                onChange={onChangeHandler} 
                                value={data.country} 
                                type="text" 
                                placeholder='Country' 
                                required 
                            />
                        </div>
                        
                        {/* Save Address Toggle */}
                        <div className="place-order__save-address">
                            <label className="save-address-label">
                                <input 
                                    type="checkbox" 
                                    checked={saveNewAddress}
                                    onChange={(e) => setSaveNewAddress(e.target.checked)}
                                />
                                Save this address for next time
                            </label>
                            {saveNewAddress && (
                                <input 
                                    type="text" 
                                    className="save-address-tag-input"
                                    placeholder="e.g. Home, Office, Girlfriend's House"
                                    value={addressTag}
                                    onChange={(e) => setAddressTag(e.target.value)}
                                    required
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Payment details sidebar */}
            <div className='place-order__right'>
                <div className='place-order__summary-card'>
                    <h2 className='place-order__summary-title'>Order Summary</h2>
                    
                    {/* Items List preview */}
                    <div className='place-order__items-preview'>
                        {orderItems.map((item, idx) => (
                            <div key={idx} className='place-order__item-row'>
                                <span className='place-order__item-qty-name'>
                                    <span className='qty'>{item.quantity}x</span>
                                    <span className='name'>{item.name}</span>
                                </span>
                                <span className='price'>₹{item.price * item.quantity}</span>
                            </div>
                        ))}
                    </div>

                    <hr className='place-order__divider' />

                    {/* Driver Tip Pills */}
                    <div className='place-order__tip-section'>
                        <div className='place-order__tip-header'>
                            <Gift size={14} className='tip-icon' />
                            <span>Tip your delivery partner</span>
                        </div>
                        <p className='place-order__tip-desc'>100% of the tip goes directly to the driver.</p>
                        <div className='place-order__tip-options'>
                            {[0, 20, 30, 50].map((tip) => (
                                <button
                                    key={tip}
                                    type='button'
                                    className={`place-order__tip-btn ${driverTip === tip ? 'active' : ''}`}
                                    onClick={() => setDriverTip(tip)}
                                >
                                    {tip === 0 ? 'No Tip' : `₹${tip}`}
                                </button>
                            ))}
                        </div>
                    </div>

                    <hr className='place-order__divider' />

                    {/* Cost Totals breakdown */}
                    <div className='place-order__costs'>
                        <div className='place-order__cost-row'>
                            <span>Items Subtotal</span>
                            <span>₹{subtotal}</span>
                        </div>
                        <div className='place-order__cost-row'>
                            <span>Delivery Partner Fee</span>
                            <span>{deliveryFee === 0 ? <span className='free-text'>FREE</span> : `₹${deliveryFee}`}</span>
                        </div>
                        <div className='place-order__cost-row'>
                            <span>Platform Fee</span>
                            <span>₹{platformFee}</span>
                        </div>
                        <div className='place-order__cost-row'>
                            <span>GST & Restaurant Charges</span>
                            <span>₹{gstTax}</span>
                        </div>
                        {driverTip > 0 && (
                            <div className='place-order__cost-row tip-cost-row'>
                                <span>Driver Tip</span>
                                <span>₹{driverTip}</span>
                            </div>
                        )}
                        <hr className='place-order__divider-inner' />
                        <div className='place-order__cost-row total-cost-row'>
                            <span>Grand Total</span>
                            <span>₹{grandTotal}</span>
                        </div>
                    </div>

                    {/* Stripe sandbox alert */}
                    <div className='place-order__sandbox-alert'>
                        <Info size={14} className='alert-icon' />
                        <span>Payments are secure and processed in <strong>Stripe Test Mode</strong>.</span>
                    </div>

                    <button 
                        type="submit" 
                        className='place-order__submit-btn'
                        disabled={submitting}
                    >
                        {submitting ? (
                            <span>Placing Order...</span>
                        ) : (
                            <>
                                <Lock size={15} />
                                <span>Proceed to Payment</span>
                            </>
                        )}
                    </button>

                    <div className='place-order__secure-badge'>
                        <ShieldCheck size={14} />
                        <span>SSL Secure Checkout</span>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default PlaceOrder;
