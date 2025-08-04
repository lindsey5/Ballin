import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar"
import { CustomerContextProvider } from "../contexts/Customer"

const CustomerLayout = () => {
    return (
        <CustomerContextProvider>
            <div className="bg-gradient-to-r from-blue-100 to-white">
                <Navbar />
                <Outlet />
            </div>
        </CustomerContextProvider>
    )
}

export default CustomerLayout