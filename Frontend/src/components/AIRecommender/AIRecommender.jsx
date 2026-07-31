import React, { useContext, useMemo, useState } from 'react';
import { StoreContext } from '../../context/StoreContext.jsx';
import FoodItem from '../Navbar/FoodItem/FoodItem.jsx';
import './AIRecommender.css';

/**
 * 🤖 AI FOOD RECOMMENDER
 * Client-side recommendation engine:
 * 1. Finds categories in user's cart
 * 2. Recommends items from same + complementary categories
 * 3. Scores by category match + price proximity + not already in cart
 * No external API needed — works entirely from existing food_list data.
 */

const COMPLEMENTS = {
    Salad:      ['Sandwich', 'Pure Veg', 'Rolls'],
    Rolls:      ['Salad', 'Deserts', 'Sandwich'],
    Deserts:    ['Cake', 'Rolls'],
    Sandwich:   ['Salad', 'Noodles', 'Pasta'],
    Cake:       ['Deserts'],
    'Pure Veg': ['Salad', 'Pasta', 'Noodles'],
    Pasta:      ['Salad', 'Sandwich', 'Pure Veg'],
    Noodles:    ['Rolls', 'Sandwich', 'Pure Veg'],
};

const AIRecommender = () => {
    const { food_list, cartItems, addToCart, url } = useContext(StoreContext);
    const [dismissed, setDismissed] = useState(false);

    const recommendations = useMemo(() => {
        if (!food_list.length) return [];

        // Items in cart
        const cartIds = Object.entries(cartItems)
            .filter(([, qty]) => qty > 0)
            .map(([id]) => id);

        if (cartIds.length === 0) return [];

        // Cart categories + avg price
        const cartItems_ = food_list.filter(f => cartIds.includes(String(f.id || f._id)));
        const cartCategories = [...new Set(cartItems_.map(f => f.category))];
        const avgPrice = cartItems_.reduce((s, f) => s + f.price, 0) / cartItems_.length;

        // Target categories (cart + complements)
        const targetCategories = new Set([
            ...cartCategories,
            ...cartCategories.flatMap(c => COMPLEMENTS[c] || []),
        ]);

        // Score each non-cart item
        const scored = food_list
            .filter(f => !cartIds.includes(String(f.id || f._id)))
            .map(f => {
                let score = 0;
                if (cartCategories.includes(f.category)) score += 3;
                else if (targetCategories.has(f.category)) score += 1;
                // Price proximity bonus
                const priceDiff = Math.abs(f.price - avgPrice);
                if (priceDiff < 5) score += 2;
                else if (priceDiff < 10) score += 1;
                return { ...f, score };
            })
            .filter(f => f.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 4);

        return scored;
    }, [food_list, cartItems]);

    if (dismissed || recommendations.length === 0) return null;

    return (
        <div className='ai-rec'>
            <div className='ai-rec__header'>
                <div className='ai-rec__title-row'>
                    <div className='ai-rec__ai-badge'>
                        <span>🤖</span> AI
                    </div>
                    <div>
                        <h3 className='ai-rec__title'>Recommended For You</h3>
                        <p className='ai-rec__subtitle'>Based on your cart — you might love these</p>
                    </div>
                </div>
                <button
                    className='ai-rec__dismiss'
                    onClick={() => setDismissed(true)}
                    aria-label='Dismiss recommendations'
                >
                    ×
                </button>
            </div>

            <div className='ai-rec__grid'>
                {recommendations.map((item, idx) => (
                    <FoodItem
                        key={item.id || item._id || idx}
                        id={item.id || item._id}
                        name={item.name}
                        description={item.description}
                        price={item.price}
                        image={item.image}
                        category={item.category}
                    />
                ))}
            </div>
        </div>
    );
};

export default AIRecommender;
