import { useState, useEffect, useContext } from "react"
import { LinePasswordField, LineTextField } from "../../components/Textfield"
import LoadingScreen from '../../components/Loading';
import { UserContext } from "../../contexts/User";
import { Navigate } from "react-router-dom";
import { postData } from "../../services/api";
import { successAlert } from "../../utils/swal";


const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useContext(UserContext);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        setError('')
        const response = await postData('/api/forgot-password', { email });
        setLoading(false)
        if(!response.success){
            setError(response.error || 'Something went wrong. Please Try again.')
            return;
        }

        await successAlert(response.message || 'Success', 'Please check your inbox and follow the instructions to reset your password.');

        window.location.href = '/';
        
    }

    if(user){
        return <Navigate to="/" />
    }

    return (
        <div className="min-h-[calc(100vh-100px)] flex justify-center md:grid grid-cols-2 gap-5">
            <LoadingScreen loading={loading} />
            <img className="p-10 hidden md:block w-full h-[calc(100vh-100px)]" src="/pic (2).jpg" alt="image" />
            <form className="p-10 flex flex-col gap-5 w-[90%] max-w-[600px]" onSubmit={handleSubmit}>
                <h1 className="mb-2 font-bold text-4xl text-purple-500">Forgot Password</h1>
                <p className="text-gray-400 mb-4">Enter your email address and we’ll send you a link to reset your password.</p>
                <p className="text-red-500">{error}</p>
                <LineTextField
                    placeholder="Enter your email"
                    className="w-full"
                    value={email}
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit" disabled={loading} className="mt-6 cursor-pointer bg-black text-white w-full py-3 px-5 rounded-md">Sign up</button>
                <span className="text-center mt-4">Back to <a className="text-purple-500 text-bold text-lg" href="/login">Log in</a></span>
            </form>
        </div>
    )
}

export default ForgotPasswordPage