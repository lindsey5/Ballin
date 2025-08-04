import { useState } from "react";
import { LineTextField } from "../../components/Textfield"
import { postData } from "../../services/api"
import { errorAlert, successAlert } from "../../utils/swal";

const CustomerLoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const login = async (e) => {
        e.preventDefault();
        const response = await postData('/api/login', { email, password });
        if(response?.error){
            await errorAlert(response.error, '');
            return;
        }
        await successAlert('Login successful', 'Welcome to Ballin!')
        window.location.href = '/'
    }

    return (
        <div className="h-[calc(100vh-100px)] flex justify-center py-20">
            <form className="flex flex-col gap-5 w-[90%] max-w-[600px]" onSubmit={login}>
                <h1 className="mb-6 font-bold text-3xl text-purple-500">LOG IN</h1>
                <LineTextField 
                    placeholder="Email"
                    className="w-full"
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <LineTextField 
                    placeholder="Password"
                    className="w-full"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="mt-6 cursor-pointer bg-black text-white w-full py-3 px-5 rounded-md">Log In</button>
                <span className="text-center mt-4">Don't have an account? <a className="text-purple-500 text-bold text-lg" href="/signup">Create an account.</a></span>
            </form>
        </div>
    )
}

export default CustomerLoginPage