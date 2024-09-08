import React, { useContext, useEffect, useState } from 'react'
import './All_Orders.css'
import { GiConfirmed } from "react-icons/gi";
import axios from 'axios'
import { BsFillPersonFill } from 'react-icons/bs'
import { RiLockPasswordFill } from 'react-icons/ri'
import { GoAlert } from 'react-icons/go'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import CreateContextApi from '../../ContextApi/CreateContextApi';
import Cookies from 'js-cookie';

export default function All_Orders() {
  const [allorderData, setOrderData] = useState([]);
  const [additemactive, setaddItemActive] = useState(false);
  const [alloredrsactive, setAllOrdersActive] = useState(true)
  const [alertmsg, setalert] = useState(null);
  const { auth, setAuth } = useContext(CreateContextApi);
  const navigate = useNavigate();
  const getallOrders = async () => {
    let data = await fetch('http://localhost:3001/allOrders');
    let res = await data.json();
    setOrderData(res);
  }

  useEffect(() => {
    axios.post(`http://localhost:3001/verifyAuth`, { cookie: Cookies.get(`adminLoggedIn`) }).then((res) => {
      if (res.data.mes !== 'Success') {
        setAuth(false)
        navigate('/admin-login')
      }
      else {
        setAuth(true);
        getallOrders();
      }
    })
  }, [])
  const [menu, setMenu] = useState({
    item_name: '',
    o_price: '',
    price: '',
    items_type: '',
    image: '',
  })
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMenu({
      ...menu, [name]: value
    })
  }
  const inputImage = (e) => {
    console.log(e.target.files[0].name);
    setMenu({
      ...menu, image: e.target.files[0].name
    });
  }
  const showalert = (msg) => {
    setalert(msg);
    setTimeout(() => {
      setalert(null);
    }, 1000);
  }
  const addMenuItems = () => {
    if (!menu.item_name || !menu.price || !menu.o_price || !menu.image || !menu.items_type) {
      showalert('Please fill input fields');
    }
    else {
      axios.post('http://localhost:3001/addItem', menu)
        .then((res) => {
          showalert(res.data.message);
        })
    }
  }
  const confirmOrder = (id) => {
    axios.post('http://localhost:3001/confirmOrder', { id: id })
      .then((res) => {
        toast.success(res.data.message, {
          autoClose: 1000
        })
        getallOrders();
      })
  }
  const cancelOrder = (id) => {
    axios.post('http://localhost:3001/cancelOrder', { id: id })
      .then((res) => {
        toast.error(res.data.message, {
          autoClose: 1000
        })
        getallOrders();
      })

  }
  return (

    <>
      {auth == true ?
        <>
          <div className="my-orders">
            {alertmsg && <div className="alert"><GoAlert /><span>{alertmsg}</span></div>}
            <div className="my_orders_form">
              <div className="all-orders-heading">
                <h2 className={alloredrsactive === true ? 'all-orders' : 'all-orders-non-active'} onClick={() => { setAllOrdersActive(true); setaddItemActive(false) }}>All <span>Orders</span> </h2>
                <h2 className={additemactive === false ? 'non-active' : 'add-items'} onClick={() => { setAllOrdersActive(false); setaddItemActive(true) }}>Add <span>Items</span> </h2>
              </div>
              <table className={alloredrsactive ? '' : 'table-non-active'}>
                <tr>
                  <th>Order ID</th>
                  {/* <th>User ID</th> */}
                  <th>Item Name</th>
                  <th>Cancel</th>
                </tr>
                {allorderData.map((Data, index) => (
                  <tr key={index}>
                    <td>{Data._id}</td>
                    {/* <td>{Data.user_id}</td> */}
                    <td>{Data.item_name}</td>
                    <td style={{ width: '250px' }}>
                      <button className='confirm' onClick={() => { confirmOrder(Data._id) }}>Confirm</button>
                      <button className='delete' onClick={() => { cancelOrder(Data._id) }}>Cancel</button>
                    </td>
                  </tr>
                ))}
              </table>

              {allorderData.length === 0 ? <><h2 style={{ fontSize: '40px', color: 'white' }}>No Orders</h2></> : <><span></span></>}
            </div>
          </div>
          <div className={additemactive ? 'add-section ' : 'add-section add-items-non-active'}>
            <div className="admin-add-items">
              <h2><span>ADD</span> Item</h2>
              <div className="add-items-all-inputs">
                <div className="add-item-heading">
                  <div className="icon"> <BsFillPersonFill /></div>
                  <input className='input-field' type="text" name="item_name" id="" placeholder='Heading' onChange={(e) => { handleChange(e) }} />
                  {menu.item_name === "" && <span>Name Required</span>}
                </div>
                <div className="add-o-price">
                  <div className="icon"> <RiLockPasswordFill /></div>
                  <input className='input-field' type="text" name="o_price" id="" placeholder='Original Price' onChange={(e) => { handleChange(e) }} />
                  {menu.o_price === "" && <span>Original Price Required</span>}
                </div>
                <div className="add-price">
                  <div className="icon"> <RiLockPasswordFill /></div>
                  <input className='input-field' type="text" name="price" id="" placeholder='Price' onChange={(e) => { handleChange(e) }} />
                  {menu.price === "" && <span>Price Required</span>}
                </div>
                <div className="add-item-type">
                  <div className="icon"> <RiLockPasswordFill /></div>
                  <input className='input-field' type="text" name="items_type" id="" placeholder='Item Type' onChange={(e) => { handleChange(e) }} />
                  {menu.items_type === "" && <span>Type Required</span>}
                </div>
              </div>
              <div className="img-input">
                <input style={{ backgroundColor: 'black', marginTop: '10px' }} type="file" onChange={inputImage} />
              </div>
              <button className='submit-btn' onClick={() => addMenuItems()}>Add Item Now</button>
            </div>
          </div>
          <ToastContainer />
        </>
        : <></>}
    </>
  )
}
