import React from 'react';
import "./Sidebar.css";
import { NavLink } from 'react-router-dom';
import { PlusCircle, ListChecks, ShoppingBag } from 'lucide-react';

const Sidebar = () => {
    return (
        <div className='sidebar'>
            <div className="sidebar-options">
                <NavLink to='/add' className="sidebar-option">
                    <PlusCircle size={18} className='sidebar-icon' />
                    <p>Add Items</p>
                </NavLink>
                
                <NavLink to='/list' className="sidebar-option">
                    <ListChecks size={18} className='sidebar-icon' />
                    <p>List Items</p>
                </NavLink>
                
                <NavLink to="/orders" className="sidebar-option">
                    <ShoppingBag size={18} className='sidebar-icon' />
                    <p>Orders</p>
                </NavLink>
            </div>
        </div>
    );
};

export default Sidebar;
