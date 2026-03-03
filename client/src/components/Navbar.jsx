import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
function Navbar() {
    const Navigate = useNavigate()
    const { userData, backendUrl, setUserData, setIsLoggedin } = useContext(AppContent);
    const EmailVerify=async()=>{
        try {
            axios.defaults.withCredentials=true;
            const{data}=await axios.post(backendUrl+'/api/auth/send-verify-otp')
            if(data.success){
               Navigate('/verify-email'); 
               toast.success("Verification OTP sent to the registered email");
            }else{
                toast.error(data.message)
            }
            
        } catch (error) {
            toast.error(error.message);
        }
    }
    const logout=async()=>{
        try {
            axios.defaults.withCredentials=true;
            const{data}=await axios.post(backendUrl+'/api/auth/logout')
            data.success && setIsLoggedin(false);
            data.success && setUserData(false);
            Navigate('/');
        } catch (error) {
            toast.error(error.message);
        }
    }
    return (
        <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0'>
            <img src={assets.logo} alt="" className='w-28 sm:w-25' />
            {userData ? <div className='w-15 h-15 flex items-center justify-center border rounded-full backdrop-blur-2xl text-white hover:bg-gray-800 transition duration-300 relative group font-sans text-2xl'>
                {userData.name[0].toUpperCase()}
                <div className='w-32 absolute hidden group-hover:block top-0 right-15 z-10 text-black rounded pt-10 '>
                    <ul className='list-none m-0 p-2 bg-gray-400 text-sm rounded-lg shadow-md '>
                       {!userData.Accountverification &&<li onClick={EmailVerify} className='py-1 px-3 rounded hover:bg-gray-600 hover:text-white transition-colors duration-200 cursor-pointer'>
                            Verify Email
                        </li>} 
                        <li onClick={logout} className='py-1 px-3 rounded hover:bg-gray-600 hover:text-white transition-colors duration-200 cursor-pointer'>
                            Logout
                        </li>
                    </ul>
                </div>
            </div> : <button onClick={() => Navigate('/login')}
                className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-100 hover:bg-gray-900 transition-all'>Login <img src={assets.arrow_icon} alt="" /></button>}

        </div>
    )
}

export default Navbar
