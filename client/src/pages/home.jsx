import React from 'react'
import Header from '../components/header'
import Navbar from '../components/navbar'
function home() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-[url("public/bg_img.png")] bg-cover bg-center'>
        <Navbar/>
        <Header/>
    </div>
  )
}

export default home
