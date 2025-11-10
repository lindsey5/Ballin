import { Mail, Shield, User } from "lucide-react"
import { Helmet } from "react-helmet"
import { CustomizedTextField, PasswordField } from "../../components/Textfield"
import { useState, useContext, useEffect } from "react"
import { UserContext } from "../../contexts/User"
import { updateData } from "../../services/api"
import { confirmDialog, successAlert } from "../../utils/swal"
import LoadingScreen from "../../components/Loading"

const tabs = [
    { label: 'Profile', icon: User },
    { label: 'Password', icon: Shield }
]

const ChangePassword = () => {
    const [updating, setUpdating] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState('');

    const saveChanges = async () => {
        setError('')
        if(!currentPassword || !newPassword || !confirmNewPassword){
            setError('All password fields are required.');
            return;
         }

        if(newPassword !== confirmNewPassword){
            setError('New password and confirm password do not match.');
            return;
        }

        if(await confirmDialog('Change your password?', 'Make sure to remember your new password.')){
            setUpdating(true)
            const response = await updateData('/api/admins/password', { currentPassword, newPassword });
            setUpdating(false)
            if(!response.success){
                setError(response.error || 'Something went wrong. Please try again;')
                return;
            }

            await successAlert('Success', response.message);
            window.location.reload();
        }
    }

    return (
        <>
            <LoadingScreen loading={updating}/>
            <p className="text-red-500 mb-4">{error}</p>
            <div className="grid gap-4 md:grid-cols-2">
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
                    onClick={saveChanges}
                    disabled={updating}
                >
                    Save Password
                 </button>
            </div>
        </>
    )
}

const ProfileInformation = () => {
    const [updating, setUpdating] = useState(false);
    const { user, loading } = useContext(UserContext);
    const [updatedData, setUpdatedData] = useState();
    const [error, setError] = useState('');

    useEffect(() => {
        if(user){
            setUpdatedData(user);
        }
    }, [user])

    const saveChanges = async () => {
        if(await confirmDialog('Save changes?', 'Are you sure you want to update your account information?')){
            setUpdating(true)
            const response = await updateData('/api/admins', { firstname: user.firstname, lastname: user.lastname });
            setUpdating(false)
            if(!response.success){
                setError(response.error || 'Something went wrong. Please try again;')
                return;
            }

            await successAlert('Success', response.message);
            window.location.reload();
        }
    }

    return (
        <>
            <LoadingScreen loading={updating}/>
            <p className="text-red-500 mb-4">{error}</p>
            <div className="grid gap-4 md:grid-cols-2">
                <CustomizedTextField
                    label="Firstname"
                    placeholder="Enter your firstname"
                    value={updatedData?.firstname}
                    onChange={(e) => setUpdatedData(prev => ({...prev, firstname: e.target.value}))}
                    Icon={User}
                />
                <CustomizedTextField
                    label="Lastname"
                    placeholder="Enter your lastname"
                    value={updatedData?.lastname}
                    onChange={(e) => setUpdatedData(prev => ({...prev, lastname: e.target.value}))}
                    Icon={User}
                />
                <CustomizedTextField
                    label="Email"
                    value={updatedData?.email}
                    Icon={Mail}
                    disabled
                />
            </div>
            <div className="flex justify-end">
                <button 
                    className="mt-8 cursor-pointer hover:opacity-75 mt-4 p-3 bg-black text-white rounded-lg disabled:opacity-50"
                    onClick={saveChanges}
                    disabled={updating || loading}
                >
                    Save Changes
                 </button>
            </div>
        </>
    )
}

const Settings = () => {
    const [activeTab, setActiveTab] = useState('Profile');

    return (
        <div className="h-screen p-5 flex flex-col items-center gap-5">
            <Helmet>
                <title>Profile Settings</title>
            </Helmet>
            <h1 className="w-full text-start text-3xl font-bold text-black">Profile Settings</h1>
            <div className="w-full flex gap-2 items-center border-b border-gray-300">
            {tabs.map(tab => (
                <button
                    key={tab.label}
                    onClick={() => setActiveTab(tab.label)}
                    className={`flex gap-2 px-4 pb-2 font-medium ${
                    activeTab === tab.label
                        ? "text-purple-600 border-b-2 border-purple-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                    <tab.icon />
                    {tab.label.charAt(0).toUpperCase() + tab.label.slice(1)}
                </button>
            ))}
            </div>
            <div className="w-full md:w-[80%] bg-white shadow-lg border border-gray-200 rounded-lg p-5">
            {activeTab === 'Profile' && <ProfileInformation />}
            {activeTab === 'Password' && <ChangePassword />}
            </div>
        </div>
    )
}

export default Settings