import React, { useContext, useEffect } from 'react'

import Header from '../Header/Header.js'
import Home from '../Home/Home.js'
import About from '../About/About.js'
import Menu from '../Menu/Menu.js'
import Products from '../Products/Products.js'
import Customer from '../Customer/Customer.js'
import Contact from '../Contact/Contact.js'
import Blogs from '../Blogs/Blogs.js'
import Footer from '../Footer/Footer.js'
import CreateContextApi from '../../ContextApi/CreateContextApi'
import { useNavigate, useParams } from 'react-router-dom'
import Cookies from 'js-cookie'
import axios from 'axios'


export default function Main_Page() {
    const { id } = useParams();
    const { auth, setAuth } = useContext(CreateContextApi);
    const navigate = useNavigate();

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

    return (
        <>
            {auth === true ?
                <>
                    <Header />
                    <Home />
                    <About />
                    <Menu />
                    <Products />
                    <Customer />
                    <Contact />
                    <Blogs />
                    <Footer />
                </>
                : <></>}
        </>
    )
}
