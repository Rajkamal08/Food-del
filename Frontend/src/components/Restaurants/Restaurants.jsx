import React from 'react';
import './Restaurants.css';
import { Star, Clock, Sparkles } from 'lucide-react';
import { useToast } from '../Toast/Toast.jsx';

const RESTAURANT_DATA = [
  {
    name: "Pasta Fresca",
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=500&auto=format&fit=crop&q=80",
    rating: "4.8",
    time: "20-25 mins",
    cuisine: "Italian, Pasta, Pizza",
    famous: "Pasta Al Limone, Lasagna",
    categoryMatch: "Pasta"
  },
  {
    name: "Burger Mansion",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80",
    rating: "4.7",
    time: "15-20 mins",
    cuisine: "Burgers, Sandwiches, Fast Food",
    famous: "Double Cheese Burger, Club Sandwich",
    categoryMatch: "Sandwich"
  },
  {
    name: "Noodle Station",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=80",
    rating: "4.6",
    time: "25-30 mins",
    cuisine: "Asian, Noodles, Ramen",
    famous: "Spicy Ramen, Hakka Noodles",
    categoryMatch: "Noodles"
  },
  {
    name: "The Salad Bar",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=80",
    rating: "4.9",
    time: "15-20 mins",
    cuisine: "Healthy, Salads, Vegan",
    famous: "Greek Salad, Quinoa Bowl",
    categoryMatch: "Salad"
  },
  {
    name: "Sweet Delights",
    image: "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=500&auto=format&fit=crop&q=80",
    rating: "4.8",
    time: "10-15 mins",
    cuisine: "Bakery, Cakes, Desserts",
    famous: "Choco Fudge, Red Velvet Cake",
    categoryMatch: "Cake"
  }
];

const Restaurants = ({ setCategory }) => {
  const showToast = useToast();

  const handleRestaurantClick = (restaurant) => {
    setCategory(restaurant.categoryMatch);
    showToast(`Filtering dishes from ${restaurant.name}!`, "success");
    
    // Smooth scroll down to the food menu section
    setTimeout(() => {
      const element = document.getElementById('explore-menu');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className='restaurants' id='restaurants-section'>
      <div className='restaurants__header'>
        <div className='restaurants__title-group'>
          <Sparkles size={18} className='restaurants__title-icon' fill="currentColor" />
          <h2>Top Rated Restaurants</h2>
        </div>
        <p className='restaurants__subtitle'>Order from the finest gourmet kitchens delivering right now.</p>
      </div>

      <div className='restaurants__grid'>
        {RESTAURANT_DATA.map((res, index) => (
          <div 
            key={index} 
            className='restaurants__card'
            onClick={() => handleRestaurantClick(res)}
          >
            {/* Image section */}
            <div className='restaurants__img-wrap'>
              <img src={res.image} alt={res.name} loading='lazy' />
              <div className='restaurants__time-badge'>
                <Clock size={11} />
                <span>{res.time}</span>
              </div>
            </div>

            {/* Content section */}
            <div className='restaurants__body'>
              <div className='restaurants__row-header'>
                <h3 className='restaurants__name'>{res.name}</h3>
                <div className='restaurants__rating-badge'>
                  <Star size={11} fill="currentColor" />
                  <span>{res.rating}</span>
                </div>
              </div>

              <p className='restaurants__cuisine'>{res.cuisine}</p>
              
              <div className='restaurants__divider' />
              
              <div className='restaurants__famous-wrap'>
                <span className='famous-label'>Famous For:</span>
                <p className='famous-text'>{res.famous}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <hr className='restaurants__section-divider' />
    </div>
  );
};

export default Restaurants;
