import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import Login from './pages/login'
import VerifyEmail from './pages/verifyEmail'
import ResetPassword from './pages/ResetPassword'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/verify-email' element={<VerifyEmail />} />
        <Route path='/reset-password' element={<ResetPassword />} />
      </Routes>
    </div>
  )
}

export default App