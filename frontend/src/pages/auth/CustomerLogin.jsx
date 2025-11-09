import { useState } from "react";
import { LinePasswordField, LineTextField } from "../../components/Textfield"
import { postData } from "../../services/api"
import { successAlert } from "../../utils/swal";
import { Helmet } from "react-helmet";
import { useContext } from "react"
import { UserContext } from "../../contexts/User"
import { Navigate } from "react-router-dom";

const CustomerLoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { user } = useContext(UserContext);
    const [error, setError] = useState('');

    const login = async (e) => {
        e.preventDefault();
        setError('');
        const response = await postData('/api/login', { email, password });
        if(response?.error){
            setError(response.error);
            return;
        }
        await successAlert('Login successful', 'Welcome to Ballin!')
        window.location.href = '/'
    }

    if(user){
        return <Navigate to="/" />
    }

    return (
        <div className="min-h-[calc(100vh-100px)] flex justify-center md:grid grid-cols-2 gap-5">
             <Helmet>
                <title>Log In</title>
            </Helmet>
            <img className="p-10 hidden md:block w-full h-[calc(100vh-100px)]" src="/pic (1).jpg" alt="image" />
            <form className="p-10 flex flex-col gap-5 w-[90%]" onSubmit={login}>
                <h1 className="mb-6 font-bold text-3xl text-purple-500">LOG IN</h1>
                <p className="text-red-500">{error}</p>
                <LineTextField 
                    placeholder="Email"
                    className="w-full"
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <LinePasswordField 
                    placeholder="Password"
                    className="w-full"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="mt-6 cursor-pointer bg-black text-white w-full py-3 px-5 rounded-md">Log In</button>
                <span className="text-center mt-4">Don't have an account? <a className="text-purple-500 text-bold text-lg" href="/signup">Create an account.</a></span>
            </form>
        </div>
    )
}

export default CustomerLoginPage