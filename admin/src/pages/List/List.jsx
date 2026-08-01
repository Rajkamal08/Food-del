import React, { useState, useEffect } from 'react';
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";
import { Trash2, Sparkles } from 'lucide-react';

const List = ({ url, adminToken }) => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchList = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${url}/api/food/list`);
            if (response.data.success) {
                setList(response.data.data);
            } else {
                toast.error("Failed to load food list.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error loading dishes.");
        } finally {
            setLoading(false);
        }
    };

    const removeFood = async (foodId, foodName) => {
        if (!window.confirm(`Are you sure you want to delete "${foodName}"?`)) return;
        try {
            const response = await axios.post(`${url}/api/food/remove`, { id: foodId }, {
                headers: { token: adminToken }
            });
            if (response.data.success) {
                toast.success(response.data.message || `${foodName} deleted successfully!`);
                await fetchList();
            } else {
                toast.error(response.data.message || "Error deleting dish.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete dish.");
        }
    };

    // ✅ FIXED: Added dependency array [] to prevent infinite API rendering loops
    useEffect(() => {
        fetchList();
    }, []);

    return (
        <div className='list'>
            <div className='list__header'>
                <div className='list__title-row'>
                    <Sparkles size={18} className='list__title-icon' fill="currentColor" />
                    <h2>Active Menu List</h2>
                </div>
                <p className='list__subtitle'>Manage existing dishes, view prices, and remove expired options.</p>
                {!loading && (
                    <span className='list__count-badge'>{list.length} Dishes Total</span>
                )}
            </div>

            {loading ? (
                <div className='list__loading'>
                    <div className='spinner' />
                    <p>Loading FeastFlow items...</p>
                </div>
            ) : list.length === 0 ? (
                <div className='list__empty'>
                    <h3>No items found</h3>
                    <p>Click "Add Items" on the sidebar to publish your first gourmet dish!</p>
                </div>
            ) : (
                <div className="list-table">
                    {/* Table Header */}
                    <div className='list-table-format title'>
                        <b>Preview</b>
                        <b>Dish Name</b>
                        <b>Category</b>
                        <b>Price</b>
                        <b className='text-center'>Action</b>
                    </div>

                    {/* Table Rows */}
                    <div className='list-table-rows'>
                        {list.map((item, index) => {
                            return (
                                <div key={item._id || index} className='list-table-format row'>
                                    <div className='list-img-wrap'>
                                        <img src={`${url}/images/` + item.image} alt={item.name} loading='lazy' />
                                    </div>
                                    <p className='list-name'>{item.name}</p>
                                    <span className='list-category'>{item.category}</span>
                                    <p className='list-price'>₹{item.price}</p>
                                    <div className='list-action-wrap'>
                                        <button 
                                            onClick={() => removeFood(item._id, item.name)} 
                                            className='list-delete-btn'
                                            title={`Delete ${item.name}`}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export default List;
