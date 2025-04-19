import React, { useContext } from 'react';
import './FoodDisplay.css';
import { StoreContext } from '../../../context/StoreContext.jsx';
import FoodItem from '../FoodItem/FoodItem';

const FoodDisplay = ({ category }) => {
    const { food_list } = useContext(StoreContext);

    return (
        <div className='food-display' id="food-display">
            <h2>Top dishes near you</h2>
            <div className="food-display-list">
                {food_list.map((item, index) => {
                    if (category === "All" || category === item.category) {
                        // console.log("✅ FoodDisplay item id:", item.id);
                        return (
                            <FoodItem
                                key={item.id || `food-${index}`} // Use fallback key if id is missing
                                id={item.id}
                                name={item.name}
                                description={item.description}
                                price={item.price}
                                image={item.image}
                            />
                        );
                    }
                    return null;
                })}



            </div>
        </div>
    );
}
export default FoodDisplay;
