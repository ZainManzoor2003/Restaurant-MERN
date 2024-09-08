import React, { useState } from 'react'
import { BsFillCartFill } from "react-icons/bs"
import { BsFillPersonFill } from "react-icons/bs"
import { FaSearch } from "react-icons/fa"
import { useTypewriter, Cursor } from 'react-simple-typewriter'
import './Navbar2.css'
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie'
import Swal from 'sweetalert2'
import axios from 'axios'

export default function Navbar2() {
  const [inputtrue, setinputtrue] = useState(false);
  const [carttrue, setcarttrue] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [text] = useTypewriter(
    {
      words: ['Management System'],
      loop: {},
      typeSpeed: 80,
      delaySpeed: 1000,
    }
  );
  const logout = () => {
    id && Cookies.remove(`token${id}`)
    Cookies.remove('userLoggedIn');
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
          <div className="heading">
            <h2> <span>Restaurant</span> {text} <Cursor /></h2>
          </div>
          <div className="icons">
          <div className="search-icon" onClick={() => { setinputtrue(!inputtrue); setcarttrue(false) }}><FaSearch /></div>
            <div className="cart" onClick={() => { setcarttrue(!carttrue); setinputtrue(false)}}><BsFillCartFill /></div>
          </div>
        </div>
      </header>
    </>
  )
}
