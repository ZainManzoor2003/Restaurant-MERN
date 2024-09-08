import React, { useEffect, useState } from 'react'
import { BsFillPersonFill } from 'react-icons/bs'
import { RiLockPasswordFill } from 'react-icons/ri'
import { MdOutlineDialerSip } from 'react-icons/md'
import { FaRegAddressCard } from 'react-icons/fa'
import { HiUser } from 'react-icons/hi'
import { MdEmail } from 'react-icons/md'
import { GoAlert } from 'react-icons/go'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './Signup.css'
import Aos from 'aos'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Signup() {
    const navigate = useNavigate();
    const [loading,setLoading]=useState(false)
    const [user, setUser] = useState({
        name: ' ',
        username: ' ',
        password: ' ',
        email: ' ',
        number: ' ',
        address: ' '
    })
    useEffect(() => {
        Aos.init({ duration: 500, delay: 200 });
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({
            ...user, [name]: value
        })
    }
    const addnewuser = async () => {
        if (user.username === 'zain123') {
            toast.error('This username is not valid', {
                autoClose: 1000
            })
        }
        else if (user.name === '' || user.name === ' ' || user.username === '' || user.username === ' ' || user.password === '' || user.password === ' ' ||
            user.email === '' || user.email === ' ' || user.number === '' || user.number === ' ' || user.address === '' || user.address === ' ') {
            toast.error('Please Fill Input Fields', {
                autoClose: 1000
            })
        }
        else {
            setLoading(true)
            await axios.post('http://localhost:3001/addnewuser', user)
                .then((res) => {
                    toast.success(res.data.message, {
                        autoClose: 1000
                    })
                    if (res.data.message === 'Account Created Succesfully') {
                        setTimeout(() => {
                            navigate('/');
                        }, 1000);
                    }
                })
                setLoading(false)
        }
    }
    return (
        <>
            <div className="signup">
                <div data-aos="zoom-in" className="signup-form">
                    <div className="left">
                        <img src="./Images/about.png" alt="" />
                    </div>
                    <div className="right">
                        <h2><span>Sign</span> UP</h2>
                        <div className="inputs">
                            <div className="name">
                                <div className="icon"> <BsFillPersonFill /></div>
                                <input type="text" name="name" id="" placeholder='Name' onChange={(e) => { handleChange(e) }} />
                                {user.name === "" && <span>Name Required</span>}
                            </div>
                            <div className="username">
                                <div className="icon"> <HiUser /></div>
                                <input type="text"  name="username" id="" placeholder='UserName' onChange={(e) => { handleChange(e) }} />
                                {user.username === "" && <span>Username Required</span>}
                            </div>
                            <div className="password2">
                                <div className="icon"> <RiLockPasswordFill /></div>
                                <input type="text" name="password" id="" placeholder='Password' onChange={(e) => { handleChange(e) }} />
                                {user.password === "" && <span>Password Required</span>}
                            </div>
                            <div className="email">
                                <div className="icon"> <MdEmail /></div>
                                <input type="email" name="email" id="" placeholder='Email' onChange={(e) => { handleChange(e) }} />
                                {user.email === "" && <span>Email Required</span>}
                            </div>
                            <div className="number">
                                <div className="icon"> <MdOutlineDialerSip /></div>
                                <input maxLength={11} type="text" name="number" id="" placeholder='Number' onChange={(e) => { handleChange(e) }} />
                            </div>
                            <div className="address">
                                <div className="icon"> <FaRegAddressCard /></div>
                                <input type="text" name="address" id="" placeholder='Address' onChange={(e) => { handleChange(e) }} />
                                {user.address === '' && <span>Address Required</span>}
                            </div>
                        </div>
                        <button disabled={loading} className='submit-btn' onClick={addnewuser}>Sign Up</button>
                        <p>Already have an account <span onClick={() => { navigate('/') }}>sign in</span></p>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    )
}
