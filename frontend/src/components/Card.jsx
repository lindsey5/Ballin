
export const DashboardCard = ({ icon, label, value}) => {

    return (
        <div className="bg-white p-5 border border-gray-300 border-l-black border-l-4 rounded-md shadow-md">
            <div className="flex gap-5 items-center">
                {icon}
                <h2 className="font-semibold">{label}</h2>
            </div>
            <h1 className="mt-3 text-2xl font-bold">{value}</h1>

        </div>
    )
}