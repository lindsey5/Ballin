import { useState } from "react";

export const StatusDropdown = ({ status, handleSelect }) => {
    const [open, setOpen] = useState(false);
    const statuses = [
        { label: "Pending", color: "bg-yellow-400" },
        { label: "Confirmed", color: "bg-blue-500" },
        { label: "Shipped", color: "bg-indigo-500" },
        { label: "Delivered", color: "bg-green-500" },
        { label: "Received", color: "bg-emerald-600" },
        { label: "Cancelled", color: "bg-gray-500" },
        { label: "Rejected", color: "bg-red-500" },
        { label: "Failed", color: "bg-red-700" },
    ];

    const select = (label) => {
        handleSelect(label)
        setOpen(false)
    }

     return (
        <div className="relative w-[170px]">
            {/* Button to open/close */}
            <button
            type="button"
            onClick={() => setOpen(!open)}
            className="w-full flex items-center justify-between border border-black rounded-lg px-3 py-2"
            >
            {status ? (
                <span className="flex items-center gap-2">
                <span
                    className={`w-3 h-3 rounded-full ${
                    statuses.find((s) => s.label === status)?.color
                    }`}
                ></span>
                {status}
                </span>
            ) : (
                <span className="text-gray-400">Select a status</span>
            )}
            <span className="ml-2">{open ? "▲" : "▼"}</span>
            </button>

            {/* Dropdown (toggle with state) */}
            {open && (
            <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {statuses.map((s) => (
                <li
                    key={s.label}
                    onClick={() => select(s.label)}
                    className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100"
                >
                    <span className={`w-3 h-3 rounded-full ${s.color}`}></span>
                    {s.label}
                </li>
                ))}
            </ul>
            )}
        </div>
     )
}