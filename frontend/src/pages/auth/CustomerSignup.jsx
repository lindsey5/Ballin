import { useState, useEffect } from "react"
import { LineTextField } from "../../components/Textfield"
import { postData } from "../../services/api";
import { errorAlert, successAlert } from "../../utils/swal";
import { formatTime } from "../../utils/utils";
import LoadingScreen from '../../components/Loading';

const sendVerificationCode = async (callBack, email) => {
    const response = await postData('/api/signup/verification', { email });
    if(response.success){
        callBack();
    }
}

const VerifyCodeModal = ({ customer, close }) => {
    const [seconds, setSeconds] = useState(5 * 60);
    const [loading, setLoading] = useState(false);
    const [code, setCode] = useState('');

    useEffect(() => {
        const count = setInterval(() => {
            setSeconds(prev => {
                if (prev <= 1) {
                    clearInterval(count)
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(count);
    }, []);

    const createAccount = async (e) => {
        e.preventDefault()
        setLoading(true)
        const response = await postData('/api/signup', { code, customer })
        if(response.success){
            await successAlert('Sign Up successful', 'Welcome to Ballin!');
            window.location.href = '/'
        }else{
            errorAlert(response.error, 'Try again');
        }
        setLoading(false)
    }

    const resend = async () => {
        if(!loading){
            setLoading(true)
            await sendVerificationCode(() => setSeconds(5 * 60), customer.email)
            setLoading(false)
        }
    }

    return (
        <div className="flex justify-center items-center fixed z-99 bg-gray-900/50 inset-0">
             <LoadingScreen loading={loading} />
            <form className="max-w-[450px] w-[80%] p-10 bg-white rounded-lg flex flex-col gap-5" onSubmit={createAccount}>
                <h1 className="font-bold text-2xl text-purple-500">Verify your Email Address</h1>
                <div>
                    <p>Please enter the code we sent to:</p>
                    <p className="text-blue-500 font-bold mt-1">{customer?.email}</p>
                </div>
                <LineTextField placeholder="Enter code" onChange={(e) => setCode(e.target.value)}/>
                <p className="text-center text-sm md:text-base">{seconds ? `Code expires in ${formatTime(seconds)}` : 'Code expired'}</p>
                <div className="flex gap-5">
                    <button 
                        type="button"
                        className="flex-1 bg-white border border-gray-300 shadow-lg cursor-pointer"
                        onClick={close}
                    >Cancel</button>
                    <button
                        type="submit"
                        className="flex-2 bg-black text-white py-2 cursor-pointer"
                        disabled={loading}
                     >Verify Code</button>
                </div>
                <p>Haven't received yet? <span className="font-bold text-purple-500 cursor-pointer" onClick={resend}>Resend</span>
                </p>
            </form>
        </div>
    )
}

const CustomerSignupPage = () => {
    const [newCustomer, setNewCustomer] = useState();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(newCustomer.password !== newCustomer.confirmPassword){
            errorAlert('Password doesn\'t matched.', '')
        }else{
            setLoading(true)
            await sendVerificationCode(() => setOpen(true), newCustomer.email)
            setLoading(false);
        }
    }

    return (
        <div className="h-[calc(100vh-100px)] flex justify-center py-20">
            <LoadingScreen loading={loading} />
            {open && <VerifyCodeModal customer={newCustomer} close={() => setOpen(false)}/>}
            <form className="flex flex-col gap-5 w-[90%] max-w-[600px]" onSubmit={handleSubmit}>
                <h1 className="mb-6 font-bold text-4xl text-purple-500">SIGN UP</h1>
                <div className="flex gap-5">
                    <LineTextField 
                        placeholder="Firstname"
                        className="w-full"
                        value={newCustomer?.firstname || ''}
                        onChange={(e) => setNewCustomer(prev => ({...prev, firstname: e.target.value}))}
                        />
                    <LineTextField 
                        placeholder="Lastname"
                        className="w-full"
                        value={newCustomer?.lastname || ''}
                        onChange={(e) => setNewCustomer(prev => ({...prev, lastname: e.target.value}))}
                    />
                    </div>
                <LineTextField 
                    placeholder="Email"
                    className="w-full"
                    type="email"
                    value={newCustomer?.email || ''}
                    onChange={(e) => setNewCustomer(prev => ({...prev, email: e.target.value}))}
                />
                <LineTextField 
                    placeholder="Password"
                    className="w-full"
                    type="password"
                    value={newCustomer?.password || ''}
                    onChange={(e) => setNewCustomer(prev => ({...prev, password: e.target.value}))}
                />
                 <LineTextField 
                    placeholder="Confirm Password"
                    className="w-full"
                    type="password"
                    value={newCustomer?.confirmPassword || ''}
                    onChange={(e) => setNewCustomer(prev => ({...prev, confirmPassword: e.target.value}))}
                />
                <button type="submit" disabled={loading} className="mt-6 cursor-pointer bg-black text-white w-full py-3 px-5 rounded-md">Sign up</button>
                <span className="text-center mt-4">Already have an account? <a className="text-purple-500 text-bold text-lg" href="/login">Log in your account.</a></span>
            </form>
        </div>
    )
}

export default CustomerSignupPage