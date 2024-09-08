import React, { useEffect, useState, useContext } from 'react'
import { BsFillPersonFill } from 'react-icons/bs'
import { RiLockPasswordFill } from 'react-icons/ri'
import { MdOutlineDialerSip } from 'react-icons/md'
import { FaRegAddressCard } from 'react-icons/fa'
import { HiUser } from 'react-icons/hi'
import { MdEmail } from 'react-icons/md'
import { GoAlert } from 'react-icons/go'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import './Update.css'
import Aos from 'aos'
import CreateContextApi from '../../ContextApi/CreateContextApi'
import Cookies from 'js-cookie'

export default function Update() {
    const { id } = useParams();
    const { userData, setUserData,auth,setAuth } = useContext(CreateContextApi);
    const [alertmsg, setalert] = useState(null);
    const navigate = useNavigate('');
    useEffect(() => {
        Aos.init({ duration: 500, delay: 200 });
    });
    useEffect(() => {
        id && axios.post(`http://localhost:3001/verifyAuth`, { cookie: Cookies.get(`token${id}`) }).then((res) => {
            if (res.data.mes !== 'Success') {
                setAuth(false)
                navigate('/')
            }
            else {
                setAuth(true);
            }
        })
    }, [])
    useEffect(() => {
        if (userData.name === "") {
            getUserData();
        }
    }, [])
    const getUserData = async () => {
        let data = await fetch(`http://localhost:3001/fetchUserData/${id}`);
        let res = await data.json();
        setUserData({
            name: res[0].name, username: res[0].username, password: res[0].password, email: res[0].email, address: res[0].address,
            number: res[0].number
        })
    }
    const updateProfile = () => {
        axios.post(`http://localhost:3001/updateProfile/${id}`, userData)
            .then((res) => {
                showalert(res.data.message);
            })
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...userData, [name]: value
        })
    }
    const showalert = (msg) => {
        setalert(msg);
        setTimeout(() => {
            setalert(null);
        }, 1000);
        setTimeout(() => {
            id && Cookies.remove(`token${id}`);
            navigate('/');
        }, 1000);
    }
    return (
        <>
            {auth === true ?
                <div className="update-profile">
                    {alertmsg && <div className="alert"><GoAlert /><span>{alertmsg}</span></div>}
                    <div data-aos="zoom-in" className="update">
                        <h2><span>Sign</span> UP</h2>
                        <div className="inputs">
                            <div className="update-name">
                                <div className="icon"> <BsFillPersonFill /></div>
                                <input type="text" name="" id="" placeholder='Name' value={userData.name} onChange={(e) => { handleChange(e.target) }} />
                                {userData.name === "" && <span>Name Required</span>}
                            </div>
                            <div className="update-username">
                                <div className="icon"> <HiUser /></div>
                                <input type="text" name="" id="" placeholder='UserName' value={userData.username} onChange={(e) => { handleChange(e.target.value) }} />
                                {userData.username === "" && <span>Username Required</span>}
                            </div>
                            <div className="update-password2">
                                <div className="icon"> <RiLockPasswordFill /></div>
                                <input type="text" name="" id="" placeholder='Password' value={userData.password} onChange={(e) => { handleChange(e.target.value) }} />
                                {userData.password === "" && <span>Password Required</span>}
                            </div>
                            <div className="update-email">
                                <div className="icon"> <MdEmail /></div>
                                <input type="email" name="" id="" placeholder='Email' value={userData.email} onChange={(e) => { handleChange(e.target.value) }} />
                                {userData.email === "" && <span>Email Required</span>}
                            </div>
                            <div className="update-number">
                                <div className="icon"> <MdOutlineDialerSip /></div>
                                <input type="number" name="" id="" placeholder='Number' value={userData.number} onChange={(e) => { handleChange(e.target.value) }} />
                            </div>
                            <div className="update-address">
                                <div className="icon"> <FaRegAddressCard /></div>
                                <input type="text" name="" id="" placeholder='Address' value={userData.address} onChange={(e) => { handleChange(e.target.value) }} />
                                {userData.address === "" && <span>Address Required</span>}
                            </div>
                        </div>
                        <button className='update-submit-btn' onClick={() => updateProfile()}>Update My Profile</button>
                    </div>
                </div>

                : <></>}
        </>
    )
}
