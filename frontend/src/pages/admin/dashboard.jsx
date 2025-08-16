import { DashboardCard } from "../../components/Card"
import { PhilippinePeso, ShoppingBasket, Shirt } from 'lucide-react';
import useFetch from "../../hooks/useFetch";
import { formatToPeso } from "../../utils/utils";
import { useMemo } from "react";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { OrderTableColumns, OrderTableRow } from "./orders";
import CustomizedTable from "../../components/CustomizedTable";
import { Helmet } from "react-helmet";

const iconStyle = "text-purple-500 w-10 h-10 border border-gray-300 shadow-xl rounded-lg p-2"

const Dashboard = () => {
    const { data : salesToday } = useFetch('/api/sales/today');
    const { data : salesThisMonth } = useFetch('/api/sales/month');
    const { data : totalProducts } = useFetch('/api/products/total');
    const { data : orders } = useFetch('/api/orders/total');
    const { data : sales } = useFetch('/api/sales/per-month');
    const { data : topProducts } = useFetch('/api/sales/top-products');
    const { data : mostRecentOrders } = useFetch('/api/orders/recent')

    console.log(topProducts)

    const salesPerMonth = useMemo(() => {
        if(!sales) return []
        const monthNames = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        const fullData = monthNames.map((name, index) => {
          const monthData = sales.salesPerMonth.find((m) => m.month === index + 1);
          return {
            month: name,
            Sales: monthData ? monthData.totalSales : 0
          };
        });
        return fullData
    }, [sales])

    return (
        <div className="p-5">
            <Helmet>
                <title>Dashboard</title>
            </Helmet>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <div className="grid grid-cols-4 gap-10 mt-6">
                <DashboardCard 
                    icon={<PhilippinePeso className={iconStyle} />} 
                    label="Sales Today" 
                    value={formatToPeso(salesToday?.totalSalesToday ?? 0)}
                />
                <DashboardCard 
                    icon={<PhilippinePeso className={iconStyle} />} 
                    label="Sales This Month" 
                    value={formatToPeso(salesThisMonth?.totalSalesThisMonth ?? 0)}
                />
                <DashboardCard 
                    icon={<Shirt className={iconStyle} />} 
                    label="Total Products" 
                    value={totalProducts?.totalProducts ?? 0}
                />
                <DashboardCard 
                    icon={<ShoppingBasket className={iconStyle} />} 
                    label="Total Orders" 
                    value={orders?.totalOrders ?? 0}
                />
            </div>
            <div className="w-full h-[500px] mt-12 bg-white border border-gray-300 shadow-lg rounded-md p-5">
                <h2 className="font-bold mb-6">Sales Per Month {new Date().getFullYear()}</h2>
                <ResponsiveContainer>
                <LineChart data={salesPerMonth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Sales" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="flex gap-10 mt-16 h-[500px]">
                <div className="h-full flex flex-col flex-2">
                    <h2 className="text-xl font-bold p-5">Recent Orders</h2>
                    <div className="min-h-0 flex-grow overflow-y-auto p-3">
                        <CustomizedTable 
                            cols={<OrderTableColumns />}
                            rows={mostRecentOrders?.recent_orders.map(order => <OrderTableRow key={order.order_id} order={order}/>)}
                        />
                    </div>
                </div>
                <div className="h-full flex-1 bg-white border border-gray-300 shadow-lg rounded-xl p-5">
                    <h2 className="text-xl font-bold">Top Products</h2>
                    {topProducts?.topProducts?.length > 0 ? (
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={topProducts.topProducts}
                                    dataKey="totalSold"
                                    nameKey="product.product_name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={120}
                                    fill="#8884d8"
                                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                >
                                    {topProducts.topProducts.map((_, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c"][index % 5]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => `${value} sold`} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-center mt-20 text-gray-500">No top products found</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Dashboard