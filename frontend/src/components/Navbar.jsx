import { useContext, useState } from 'react';
import Searchfield from './SearchField';
import IconButton from '@mui/material/IconButton';
import { Tooltip } from '@mui/material';
import { CartButton, NotificationBell } from './Button';
import { signout } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/User';
import { Shirt, Menu, X } from 'lucide-react';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

const Navbar = () => {
  const { user } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/products?searchTerm=${searchTerm}`);
  };

  return (
    <header className="w-full px-5 md:px-20 py-5 flex justify-between items-center gap-3">
      {/* Logo */}
      <a href="/">
        <img className="w-[70px] md:w-[140px] h-[40px] md:h-[60px]" src="/logo.png" alt="logo" />
      </a>

      {/* Search - hidden on small screens */}
      <div className="hidden md:block w-full max-w-md">
        <Searchfield
          placeholder="Search Product..."
          submit={handleSubmit}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Right-side Icons */}
      <div className="flex items-center gap-3">
        <CartButton />
        <div className="hidden md:flex items-center gap-3">
          <Tooltip title="Shop">
            <IconButton onClick={() => navigate('/products')}>
              <Shirt size={28} />
            </IconButton>
          </Tooltip>
        </div>
        <NotificationBell />

        {/* Desktop Settings / Profile */}
        {user ? (
          <div className="relative hidden md:block">
            <Tooltip title="Menu">
              <IconButton onClick={() => setOpen(!open)}>
                <SettingsOutlinedIcon sx={{ width: 30, height: 30 }} />
              </IconButton>
            </Tooltip>
            {open && (
              <div className="bg-gray-50 absolute w-[200px] right-0 border border-gray-200 rounded-lg z-50">
                <button className="text-start text-lg w-full p-3 border-t border-gray-300 cursor-pointer" onClick={() => navigate('/products')}>Shop</button>
                <button className="text-start text-lg w-full p-3 border-t border-gray-300 cursor-pointer" onClick={() => navigate('/profile')}>My Profile</button>
                <button className="text-start text-lg w-full p-3 border-t border-gray-300 cursor-pointer" onClick={() => navigate('/orders')}>My Orders</button>
                <div className="px-5 py-3 flex justify-center border-t border-gray-300">
                  <button className="w-full py-2 bg-black text-white rounded-lg" onClick={signout}>Log Out</button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-3">
            <a className="text-lg hover:underline" href="/login">Log In</a>
            <p>|</p>
            <a className="text-lg hover:underline" href="/signup">Sign Up</a>
          </div>
        )}

        {/* Hamburger Button (mobile only) */}
        <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden cursor-pointer">
          {mobileMenu ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenu && (
        <div className="absolute top-20 left-0 w-full bg-white border-t border-gray-200 shadow-lg flex flex-col p-5 gap-4 md:hidden z-50">
          <Searchfield
            placeholder="Search Product..."
            submit={handleSubmit}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <button className="text-lg cursor-pointer" onClick={() => navigate('/products')}>Shop</button>
          {user ? (
            <>
              <button className="text-lg cursor-pointer" onClick={() => navigate('/profile')}>My Profile</button>
              <button className="text-lg cursor-pointer" onClick={() => navigate('/orders')}>My Orders</button>
              <button className="w-full py-2 bg-black text-white rounded-lg cursor-pointer" onClick={signout}>Log Out</button>
            </>
          ) : (
            <>
              <a className="text-lg" href="/login">Log In</a>
              <a className="text-lg" href="/signup">Sign Up</a>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
