import { Helmet } from "react-helmet"
import { useState, useContext } from "react"
import { Mail, Shield, User } from "lucide-react"
import { CustomizedTextField, PasswordField } from "../../components/Textfield";
import { CircularProgress } from "@mui/material";
import { UserContext } from "../../contexts/User";
import { updateData } from "../../services/api";
import { confirmDialog, errorAlert, successAlert } from "../../utils/swal";

const ProfileInformation = () => {
    const { user, loading, setUser } = useContext(UserContext);
    const [updating, setUpdating] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const saveChanges = async () => {
        if(await confirmDialog('Save changes to your profile?', 'Make sure the information is correct.')){
            if(!user.firstname || !user.lastname){
                await errorAlert('Validation Error', 'First name and last name are required.');
                return;
            }
            setUpdating(true);

            const response = await updateData('/api/customers', user);
            setUpdating(false);
            if(!response.success){
                await errorAlert('Update Error', response.error);
                return;
            }

            await successAlert('Success!', 'Profile updated successfully!');
        }
    }

    return (
        <>
            {loading ? <div className="flex justify-center">
                <CircularProgress />
            </div> : 
            <>
            <div className="grid md:grid-cols-2 gap-5">
                <CustomizedTextField 
                    label="First Name"
                    placeholder="Enter your first name"
                    value={user?.firstname}
                    name="firstname"
                    onChange={handleChange}
                    Icon={User}
                />
                <CustomizedTextField
                    label="Last Name"
                    placeholder="Enter your last name"
                    value={user?.lastname}
                    name="lastname"
                    onChange={handleChange}
                    Icon={User}
                />

                <CustomizedTextField
                    label="Email"
                    placeholder="Enter your email"
                    value={user?.email}
                    name="email"
                    onChange={handleChange}
                    Icon={Mail}
                    disabled
                />
            </div>
            <div className="flex justify-end">
                <button 
                    className="mt-8 cursor-pointer hover:opacity-75 mt-4 p-3 bg-black text-white rounded-lg disabled:opacity-50"
                    onClick={saveChanges}
                    disabled={updating}
                >
                    Save Changes
                 </button>
            </div>
            </>
            }
        </>
    )
}

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState('');
    const [updating, setUpdating] = useState(false);
    
    const changePassword = async () => {
        if(await confirmDialog('Change your password?', 'Make sure to remember your new password.')){
            if(!currentPassword || !newPassword || !confirmNewPassword){
                setError('All password fields are required.');
                return;
            }

            if(newPassword !== confirmNewPassword){
                setError('New password and confirm password do not match.');
                return;
            }

            setUpdating(true);
            const response = await updateData('/api/customers/password', { currentPassword, newPassword });
            setUpdating(false);
            if(!response.success){
                setError(response.error);
                return;
            }
            await successAlert('Success!', 'Password changed successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
            setError('');
        }
    }

    return (
        <>
            <p className="text-red-500 mb-8">{error}</p>
            <div className="grid md:grid-cols-2 gap-5">
                <PasswordField 
                    label="Current Password"
                    placeholder="Enter your current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    name="currentPassword"
                />
                <PasswordField
                    label="New Password"
                    placeholder="Enter your new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    name="newPassword"
                />
                <PasswordField
                    label="Confirm New Password"
                    placeholder="Confirm your new password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    name="confirmNewPassword"
                />
            </div>
            <div className="flex justify-end">
                <button 
                    className="mt-8 cursor-pointer hover:opacity-75 mt-4 p-3 bg-black text-white rounded-lg disabled:opacity-50"
                    onClick={changePassword}
                    disabled={updating}
                >
                    Update Password
                 </button>
            </div>
        </>
    )
}

const Profile = () => {
    const [activeTab, setActiveTab] = useState('info');

    return (
        <div className="flex flex-col gap-5 min-h-[calc(100vh-100px)] px-4 md:px-10 py-10">
             <Helmet>
                <title>Profile Settings</title>
            </Helmet>
            <div>
                <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
                <p>Manage your account information and security</p>
            </div>

            <div className="grid grid-cols-2 bg-white border border-gray-200 rounded-xl shadow-md">
                <button 
                    className={`text-sm md:text-base cursor-pointer p-3 flex justify-center items-center gap-2 ${activeTab === 'info' ? 'bg-purple-100 border-b-2 border-purple-500 text-purple-500 font-bold rounded-tl-xl' : 'hover:bg-gray-100 rounded-tl-xl'}`} 
                    onClick={() => setActiveTab('info')}
                >
                    <User className="w-7 h-7" />
                    Profile Information
                </button>
                <button 
                    className={`text-sm md:text-base cursor-pointer p-3 flex justify-center items-center gap-2 ${activeTab === 'password' ? 'bg-purple-100 border-b-2 border-purple-500 text-purple-500 font-bold rounded-tr-xl' : 'hover:bg-gray-100 rounded-tr-xl'}`} 
                    onClick={() => setActiveTab('password')}
                >
                    <Shield className="w-7 h-7" />
                    Change Password
                </button>
            </div>
            <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-md">
                {activeTab === 'info' && <ProfileInformation />}
                {activeTab === 'password' && <ChangePassword />}
            </div>
        </div>
    )
}

export default Profile