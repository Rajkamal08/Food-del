import React, { useContext, useMemo, useState } from 'react';
import { StoreContext } from '../../context/StoreContext.jsx';
import { useToast } from '../Toast/Toast.jsx';
import './AIRecommender.css';
import { 
  Sparkles, 
  Activity, 
  ShieldCheck, 
  ShoppingBag, 
  Plus, 
  AlertCircle 
} from 'lucide-react';

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
    const showToast = useToast();

    // Get cart items list
    const cartItemsList = useMemo(() => {
        return food_list.filter(f => (cartItems[f.id] || cartItems[f._id] || 0) > 0);
    }, [food_list, cartItems]);

    // Calculate Nutritional Balance Score (0 - 100)
    const cartAnalysis = useMemo(() => {
        if (cartItemsList.length === 0) return { score: 0, label: 'Empty Cart', tips: 'Add items to your cart to activate AI Nutrition Analysis!' };
        
        let vegCount = 0;
        let sweetCount = 0;
        let carbCount = 0;

        cartItemsList.forEach(item => {
            const cat = item.category || '';
            const qty = cartItems[item.id] || cartItems[item._id] || 1;
            if (['Salad', 'Pure Veg'].includes(cat)) vegCount += qty;
            if (['Deserts', 'Cake'].includes(cat)) sweetCount += qty;
            if (['Pasta', 'Noodles', 'Sandwich', 'Rolls'].includes(cat)) carbCount += qty;
        });

        let score = 50; // Base score
        score += vegCount * 15;
        score -= sweetCount * 10;
        
        if (carbCount > 0 && vegCount === 0) score -= 15; // Heavy carbs without greens penalty
        if (carbCount > 0 && vegCount > 0) score += 10; // Balanced carbs and greens bonus

        score = Math.max(10, Math.min(100, score));

        let label = 'Balanced Meal';
        let color = '#f59e0b';
        let tips = '';

        if (score >= 80) {
            label = 'Excellent Nutrient Balance! 🥗';
            color = '#22c55e';
            tips = 'Perfect choice! Your cart contains a balanced mix of dietary fibers, vitamins, and energy.';
        } else if (score >= 50) {
            label = 'Good Nutritional Mix';
            color = '#f59e0b';
            tips = 'Consider adding a fresh Salad or organic green dish to balance the carbs and improve digestion.';
        } else {
            label = 'Sugary / Carb Heavy ⚠️';
            color = '#ef4444';
            tips = 'Your cart is high in sugars or refined carbs. We highly recommend pairing this with a protein salad!';
        }

        return { score, label, color, tips };
    }, [cartItemsList, cartItems]);

    // Generate smart pairing recommendations
    const pairings = useMemo(() => {
        if (!food_list.length || cartItemsList.length === 0) return [];

        const cartIds = cartItemsList.map(f => String(f.id || f._id));
        const cartCategories = [...new Set(cartItemsList.map(f => f.category))];
        const avgPrice = cartItemsList.reduce((s, f) => s + f.price, 0) / cartItemsList.length;

        const targetCategories = new Set([
            ...cartCategories.flatMap(c => COMPLEMENTS[c] || []),
        ]);

        return food_list
            .filter(f => !cartIds.includes(String(f.id || f._id)))
            .map(f => {
                let score = 0;
                if (targetCategories.has(f.category)) score += 4;
                const priceDiff = Math.abs(f.price - avgPrice);
                if (priceDiff < 8) score += 2;
                return { ...f, score };
            })
            .filter(f => f.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 3);
    }, [food_list, cartItemsList]);

    const handleAddPairing = (item) => {
        addToCart(item.id || item._id);
        showToast(`Added pairing: ${item.name}!`, "success");
    };

    return (
        <div className='ai-rec'>
            <div className='ai-rec__container'>
                {/* Left: Nutritional analysis score card */}
                <div className='ai-rec__analysis-card'>
                    <div className='ai-rec__badge-row'>
                        <span className='ai-rec__ai-tag'>
                            <Sparkles size={12} fill="currentColor" />
                            <span>AI Nutrition Coach</span>
                        </span>
                        {cartItemsList.length > 0 && (
                            <span className='ai-rec__score-label' style={{ color: cartAnalysis.color }}>
                                {cartAnalysis.label}
                            </span>
                        )}
                    </div>

                    {cartItemsList.length === 0 ? (
                        <div className='ai-rec__empty-analysis'>
                            <Activity size={32} className='ai-rec__activity-icon' />
                            <h3>Cart Analysis Inactive</h3>
                            <p>Add items to your cart to analyze calorie mix, nutrient balance scores, and tailored pairings.</p>
                        </div>
                    ) : (
                        <div className='ai-rec__active-analysis'>
                            <div className='ai-rec__metric-row'>
                                <span className='metric-title'>Meal Balance Index</span>
                                <span className='metric-value' style={{ color: cartAnalysis.color }}>{cartAnalysis.score}%</span>
                            </div>
                            <div className='ai-rec__bar-bg'>
                                <div 
                                    className='ai-rec__bar-fill' 
                                    style={{ width: `${cartAnalysis.score}%`, backgroundColor: cartAnalysis.color }} 
                                />
                            </div>
                            <div className='ai-rec__tip-row'>
                                <ShieldCheck size={14} className='tip-icon' />
                                <p className='tip-text'>{cartAnalysis.tips}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right: Complementary Chef Pairings */}
                <div className='ai-rec__pairings-panel'>
                    <h3 className='ai-rec__pairings-title'>
                        <ShoppingBag size={14} />
                        <span>Recommended Smart Pairings</span>
                    </h3>

                    {cartItemsList.length === 0 ? (
                        <p className='pairings-empty-text'>Suggested pairings will appear here once you add items to the cart.</p>
                    ) : pairings.length === 0 ? (
                        <p className='pairings-empty-text'>No matching pairings found for your current selection.</p>
                    ) : (
                        <div className='ai-rec__pairings-list'>
                            {pairings.map((item, idx) => {
                                const imgSrc = item.image && item.image.startsWith('http')
                                    ? item.image
                                    : `${url}/images/${item.image}`;
                                return (
                                    <div key={item.id || item._id || idx} className='ai-rec__pairing-item'>
                                        <img src={imgSrc} alt={item.name} className='pairing-img' />
                                        <div className='pairing-info'>
                                            <h4 className='pairing-name'>{item.name}</h4>
                                            <span className='pairing-price'>₹{item.price}</span>
                                        </div>
                                        <button 
                                            onClick={() => handleAddPairing(item)}
                                            className='pairing-add-btn'
                                            title='Quick add'
                                        >
                                            <Plus size={13} />
                                            <span>Add</span>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AIRecommender;
