import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../context/AppContext';
const formatName = (name) => {
  if (!name) return "";
  return name
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
const Header = () => {
  const { userData } = useContext(AppContent);
  const navigate = useNavigate();

  return (
    <div className='flex flex-col items-center mt-20 px-4 text-center text-gray-100'>
      
      <img
        src={assets.header_img}
        alt="User avatar"
        className='w-36 h-36 rounded-full mb-10'
      />

      <h1 className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2'>
        Welcome {userData?formatName(userData.name): "Developer"} To Modern Auth website
        <img
          src={assets.hand_wave}
          alt="Wave"
          className='w-8 aspect-square'
        />
      </h1>

      <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>
        Welcome to our app
      </h2>

      <p className='mb-8 max-w-md'>
        This is a modern auth login project based on MERN stack
      </p>

      <button
        onClick={() => navigate('/login')}
        className='border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-800 hover:text-gray-50 transition-all'
      >
        Get Started
      </button>

    </div>
  );
};

export default Header;