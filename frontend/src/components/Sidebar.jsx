import Divider from "@mui/material/Divider"
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import PermContactCalendarOutlinedIcon from '@mui/icons-material/PermContactCalendarOutlined';
import { useLocation } from "react-router-dom";

const SideLink = ({ icon, label, path }) => {
    const location = useLocation();
    const currentPath = location.pathname

    return (
        <a className={`flex px-3 py-2 hover:bg-gray-200 rounded-md items-center gap-2 ${currentPath === path && 'bg-gray-200'}`} href={path}>
            {icon}
            <p className="font-bold text-black">{label}</p>
        </a>
    )
}

const SideLink2 = ({ label, path }) => {
    const location = useLocation();
    const currentPath = location.pathname

    return (
        <a className={`relative pl-10 flex py-1 rounded-md cursor-pointer items-center gap-2 my-2 hover:bg-gray-200 ${currentPath === path && 'bg-gray-200'}`} href={path}>
            {path === currentPath &&  <div className="z-2 absolute left-5 w-2 h-2 bg-blue-500 rounded-full"/>}
            <p className={`${path === currentPath && 'text-black font-bold'}`}>{label}</p>
        </a>
    )
}

const Sidebar = () => {
    return (
        <aside className="bg-white flex flex-col fixed inset-y-0 left-0 w-[200px] shadow-xl shadow-blue-200 px-3 py-5 border-r border-gray-200 flex flex-col gap-2">
           <div className="flex-1">
                <h1 className="font-bold text-2xl mb-5 text-blue-500">Admin</h1>
                <Divider sx={{ marginBottom: 3 }}/>
                <SideLink icon={<SpaceDashboardOutlinedIcon />} label="Dashboard" path="/admin"/>
                <div>
                    <div className="flex px-3 py-2 items-center gap-2">
                        <Inventory2OutlinedIcon />
                        <p className="font-bold text-black">Store</p>
                    </div>
                    <div className="relative after:content[''] after:absolute after:left-5 after:top-4 after:bottom-4 after:border-1 after:border-gray-300 after:bg-gray-300">
                        <SideLink2 label="Products" path="/admin/products"/>
                        <SideLink2 label="Orders" path="/admin/orders"/>
                        <SideLink2 label="Notifications" path="/admin/notifications"/>
                        <SideLink2 label="Customers" path="/admin/customers"/>
                    </div>
                </div>
                <SideLink icon={<PermContactCalendarOutlinedIcon />} label="Admins" path="/admin/admins"/>
                <SideLink icon={<SettingsOutlinedIcon />} label="Settings" path="/admin/settings"/>
                <SideLink icon={<LogoutOutlinedIcon />} label="Logout"/>
           </div>
           <div>
                <img className="h-[80px]" src="/logo.jpg" alt="logo" />
           </div>
        </aside>
    )
}

export default Sidebar