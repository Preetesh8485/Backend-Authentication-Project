import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import axios from 'axios';
import { AppContent } from '../context/AppContext';
import { toast } from 'react-toastify';

const VerifyEmail=()=>{
  axios.defaults.withCredentials=true
const{backendUrl,isLoggedin,userData,getUserData}=useContext(AppContent)
  const navigate = useNavigate();
  const inputRefs=React.useRef([]);

  const handleInput=(e,index)=>{
    if(e.target.value.length>0&& index<inputRefs.current.length-1){
      inputRefs.current[index+1].focus();
    }

  }
  const handleDelete=(e,index)=>{
    if(e.key==='Backspace'&&e.target.value===''&&index>0){
      inputRefs.current[index-1].focus();
    }
  }
  const handlePaste=(e)=>{
    const paste=e.clipboardData.getData('text')
    const pasteArray=paste.split('');
    pasteArray.forEach((char,index)=>{
      if(inputRefs.current[index]){
        inputRefs.current[index].value=char;
      }
    })
  }
  const onSubmitHandler =async(e)=>{
    try {
      e.preventDefault();
      const otpArray =inputRefs.current.map(e=>e.value);
      const otp=otpArray.join('')
      const{data}=await axios.post(backendUrl+'/api/auth/verify-account',{otp})
      if(data.success){
        toast.success(data.message);
        getUserData();
        navigate('/')
      }else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  useEffect(()=>{
    isLoggedin&&userData&&userData.Accountverification&&navigate('/')
  },[isLoggedin,userData])
  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-yellow-900 to-blue-900'>
      
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt=""
        className='absolute left-5 sm:left-20 top-5 w-28 sm:w-24 cursor-pointer'
      />

      <form onSubmit={onSubmitHandler} className='bg-gradient-to-br from-blue-500 to-blue-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
        <h1 className='text-center text-2xl font-semibold text-white mb-4'>
          Email Verification
        </h1>

        <p className='text-center font-semibold text-gray-400 mb-6'>
          Enter the 6-digit OTP sent on Email
        </p>

        <div className='flex justify-between mb-8' onPaste={handlePaste}>
          {Array(6).fill(0).map((_, index) => (
            <input
              type="text"
              maxLength="1"
              key={index}
              required
              className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400'
              ref={e=>inputRefs.current[index]=e}
              onInput={(e)=>{handleInput(e,index)}}
              onKeyDown={(e)=>{handleDelete(e,index)}}
            />
          ))}
        </div>

        <button
          type="submit"
          className='w-full py-3 bg-gray-600 text-gray-100 font-semibold rounded-full hover:bg-blue-900 transition-colors duration-200'
        >
          Submit OTP
        </button>
      </form>
    </div>
  );
}

export default VerifyEmail;