import React, { useState } from 'react';
import "./Add.css";
import { assets } from '../../assets/assets';
import axios from "axios";
import { toast } from "react-toastify";
import { UploadCloud, Sparkles } from 'lucide-react';

const Add = ({ url }) => {
    const [image, setImage] = useState(null);
    const [data, setData] = useState({
        name: "",
        description: "",
        price: "",
        category: "Salad"
    });
    const [uploading, setUploading] = useState(false);

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData(prevData => ({ ...prevData, [name]: value }));
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        if (!image) {
            toast.error("Please upload an image first.");
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("price", Number(data.price));
        formData.append("category", data.category);
        formData.append("image", image);

        try {
            const response = await axios.post(`${url}/api/food/add`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (response.data.success) {
                setData({
                    name: "",
                    description: "",
                    price: "",
                    category: "Salad"
                });
                setImage(null);
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        }
        catch (error) {
            console.error("Error:", error);
            toast.error("Failed to add product. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className='add'>
            <div className='add__header'>
                <div className='add__title-row'>
                    <Sparkles size={18} className='add__title-icon' fill="currentColor" />
                    <h2>Add Gourmet Item</h2>
                </div>
                <p className='add__subtitle'>Create a new recipe entry in FeastFlow's cloud database.</p>
            </div>

            <form className='add__form' onSubmit={onSubmitHandler}>
                {/* Image Upload Zone */}
                <div className='add__upload-container'>
                    <p className='add__label'>Upload Dish Image</p>
                    <label htmlFor='image' className={`add__upload-zone ${image ? 'has-image' : ''}`}>
                        {image ? (
                            <div className='upload-preview-wrap'>
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt="Upload preview"
                                    className='upload-preview'
                                />
                                <div className='upload-overlay'>
                                    <UploadCloud size={20} />
                                    <span>Change Photo</span>
                                </div>
                            </div>
                        ) : (
                            <div className='upload-placeholder'>
                                <UploadCloud size={28} className='upload-icon' />
                                <p className='upload-text-main'>Click to Upload Image</p>
                                <p className='upload-text-sub'>Supports JPG, PNG (Max 5MB)</p>
                            </div>
                        )}
                    </label>
                    <input
                        onChange={(e) => setImage(e.target.files[0])}
                        type="file"
                        id='image'
                        hidden
                    />
                </div>

                {/* Product Name */}
                <div className="add__field">
                    <p className='add__label'>Dish Title</p>
                    <input
                        onChange={onChangeHandler}
                        value={data.name}
                        type="text"
                        name="name"
                        placeholder='e.g., Truffle Tagliatelle'
                        required
                    />
                </div>

                {/* Description */}
                <div className='add__field'>
                    <p className='add__label'>Detailed Recipe Description</p>
                    <textarea
                        onChange={onChangeHandler}
                        value={data.description}
                        name="description"
                        rows="4"
                        placeholder='List details such as organic ingredients, spice levels, chef notes, or calorie estimates...'
                        required
                    />
                </div>

                {/* Category & Price */}
                <div className="add__row">
                    <div className='add__field flex-1'>
                        <p className='add__label'>Menu Category</p>
                        <div className='select-wrapper'>
                            <select onChange={onChangeHandler} name="category" value={data.category} required>
                                <option value="Salad">Salad</option>
                                <option value="Rolls">Rolls</option>
                                <option value="Deserts">Deserts</option>
                                <option value="Sandwich">Sandwich</option>
                                <option value="Cake">Cake</option>
                                <option value="Pure Veg">Pure Veg</option>
                                <option value="Pasta">Pasta</option>
                                <option value="Noodles">Noodles</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="add__field flex-1">
                        <p className='add__label'>Base Price (₹)</p>
                        <input
                            onChange={onChangeHandler}
                            value={data.price}
                            type="number"
                            name='price'
                            placeholder='e.g., 250'
                            min="1"
                            required
                        />
                    </div>
                </div>

                {/* Submit button */}
                <button type="submit" className='add__submit-btn' disabled={uploading}>
                    {uploading ? 'Adding Dish...' : 'Publish Dish'}
                </button>
            </form>
        </div>
    );
}

export default Add;
