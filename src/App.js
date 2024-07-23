import React from 'react';
import axios from 'axios';
import Login from './Components/Login';
import Navbar from './Components/Navbar';
import SignUp from './Components/SignUp';
import Dashboard from './Components/Dashboard';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import OpportunitiesComponent from './Components/OpportunitiesComponent';

axios.defaults.baseURL = 'https://internship-portal-rv8y.onrender.com';
axios.defaults.withCredentials = true;

export default function App() {
  return (
    <>
        <BrowserRouter>
        <Navbar/>
          <Routes>
          <Route path='/' element={<OpportunitiesComponent/>}/>
            <Route path='/signup' element={<SignUp/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/dashboard' element={<Dashboard/>}/>
          </Routes>
        </BrowserRouter>
    </>
  )
}
