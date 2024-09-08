import React, { useEffect, useState, useContext } from 'react'
import { BsFillCartFill } from "react-icons/bs"
import Aos from 'aos';
import './Menu.css'
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2'
import axios from 'axios';
import CreateContextApi from '../../ContextApi/CreateContextApi'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Menu() {
    const { id } = useParams();
    const { menuData, setMenuData, tempmenuData, setTempMenuData, cartData, setCartData } = useContext(CreateContextApi);
    useEffect(() => {
        Aos.init({ duration: 200, delay: 200 });
    });
    const getMenuData = async () => {
        let data = await fetch('http://localhost:3001/fetchMenuItems');
        let res = await data.json();
        setMenuData(res);
        setTempMenuData(res);
    }
    useEffect(() => {
        if (menuData.length === 0) {
            getMenuData();
        }
    }, [])
    const setCurentOrder = (index) => {
        Swal.fire({
            title: 'Are you really want to place order',
            showDenyButton: true,
            // showCancelButton: true,
            confirmButtonText: 'Yes',
            denyButtonText: `No`,
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                buynow(index);
            } else if (result.isDenied) {
                Swal.fire('Order Not Placed', '', 'info')
            }
        })
    }
    const buynow = (index) => {
        axios.post(`http://localhost:3001/buyNow/${id}`, { order: tempmenuData[index] })
            .then(() => {
                Swal.fire('Order Placed!', '', 'success')
            })
    }
    const searchMenu = (e) => {
        if (e.target.value === '') {
            setTempMenuData(menuData);
        }
        else {
            setTempMenuData(menuData.filter((menu) => {
                return menu.item_type.includes(e.target.value);
            }))
        }
    }
    const getCartData = async () => {
        let data = await fetch(`http://localhost:3001/fetchCartData/${id}`);
        let res = await data.json();
        setCartData(res);
    }
    const addtoCart = (i) => {
        axios.post(`http://localhost:3001/addToCart/${id}`, {menuId:tempmenuData[i]._id})
            .then((res) => {
                if (res.data.message === 'Added to Cart') {
                    toast.success(res.data.message, {
                        autoClose: 1000
                    })
                    getCartData();

                }
                else {
                    toast.error(res.data.message, {
                        autoClose: 1000
                    })
                }
            })


    }
    return (
        <>
            <div className="menu" id='mn'>
                <h3 className='responsive-heading'>Our<span>Menu</span></h3>
                <div className='search-bar'>
                    <input type="text" placeholder='Search Here...' onChange={(e) => { searchMenu(e) }} />
                    {/* <div className="search-icon"><FaSearch /></div> */}
                </div>
                <div className="cards">
                    {tempmenuData.map((arr, index) => (
                        <div data-aos="flip-left" className="card">
                            <div className="cart-icon">
                                <div className="menu-cart" onClick={() => addtoCart(index)}><BsFillCartFill /></div>
                            </div>

                            <img src={`../Images/${tempmenuData[index].image}`} alt="" />
                            <h4>{tempmenuData[index].item_name}</h4>
                            <div className="price">
                                <h4>{'$' + tempmenuData[index].price}</h4>
                                <span>{'$' + tempmenuData[index].o_price}</span>
                            </div>
                            <button className='btn' onClick={() => setCurentOrder(index)}>Buy Now</button>
                        </div>
                    ))}
                </div>
            </div>
            <ToastContainer />
        </>
    )
}
