import { Navigate, Outlet } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Chatbot from "../components/Chatbot"
import { useContext } from "react"
import { UserContext } from "../contexts/User"
import { NotificationsContextProvider } from "../contexts/Notifications"

const CustomerLayout = () => {
    const { user, loading } = useContext(UserContext);

    if((user?.role === 'Admin' || user?.role === 'Owner') && !loading){
        return <Navigate to="/admin" />
    }

    return (
        <NotificationsContextProvider>
            <div className="bg-gradient-to-r from-blue-100 to-white">
                <Navbar />
                <Outlet />
                <Footer />
                <Chatbot />
            </div>
        </NotificationsContextProvider>
    )
}

export default CustomerLayout