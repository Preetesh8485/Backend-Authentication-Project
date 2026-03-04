import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext';
import axios from "axios";
import { toast } from 'react-toastify';
import { GoogleLogin } from "@react-oauth/google";


const Login = () => {
    const navigate = useNavigate();
    const{backendUrl,setIsLoggedin,getUserData}=useContext(AppContent);
    const [state, setState] = useState('Sign Up')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [Cnfpassword, setConfPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const isPasswordMatch = password === Cnfpassword
    const onSubmitHandler = async (e) => {
  try {
    e.preventDefault();

    if (state === 'Sign Up' && !isPasswordMatch) return;

    axios.defaults.withCredentials = true;

    if (state === 'Sign Up') {
      const { data } = await axios.post(
        backendUrl + '/api/auth/register',
        { name, email, password }
      );

      if (data.success) {
        setIsLoggedin(true);
        getUserData();
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } else {
      const { data } = await axios.post(
        backendUrl + '/api/auth/login',
        { email, password }
      );

      if (data.success) {
        setIsLoggedin(true);
        getUserData();
        navigate('/');
      } else {
        toast.error(data.message);
      }
    }
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || "Something went wrong");
  }
  
};
const handleGoogleLogin = async (credentialResponse) => {
  try {
    console.log(credentialResponse)
    const token = credentialResponse.credential;
    
    const { data } = await axios.post(
      backendUrl + "/api/auth/google-login",
      { token }
    );

    if (data.success) {
      setIsLoggedin(true);
      getUserData();
      navigate("/");
      toast.success("Google login successful");
    } else {
      toast.error(data.message);
    }

  } catch (error) {
    console.log(error);
    toast.error("Google login failed");
  }
};
    return (
        <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-yellow-900 to-blue-900  '>
            <img onClick={() => navigate('/')} src={assets.logo} alt="" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-25 cursor-pointer' />
            <div className=' backdrop-blur-3xl p-10 rounded-2xl shadow-2xl w-full sm:w-96 text-indigo-200 text-sm border border-white/20'>
                <h2 className='text-3xl font-semibold text-indigo-100 text-center mb-3 '>{state === 'Sign Up' ? 'Create account' : 'Login '}</h2>
                <p className='text-center text-sm mb-6'>{state === 'Sign Up' ? 'Create your account' : 'Login to your account'}</p>
                <form onSubmit={onSubmitHandler}>
                    {state === 'Sign Up' && (<div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                        <img src={assets.person_icon} alt="" />
                        <input onChange={e => setName(e.target.value)} value={name} type="text" placeholder="Full Name" required className='bg-transparent outline-none ' />
                    </div>
                    )}

                    <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                        <img src={assets.mail_icon} alt="" />
                        <input onChange={e => setEmail(e.target.value)} value={email} type="email" placeholder="Valid Email" required className='bg-transparent outline-none ' />
                    </div>
                    <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                        <img src={assets.lock_icon} alt="" />
                        <input onChange={e => setPassword(e.target.value)}
                            value={password}
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            required
                            className='bg-transparent outline-none flex-1' />
                        <button
                            type="button"
                            onClick={() => setShowPassword(prev => !prev)}
                            className="text-xs text-indigo-300 hover:text-indigo-200"
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>

                    </div>
                    {state === 'Sign Up' && (<div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                        <img src={assets.lock_icon} alt="" />
                        <input onChange={e => setConfPassword(e.target.value)}
                            value={Cnfpassword}
                            type={showConfirm ? "text" : "password"}
                            placeholder="Confirm Password"
                            required
                            className='bg-transparent outline-none ' />
                        <button
                            type="button"
                            onClick={() => setShowConfirm(prev => !prev)}
                            className="text-xs text-indigo-300 hover:text-indigo-200"
                        >
                            {showConfirm ? "Hide" : "Show"}
                        </button>
                    </div>)}
                    {state === 'Sign Up' && Cnfpassword && !isPasswordMatch && (
                        <p className="text-red-400 text-xs mb-3 px-2">
                            Passwords do not match
                        </p>
                    )}

                    <div>

                    </div>
                    {state === 'Login' && (<p onClick={() => navigate('/reset-password')} className='mb-4 text-indigo-200 hover:cursor-pointer inline-block'>Forgot password?</p>)}

                    <button
                        disabled={state === 'Sign Up' && !isPasswordMatch}
                        className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-400 font-medium disabled:opacity-50 disabled:cursor-not-allowed enabled:cursor-pointer'
                    >
                        {state}
                    </button>
                    {state === "Login" && (
<>
  <div className="flex items-center gap-3 my-4">
    <div className="flex-1 h-[1px] bg-gray-600"></div>
    <p className="text-xs text-gray-400">OR</p>
    <div className="flex-1 h-[1px] bg-gray-600"></div>
  </div>

  <div className="flex justify-center">
    <GoogleLogin
      onSuccess={handleGoogleLogin}
      onError={() => toast.error("Google Login Failed")}
    />
  </div>
</>
)}
                    {state === 'Sign Up' ? (<p className='text-gray-400 text-center text-xs mt-4 '>Already have an account?{' '}<span onClick={() => setState('Login')} className='text-blue-600 cursor-pointer underline '>Login here</span>
                    </p>) : (<p className='text-gray-400 text-center text-xs mt-4 '>Don't have an account?{' '}<span onClick={() => setState('Sign Up')} className='text-blue-600 cursor-pointer underline '>Sign Up</span>
                    </p>
                    )}


                </form>
            </div>

        </div>
    )
}

export default Login
