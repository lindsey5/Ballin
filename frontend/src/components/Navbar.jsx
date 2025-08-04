import { useContext, useState } from 'react';
import Searchfield from './SearchField';
import IconButton from '@mui/material/IconButton';
import { CustomerContext } from '../contexts/Customer';
import { Avatar } from '@mui/material';
import CartButton from './Button';

const Navbar = () => {
  const { customer } = useContext(CustomerContext);
  const [open, setOpen] = useState(false);

  return (
    <header className="px-20 py-5 flex justify-between items-center gap-10">
      <a href="/"><img className="w-30 h-15" src="/logo.jpg" alt="logo"/></a>
      <Searchfield placeholder='Search Product...'/>
      <div className="flex items-center gap-3">
        <CartButton />
        {customer ? (
        <div className='relative'>
          <IconButton onClick={() => setOpen(!open)}>
            <Avatar />
          </IconButton>
          {open && <div className='bg-gray-50 z-99 absolute w-[200px] right-0 border border-gray-200 rounded-lg'>
            <button className='text-start text-lg w-full p-3 border-t border-gray-300 cursor-pointer'>My Profile</button>
            <button className='text-start text-lg w-full p-3 border-t border-gray-300 cursor-pointer'>My Orders</button>
            <div className='px-5 py-3 flex justify-center border-t border-gray-300'>
              <button className='w-full py-2 bg-black text-white rounded-lg cursor-pointer'>Log Out</button>
            </div>
          </div>}

        </div>):
        <>
          <a className="text-lg hover:underline" href='/login'>Log In</a>
          <p>|</p>
          <a className="text-lg hover:underline" href='/signup'>Sign Up</a>
        </>
        }
      </div>

    </header>
  )
}

export default Navbar