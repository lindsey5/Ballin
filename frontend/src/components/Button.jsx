import IconButton from '@mui/material/IconButton';
import { Badge, Tooltip } from '@mui/material';
import { fetchCart } from '../features/cart/cartThunks';
import { useDispatch, useSelector } from 'react-redux';
import { useContext, useEffect, useState, useRef } from 'react';
import { FormControlLabel, Radio } from "@mui/material"
import NotificationsIcon from '@mui/icons-material/Notifications';
import { NotificationContext } from '../contexts/Notifications';
import { formatDate } from '../utils/dateUtils';
import { Bell } from 'lucide-react';
import { updateData } from '../services/api';
import { successAlert } from '../utils/swal';
import LoadingScreen from './Loading';

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

export const NotificationBell = () => {
    const { notifications, unread, hasMore, loadNextPage } = useContext(NotificationContext);
    const [showNotification, setShowNotification] = useState(false);
    const [loading, setLoading] = useState(false);

    const markAllRead = async () => {
        const response = await updateData("/api/notifications", {});
        if (response.success) {
        await successAlert(response.message);
        window.location.reload();
        }
    };

    const handleClick = async (notification) => {
        setLoading(true);
        const response = await updateData(`/api/notifications/${notification.id}`, {})
        if(response.success){
            window.location.href = `/order/${notification.order_id}`;
        }
        setLoading(false)
    }

    return (
        <div className='relative'>
            <LoadingScreen loading={loading}/>
           <Tooltip title="Notifications">
            <Badge badgeContent={unread} color='error'>
                <IconButton onClick={() => setShowNotification(!showNotification)}>
                <NotificationsIcon sx={{ width: 30, height: 30 }}/>
                </IconButton>
            </Badge>
          </Tooltip>
            {/* Dropdown */}
            {showNotification && (
                <div className="z-99 absolute -right-10 mt-3 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform origin-top-right animate-in zoom-in-95 slide-in-from-top-2 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-5 bg-slate-50 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                        <Bell className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900">Notifications</h3>
                        <p className="text-xs text-slate-500">
                        Stay updated with orders
                        </p>
                    </div>
                    </div>
                    {notifications.length > 0 && (
                    <button
                        className="cursor-pointer text-xs text-purple-600 hover:text-purple-700 font-medium px-3 py-1 rounded-lg hover:bg-purple-50 transition-colors"
                        onClick={markAllRead}
                    >
                        Mark all read
                    </button>
                    )}
                </div>

                {/* Notifications List */}
                <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                    <div className="p-2">
                        {notifications.map((n, idx) => (
                        <div
                            key={idx}
                            onClick={() => handleClick(n)}
                            className="group p-4 m-2 bg-white hover:bg-slate-50 border border-slate-100 hover:border-slate-200 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-sm"
                        >
                            <div className="flex items-start gap-4">
                            {/* Icon */}
                            <div className="flex-shrink-0 mt-0.5">
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center shadow-sm">
                                <Bell className="w-5 h-5 text-white" />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-sm text-slate-900 mb-1 leading-snug">
                                {n.order_id}
                                </p>
                                <p className="text-sm font-medium text-slate-900 mb-1 leading-snug">
                               {n.message}
                                </p>
                                <p className="text-xs text-slate-500 mb-2">
                                {formatDate(n.date)}
                                </p>
                                {n.status === "unread" && (
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                    New
                                    </span>
                                </div>
                                )}
                            </div>
                            </div>
                        </div>
                        ))}

                        {/* See More Button */}
                        {hasMore && (
                        <div className="flex justify-center mt-3">
                            <button
                            onClick={loadNextPage}
                            className="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                            >
                            See more
                            </button>
                        </div>
                        )}
                    </div>
                    ) : (
                    <div className="p-8 text-center">
                        <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Bell className="w-10 h-10 text-slate-400" />
                        </div>
                        <p className="text-sm text-slate-500 max-w-xs mx-auto">
                        No notifications right now.
                        </p>
                    </div>
                    )}
                </div>
                </div>
            )}
        </div>
    )
}

export const AdminNotificationBell = () => {
    const { notifications, unread, hasMore, loadNextPage } = useContext(NotificationContext);
    const [showNotification, setNotification] = useState(false);
    const dropdownRef = useRef(null);
    const [loading, setLoading] = useState(false);


    const markAllRead = async () => {
        const response = await updateData("/api/notifications/admin", {});
        if (response.success) {
        await successAlert(response.message);
        window.location.reload();
        }
    };

    const handleClick = async (notification) => {
        setLoading(true);
        const response = await updateData(`/api/notifications/admin/${notification.id}`, {})
        if(response.success){
            window.location.href = `/admin/order/${notification.order_id}`;
        }
        setLoading(false)
    }

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target)
        ) {
            setNotification(false);
        }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="fixed top-4 right-4 z-50" ref={dropdownRef}>
            <LoadingScreen loading={loading} />
            {/* Bell Button */}
            <button
                onClick={() => setNotification(!showNotification)}
                className="cursor-pointer relative bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl p-3 shadow-2xl hover:shadow-slate-900/25 transition-all duration-200 group"
            >
                <Bell className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" />
                {unread > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full ring-2 ring-slate-900 shadow-lg">
                    {unread > 9 ? "9+" : unread}
                </span>
                )}
            </button>

        {/* Dropdown */}
        {showNotification && (
            <div className="absolute right-0 mt-3 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform origin-top-right animate-in zoom-in-95 slide-in-from-top-2 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-5 bg-slate-50 border-b border-slate-100">
                <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                    <Bell className="w-4 h-4 text-white" />
                </div>
                <div>
                    <h3 className="font-semibold text-slate-900">Notifications</h3>
                    <p className="text-xs text-slate-500">
                    Stay updated with orders
                    </p>
                </div>
                </div>
                {notifications.length > 0 && (
                <button
                    className="cursor-pointer text-xs text-purple-600 hover:text-purple-700 font-medium px-3 py-1 rounded-lg hover:bg-purple-50 transition-colors"
                    onClick={markAllRead}
                >
                    Mark all read
                </button>
                )}
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                <div className="p-2">
                    {notifications.map((n, idx) => (
                    <div
                        key={idx}
                        onClick={() => handleClick(n)}
                        className="group p-4 m-2 bg-white hover:bg-slate-50 border border-slate-100 hover:border-slate-200 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-sm"
                    >
                        <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className="flex-shrink-0 mt-0.5">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center shadow-sm">
                            <Bell className="w-5 h-5 text-white" />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm text-slate-900 mb-1 leading-snug">
                            {n.order_id}
                            </p>
                            <p className="text-sm font-medium text-slate-900 mb-1 leading-snug">
                            {n.customer.firstname} {n.customer.lastname} {n.message}
                            </p>
                            <p className="text-xs text-slate-500 mb-2">
                            {formatDate(n.date)}
                            </p>
                            {n.status === "unread" && (
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                New
                                </span>
                            </div>
                            )}
                        </div>
                        </div>
                    </div>
                    ))}

                    {/* See More Button */}
                    {hasMore && (
                    <div className="flex justify-center mt-3">
                        <button
                        onClick={loadNextPage}
                        className="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                        >
                        See more
                        </button>
                    </div>
                    )}
                </div>
                ) : (
                <div className="p-8 text-center">
                    <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Bell className="w-10 h-10 text-slate-400" />
                    </div>
                    <p className="text-sm text-slate-500 max-w-xs mx-auto">
                    No notifications right now.
                    </p>
                </div>
                )}
            </div>
            </div>
        )}
        </div>
    );
};
