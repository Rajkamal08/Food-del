import React, { useContext, useState, useEffect } from 'react';
import './FoodItem.css';
import { assets } from '../../../assets/assets';
import { StoreContext } from '../../../context/StoreContext.jsx';
import { useToast } from '../../Toast/Toast.jsx';
import { Heart, Plus, Minus, Flame, Star } from 'lucide-react';

const VEG_CATEGORIES = ['Salad', 'Deserts', 'Cake', 'Pure Veg'];

const FoodItem = ({ id, name, price, description, image, category }) => {
    const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);
    const showToast = useToast();
    const [adding, setAdding] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    const count = cartItems[id] || 0;
    const isVeg = VEG_CATEGORIES.includes(category);

    // Load favorite state from localStorage
    useEffect(() => {
        const favs = JSON.parse(localStorage.getItem('favorites') || '{}');
        setIsFavorite(!!favs[id]);
    }, [id]);

    const toggleFavorite = (e) => {
        e.stopPropagation();
        const favs = JSON.parse(localStorage.getItem('favorites') || '{}');
        const nextState = !isFavorite;
        if (nextState) {
            favs[id] = true;
            showToast(`${name} added to favorites!`, 'info');
        } else {
            delete favs[id];
            showToast(`${name} removed from favorites.`, 'info');
        }
        localStorage.setItem('favorites', JSON.stringify(favs));
        setIsFavorite(nextState);
    };

    // Deterministic rating (e.g., 4.2 to 4.9)
    const hash = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const rating = (4.1 + (hash % 9) * 0.1).toFixed(1);

    // Deterministic calories (e.g., 180 to 450 kcal)
    const calories = 180 + (hash % 28) * 10;

    // Deterministic discount calculations (e.g., 20% off)
    const discountPercent = 10 + (hash % 4) * 5; // 10%, 15%, 20%, 25%
    const originalPrice = Math.round(price * (1 + discountPercent / 100));

    // Spicy level check based on name
    const lowercaseName = name.toLowerCase();
    const isSpicy = lowercaseName.includes('spicy') || 
                    lowercaseName.includes('chili') || 
                    lowercaseName.includes('peri') || 
                    lowercaseName.includes('noodles') || 
                    lowercaseName.includes('pasta');

    const imgSrc = image && image.startsWith('http')
        ? image
        : `${url}/images/${image}`;

    const handleAdd = async (e) => {
        e.stopPropagation();
        setAdding(true);
        await addToCart(id);
        showToast(`${name} added to cart!`, 'success');
        setTimeout(() => setAdding(false), 400);
    };

    const handleRemove = (e) => {
        e.stopPropagation();
        removeFromCart(id);
    };

    return (
        <div className='food-item'>
            {/* Image Wrap */}
            <div className='food-item__img-wrap'>
                <img className='food-item__img' src={imgSrc} alt={name} loading='lazy' />

                {/* Offer tag */}
                <div className='food-item__offer-badge'>
                    {discountPercent}% OFF
                </div>

                {/* Favorite Icon */}
                <button 
                    className={`food-item__fav-btn ${isFavorite ? 'active' : ''}`} 
                    onClick={toggleFavorite}
                    aria-label='Toggle favorite'
                >
                    <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
                </button>

                {/* Veg/Non-Veg overlay */}
                <div className='food-item__badges'>
                    <span 
                        className={`food-item__veg-badge ${isVeg ? 'veg' : 'non-veg'}`}
                        title={isVeg ? 'Veg' : 'Non-veg'}
                    >
                        <span className='dot' />
                    </span>
                </div>

                {/* Estimated Delivery Tag */}
                <span className='food-item__del-time'>30 mins</span>
            </div>

            {/* Content Info */}
            <div className='food-item__info'>
                <div className='food-item__meta-row'>
                    <div className='food-item__rating-wrap'>
                        <Star size={12} className='star-icon' fill="currentColor" />
                        <span>{rating}</span>
                    </div>
                    {isSpicy && (
                        <div className='food-item__spicy-tag'>
                            <Flame size={12} />
                            <span>Spicy</span>
                        </div>
                    )}
                    <span className='food-item__kcal'>{calories} kcal</span>
                </div>

                <h3 className='food-item__name'>{name}</h3>
                <p className='food-item__desc'>{description}</p>

                <div className='food-item__footer'>
                    <div className='food-item__price-group'>
                        <span className='food-item__price'>₹{price}</span>
                        <span className='food-item__original-price'>₹{originalPrice}</span>
                    </div>

                    {/* Quantity selectors */}
                    <div className='food-item__cart-ctrl'>
                        {count === 0 ? (
                            <button
                                className={`food-item__add-btn ${adding ? 'adding' : ''}`}
                                onClick={handleAdd}
                                aria-label={`Add ${name} to cart`}
                            >
                                <Plus size={14} />
                                <span>Add</span>
                            </button>
                        ) : (
                            <div className='food-item__counter'>
                                <button onClick={handleRemove} className='food-item__counter-btn' aria-label='Remove one'>
                                    <Minus size={13} />
                                </button>
                                <span className='food-item__counter-val'>{count}</span>
                                <button onClick={handleAdd} className='food-item__counter-btn' aria-label='Add one'>
                                    <Plus size={13} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FoodItem;
