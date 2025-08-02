import { LineTextField } from "../../components/Textfield"

const CustomerLoginPage = () => {
    return (
        <div className="h-[calc(100vh-100px)] flex justify-center py-20">
            <div className="flex flex-col gap-5 w-[90%] max-w-[600px]">
                <h1 className="mb-6 font-bold text-3xl text-purple-500">LOG IN</h1>
                <LineTextField 
                    placeholder="Email"
                    className="w-full"
                    type="email"
                />
                <LineTextField 
                    placeholder="Password"
                    className="w-full"
                    type="password"
                />
                <button className="mt-6 cursor-pointer bg-black text-white w-full py-3 px-5 rounded-md">Log In</button>
                <span className="text-center mt-4">Don't have an account? <a className="text-purple-500 text-bold text-lg" href="/signup">Create an account.</a></span>
            </div>
        </div>
    )
}

export default CustomerLoginPage