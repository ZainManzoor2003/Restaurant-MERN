import CreateContextApi from "./CreateContextApi";

import React, { useState } from 'react'

export default function ContextApiStates(props) {
  const [menuData, setMenuData] = useState([]);
  const [tempmenuData, setTempMenuData] = useState(menuData);
  const [cartData, setCartData] = useState([]);
  const [auth,setAuth]=useState(undefined);
  const [orderData, setOrderData] = useState([]);
  const [userData, setUserData] = useState(
    {
        name: '',
        username: '',
        password: '',
        email: '',
        number: '',
        address: ''
    }
)
  
  
  return (
    <>
      <CreateContextApi.Provider value={{ menuData, setMenuData,
  tempmenuData,setTempMenuData,cartData,setCartData,auth,setAuth,orderData,setOrderData,userData,setUserData }}>
        {props.children}
      </CreateContextApi.Provider>
    </>
  )
}
