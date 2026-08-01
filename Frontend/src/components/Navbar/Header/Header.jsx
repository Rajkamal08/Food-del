import React, { useContext } from 'react';
import './Header.css';
import { StoreContext } from '../../../context/StoreContext.jsx';
import { Search, MapPin, Sparkles } from 'lucide-react';

const POPULAR_TAGS = [
  { label: '🍕 Pizza', value: 'Pizza' },
  { label: '🍲 Biryani', value: 'Biryani' },
  { label: '🍔 Burger', value: 'Burger' },
  { label: '🍜 Noodles', value: 'Noodles' },
  { label: '🍰 Cake', value: 'Cake' },
  { label: '⭐ 4.5+', value: '4.5' }
];

const Header = () => {
  const { searchQuery, setSearchQuery } = useContext(StoreContext);

  const handleTagClick = (val) => {
    if (val === '4.5') {
      setSearchQuery('');
    } else {
      setSearchQuery(val);
    }
    const element = document.getElementById('explore-menu');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const element = document.getElementById('explore-menu');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className='header'>
      <div className='header__container container'>
        {/* Left Content */}
        <div className='header__left'>
          <div className='header__badge'>
            <MapPin size={12} className='header__badge-icon' />
            <span>Bangalore, Koramangala</span>
          </div>
          
          <h1 className='header__title'>
            Good Food.<br />
            <span className='header__title-highlight'>Delivered Fast.</span>
          </h1>

          <p className='header__subtitle'>
            Order from top restaurants near you and get it in 30 minutes.
          </p>

          {/* Search Pill */}
          <form className='header__search-form' onSubmit={handleSearchSubmit}>
            <div className='header__search-input-wrap'>
              <Search size={18} className='header__search-icon-inside' />
              <input
                type='text'
                placeholder='Search for dishes, cuisines, restaurants...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label='Search food'
              />
              <button type='submit' className='header__search-btn'>
                Search
              </button>
            </div>
          </form>

          {/* Popular Tags */}
          <div className='header__tags-row'>
            {POPULAR_TAGS.map((tag) => (
              <button
                key={tag.label}
                className='header__tag'
                onClick={() => handleTagClick(tag.value)}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right Composition Graphics */}
        <div className='header__right'>
          <div className='header__graphics-wrap'>
            {/* Top Right Dish */}
            <div className='header__dish header__dish--top'>
              <img 
                src='https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop' 
                alt='Salad bowl' 
              />
            </div>

            {/* Main Center Burger Dish */}
            <div className='header__dish header__dish--center'>
              <img 
                src='https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=500&fit=crop' 
                alt='Burger plate' 
              />
              {/* Delivery Time Badge */}
              <div className='header__time-badge'>
                <span className='header__time-title'>Delivered in</span>
                <span className='header__time-value'>30 mins</span>
                <Sparkles size={14} className='header__time-sparkle' fill="currentColor" />
              </div>
            </div>

            {/* Bottom Right Soup Dish */}
            <div className='header__dish header__dish--bottom'>
              <img 
                src='https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop' 
                alt='Noodle soup' 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
