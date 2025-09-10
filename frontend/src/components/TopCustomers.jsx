import useFetch from "../hooks/useFetch"

const TopCustomers = () => {
    const { data } = useFetch('/api/customers/top');
    console.log(data)

    return (
        <div className="flex-1 space-y-5 bg-white border border-gray-300 shadow-lg rounded-xl p-5">
            <h1 className="font-bold text-lg">Top Customers</h1>
            <div className="py-3 space-y-5 flex-grow min-h-0 overflow-y-auto">
                {data?.topCustomers.map((customer, index) => (
                    <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-white gap-5 rounded-2xl shadow-md border border-gray-200"
                    >
                    {/* Left side: name + email */}
                    <div>
                        <h1 className="text-lg font-semibold text-gray-800">
                        {customer.customer.firstname} {customer.customer.lastname}
                        </h1>
                        <p className="text-sm text-gray-500">{customer.customer.email}</p>
                    </div>

                    {/* Right side: total orders */}
                    <div className="bg-blue-100 text-blue-800 font-medium px-3 py-1 rounded-lg">
                        Total Orders: {customer.total_orders}
                    </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TopCustomers