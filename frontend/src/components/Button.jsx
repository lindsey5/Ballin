import IconButton from '@mui/material/IconButton';
import { Badge, Tooltip } from '@mui/material';
import { fetchCart } from '../features/cart/cartThunks';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { FormControlLabel, Radio } from "@mui/material"

export const CartButton = () => {
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart.cart)

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    return (
        <Tooltip title="Cart">
            <IconButton onClick={() => window.location.href = '/cart' }>
                <Badge badgeContent={cart.length} color="primary">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
                        <path fillRule="evenodd" d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 0 0 4.25 22.5h15.5a1.875 1.875 0 0 0 1.865-2.071l-1.263-12a1.875 1.875 0 0 0-1.865-1.679H16.5V6a4.5 4.5 0 1 0-9 0ZM12 3a3 3 0 0 0-3 3v.75h6V6a3 3 0 0 0-3-3Zm-3 8.25a3 3 0 1 0 6 0v-.75a.75.75 0 0 1 1.5 0v.75a4.5 4.5 0 1 1-9 0v-.75a.75.75 0 0 1 1.5 0v.75Z" clipRule="evenodd" />
                    </svg>
                </Badge>
            </IconButton>
        </Tooltip>
    )
}

export const RadioButton = ({ label, value }) => {

    return (
        <FormControlLabel
            value={value} 
            control={( <Radio /> )} 
            label={label} 
        />   
    )
}

export const OrderUpdateButton = ({ status, onClick, disabled }) => {
    const getStatusColor = (status) => {
        switch (status) {
        case 'Confirmed':
            return 'text-blue-700 border-blue-300 hover:bg-blue-50 hover:border-blue-400';
        case 'Shipped':
            return 'text-orange-700 border-orange-300 hover:bg-orange-50 hover:border-orange-400';
        case 'Delivered':
            return 'text-green-700 border-green-300 hover:bg-green-50 hover:border-green-400';
        case 'Completed':
            return 'text-emerald-700 border-emerald-300 hover:bg-emerald-50 hover:border-emerald-400';
        case 'Cancelled':
            return 'text-red-700 border-red-300 hover:bg-red-50 hover:border-red-400';
        case 'Rejected':
            return 'text-red-700 border-red-300 hover:bg-red-50 hover:border-red-400';
        case 'Refunded':
            return 'text-purple-700 border-purple-300 hover:bg-purple-50 hover:border-purple-400';
        case 'Failed':
            return 'text-red-700 border-red-300 hover:bg-red-50 hover:border-red-400';
        default:
            return 'text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400';
        }
    };

    return (
        <button
        onClick={onClick}
        disabled={disabled}
        className={`cursor-pointer px-3 py-1.5 text-sm font-bold border rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${getStatusColor(status)}`}
        >
        Mark as {status}
        </button>
    );
};