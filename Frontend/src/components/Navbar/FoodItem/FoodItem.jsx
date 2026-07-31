import React, { useContext, useState } from 'react';
import './FoodItem.css';
import { assets } from '../../../assets/assets';
import { StoreContext } from '../../../context/StoreContext.jsx';
import { useToast } from '../../Toast/Toast.jsx';

// Deterministic badge assignment based on item name
const getBadge = (name, index) => {
    const badges = ['BESTSELLER', 'POPULAR', 'CHEF\'S PICK', 'NEW', null, null];
    const hash = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return badges[hash % badges.length];
};

// Meal time tags based on category
const getMealTag = (category) => {
    const map = {
        Salad: '🥗 Healthy',
        Rolls: '🌯 Snack',
        Deserts: '🍰 Dessert',
        Sandwich: '🥪 Lunch',
        Cake: '🎂 Special',
        'Pure Veg': '🌿 Vegan',
        Pasta: '🍝 Dinner',
        Noodles: '🍜 Dinner',
    };
    return map[category] || '🍽️ Meal';
};

// Veg categories
const VEG_CATEGORIES = ['Salad', 'Deserts', 'Cake', 'Pure Veg'];

const StarRating = ({ rating = 4.5 }) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    return (
        <div className='food-item__stars' aria-label={`Rating: ${rating}`}>
            {'★'.repeat(full)}{half ? '½' : ''}{'☆'.repeat(5 - full - (half ? 1 : 0))}
            <span>{rating}</span>
        </div>
    );
};

const FoodItem = ({ id, name, price, description, image, category }) => {
    const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);
    const showToast = useToast();
    const [adding, setAdding] = useState(false);

    const badge = getBadge(name, id);
    const mealTag = getMealTag(category);
    const isVeg = VEG_CATEGORIES.includes(category);
    const count = cartItems[id] || 0;

    // Deterministic rating per item
    const hash = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const rating = (3.8 + (hash % 12) * 0.1).toFixed(1);

    const imgSrc = image && image.startsWith('http')
        ? image
        : `${url}/images/${image}`;

    const handleAdd = async () => {
        setAdding(true);
        await addToCart(id);
        showToast(`${name} added to cart!`, 'success');
        setTimeout(() => setAdding(false), 400);
    };

    return (
        <div className='food-item'>
            {/* Image */}
            <div className='food-item__img-wrap'>
                <img className='food-item__img' src={imgSrc} alt={name} loading='lazy' />

                {/* Badges */}
                <div className='food-item__badges'>
                    {badge && <span className='food-item__badge'>{badge}</span>}
                    <span className={`food-item__veg-dot ${isVeg ? 'veg' : 'non-veg'}`} title={isVeg ? 'Veg' : 'Non-veg'} />
                </div>

                {/* Meal tag */}
                <span className='food-item__meal-tag'>{mealTag}</span>

                {/* Cart controls */}
                <div className='food-item__cart-ctrl'>
                    {count === 0 ? (
                        <button
                            className={`food-item__add-btn ${adding ? 'adding' : ''}`}
                            onClick={handleAdd}
                            aria-label={`Add ${name} to cart`}
                        >
                            <img src={assets.add_icon_white} alt='add' />
                        </button>
                    ) : (
                        <div className='food-item__counter'>
                            <button onClick={() => removeFromCart(id)} aria-label='Remove one'>
                                <img src={assets.remove_icon_red} alt='remove' />
                            </button>
                            <span>{count}</span>
                            <button onClick={handleAdd} aria-label='Add one'>
                                <img src={assets.add_icon_green} alt='add' />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Info */}
            <div className='food-item__info'>
                <div className='food-item__name-row'>
                    <h3 className='food-item__name'>{name}</h3>
                    <StarRating rating={parseFloat(rating)} />
                </div>
                <p className='food-item__desc'>{description}</p>
                <div className='food-item__footer'>
                    <span className='food-item__price'>₹{price}</span>
                    {count > 0 && (
                        <span className='food-item__in-cart'>{count} in cart</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FoodItem;
