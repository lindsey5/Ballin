import { Outlet } from "react-router-dom"
import Sidebar from "../components/Sidebar"

const AdminLayout = () => {
    return (
        <div className="pl-52 bg-gradient-to-r from-blue-100 to-white">
            <Sidebar />
            <Outlet />
        </div>
    )
}

export default AdminLayout