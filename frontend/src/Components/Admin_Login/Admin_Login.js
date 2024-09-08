import React, { useContext, useEffect, useState } from 'react'
import { BsFillPersonFill, } from 'react-icons/bs'
import { RiLockPasswordFill } from 'react-icons/ri'
import { GoAlert } from 'react-icons/go'
// import './Admin_Login.css'
import { useNavigate } from 'react-router-dom';
import Aos from 'aos'
import axios from 'axios'
import CreateContextApi from '../../ContextApi/CreateContextApi'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie'

export default function Admin_Login() {
    const a = useContext(CreateContextApi);
    const navigate = useNavigate();
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();
    useEffect(() => {
        Aos.init({ duration: 500, delay: 200 });
    });
    const adminLogin = () => {
        axios.post('http://localhost:3001/loginAdmin', { username: username, password: password })
            .then((res) => {
                if (res.data.message === "Login Successfull") {
                    toast.success(res.data.message,{
                        autoClose:500
                    })
                    var date = new Date();
                    date.setTime(date.getTime() + (30 * 1000));
                    Cookies.set('adminLoggedIn', res.data.token,{expires:1})
                    setTimeout(() => {
                        navigate('/all_orders');
                    }, 500);
                }
                else{
                    toast.error(res.data.message,{
                        autoClose:500
                    })
                }
            })
    }
    return (
        <>
            <div className="login">
                <div data-aos="zoom-in" className="login-form">
                    {/* <div className="right">
                        <img src="./Images/about.png" alt="" />
                    </div>  */}
                    {/* <div className="left"> */}
                    <h2><span>Admin </span> Login</h2>
                    <div className="username">
                        <div className="icon"> <BsFillPersonFill /></div>
                        <input type="text" name="" id="" placeholder='UserName' onChange={(e) => { setUserName(e.target.value) }} />
                    </div>
                    <div className="password">
                        <div className="icon"> <RiLockPasswordFill /></div>
                        <input type="text" name="" id="" placeholder='Password' onChange={(e) => { setPassword(e.target.value) }} />
                    </div>
                    <button className='submit-btn' onClick={() => adminLogin()}>Log In</button>
                    {/* </div> */}
                </div>
            </div>
            <ToastContainer/>
        </>
    )
}
