import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar"

const CustomerLayout = () => {
    return (
        <div className="bg-gradient-to-r from-blue-100 to-white">
        <Navbar />
        <Outlet />
        </div>
    )
}

export default CustomerLayout