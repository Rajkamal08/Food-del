import React, { useContext } from 'react';
import './FoodDisplay.css';
import { StoreContext } from '../../../context/StoreContext.jsx';
import FoodItem from '../FoodItem/FoodItem';
import AIRecommender from '../../AIRecommender/AIRecommender';

// Skeleton card placeholder
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

const FoodDisplay = ({ category }) => {
    const { food_list, searchQuery } = useContext(StoreContext);
    const isLoading = food_list.length === 0;

    const filtered = food_list.filter(item => {
        const safeCategory = item.category || '';
        const safeName = item.name || '';
        const safeQuery = searchQuery || '';
        const matchesCategory = category === 'All' || category.toLowerCase() === safeCategory.toLowerCase();
        const matchesSearch = safeName.toLowerCase().includes(safeQuery.toLowerCase()) ||
                              (item.description || '').toLowerCase().includes(safeQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className='food-display' id='food-display'>
            {/* AI Recommender */}
            <AIRecommender />

            {/* Header row */}
            <div className='food-display__header'>
                <h2 className='food-display__title'>
                    {category === 'All' ? '🍽️ Top Dishes Near You' : `🍽️ ${category}`}
                </h2>
                {!isLoading && (
                    <span className='food-display__count'>
                        {filtered.length} dish{filtered.length !== 1 ? 'es' : ''}
                    </span>
                )}
            </div>

            {/* Loading skeletons */}
            {isLoading && (
                <div className='food-display__grid'>
                    {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            )}

            {/* Empty state */}
            {!isLoading && filtered.length === 0 && (
                <div className='food-display__empty'>
                    <div className='food-display__empty-icon'>🔍</div>
                    <h3>No dishes found</h3>
                    <p>
                        {searchQuery
                            ? `No results for "${searchQuery}". Try a different keyword.`
                            : `No dishes in the "${category}" category yet.`}
                    </p>
                </div>
            )}

            {/* Food grid */}
            {!isLoading && filtered.length > 0 && (
                <div className='food-display__grid'>
                    {filtered.map((item, index) => (
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
