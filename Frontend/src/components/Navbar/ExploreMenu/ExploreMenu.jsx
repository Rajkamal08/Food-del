import React from 'react'

import './ExploreMenu.css'
import { menu_list } from '../../../assets/assets'
const ExploreMenu = ({ category, setCategory }) => {
    console.log("Category:", category);
    console.log("setCategory Function:", setCategory);
    return (
        <div className='explore-menu' id='explore-menu'>
            <h1>Explore Our menu</h1>
            <p className='explore-menu-text'>Choose from a diverse menu featuring mouthwatering cuisines, fresh ingredients, and expertly crafted dishes, delivered hot and fast to your doorstep for the ultimate dining experience!</p>
            <div className='explore-menu-list'>
                {menu_list.map((item, index) => {
                    return (
                        <div onClick={() => setCategory(prev => prev === item.menu_name ? "All" : item.menu_name)} key={index} className='explore-menu-list-item'>
                            <img className={category === item.menu_name ? "active" : ""} src={item.menu_image} alt="" />
                            <p>{item.menu_name}</p>
                        </div>
                    )
                })}
            </div>
            <hr />
        </div>
    )
}

export default ExploreMenu
