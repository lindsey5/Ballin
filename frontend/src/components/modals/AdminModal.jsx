import { Modal } from "@mui/material"
import { CustomizedTextField, PasswordField } from "../Textfield"
import { memo, useState } from "react"
import { Lock, Mail, Shield, User } from "lucide-react";
import { confirmDialog, successAlert, errorAlert } from "../../utils/swal";
import { postData, updateData } from "../../services/api";

const AdminModal = ({ open, close, admin }) => {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    console.log('Rendered')

    const handleSave = async () => {
        if (!firstname || !lastname || !email) {
            await errorAlert("Missing Fields", "Please fill in all required fields.");
            return;
        }

        if (!admin && (!password || !confirmPassword)) {
            await errorAlert("Missing Password", "Please enter and confirm your password.");
            return;
        }

        if (password !== confirmPassword) {
            await errorAlert("Password Mismatch", "Passwords do not match. Please try again.");
            return;
        }

        const mainMessage = admin ? "Are you sure you want to update this admin?" : "Are you sure you want to create this new admin?";
        const subMessage = admin ? "The admin details will be updated." : "A new admin account will be created.";

        if (await confirmDialog(mainMessage, subMessage)) {
            const response = admin ? await updateData('/api/admins', { firstname, lastname, email, password }) : await postData('/api/admins', { firstname, lastname, email, password});
            if(!response.success){
                await errorAlert("Error", response.error || "Something went wrong. Please try again.");
                return;
            }

            await successAlert("Success",admin ? "Admin profile has been successfully updated." : "New admin account has been successfully created.");
        }
    };

    return (
        <Modal 
            open={open}
            onClose={close}
            aria-labelledby="create-admin-modal-title"
            aria-describedby="create-admin-modal-description"
            sx={{
                zIndex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <div className="min-w-[650px] space-y-4 bg-white px-6 py-10 rounded-xl">
                <h1 className="font-bold text-lg mb-8">
                    {!admin ? 'Create New' : 'Update'} Admin
                </h1>
                <div className="grid grid-cols-2 gap-4">
                    <CustomizedTextField 
                        label="Firstname"
                        onChange={(e) => setFirstname(e.target.value)}
                        name="firstname"
                        placeholder="Enter firstname"
                        value={firstname}
                        Icon={User}
                    />
                    <CustomizedTextField 
                        label="Lastname"
                        onChange={(e) => setLastname(e.target.value)}
                        name="lastname"
                        placeholder="Enter lastname"
                        value={lastname}
                        Icon={User}
                    />
                    <CustomizedTextField 
                        label="Email"
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        name="email"
                        placeholder="Enter email"
                        value={email}
                        Icon={Mail}
                    />
                    <PasswordField
                        label="Password"
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        name="password"
                        placeholder="Enter password"
                        value={password}
                        Icon={Shield}
                    />
                    <PasswordField
                        label="Confirm Password"
                        type="password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        Icon={Lock}
                    />
                </div>
                <div className="flex justify-end">
                    <button 
                        onClick={handleSave}
                        className="cursor-pointer hover:opacity-75 p-3 bg-black text-white rounded-lg disabled:opacity-50"
                    >
                        {admin ? 'Update' : 'Save'} Admin
                    </button>
                </div>
            </div>
        </Modal>
    )
}

export default memo(AdminModal);
