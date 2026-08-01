import React, { useState } from 'react'
import './Home.css'
import Header from '../../components/Navbar/Header/Header'
import ExploreMenu from '../../components/Navbar/ExploreMenu/ExploreMenu'
import Restaurants from '../../components/Restaurants/Restaurants'
import FoodDisplay from '../../components/Navbar/FoodDisplay/FoodDisplay'
import AppDownload from '../../components/AppDownload/AppDownload'
const Home = () => {

    const [category, setCategory] = useState("All");
    return (
        <div>
            <Header />
            <div className="container">
                <ExploreMenu category={category} setCategory={setCategory} />
                <Restaurants setCategory={setCategory} />
                <FoodDisplay category={category} setCategory={setCategory} />
                <AppDownload />
            </div>
        </div>
    )
}

export default Home
