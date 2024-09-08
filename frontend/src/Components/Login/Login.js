import React, { useContext, useEffect, useState } from 'react'
import { BsFillPersonFill, } from 'react-icons/bs'
import { RiLockPasswordFill } from 'react-icons/ri'
import { GoAlert } from 'react-icons/go'
import './Login.css'
import { useNavigate } from 'react-router-dom';
import Aos from 'aos'
import axios from 'axios'
import CreateContextApi from '../../ContextApi/CreateContextApi'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';

export default function Login() {
    useEffect(() => {
        Aos.init({ duration: 500, delay: 200 });
    });
    const a = useContext(CreateContextApi);
    const navigate = useNavigate();
    const [loading,setLoading]=useState(false);
    const [user, setUser] = useState({
        username: '',
        password: ''
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({
            ...user, [name]: value
        })
    }
    const login = async() => {
        setLoading(true)
        await axios.post('http://localhost:3001/loginUser', user)
        .then((res) => {
            if (res.data.message === "Login Successfull") {
                    toast.success(res.data.message,{
                        autoClose:500
                    })
                    var date = new Date();
                    date.setTime(date.getTime() + (30 * 1000));
                    Cookies.set(`token${res.data.id}`, res.data.token,{expires:1})
                    setTimeout(() => {
                        navigate('/home/' + res.data.id);
                    }, 1000);
                }
                else{
                    toast.error(res.data.message,{
                        autoClose:500
                    })
                }
            })
            setLoading(false)

    }


    return (
        <>
            <div className="login">
                <div data-aos="zoom-in" className="login-form">
                    <h2><span>LOG</span> IN<span>{a.state}</span></h2>
                    <div className="username">
                        <div className="icon"> <BsFillPersonFill /></div>
                        <input type="text" name="username" id="" placeholder='UserName' onChange={(e) => { handleChange(e) }} />
                    </div>
                    <div className="password">
                        <div className="icon"> <RiLockPasswordFill /></div>
                        <input type="text" name="password" id="" placeholder='Password' onChange={(e) => { handleChange(e) }} />
                    </div>
                    <button disabled={loading} className='submit-btn' onClick={() => login()}>Log In</button>
                    <p>Don't have an account
                        <span>
                            <span onClick={() => { navigate('/signup') }}>signup</span>
                            <span className='slash'>/</span>
                            <span className='for-admin' onClick={() => { navigate('/admin-login') }}>admin login</span>
                        </span>
                    </p>
                </div>
            </div>
            <ToastContainer/>
        </>
    )
}
