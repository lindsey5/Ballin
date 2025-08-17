import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Chatbot from "../components/Chatbot"

const CustomerLayout = () => {
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