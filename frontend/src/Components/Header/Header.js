import React, { createContext, useContext, useEffect, useState } from 'react'
import { BsFillCartFill } from "react-icons/bs"
import { GiHamburgerMenu } from "react-icons/gi"
import { FaSearch } from "react-icons/fa";
import { BsFillPersonFill } from 'react-icons/bs'
import { ImCross } from 'react-icons/im'
import './Header.css'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreateContextApi from '../../ContextApi/CreateContextApi';
import Cookies from 'js-cookie'

export default function Header() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [inputtrue, setinputtrue] = useState(false);
    const [droptrue, setdroptrue] = useState(false);
    const [navtrue, setnavtrue] = useState(false);
    const [carttrue, setcarttrue] = useState(false);
    const { cartData, setCartData } = useContext(CreateContextApi);
    const getCartData = async () => {
        let data = await fetch(`http://localhost:3001/fetchCartData/${id}`);
        let res = await data.json();
        setCartData(res);
    }
    useEffect(() => {
        getCartData();
    }, [])
    const logout = () => {
        id && Cookies.remove(`token${id}`)
        navigate('/');
    }
    const delalert = () => {
        Swal.fire({
            title: 'Are you really want to delete your account?',
            showDenyButton: true,
            // showCancelButton: true,
            confirmButtonText: 'Yes',
            denyButtonText: `No`,
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                deleteAccount();
            } else if (result.isDenied) {
                Swal.fire('Account Not Deleted', '', 'info')
            }
        })
    }
    const deleteCart = (i) => {
        axios.post(`http://localhost:3001/deleteCart/${id}`, { menuId: cartData[i]._id })
            .then((res) => {
                if (res.data.message === 'Item Deleted from Cart') {
                    toast.success(res.data.message, {
                        autoClose: 1000,
                        position: 'top-center'
                    })
                }
                else {
                    toast.error(res.data.message, {
                        autoClose: 1000,
                        position: 'top-center'
                    })
                }
                getCartData();
            })

    }
    const deleteAccount = () => {
        axios.post(`http://localhost:3001/deleteAccount/${id}`)
            .then((res) => {
                Swal.fire('Account Deleted!', '', 'success')
                if (res.data.message === "Your Account and all associated data deleted") {
                    id && Cookies.remove(`token${id}`);
                    navigate('/');
                }
            })
    }
    return (
        <>
            <header>
                <div className='header'>
                    <div className="logo">
                        <img src="../Images/logo.png" alt="My Pic" />
                    </div>
                    <nav className={!navtrue ? 'nav-active' : ' nav-non-active'}>
                        <ul>
                            <li><a href='#hm'>Home</a></li>
                            <li><a href='#ab'>About</a></li>
                            <li><a href='#mn'>Menu</a></li>
                            <li><a href='#pr'>Products</a></li>
                            <li><a href='#re'>Review</a></li>
                            <li><a href='#con'>Contact</a></li>
                            <li><a href='#blg'>Blogs</a></li>
                            <li><a onClick={() => navigate('/my_orders/' + id)}>My Orders</a></li>
                        </ul>
                    </nav>
                    <div className="icons">
                        <div className="search-icon" onClick={() => { setinputtrue(!inputtrue); setdroptrue(false); setnavtrue(false); setcarttrue(false) }}><FaSearch /></div>
                        <div className="cart" onClick={() => { setcarttrue(!carttrue); setnavtrue(false); setdroptrue(false); setinputtrue(false); }}><BsFillCartFill /></div>
                        <div className="drop-down" onClick={() => { setdroptrue(!droptrue); setinputtrue(false); setnavtrue(false); setcarttrue(false); }}><BsFillPersonFill /></div>
                        <div className="burger" onClick={() => { setnavtrue(!navtrue); setdroptrue(false); setinputtrue(false); setcarttrue(false); }}><GiHamburgerMenu /></div>
                    </div>
                    <div className={!carttrue ? 'cart-menu cart-active' : 'cart-menu cart-non-active'} >
                        {cartData.map((arr, index) => (
                            <div className="cart-items">
                                <div className="cart-left-side-img">
                                    <img src={'/Images/' + cartData[index].image} alt="" />
                                </div>
                                <div className="cart-right-side-content">
                                    <h4>{cartData[index].item_name}</h4>
                                    <h4>{'$' + cartData[index].price}</h4>
                                </div>
                                <div className="cart-cross-icon">
                                    <span onClick={() => { deleteCart(index) }}><ImCross /></span>
                                </div>
                            </div>
                        ))}
                        <button className='cart-btn'>CheckOut Now</button>
                    </div>
                    <div className={inputtrue ? 'search-bar search-bar-active' : 'search-bar search-bar-non-active'}>
                        <input type="text" placeholder='Search Here...' />
                        <div className="search-icon"><FaSearch /></div>
                    </div>
                    <div className={droptrue ? 'drop-bar drop-bar-active' : 'drop-bar drop-bar-non-active'} >
                        <img src="../Images/user pic.png" alt="" />
                        <div className="user-buttons">
                            <button className='Log' onClick={logout}>Log Out</button>
                            <button className='update' onClick={() => {navigate('/update/' + id); setdroptrue(false)}}>Update Profile</button>
                            <button className='Delete' onClick={() => delalert()}>Delete</button>
                        </div>
                    </div>
                </div>
            </header>
            <ToastContainer />
        </>
    )
}
