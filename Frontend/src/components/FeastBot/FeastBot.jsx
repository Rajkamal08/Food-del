import React, { useState, useEffect, useRef, useContext } from 'react';
import { StoreContext } from '../../context/StoreContext.jsx';
import { useToast } from '../Toast/Toast.jsx';
import './FeastBot.css';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Plus, 
  ShoppingBag, 
  Utensils 
} from 'lucide-react';

const FeastBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([
        { 
            sender: 'bot', 
            text: "👋 Hi! I'm FeastBot, your personal AI Chef & Food Butler. Ask me for recommendations, nutrition analysis, or custom pairings!",
            time: new Date() 
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const showToast = useToast();

    const { food_list, cartItems, addToCart, url } = useContext(StoreContext);

    // Scroll to bottom on new message
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isTyping]);

    const handleSend = (textToSend) => {
        const query = textToSend || input;
        if (!query.trim()) return;

        // User message
        const userMsg = { sender: 'user', text: query, time: new Date() };
        setMessages(prev => [...prev, userMsg]);
        if (!textToSend) setInput("");

        // Trigger typing
        setIsTyping(true);

        setTimeout(() => {
            setIsTyping(false);
            const botResponse = generateBotResponse(query.toLowerCase());
            setMessages(prev => [...prev, botResponse]);
        }, 800);
    };

    const generateBotResponse = (query) => {
        let text = "";
        let recommendedItems = [];

        // 1. Check for health / veg / salad queries
        if (query.includes('health') || query.includes('diet') || query.includes('veg') || query.includes('salad')) {
            const salads = food_list.filter(f => f.category === 'Salad' || f.category === 'Pure Veg').slice(0, 2);
            text = "Here are some ultra-fresh, nutrient-dense options I recommend for a healthy, guilt-free meal! 🥗";
            recommendedItems = salads;
        } 
        // 2. Check for spicy / heavy options
        else if (query.includes('spicy') || query.includes('rolls') || query.includes('noodles') || query.includes('burger')) {
            const spicy = food_list.filter(f => ['Rolls', 'Noodles', 'Sandwich'].includes(f.category)).slice(0, 2);
            text = "Craving something savoury and delicious? These top-rated choices are packed with bold, satisfying flavours! 🔥";
            recommendedItems = spicy;
        } 
        // 3. Check for dessert / sweets
        else if (query.includes('sweet') || query.includes('dessert') || query.includes('cake') || query.includes('chocolate')) {
            const sweets = food_list.filter(f => ['Deserts', 'Cake'].includes(f.category)).slice(0, 2);
            text = "Time for something sweet! Indulge in our chef's signature handcrafted desserts. 🍰";
            recommendedItems = sweets;
        }
        // 4. Check for cart-based pairing suggestions
        else if (query.includes('pair') || query.includes('cart') || query.includes('with my')) {
            const activeCartKeys = Object.keys(cartItems).filter(k => cartItems[k] > 0);
            if (activeCartKeys.length === 0) {
                text = "Your cart is empty right now! Add some dishes first, and I will suggest perfect combinations (like garlic bread with pasta!). 🍽️";
            } else {
                const firstCartItem = food_list.find(f => activeCartKeys.includes(String(f.id || f._id)));
                const firstCat = firstCartItem ? firstCartItem.category : 'Salad';
                
                // Recommend complementary categories
                const complementCats = {
                    Salad: ['Sandwich', 'Pasta'],
                    Rolls: ['Salad', 'Deserts'],
                    Deserts: ['Cake'],
                    Sandwich: ['Salad', 'Noodles'],
                    Cake: ['Deserts'],
                    'Pure Veg': ['Pasta', 'Salad'],
                    Pasta: ['Salad', 'Pure Veg'],
                    Noodles: ['Rolls', 'Pure Veg'],
                };
                
                const targets = complementCats[firstCat] || ['Salad'];
                const match = food_list.filter(f => targets.includes(f.category)).slice(0, 2);
                
                text = `I see you have ${firstCartItem.name} in your cart! Here are some complementary pairings that chefs highly recommend:`;
                recommendedItems = match;
            }
        } 
        // 5. Default fallback response
        else {
            const randomDishes = food_list.sort(() => 0.5 - Math.random()).slice(0, 2);
            text = "I'm on it! I searched FeastFlow's gourmet menu and selected these top choices for you. Let me know if you would like something else! 🍽️";
            recommendedItems = randomDishes;
        }

        return {
            sender: 'bot',
            text,
            items: recommendedItems,
            time: new Date()
        };
    };

    const handleAddFromBot = (item) => {
        addToCart(item.id || item._id);
        showToast(`${item.name} added to cart!`, "success");
    };

    return (
        <div className={`feastbot-widget ${isOpen ? 'open' : ''}`}>
            {/* Glow Bubble trigger */}
            {!isOpen && (
                <button 
                    className='feastbot-trigger' 
                    onClick={() => setIsOpen(true)}
                    aria-label='Open AI Butler'
                >
                    <span className='feastbot-trigger-pulse' />
                    <Bot size={22} className='trigger-icon' />
                    <span className='trigger-text'>FeastBot</span>
                </button>
            )}

            {/* Chat Drawer */}
            {isOpen && (
                <div className='feastbot-chat'>
                    {/* Header */}
                    <div className='feastbot-header'>
                        <div className='feastbot-brand'>
                            <Bot size={18} className='brand-icon' />
                            <div>
                                <h4>FeastBot</h4>
                                <span className='status-pill'>Online AI Assistant</span>
                            </div>
                        </div>
                        <button 
                            className='feastbot-close' 
                            onClick={() => setIsOpen(false)}
                            aria-label='Close AI Butler'
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Messages Panel */}
                    <div className='feastbot-messages'>
                        {messages.map((msg, index) => (
                            <div key={index} className={`msg-row ${msg.sender}`}>
                                {msg.sender === 'bot' && <Bot size={16} className='msg-bot-avatar' />}
                                <div className='msg-bubble-wrap'>
                                    <div className='msg-bubble'>
                                        <p className='msg-text'>{msg.text}</p>
                                        
                                        {/* Inline Recommended Dishes */}
                                        {msg.items && msg.items.length > 0 && (
                                            <div className='msg-items-grid'>
                                                {msg.items.map((item) => {
                                                    const imgSrc = item.image && item.image.startsWith('http')
                                                        ? item.image
                                                        : `${url}/images/${item.image}`;
                                                    return (
                                                        <div key={item.id || item._id} className='msg-food-card'>
                                                            <img src={imgSrc} alt={item.name} className='card-img' />
                                                            <div className='card-info'>
                                                                <h5 className='card-name'>{item.name}</h5>
                                                                <div className='card-footer-row'>
                                                                    <span className='card-price'>₹{item.price}</span>
                                                                    <button 
                                                                        onClick={() => handleAddFromBot(item)}
                                                                        className='card-add-btn'
                                                                    >
                                                                        <Plus size={10} />
                                                                        <span>Add</span>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                    <span className='msg-time'>
                                        {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {/* Typing Indicators */}
                        {isTyping && (
                            <div className='msg-row bot'>
                                <Bot size={16} className='msg-bot-avatar' />
                                <div className='msg-bubble typing-bubble'>
                                    <span className='dot' />
                                    <span className='dot' />
                                    <span className='dot' />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Predefined prompt pills */}
                    <div className='feastbot-prompts'>
                        <button onClick={() => handleSend("Suggest a healthy veggie meal 🥗")}>
                            🥗 Healthy Combo
                        </button>
                        <button onClick={() => handleSend("Recommend something spicy 🔥")}>
                            🔥 Spicy Choice
                        </button>
                        <button onClick={() => handleSend("What pairs best with my cart? 🍝")}>
                            🍝 Cart Pairing
                        </button>
                        <button onClick={() => handleSend("Surprise me with a dessert 🍰")}>
                            🍰 Dessert
                        </button>
                    </div>

                    {/* Footer input form */}
                    <form 
                        className='feastbot-input-area' 
                        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    >
                        <input 
                            type='text' 
                            placeholder='Ask FeastBot anything...' 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button type='submit' className='send-btn' aria-label='Send message'>
                            <Send size={14} />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default FeastBot;
