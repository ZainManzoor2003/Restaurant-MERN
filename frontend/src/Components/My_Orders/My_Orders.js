import React, { useContext, useEffect, useState } from 'react'
import './My_Orders.css'
import { AiFillDelete } from "react-icons/ai";
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom';
import CreateContextApi from '../../ContextApi/CreateContextApi'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie'

export default function My_Orders() {
  const { id } = useParams();
  const { orderData, setOrderData, auth, setAuth } = useContext(CreateContextApi);
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
  useEffect(() => {
      getMyOrders();
  }, [])
  const getMyOrders = async () => {
    let data = await fetch(`http://localhost:3001/myOrders/${id}`);
    let res = await data.json();
    setOrderData(res);
  }
  const deleteOrder = (orderId) => {
    axios.post(`http://localhost:3001/deleteMyOrder/${id}`, { id: orderId })
      .then((res) => {
        toast.success(res.data.message, {
          autoClose: 1000
        })
        getMyOrders();
      })
  }
  return (
    <>
      {auth === true ?
        <>
          <div className="my-orders">
            <div className="my_orders_form">
              <h2>My <span>Orders</span> </h2>
              <table>
                <tr>
                  <th>Order ID</th>
                  <th>Item Price</th>
                  <th>Status</th>
                  <th>Item Type</th>
                  <th>Cancel</th>
                </tr>
                {orderData.map((Data, index) => (
                  <tr key={index}>
                    <td>{Data._id}</td>
                    <td>{'$' + Data.price}</td>
                    <td>{Data.status}</td>
                    <td>{Data.item_type}</td>
                    <td>
                      <button disabled={Data.status === 'confirmed' || Data.status === 'cancelled'} className='delete' onClick={() => deleteOrder(Data._id)}><AiFillDelete /></button>
                    </td>
                  </tr>
                ))}

              </table>
              {orderData.length === 0 ? <><h2 style={{ fontSize: '40px', color: 'white' }}>No Orders</h2></> : <><span></span></>}
            </div>
          </div>
          <ToastContainer />
        </>
        : <></>}
    </>
  )
}
