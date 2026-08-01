import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import foodModel from "./models/foodModel.js";

// Beautiful Unsplash images of Indian/Asian food
const premiumFoodPhotos = [
  "photo-1589302168068-9646b4f93c21", // Biryani / Rice
  "photo-1631515243349-e0cb75fb8d3a", // Curry
  "photo-1565557623262-b51c2513a641", // Tandoori / Tikka
  "photo-1601050690597-df0568f70950", // Samosa / Street
  "photo-1626082927389-6cd097cdc6ec", // Non-Veg
  "photo-1585937421612-70a008356fbe", // Dosa / Veg
  "photo-1606491956689-2ea866880c84", // Indian Sweets
  "photo-1517244683847-7456b63c5969", // Rolls / Wraps
  "photo-1546833999-b9f581a1996d", // General Indian
  "photo-1555126634-323283e090fa", // Drink / Lassi
  "photo-1610970881699-44a5587ce578", // Paneer
  "photo-1512621776951-a57141f2eefd", // Healthy Veg
  "photo-1555939594-58d7cb561ad1", // Meat
  "photo-1504674900247-0877df9cc836", // Mixed Food
  "photo-1645112411341-6c4fd023714a", // Naan / Roti
  "photo-1585937421612-70a008356fbe", // Idli
];

const categories = {
  "Street Food": {
    bases: ["Pani Puri", "Aloo Tikki Chaat", "Samosa Chaat", "Vada Pav", "Pav Bhaji", "Dahi Puri", "Kachori", "Bhel Puri", "Papdi Chaat", "Chole Bhature"],
    prefixes: ["Mumbai Special", "Delhi Style", "Spicy", "Authentic", "Crispy", "Tangy", "Classic"],
    minPrice: 80,
    maxPrice: 180
  },
  "Indian Sweets": {
    bases: ["Gulab Jamun", "Rasgulla", "Kaju Katli", "Jalebi", "Rasmalai", "Barfi", "Ladoo", "Mysore Pak", "Gajar Ka Halwa", "Soan Papdi"],
    prefixes: ["Premium", "Desi Ghee", "Saffron", "Rich", "Festive", "Fresh", "Royal"],
    minPrice: 150,
    maxPrice: 400
  },
  "Non-Veg": {
    bases: ["Butter Chicken", "Chicken Tikka Masala", "Mutton Rogan Josh", "Kadai Chicken", "Fish Curry", "Prawn Masala", "Chicken Chettinad", "Mutton Korma"],
    prefixes: ["Spicy", "Chef's Special", "Dhaba Style", "Royal", "Rich", "Punjabi", "Andhra"],
    minPrice: 350,
    maxPrice: 750
  },
  "Biryani": {
    bases: ["Hyderabadi Dum Biryani", "Lucknowi Biryani", "Kolkata Biryani", "Chicken Biryani", "Mutton Biryani", "Paneer Tikka Biryani", "Egg Biryani", "Awadhi Biryani"],
    prefixes: ["Royal", "Nawabi", "Spicy", "Authentic", "Special Dum", "Double Masala"],
    minPrice: 280,
    maxPrice: 650
  },
  "Tandoori": {
    bases: ["Chicken Tandoori", "Paneer Tikka", "Mutton Seekh Kebab", "Chicken Malai Tikka", "Fish Tikka", "Tandoori Aloo", "Mushroom Tikka", "Hariyali Kebab"],
    prefixes: ["Smoky", "Spicy", "Charcoal Grilled", "Creamy", "Afghani", "Classic"],
    minPrice: 250,
    maxPrice: 600
  },
  "Curries": {
    bases: ["Paneer Butter Masala", "Palak Paneer", "Dal Makhani", "Chana Masala", "Malai Kofta", "Bhindi Masala", "Aloo Gobi", "Mix Veg Curry", "Navratan Korma"],
    prefixes: ["Rich", "Dhaba Style", "Creamy", "Spicy", "Homestyle", "Premium", "Classic"],
    minPrice: 200,
    maxPrice: 450
  },
  "Rolls": {
    bases: ["Kathi Roll", "Chicken Tikka Roll", "Paneer Tikka Roll", "Egg Roll", "Mutton Seekh Roll", "Mushroom Roll", "Soya Chaap Roll", "Double Egg Roll"],
    prefixes: ["Kolkata Style", "Spicy", "Jumbo", "Cheesy", "Double Loaded", "Classic"],
    minPrice: 120,
    maxPrice: 280
  },
  "Drinks": {
    bases: ["Sweet Lassi", "Mango Lassi", "Masala Chai", "Filter Coffee", "Cold Coffee", "Nimbu Pani", "Jaljeera", "Rooh Afza Milk", "Buttermilk"],
    prefixes: ["Refreshing", "Chilled", "Special", "Thick", "Classic", "Premium"],
    minPrice: 50,
    maxPrice: 150
  }
};

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getPrice = (min, max) => Math.floor(Math.random() * (max - min) / 10) * 10 + min;

const generateData = () => {
  const foods = [];
  let idCounter = 1;

  for (const [categoryName, data] of Object.entries(categories)) {
    // Generate exactly 25 items per category to hit exactly 200 items (8 categories * 25 = 200)
    for (let i = 0; i < 25; i++) {
      const prefix = getRandom(data.prefixes);
      const base = getRandom(data.bases);
      const name = `${prefix} ${base}`;
      const price = getPrice(data.minPrice, data.maxPrice);
      const imageId = getRandom(premiumFoodPhotos);
      const imageUrl = `https://images.unsplash.com/${imageId}?w=600&auto=format&fit=crop&q=80`;

      foods.push({
        name,
        description: `Authentic ${name} prepared with rich Indian spices and premium ingredients. A true culinary delight.`,
        price,
        image: imageUrl, // Storing full URL directly
        category: categoryName
      });
      idCounter++;
    }
  }
  return foods;
};

const seedDB = async () => {
  try {
    console.log("Connecting to Database...");
    await connectDB();

    console.log("Wiping existing foods collection...");
    await foodModel.deleteMany({});
    console.log("Old menu wiped successfully.");

    const newFoods = generateData();
    console.log(`Inserting ${newFoods.length} authentic Indian dishes...`);
    
    await foodModel.insertMany(newFoods);
    
    console.log("✅ Seed complete! The Great FeastFlow Menu Expansion was successful.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedDB();
