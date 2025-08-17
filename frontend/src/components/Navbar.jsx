import { useContext, useState } from 'react';
import Searchfield from './SearchField';
import IconButton from '@mui/material/IconButton';
import { Avatar } from '@mui/material';
import { CartButton } from './Button';
import { signout } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/User';

const Navbar = () => {
  const { user } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/products?searchTerm=${searchTerm}`)
  }

  return (
    <header className="max-w-full px-5 md:px-20 py-5 flex md:justify-between items-center gap-3 md:gap-10">
      <a href="/"><img className="w-[70px] md:w-[140px] h-[40px] md:h-[60px]" src="/logo.png" alt="logo"/></a>
      <Searchfield placeholder='Search Product...' submit={handleSubmit} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
      <div className="flex items-center gap-3">
        <CartButton />
        {user ? (
        <div className='relative'>
          <IconButton onClick={() => setOpen(!open)}>
            <Avatar />
          </IconButton>
          {open && <div className='bg-gray-50 z-99 absolute w-[200px] right-0 border border-gray-200 rounded-lg'>
            <button className='text-start text-lg w-full p-3 border-t border-gray-300 cursor-pointer'>My Profile</button>
            <button className='text-start text-lg w-full p-3 border-t border-gray-300 cursor-pointer' onClick={() => window.location.href = '/orders'}>My Orders</button>
            <div className='px-5 py-3 flex justify-center border-t border-gray-300'>
              <button className='w-full py-2 bg-black text-white rounded-lg cursor-pointer' onClick={signout}>Log Out</button>
            </div>
          </div>}

        </div>):
        <>
          <a className="text-lg hover:underline" href='/login'>Log In</a>
          <p className='md:block hidden'>|</p>
          <a className="md:block hidden text-lg hover:underline" href='/signup'>Sign Up</a>
        </>
        }
      </div>

    </header>
  )
}

export default Navbar