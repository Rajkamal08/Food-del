import React, { useContext, useState, useMemo } from 'react';
import './FoodDisplay.css';
import { StoreContext } from '../../../context/StoreContext.jsx';
import { menu_list } from '../../../assets/assets';
import FoodItem from '../FoodItem/FoodItem';
import AIRecommender from '../../AIRecommender/AIRecommender';
import { SlidersHorizontal, X, RotateCcw } from 'lucide-react';

// Skeleton card placeholder matching the new premium card layout
const SkeletonCard = () => (
    <div className='food-display__skeleton'>
        <div className='skeleton food-display__skeleton-img' />
        <div className='food-display__skeleton-body'>
            <div className='skeleton food-display__skeleton-line food-display__skeleton-line--title' />
            <div className='skeleton food-display__skeleton-line' />
            <div className='skeleton food-display__skeleton-line food-display__skeleton-line--short' />
        </div>
    </div>
);

const FoodDisplay = ({ category, setCategory }) => {
    const { food_list, searchQuery, setSearchQuery } = useContext(StoreContext);
    const [sortBy, setSortBy] = useState('default'); // 'default', 'price-low', 'price-high', 'rating'
    const isLoading = food_list.length === 0;

    // Filter items
    const filtered = useMemo(() => {
        return food_list.filter(item => {
            const safeCategory = item.category || '';
            const safeName = item.name || '';
            const safeQuery = searchQuery || '';
            const matchesCategory = category === 'All' || category.toLowerCase() === safeCategory.toLowerCase();
            const matchesSearch = safeName.toLowerCase().includes(safeQuery.toLowerCase()) ||
                                  (item.description || '').toLowerCase().includes(safeQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [food_list, category, searchQuery]);

    // Sort items
    const sorted = useMemo(() => {
        const list = [...filtered];
        if (sortBy === 'price-low') {
            return list.sort((a, b) => a.price - b.price);
        }
        if (sortBy === 'price-high') {
            return list.sort((a, b) => b.price - a.price);
        }
        if (sortBy === 'rating') {
            return list.sort((a, b) => {
                const hashA = a.name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
                const ratingA = 3.8 + (hashA % 12) * 0.1;
                const hashB = b.name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
                const ratingB = 3.8 + (hashB % 12) * 0.1;
                return ratingB - ratingA;
            });
        }
        return list; // default unsorted
    }, [filtered, sortBy]);

    const categories = [{ menu_name: 'All' }, ...menu_list];

    return (
        <div className='food-display' id='explore-menu'>
            {/* AI Recommender Component */}
            <AIRecommender />

            {/* Header row */}
            <div className='food-display__header'>
                <div>
                    <h2 className='food-display__title'>Explore Our Menu</h2>
                    {searchQuery && (
                        <div className='food-display__search-tag'>
                            <span>Showing results for &quot;{searchQuery}&quot;</span>
                            <button onClick={() => setSearchQuery('')} aria-label='Clear search'>
                                <X size={12} />
                            </button>
                        </div>
                    )}
                </div>
                
                <div className='food-display__controls'>
                    {/* Results count */}
                    {!isLoading && (
                        <span className='food-display__count'>
                            {filtered.length} dish{filtered.length !== 1 ? 'es' : ''}
                        </span>
                    )}

                    {/* Sorting dropdown */}
                    <div className='food-display__sort-wrap'>
                        <SlidersHorizontal size={14} className='food-display__sort-icon' />
                        <select 
                            className='food-display__sort-select' 
                            value={sortBy} 
                            onChange={(e) => setSortBy(e.target.value)}
                            aria-label='Sort dishes'
                        >
                            <option value='default'>Sort: Default</option>
                            <option value='price-low'>Price: Low to High</option>
                            <option value='price-high'>Price: High to Low</option>
                            <option value='rating'>Rating: Top Rated</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Modern Category Filter Pills */}
            <div className='food-display__filters'>
                {categories.map((cat) => (
                    <button
                        key={cat.menu_name}
                        className={`food-display__filter-btn ${
                            (cat.menu_name === 'All' && category === 'All') || category === cat.menu_name
                                ? 'active'
                                : ''
                        }`}
                        onClick={() => setCategory(cat.menu_name)}
                    >
                        {cat.menu_name === 'All' ? '🍽️ All Cuisines' : cat.menu_name}
                    </button>
                ))}
            </div>

            {/* Loading skeletons */}
            {isLoading && (
                <div className='food-display__grid'>
                    {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            )}

            {/* Premium Empty State Illustration */}
            {!isLoading && filtered.length === 0 && (
                <div className='food-display__empty'>
                    <div className='food-display__empty-graphic'>
                        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="60" cy="60" r="50" stroke="var(--border)" strokeWidth="4" strokeDasharray="6 6" />
                            <path d="M45 55C45 46.7157 51.7157 40 60 40C68.2843 40 75 46.7157 75 55C75 63.2843 68.2843 70 60 70C51.7157 70 45 63.2843 45 55Z" stroke="var(--text-muted)" strokeWidth="4" />
                            <path d="M71 66L85 80" stroke="var(--text-muted)" strokeWidth="4" strokeLinecap="round" />
                            <circle cx="55" cy="50" r="3" fill="var(--primary)" />
                            <circle cx="65" cy="50" r="3" fill="var(--primary)" />
                            <path d="M52 60C55 58 65 58 68 60" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                    </div>
                    <h3>No results found</h3>
                    <p>
                        We couldn&apos;t find any dishes matching your preference. Try checking your spelling or selecting a different category.
                    </p>
                    <button className='food-display__reset-btn' onClick={() => { setSearchQuery(''); setCategory('All'); setSortBy('default'); }}>
                        <RotateCcw size={14} />
                        <span>Reset Filters</span>
                    </button>
                </div>
            )}

            {/* Food grid */}
            {!isLoading && sorted.length > 0 && (
                <div className='food-display__grid'>
                    {sorted.map((item, index) => (
                        <FoodItem
                            key={item.id || item._id || index}
                            id={item.id || item._id}
                            name={item.name}
                            description={item.description}
                            price={item.price}
                            image={item.image}
                            category={item.category}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default FoodDisplay;
