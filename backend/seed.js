import mongoose from "mongoose";
import dotenv from "dotenv";
import foodModel from "./models/foodModel.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const dummyFood = [
  // SALADS
  {
    name: "Greek Salad",
    description: "Fresh cucumbers, tomatoes, olives, feta cheese tossed in olive oil and oregano. A Mediterranean classic bursting with flavor.",
    price: 12,
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&h=500&fit=crop",
    category: "Salad",
  },
  {
    name: "Veg Vegan Salad",
    description: "A vibrant mix of seasonal vegetables, chickpeas, and avocado drizzled with lemon-tahini dressing. 100% plant-based.",
    price: 18,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=500&fit=crop",
    category: "Salad",
  },
  {
    name: "Clover Salad",
    description: "Garden-fresh greens with roasted beets, candied walnuts, and goat cheese. Topped with a balsamic glaze.",
    price: 16,
    image: "https://images.unsplash.com/photo-1607532941433-304659e8198a?w=500&h=500&fit=crop",
    category: "Salad",
  },
  {
    name: "Chicken Salad",
    description: "Grilled chicken breast on a bed of romaine with Caesar dressing, croutons, and shaved parmesan. Protein-packed and satisfying.",
    price: 24,
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=500&h=500&fit=crop",
    category: "Salad",
  },
  // ROLLS
  {
    name: "Lasagna Rolls",
    description: "Pasta sheets rolled with ricotta, spinach, and beef, baked in rich tomato sauce. A comforting Italian classic.",
    price: 34,
    image: "https://images.unsplash.com/photo-1574894709920-11b28be1e588?w=500&h=500&fit=crop",
    category: "Rolls",
  },
  {
    name: "Peri Peri Rolls",
    description: "Spicy peri peri marinated chicken wrapped in soft flatbread with coleslaw and garlic mayo. Fiery and addictive!",
    price: 12,
    image: "https://images.unsplash.com/photo-1626200926715-bfa5c7e1030f?w=500&h=500&fit=crop",
    category: "Rolls",
  },
  {
    name: "Chicken Rolls",
    description: "Tender chicken tikka wrapped in a soft whole-wheat roti with onions, chutney, and fresh lime. Street food at its finest.",
    price: 20,
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500&h=500&fit=crop",
    category: "Rolls",
  },
  {
    name: "Veg Rolls",
    description: "Crispy fried vegetables and paneer wrapped in flaky pastry. Served with sweet chili dipping sauce.",
    price: 15,
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&h=500&fit=crop",
    category: "Rolls",
  },
  // DESERTS
  {
    name: "Ripple Ice Cream",
    description: "Creamy vanilla ice cream with gorgeous raspberry ripple swirls. Made with real fruit and no artificial colors.",
    price: 14,
    image: "https://images.unsplash.com/photo-1488900128323-21503983a07e?w=500&h=500&fit=crop",
    category: "Deserts",
  },
  {
    name: "Fruit Ice Cream",
    description: "Three scoops of seasonal fruit sorbet — mango, strawberry, and passion fruit. Refreshing and naturally sweet.",
    price: 22,
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&h=500&fit=crop",
    category: "Deserts",
  },
  {
    name: "Jar Ice Cream",
    description: "Layered cookie crumble, chocolate fudge, and vanilla cream in a cute mason jar. Instagram-worthy and delicious.",
    price: 10,
    image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&h=500&fit=crop",
    category: "Deserts",
  },
  {
    name: "Vanilla Ice Cream",
    description: "Classic soft-serve vanilla ice cream with Madagascar vanilla bean. Sometimes simple is the best.",
    price: 12,
    image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=500&h=500&fit=crop",
    category: "Deserts",
  },
  // SANDWICHES
  {
    name: "Chicken Sandwich",
    description: "Crispy fried chicken fillet with lettuce, tomato, pickles and sriracha mayo on a toasted brioche bun.",
    price: 12,
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&h=500&fit=crop",
    category: "Sandwich",
  },
  {
    name: "Vegan Sandwich",
    description: "Roasted veggies, hummus, avocado, and sprouts stacked on multigrain bread. Nutritious and incredibly flavorful.",
    price: 18,
    image: "https://images.unsplash.com/photo-1619894373307-f27357c91f17?w=500&h=500&fit=crop",
    category: "Sandwich",
  },
  {
    name: "Grilled Sandwich",
    description: "Double-pressed sandwich with mozzarella, sun-dried tomatoes, and pesto. Golden crispy outside, gooey inside.",
    price: 16,
    image: "https://images.unsplash.com/photo-1481070414801-51fd732d7184?w=500&h=500&fit=crop",
    category: "Sandwich",
  },
  {
    name: "Bread Sandwich",
    description: "Classic club sandwich with turkey, bacon, cheese, and fresh veggies. Three layers of pure satisfaction.",
    price: 24,
    image: "https://images.unsplash.com/photo-1553909489-cd47e0907980?w=500&h=500&fit=crop",
    category: "Sandwich",
  },
  // CAKES
  {
    name: "Cup Cake",
    description: "Fluffy vanilla cupcake topped with swirls of buttercream frosting and rainbow sprinkles. Perfect for any occasion.",
    price: 14,
    image: "https://images.unsplash.com/photo-1587668178277-295251f900ce?w=500&h=500&fit=crop",
    category: "Cake",
  },
  {
    name: "Vegan Cake",
    description: "Moist chocolate cake made entirely plant-based. You won't believe it has no eggs, dairy, or butter!",
    price: 12,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=500&fit=crop",
    category: "Cake",
  },
  {
    name: "Butterscotch Cake",
    description: "Layers of buttery caramel sponge with butterscotch cream frosting. Rich, indulgent, and absolutely dreamy.",
    price: 20,
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500&h=500&fit=crop",
    category: "Cake",
  },
  {
    name: "Sliced Cake",
    description: "A generous slice of our signature rainbow cake with five layers of colorful sponge and vanilla cream.",
    price: 15,
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&h=500&fit=crop",
    category: "Cake",
  },
  // PURE VEG
  {
    name: "Garlic Mushroom",
    description: "Pan-seared button mushrooms in garlic butter, herbs, and a splash of white wine. Served with crusty bread.",
    price: 14,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&h=500&fit=crop",
    category: "Pure Veg",
  },
  {
    name: "Fried Cauliflower",
    description: "Crispy beer-battered cauliflower florets with smoky paprika dip. The ultimate vegan comfort snack.",
    price: 22,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=500&fit=crop",
    category: "Pure Veg",
  },
  {
    name: "Mix Veg Pulao",
    description: "Aromatic basmati rice cooked with seasonal vegetables and whole spices. Served with raita and papad.",
    price: 10,
    image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&h=500&fit=crop",
    category: "Pure Veg",
  },
  {
    name: "Rice Zucchini",
    description: "Zucchini stuffed with herb rice, sun-dried tomatoes, and pine nuts. A Mediterranean-inspired light meal.",
    price: 12,
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&h=500&fit=crop",
    category: "Pure Veg",
  },
  // PASTA
  {
    name: "Cheese Pasta",
    description: "Four-cheese pasta with fontina, parmesan, gorgonzola, and mozzarella. Creamy, stringy, and utterly irresistible.",
    price: 12,
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&h=500&fit=crop",
    category: "Pasta",
  },
  {
    name: "Tomato Pasta",
    description: "Al dente pasta in a rustic San Marzano tomato sauce with fresh basil and a drizzle of extra virgin olive oil.",
    price: 18,
    image: "https://images.unsplash.com/photo-1551183053-bf91798d792b?w=500&h=500&fit=crop",
    category: "Pasta",
  },
  {
    name: "Creamy Pasta",
    description: "Penne pasta in velvety Alfredo sauce with mushrooms, spinach, and black pepper. Rich comfort in every bite.",
    price: 16,
    image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=500&h=500&fit=crop",
    category: "Pasta",
  },
  {
    name: "Chicken Pasta",
    description: "Grilled chicken strips tossed with pesto, cherry tomatoes, and linguine. Light yet deeply satisfying.",
    price: 24,
    image: "https://images.unsplash.com/photo-1552056776-9b5657a15a27?w=500&h=500&fit=crop",
    category: "Pasta",
  },
  // NOODLES
  {
    name: "Butter Noodles",
    description: "Silky egg noodles tossed in brown butter, sage, and parmesan. Simple ingredients, extraordinary flavor.",
    price: 14,
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&h=500&fit=crop",
    category: "Noodles",
  },
  {
    name: "Veg Noodles",
    description: "Wok-tossed rice noodles with colorful bell peppers, snap peas, and tofu in a savory soy-ginger glaze.",
    price: 12,
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&h=500&fit=crop",
    category: "Noodles",
  },
  {
    name: "Somen Noodles",
    description: "Delicate Japanese somen noodles in a chilled dashi broth with scallions and grated ginger. Refreshingly light.",
    price: 20,
    image: "https://images.unsplash.com/photo-1623341214825-9f4f963727da?w=500&h=500&fit=crop",
    category: "Noodles",
  },
  {
    name: "Cooked Noodles",
    description: "Classic Hong Kong-style pan-fried noodles with shrimp, Chinese sausage, and oyster sauce. Crispy meets saucy!",
    price: 15,
    image: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=500&h=500&fit=crop",
    category: "Noodles",
  },
  // SALADS
  {
    name: "Caesar Salad",
    description: "Crispy romaine lettuce, herb croutons, and shredded parmesan tossed in our classic creamy Caesar dressing.",
    price: 16,
    image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500&h=500&fit=crop",
    category: "Salad",
  },
  {
    name: "Avocado Quinoa Salad",
    description: "Nutritious mix of white quinoa, diced avocado, cherry tomatoes, and cucumber with a light lime vinaigrette.",
    price: 20,
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&h=500&fit=crop",
    category: "Salad",
  },
  {
    name: "Beetroot & Goat Cheese Salad",
    description: "Earthy roasted beetroots, tangy goat cheese, arugula, and candied walnuts with a balsamic drizzle.",
    price: 17,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=500&fit=crop",
    category: "Salad",
  },
  {
    name: "Caprese Salad",
    description: "Slices of vine-ripened tomatoes, fresh buffalo mozzarella, and sweet basil leaves, drizzled with olive oil.",
    price: 15,
    image: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=500&h=500&fit=crop",
    category: "Salad",
  },
  // ROLLS
  {
    name: "Spring Rolls",
    description: "Crispy fried wrappers packed with sautéed glass noodles, cabbage, carrots, and sweet chili dipping sauce.",
    price: 10,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&h=500&fit=crop",
    category: "Rolls",
  },
  {
    name: "Paneer Kathi Roll",
    description: "Spiced paneer cubes, crunchy peppers, and sweet sliced onions wrapped in a flaky paratha flatbread.",
    price: 12,
    image: "https://images.unsplash.com/photo-1626200926715-bfa5c7e1030f?w=500&h=500&fit=crop",
    category: "Rolls",
  },
  {
    name: "Egg Roll",
    description: "Classic street-style double egg omelette rolled inside a warm flatbread with spices, onions, and zesty lime.",
    price: 9,
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500&h=500&fit=crop",
    category: "Rolls",
  },
  {
    name: "California Roll",
    description: "Authentic sushi rolls filled with crab meat, avocado, and cucumber, dusted with toasted sesame seeds.",
    price: 25,
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&h=500&fit=crop",
    category: "Rolls",
  },
  // DESERTS
  {
    name: "Chocolate Brownie",
    description: "Warm, gooey chocolate fudge brownie with a crackly top, loaded with dark chocolate chunks.",
    price: 11,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&h=500&fit=crop",
    category: "Deserts",
  },
  {
    name: "Strawberry Cheesecake",
    description: "Creamy New York-style cheesecake on a graham cracker crust, topped with fresh strawberry compote glaze.",
    price: 18,
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&h=500&fit=crop",
    category: "Deserts",
  },
  {
    name: "Tiramisu Cup",
    description: "Layers of coffee-soaked ladyfingers, whipped mascarpone cheese cream, and cocoa powder dust.",
    price: 22,
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&h=500&fit=crop",
    category: "Deserts",
  },
  {
    name: "Macaron Tower",
    description: "Assortment of colorful French macarons filled with chocolate ganache, raspberry jelly, and pistachio butter.",
    price: 30,
    image: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=500&h=500&fit=crop",
    category: "Deserts",
  },
  // SANDWICHES
  {
    name: "Club Sandwich",
    description: "Triple-decker sandwich loaded with turkey bacon, grilled chicken, egg, cheddar cheese, and mayo.",
    price: 16,
    image: "https://images.unsplash.com/photo-1554522248-037248d0a5a2?w=500&h=500&fit=crop",
    category: "Sandwich",
  },
  {
    name: "Paneer Tikka Sandwich",
    description: "Marinated paneer cooked in a tandoor, layered with green chutney, mint, and toasted sourdough bread.",
    price: 14,
    image: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=500&h=500&fit=crop",
    category: "Sandwich",
  },
  {
    name: "Avocado Toast",
    description: "Mashed avocado, red pepper flakes, pumpkin seeds, and microgreens on toasted artisanal rye bread.",
    price: 19,
    image: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=500&h=500&fit=crop",
    category: "Sandwich",
  },
  {
    name: "Tuna Melt",
    description: "Tuna salad mixed with green onions and celery, topped with melted cheddar on toasted english muffins.",
    price: 17,
    image: "https://images.unsplash.com/photo-1619096305588-d6043e4b3dea?w=500&h=500&fit=crop",
    category: "Sandwich",
  },
  // CAKES
  {
    name: "Red Velvet Cake",
    description: "Classic scarlet velvet cake layers frosted with rich cream cheese icing and vanilla crumbs.",
    price: 26,
    image: "https://images.unsplash.com/photo-1586985289688-ca924c755a0e?w=500&h=500&fit=crop",
    category: "Cake",
  },
  {
    name: "Chocolate Fudge Cake",
    description: "Decadent triple-layered chocolate sponge covered in silky, rich hot chocolate fudge frosting.",
    price: 28,
    image: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=500&h=500&fit=crop",
    category: "Cake",
  },
  {
    name: "Carrot Cake",
    description: "Moist spiced sponge packed with grated carrots, walnuts, and raisins, frosted with cream cheese frosting.",
    price: 22,
    image: "https://images.unsplash.com/photo-1622896784083-cc051313dbab?w=500&h=500&fit=crop",
    category: "Cake",
  },
  {
    name: "Lemon Drizzle Cake",
    description: "Zesty, moist lemon cake soaked with fresh lemon juice syrup, finished with a sweet sugar glaze.",
    price: 18,
    image: "https://images.unsplash.com/photo-1535141192574-5d4897c13636?w=500&h=500&fit=crop",
    category: "Cake",
  },
  // PURE VEG
  {
    name: "Paneer Butter Masala",
    description: "Cubes of fresh paneer cooked in a luxurious, creamy tomato and cashew nut gravy, flavored with fenugreek.",
    price: 28,
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&h=500&fit=crop",
    category: "Pure Veg",
  },
  {
    name: "Dal Makhani with Naan",
    description: "Slow-cooked black lentils and red kidney beans simmered overnight with butter and fresh cream. Served with Naan.",
    price: 24,
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&h=500&fit=crop",
    category: "Pure Veg",
  },
  {
    name: "Crispy Fried Corn",
    description: "Tender sweet corn kernels battered, deep-fried until golden, and tossed with spices, onion, and lime.",
    price: 14,
    image: "https://images.unsplash.com/photo-1518492104633-130d0cc84637?w=500&h=500&fit=crop",
    category: "Pure Veg",
  },
  {
    name: "Veg Manchurian",
    description: "Fried vegetable dumplings tossed in a savory, spicy, and tangy soy-based Chinese Manchurian gravy.",
    price: 18,
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&h=500&fit=crop",
    category: "Pure Veg",
  },
  // PASTA
  {
    name: "Pesto Penne",
    description: "Penne pasta tossed in a vibrant sauce of fresh basil leaves, pine nuts, garlic, parmesan, and olive oil.",
    price: 22,
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=500&h=500&fit=crop",
    category: "Pasta",
  },
  {
    name: "Spaghetti Carbonara",
    description: "Classic Roman spaghetti tossed with pan-seared guanciale egg yolks, pecorino romano, and black pepper.",
    price: 28,
    image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=500&h=500&fit=crop",
    category: "Pasta",
  },
  {
    name: "Ravioli Sage Butter",
    description: "Delicate cheese ravioli pan-tossed in brown butter sauce infused with fresh sage leaves and black pepper.",
    price: 32,
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&h=500&fit=crop",
    category: "Pasta",
  },
  {
    name: "Baked Lasagna",
    description: "Layers of pasta, meat ragù, creamy béchamel, and mozzarella, baked until golden and bubbling.",
    price: 30,
    image: "https://images.unsplash.com/photo-1574894709920-11b28be1e588?w=500&h=500&fit=crop",
    category: "Pasta",
  },
  // NOODLES
  {
    name: "Spicy Schezwan Noodles",
    description: "Wok-fried egg noodles tossed with shredded chicken, crunchy vegetables, and spicy red Schezwan chili paste.",
    price: 16,
    image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=500&h=500&fit=crop",
    category: "Noodles",
  },
  {
    name: "Pad Thai Noodles",
    description: "Flat rice noodles stir-fried with scrambled eggs, tofu, bean sprouts, crushed peanuts, and tangy tamarind.",
    price: 24,
    image: "https://images.unsplash.com/photo-1626804475297-400050e55b4e?w=500&h=500&fit=crop",
    category: "Noodles",
  },
  {
    name: "Garlic Hakka Noodles",
    description: "Thin noodles tossed with toasted garlic slivers, spring onions, capsicum, and cabbage in soy sauce.",
    price: 14,
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&h=500&fit=crop",
    category: "Noodles",
  },
  {
    name: "Singapore Vermicelli",
    description: "Thin rice vermicelli noodles sautéed with curry powder, sweet bell peppers, onions, carrots, and scrambled eggs.",
    price: 20,
    image: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=500&h=500&fit=crop",
    category: "Noodles",
  },
];

const seedDB = async () => {
  await connectDB();
  console.log("🌱 Seeding Database...");
  try {
    await foodModel.deleteMany();
    await foodModel.insertMany(dummyFood);
    console.log(`✅ Database Seeded Successfully with ${dummyFood.length} items!`);
  } catch (error) {
    console.error("❌ Error Seeding Database", error);
  } finally {
    process.exit();
  }
};

seedDB();
