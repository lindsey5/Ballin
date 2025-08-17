import { Navigate, Outlet } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Chatbot from "../components/Chatbot"
import { useContext } from "react"
import { UserContext } from "../contexts/User"

const CustomerLayout = () => {
    const { user, loading } = useContext(UserContext);

    if(user?.role === 'Admin' && !loading){
        return <Navigate to="/admin" />
    }

    return (
        <div className="bg-gradient-to-r from-blue-100 to-white">
            <Navbar />
            <Outlet />
            <Footer />
            <Chatbot />
        </div>
    )
}

export default CustomerLayout