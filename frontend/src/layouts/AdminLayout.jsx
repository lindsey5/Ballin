import { Outlet } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import { useContext } from "react";
import { UserContext } from "../contexts/User";
import { Navigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { SocketContext } from "../contexts/Socket";
import { useEffect } from "react";
import { NotificationsContextProvider } from '../contexts/Notifications';

const AdminLayout = () => {
    const { setNamespace } = useContext(SocketContext)
    const { user, loading } = useContext(UserContext);

    useEffect(() => {
        setNamespace('/notifications')
    }, [])

    if(loading) return <div className="flex flex-col justify-center items-center h-screen">
        <img src="/logo.png"/>
        <CircularProgress />
    </div>
    
    if((user?.role === 'Customer' || !user) && !loading){
        return <Navigate to="/admin/login" />
    }

    return (
        <NotificationsContextProvider>
        <div className="pl-52 bg-gradient-to-r from-blue-100 to-white">
            <Sidebar />
            <Outlet />
        </div>
        </NotificationsContextProvider>
    )
}

export default AdminLayout