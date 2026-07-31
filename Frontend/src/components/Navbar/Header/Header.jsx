import React, { useEffect, useRef } from 'react';
import './Header.css';

const STATS = [
  { value: '500+', label: 'Dishes', icon: '🍽️' },
  { value: '30 min', label: 'Avg Delivery', icon: '⚡' },
  { value: '4.9★', label: 'Rating', icon: '⭐' },
  { value: '50K+', label: 'Happy Customers', icon: '😊' },
];

const FLOATERS = ['🍕', '🍔', '🌮', '🍜', '🍣', '🧁', '🥗', '🍛'];

const Header = () => {
  return (
    <div className='header'>
      {/* Floating food emojis */}
      <div className='header__floaters' aria-hidden='true'>
        {FLOATERS.map((emoji, i) => (
          <span
            key={i}
            className='header__floater'
            style={{ '--delay': `${i * 0.7}s`, '--x': `${10 + i * 11}%` }}
          >
            {emoji}
          </span>
        ))}
      </div>

      {/* Glow orbs */}
      <div className='header__orb header__orb--1' aria-hidden='true' />
      <div className='header__orb header__orb--2' aria-hidden='true' />

      {/* Content */}
      <div className='header__content'>
        <div className='header__badge'>🔥 India&apos;s #1 Food Delivery</div>

        <h1 className='header__title'>
          Craving Something
          <span className='header__title-highlight'> Delicious?</span>
        </h1>

        <p className='header__subtitle'>
          From spicy street food to gourmet meals — choose from 500+ dishes
          crafted by top chefs, delivered hot to your door in under 30 minutes.
        </p>

        <div className='header__actions'>
          <a href='#explore-menu' className='header__btn header__btn--primary'>
            🍴 Explore Menu
          </a>
          <a href='#food-display' className='header__btn header__btn--ghost'>
            Top Picks →
          </a>
        </div>

        {/* Stats */}
        <div className='header__stats'>
          {STATS.map((stat) => (
            <div key={stat.label} className='header__stat'>
              <span className='header__stat-icon'>{stat.icon}</span>
              <span className='header__stat-value'>{stat.value}</span>
              <span className='header__stat-label'>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className='header__scroll-indicator' aria-hidden='true'>
        <div className='header__scroll-mouse'>
          <div className='header__scroll-dot' />
        </div>
        <span>Scroll down</span>
      </div>
    </div>
  );
};

export default Header;
