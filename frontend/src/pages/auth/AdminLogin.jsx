import { useState } from "react";
import { postData } from "../../services/api";
import { errorAlert } from "../../utils/swal";

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const login = async (e) => {
        e.preventDefault();
        const response = await postData('/api/admins/login', { email, password})
        if(response.success){
            window.location.href = '/admin'
        }else{
            errorAlert(response.error, 'Please try again')
        }
    }

    return (
        <div className="h-screen bg-[url('/bg.jpg')] bg-cover bg-center flex justify-center items-center">
            <form onSubmit={login} className="w-[90%] max-w-[400px] p-10 bg-white/30 backdrop-blur-md border border-white/30 shadow-lg rounded-2xl flex flex-col gap-5">
                <h1 className="font-bold text-2xl">Admin Login</h1>
                <input 
                    placeholder="Email" 
                    type="text" 
                    className="rounded-md w-full p-3 border outline-none"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input 
                    placeholder="Password" 
                    type="password" 
                    className="rounded-md w-full p-3 border outline-none"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button className="cursor-pointer rounded-lg py-2 bg-black text-white">Log In</button>
            </form>
        </div>
    )
}

export default AdminLogin