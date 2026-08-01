import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    const url = "https://food-del-backend-fsk9.onrender.com";
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

    // ✅ Fetch Food List (with premium Unsplash image mapping and safe ID mapping)
    const fetchFoodList = async () => {
        const premiumFoodPhotos = [
            "photo-1546069901-ba9599a7e63c", "photo-1565299624946-b28f40a0ae38", 
            "photo-1565958011703-44f9829ba187", "photo-1482049016688-2d3e1b311543", 
            "photo-1484723091739-30a097e8f929", "photo-1498837167922-ddd27525d352", 
            "photo-1467003909585-2f8a72700288", "photo-1476224203421-9ac39bcb3327", 
            "photo-1490645935967-10de6ba17061", "photo-1504674900247-0877df9cc836", 
            "photo-1512621776951-a57141f2eefd", "photo-1513104890138-7c749659a591", 
            "photo-1528279027-68f0d7fce9f1", "photo-1473093295043-cdd812d0e601", 
            "photo-1540189549336-e6e99c3679fe", "photo-1555939594-58d7cb561ad1", 
            "photo-1567620905732-2d1ec7ab7445", "photo-1460306855393-0410f61241c7", 
            "photo-1544025162-d76694265947", "photo-1493770308161-fd81a649fbb2", 
            "photo-1534422298391-e4f8c172dddb", "photo-1551183053-bf91a1d81141", 
            "photo-1532636875364-159e6973c3b5", "photo-1560684352-8497838a2229", 
            "photo-1506084868230-bb9d95c24759", "photo-1511690656952-34342bb7c2f2", 
            "photo-1455619452474-d2be8b1e70cd", "photo-1504754524776-8f4f37790ca0", 
            "photo-1563379091339-03b21ab4a4f8", "photo-1589301760014-d929f3979dbc", 
            "photo-1543339308-43e59d6b73a6", "photo-1533089860892-a7c6f0a88666", 
            "photo-1519708227418-c8fd9a32b7a2", "photo-1551818255-e6e10975bc17", 
            "photo-1541832676-9b763b0239ab", "photo-1550547660-d9450f859349", 
            "photo-1515003848601-20a5ab7f1b23", "photo-1529042410759-befb1204b468", 
            "photo-1574484284002-952d92456975", "photo-1594212699903-ec8a3eca50f5", 
            "photo-1585238342024-78d387f4a707", "photo-1559925393-8be0ec4767c8", 
            "photo-1606787366850-de6330128bfc", "photo-1608897013039-887f21d8c804", 
            "photo-1578985545062-69928b1d9587", "photo-1536304997881-a372c179924b", 
            "photo-1463183547434-a581660f624c", "photo-1589302168068-9646b4f93c21", 
            "photo-1551024601-bec78aea704b", "photo-1604382354936-07c5d9983bd3", 
            "photo-1508737027454-e6454ef45afd", "photo-1505253716362-afaea1d3d1af", 
            "photo-1618219908412-a29a1bb7b86e", "photo-1626082927389-6cd097cdc6ec", 
            "photo-1624462966581-bc6d768cbce5", "photo-1625813506062-0aeb1d7a094b", 
            "photo-1541014741259-df5290bc0087", "photo-1534080391025-0979e8304b2b", 
            "photo-1563729784474-d77dbb933a9e", "photo-1588195538326-c5b1e9f80a1b", 
            "photo-1612203987029-7f72421773f3", "photo-1600891964599-f61ba0e24092", 
            "photo-1598214886806-c87b84b7078b", "photo-1550617931-e17a7b70dce2", 
            "photo-1579372786545-d24232daf58c", "photo-1586528116311-ad8dd3c8310d",
            "photo-1569058242253-92a9c755a0ec", "photo-1504118543353-0195b4c0b3e5", 
            "photo-1504387828074-da7966a95474", "photo-1525351484163-7529414344d8", 
            "photo-1547496502-affa22d38842", "photo-1550258987-190a2d41a8ba", 
            "photo-1558961303-1f666c8665c1", "photo-1559183130-815174e56f66", 
            "photo-1560180474-e8563fd75bab", "photo-1560806887-1e4cd0b6cbd6", 
            "photo-1564759996738-80f4a88f49a7", "photo-1565299585323-38d6b0865b47", 
            "photo-1567620832903-9fc6debc209f", "photo-1576618148400-f54bed99fcfd", 
            "photo-1582196016295-f8c894d3e5db", "photo-1585934580926-1d1101f07b71", 
            "photo-1588166524941-3bf61a9c41db", "photo-1590947132387-155cc02f3212", 
            "photo-1593560708920-61dd98c46a4e", "photo-1598515214211-89d3c73ae83b", 
            "photo-1598946754002-443b7156942c", "photo-1600271886742-f049cd451bba", 
            "photo-1600891964092-4316c288032e", "photo-1603048588665-791ca8aea617", 
            "photo-1604152135912-04a022e23696", "photo-1604908176997-125f25cc6f3d", 
            "photo-1605493724144-185458652348", "photo-1607349913338-fca6f7fc42d0", 
            "photo-1610614819513-58e34989848b", "photo-1611143669185-af224c5e3252", 
            "photo-1615485290382-441e4d049cb5", "photo-1616641869312-ffd2a3b934f0", 
            "photo-1617347454431-f49d7ff5c3b1", "photo-1618219942942-555121b63660", 
            "photo-1618414503936-0546d2a1c22d", "photo-1621510456681-23a23cfb5f57", 
            "photo-1621961476414-e6c7348981f2", "photo-1623689046288-c70a88b508f7", 
            "photo-1625244724120-1fd1d34d00f6", "photo-1626804475297-400050e55b4e", 
            "photo-1627308595229-7830a5c91f9f", "photo-1628294895522-636c345f7785", 
            "photo-1631709497146-a239efc74a1a", "photo-1632778149955-e80f8ceca2e8", 
            "photo-1645112411341-6c4fd023714a", "photo-1647089069507-6799042b58ea"
        ];
        try {
            const response = await axios.get(url + "/api/food/list");
            const mappedData = response.data.data.map((item, index) => {
                const photoId = premiumFoodPhotos[index % premiumFoodPhotos.length];
                const cleanId = item._id || item.id;
                return {
                    ...item,
                    image: `https://images.unsplash.com/${photoId}?w=600&auto=format&fit=crop&q=80`,
                    id: cleanId,
                };
            });

            setFoodList(mappedData);
        } catch (error) {
            console.error("Failed to fetch food list:", error);
        }
    };

    const loadCartData = async (token) => {
        try {
            const response = await axios.post(
                url + "/api/cart/get",
                {},
                { headers: { token } }
            );

            console.log("🔥 Cart Data Response:", response.data);

            const fetchedCart = response.data.cartData || {}; // Default to empty object
            setCartItems(fetchedCart);

            // Store in localStorage for persistence
            localStorage.setItem("cartItems", JSON.stringify(fetchedCart));

        } catch (error) {
            console.error("Failed to load cart data:", error);
        }
    };

    useEffect(() => {
        async function loadData() {
            await fetchFoodList();

            // Always load cart from localStorage first (works for guests & logged in)
            const savedCart = JSON.parse(localStorage.getItem("cartItems")) || {};
            setCartItems(savedCart);

            const savedToken = localStorage.getItem("token");
            if (savedToken) {
                setToken(savedToken);
                // Then fetch from backend to sync latest data
                await loadCartData(savedToken);
            }
        }
        loadData();
    }, []);

   


    useEffect(() => {
        console.log("🔥 Updated cartItems:", cartItems); // ✅ Log after state updates
    }, [cartItems]); // ✅ React when cartItems changes


    const [searchQuery, setSearchQuery] = useState("");
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode");
        }
    }, [isDarkMode]);

    // ✅ Context Value
    const contextValue = {
        food_list,
        setFoodList,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken,
        searchQuery,
        setSearchQuery,
        isDarkMode,
        setIsDarkMode
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
