import { useState,useContext } from "react"
import { LinePasswordField } from "../../components/Textfield"
import LoadingScreen from '../../components/Loading';
import { UserContext } from "../../contexts/User";
import { Navigate, useParams } from "react-router-dom";
import { postData } from "../../services/api";
import { successAlert } from "../../utils/swal";


const ResetPasswordPage = () => {
    const { token } = useParams();
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useContext(UserContext);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if(confirmNewPassword !== newPassword){
            setError('Password doesn\'t matched.')
            return;
        }        

        setLoading(true)
        const response = await postData(`/api/reset-password/${token}`, { newPassword })
        setLoading(false)
        if(!response.success){
            setError(response.error || 'Something went wrong. Please try again.')
            return;
        }

        await successAlert("Success!", response.message);
        window.location.href = '/login';
    }

    if(user){
        return <Navigate to="/" />
    }

    return (
        <div className="min-h-[calc(100vh-100px)] flex justify-center md:grid grid-cols-2 gap-5">
            <LoadingScreen loading={loading} />
            <img className="p-10 hidden md:block w-full h-[calc(100vh-100px)]" src="/pic (2).jpg" alt="image" />
            <form className="p-10 flex flex-col gap-5 w-[90%] max-w-[600px]" onSubmit={handleSubmit}>
                <h1 className="mb-6 font-bold text-4xl text-purple-500">Reset Your Password</h1>
                <p className="text-red-500">{error}</p>
                <LinePasswordField 
                    placeholder="New Password"
                    className="w-full"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <LinePasswordField 
                    placeholder="Confirm New Password"
                    className="w-full"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
                <button type="submit" disabled={loading} className="mt-6 cursor-pointer bg-black text-white w-full py-3 px-5 rounded-md">Sign up</button>
                <span className="text-center mt-4">Back to <a className="text-purple-500 text-bold text-lg" href="/login">Log</a></span>
            </form>
        </div>
    )
}

export default ResetPasswordPage