 import React, { useContext } from 'react'
 import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import EmailVerify from './pages/EmailVerify'
import ResetPassword from './pages/ResetPassword'
import Home from './pages/Home'
import { ToastContainer } from 'react-toastify';
import { AppContent } from './context/AppContext'

const App = () => {
    const { loading } = useContext(AppContent);

if (loading) return null; // or spinner

  return (
    <div>
        <ToastContainer/>
        <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/email-verify' element={<EmailVerify/>}/>
            <Route path='/reset-password' element={<ResetPassword/>}/>
        </Routes>
    </div>
  )
}

export default App
