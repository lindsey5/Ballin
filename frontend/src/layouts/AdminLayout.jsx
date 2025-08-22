import { Outlet } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import { useContext } from "react";
import { UserContext } from "../contexts/User";
import { Navigate } from "react-router-dom";

const AdminLayout = () => {
    const { user, loading } = useContext(UserContext);

    if(loading) return null
    
    if((user?.role === 'Customer' || !user) && !loading){
        return <Navigate to="/admin/login" />
    }

    return (
        <div className="pl-52 bg-gradient-to-r from-blue-100 to-white">
            <Sidebar />
            <Outlet />
        </div>
    )
}

export default AdminLayout