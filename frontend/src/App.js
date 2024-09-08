import React, { useContext, useEffect, useState } from "react";
import { Route, Routes } from 'react-router-dom'
import './index.css'
import Signup from "./Components/Signup/Signup";
import Navbar2 from "./Components/Navbar2/Navbar2";
import Login from "./Components/Login/Login";
import My_Orders from "./Components/My_Orders/My_Orders";
import Admin_Login from "./Components/Admin_Login/Admin_Login";
import All_Orders from "./Components/Al_Orders/All_Orders";
import Update from "./Components/Update/Update";
import Error from "./Components/Error_Page/Error";
import CreateContextApi from './ContextApi/CreateContextApi'
import Main_Page from "./Components/Main_Page/Main_Page";


function App() {
  const a = useContext(CreateContextApi);
  return (
    <>
      <Routes>
        <Route exact path="/signup" element={<><Navbar2 /><Signup /></>}></Route>
        <Route exact path="/" element={<><Navbar2 /><Login /></>}></Route>
        <Route exact path={'/update/:id'} element={<><Navbar2 /><Update /></>}></Route>
        <Route exact path={"/admin-login"} element={<><Navbar2 /><Admin_Login /></>}></Route>
        <Route exact path={"/my_orders/:id"} element={ <><Navbar2 /><My_Orders /></>}></Route>
        <Route exact path={"/all_orders"} element={ <><Navbar2 /><All_Orders /></>}></Route>
        <Route exact path={"/*"} element={<Error />}></Route>
        <Route exact path={'/home/:id'} element={<><Main_Page/></>}></Route>
      </Routes>

    </>
  );
}

export default App;
