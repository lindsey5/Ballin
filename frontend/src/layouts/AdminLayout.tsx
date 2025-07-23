import { Outlet } from "react-router-dom"
import Sidebar from "../components/Sidebar"

const AdminLayout = () => {
    return (
        <div className="pl-52">
            <Sidebar />
            <Outlet />
        </div>
    )
}

export default AdminLayout