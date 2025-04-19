import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    const url = "http://localhost:4000";
    const [token, setToken] = useState("");
    const [food_list, setFoodList] = useState([]);



    const addToCart = async (itemId) => {
        setCartItems((prev) => {
            const updatedCart = {
                ...prev,
                [itemId]: (prev[itemId] || 0) + 1,
            };

            // ✅ Save updated cart to localStorage
            localStorage.setItem("cartItems", JSON.stringify(updatedCart));

            return updatedCart;
        });

        if (token) {
            await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
        }
    };

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => {
            if (!prev[itemId]) return prev;

            const updatedCart = { ...prev };
            updatedCart[itemId] -= 1;

            if (updatedCart[itemId] <= 0) {
                delete updatedCart[itemId];
            }

            // ✅ Save updated cart to localStorage
            localStorage.setItem("cartItems", JSON.stringify(updatedCart));

            return updatedCart;
        });

        if (token) {
            await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
        }
    };

    // ✅ Add to Cart
    // const addToCart = async (itemId) => {
    //     setCartItems((prev) => ({
    //         ...prev,
    //         [itemId]: (prev[itemId] || 0) + 1,
    //     }));
    //     if (token) {
    //         await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
    //     }
    // };

    // // ✅ Remove from Cart
    // const removeFromCart = async (itemId) => {
    //     setCartItems((prev) => {
    //         if (!prev[itemId]) return prev;

    //         const updatedCart = { ...prev };
    //         updatedCart[itemId] -= 1;

    //         if (updatedCart[itemId] <= 0) {
    //             delete updatedCart[itemId];
    //         }

    //         return { ...updatedCart };
    //     });

    //     if (token) {
    //         await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
    //     }
    // };

    // ✅ Get Total Cart Amount (with guard clause)
    const getTotalCartAmount = () => {
        let totalAmount = 0;
        if (!food_list || food_list.length === 0) return totalAmount; // Guard clause

        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find(
                    (product) => String(product.id) === String(item)
                );
                if (itemInfo && itemInfo.price !== undefined) {
                    totalAmount += itemInfo.price * cartItems[item];
                }
            }
        }
        return totalAmount;
    };

    // ✅ Fetch Food List (with safe ID mapping)
    const fetchFoodList = async () => {
        try {
            const response = await axios.get(url + "/api/food/list");
            const mappedData = response.data.data.map((item, index) => ({
                ...item,
                id: item.id || item._id || `${item.name}-${index}` || index, // Add fallback index
            }));

            setFoodList(mappedData);
        } catch (error) {
            console.error("Failed to fetch food list:", error);
        }
    };

    // const loadCartData = async (token) => {
    //     try {
    //         const response = await axios.post(
    //             url + "/api/cart/get",
    //             {},
    //             { headers: { token } }
    //         );
    //         console.log("🔥 Cart Data Response:", response.data);
    //         setCartItems(response.data.CartData || {}); // ✅ Fallback to empty object
    //         return response.data.CartData || {}; // ✅ Return fetched data
    //     } catch (error) {
    //         console.error("Failed to load cart data:", error);
    //     }
    // };

    const loadCartData = async (token) => {
        try {
            const response = await axios.post(
                url + "/api/cart/get",
                {},
                { headers: { token } }
            );

            console.log("🔥 Cart Data Response:", response.data);

            const fetchedCart = response.data.cartData || {}; // ✅ Default to empty object
            setCartItems(fetchedCart);

            // ✅ Store in localStorage for persistence
            localStorage.setItem("cartItems", JSON.stringify(fetchedCart));

        } catch (error) {
            console.error("Failed to load cart data:", error);
        }
    };
    useEffect(() => {
        async function loadData() {
            await fetchFoodList();

            const savedToken = localStorage.getItem("token");
            if (savedToken) {
                setToken(savedToken);

                // ✅ First, check localStorage for cart data
                const savedCart = JSON.parse(localStorage.getItem("cartItems")) || {};
                setCartItems(savedCart);

                // ✅ Then, fetch from backend to ensure latest data
                await loadCartData(savedToken);
            }
        }
        loadData();
    }, []);

    // useEffect(() => {
    //     async function loadData() {
    //         await fetchFoodList();

    //         const savedToken = localStorage.getItem("token");
    //         if (savedToken) {
    //             setToken(savedToken);
    //             await loadCartData(savedToken); // ✅ Await the state update
    //             setCartItems((prev) => ({ ...prev })); // ✅ Force state update
    //         }
    //     }
    //     loadData();
    // }, []);


    useEffect(() => {
        console.log("🔥 Updated cartItems:", cartItems); // ✅ Log after state updates
    }, [cartItems]); // ✅ React when cartItems changes


    // ✅ Context Value
    const contextValue = {
        food_list,
        setFoodList, // Fix: Correct state setter
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken,
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
