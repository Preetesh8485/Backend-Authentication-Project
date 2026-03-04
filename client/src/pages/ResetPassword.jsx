import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import axios from 'axios';
import { AppContent } from '../context/AppContext';
import { toast } from 'react-toastify';
const ResetPassword=()=> {
  const{backendUrl}=useContext(AppContent);
  axios.defaults.withCredentials = true;
   const navigate = useNavigate();
   const [email,setEmail]=useState('');
   const [newPassword,setNewPassword]=useState('');
   const[isEmailSent,setIsEmailSent]=useState(false);
   const[otp,setOtp]=useState(0);
   const[isOtpSubmitted,setisOtpSubmitted]=useState(false);
   const [confirmPassword, setConfirmPassword] = useState('');
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
     const onSubmitEmail=async(e)=>{
      e.preventDefault();
      try {
        const{data}=await axios.post(backendUrl+'/api/auth/send-reset-otp',{email})
        data.success?toast.success(data.message):toast.error(data.message);
        data.success && setIsEmailSent(true)
      } catch (error) {
        toast.error(error.message)
      }
     }
     const onSubmitNewPassword = async (e) => {
  e.preventDefault();

  if (newPassword !== confirmPassword) {
    toast.error("Passwords do not match");
    return;
  }

  try {
    const { data } = await axios.post(
      backendUrl + "/api/auth/reset-password",
      { email, otp, newPassword }
    );

    if (data.success) {
      toast.success("Password reset successful");
      navigate('/login');
    } else {
      toast.error(data.message);
    }

  } catch (error) {
    toast.error(error.message);
  }
};
const onSubmitOtp =async(e)=>{
  e.preventDefault();
  const otpArray =inputRefs.current.map(e=>e.value)
  setOtp(otpArray.join(''))
  setisOtpSubmitted(true);
}
  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-yellow-900 to-blue-900'>
      <img
              onClick={() => navigate('/')}
              src={assets.logo}
              alt=""
              className='absolute left-5 sm:left-20 top-5 w-28 sm:w-24 cursor-pointer'
            />
      {!isEmailSent &&
    <form onSubmit={onSubmitEmail} className='bg-gradient-to-br from-blue-500 to-blue-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
      <h1 className='text-center text-2xl font-semibold text-white mb-4'>
          Reset Password
        </h1>
        <p className='text-center font-semibold text-gray-400 mb-6'>
          Enter the registered email
        </p>
        <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
          <img src={assets.mail_icon} alt="mail_logo.png" />
          <input type="email"  placeholder='Enter Registered Email' className=' text-white bg-transparent outline-none flex-1'
          value={email} onChange={e=>setEmail(e.target.value)} required />
        </div>
        <button type="submit"
          className='w-full py-3 bg-gray-600 text-gray-100 font-semibold rounded-full hover:bg-blue-900 transition-colors duration-200'>Submit</button>
    </form>
}
{!isOtpSubmitted && isEmailSent &&<form onSubmit={onSubmitOtp} className='bg-gradient-to-br from-blue-500 to-blue-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
        <h1 className='text-center text-2xl font-semibold text-white mb-4'>
          Reset Password OTP
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
      }
    
    {isOtpSubmitted&&isEmailSent && <form
onSubmit={onSubmitNewPassword}
className='bg-gradient-to-br from-blue-500 to-blue-900 p-8 rounded-lg shadow-lg w-96 text-sm'
>

<h1 className='text-center text-2xl font-semibold text-white mb-4'>
New Password
</h1>

<p className='text-center font-semibold text-gray-400 mb-6'>
Enter your new password
</p>

{/* New Password */}
<div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>

<img src={assets.lock_icon} alt="" />

<input
type={showPassword ? "text" : "password"}
placeholder='Enter New Password'
className='text-white bg-transparent outline-none flex-1'
value={newPassword}
onChange={(e)=>setNewPassword(e.target.value)}
required
/>

<button
type="button"
onClick={()=>setShowPassword(!showPassword)}
className='text-gray-300 text-xs'
>
{showPassword ? "Hide" : "Show"}
</button>

</div>

{/* Confirm Password */}
<div className='mb-6 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>

<img src={assets.lock_icon} alt="" />

<input
type={showConfirmPassword ? "text" : "password"}
placeholder='Confirm Password'
className='text-white bg-transparent outline-none flex-1'
value={confirmPassword}
onChange={(e)=>setConfirmPassword(e.target.value)}
required
/>

<button
type="button"
onClick={()=>setShowConfirmPassword(!showConfirmPassword)}
className='text-gray-300 text-xs'
>
{showConfirmPassword ? "Hide" : "Show"}
</button>

</div>

{/* Password Match Warning */}
{confirmPassword && newPassword !== confirmPassword && (
<p className="text-red-400 text-xs mb-3 text-center">
Passwords do not match
</p>
)}

<button
type="submit"
className='w-full py-3 bg-gray-600 text-gray-100 font-semibold rounded-full hover:bg-blue-900 transition-colors duration-200'
>
Reset Password
</button>

</form>}
      
    </div>
  )
}

export default ResetPassword
