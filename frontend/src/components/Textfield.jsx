
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