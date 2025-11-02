import { Lock } from "lucide-react"
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react"

export const LineTextField = ({ className, placeholder, type = 'text', value, onChange }) => {
    return (
        <input 
            className={`text-lg outline-none border-b py-2 px-1 ${className}`}
            type={type} 
            value={value} 
            placeholder={placeholder} 
            onChange={onChange} 
            required
        />
    )
}

export const CustomizedTextField = ({ label, value, onChange, placeholder, Icon, name, type = "text", disabled = false }) => {
    return (
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
                {label}
            </label>
            <div className="relative">
                <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder={placeholder}
                    disabled={disabled}
                />
            </div>
        </div>
    )
}

export const PasswordField = ({ label, value, onChange, placeholder, Icon, name }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="relative">
            <CustomizedTextField 
                label={label}
                type={showPassword ? "text" : "password"}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                Icon={Lock}
                name={name}
            />
            <button
                type="button"
                className="absolute right-4 top-1/2 text-gray-400"
                onClick={() => setShowPassword(prev => !prev)}
            >
                {showPassword ? <VisibilityOff className="w-5 h-5" /> : <Visibility className="w-5 h-5" />}
            </button>
        </div>
    )
}