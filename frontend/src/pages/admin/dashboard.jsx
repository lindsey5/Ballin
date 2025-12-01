import { DashboardCard } from "../../components/Card"
import { PhilippinePeso, ShoppingBasket, Shirt, User2 } from 'lucide-react';
import useFetch from "../../hooks/useFetch";
import { formatToPeso } from "../../utils/utils";
import { useMemo,  } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { OrderTableColumns, OrderTableRow } from "./orders";
import CustomizedTable from "../../components/CustomizedTable";
import { Helmet } from "react-helmet";
import TopCustomers from "../../components/TopCustomers";
import { Download } from "lucide-react";
import TopProductsChart from "../../components/containers/TopProductsChart";

const iconStyle = "text-black w-10 h-10 border border-gray-300 shadow-xl rounded-lg p-2"

const Dashboard = () => {
    const { data : salesToday } = useFetch('/api/sales/today');
    const { data : salesThisMonth } = useFetch('/api/sales/month');
    const { data : totalProducts } = useFetch('/api/products/total');
    const { data : orders } = useFetch('/api/orders/total');
    const { data : sales } = useFetch('/api/sales/per-month');
    const { data : mostRecentOrders } = useFetch('/api/orders/recent');
    const { data: salesThisWeek } = useFetch('/api/sales/week');
    const { data : salesThisYear } = useFetch('/api/sales/year');
    const { data : overallSales } = useFetch('/api/sales');
    const { data : customers } = useFetch('/api/customers/total');

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

    const handlePrint = () => {
        window.print(); 
    };

    return (
        <div className="p-5">
            <Helmet>
                <title>Dashboard</title>
            </Helmet>
            <div className="flex gap-10 items-center mb-4">
                <h1 id="title" className="text-3xl font-bold">Dashboard</h1>
                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                >
                    <Download className="w-5 h-5" /> Print Reports
                </button>
            </div>
            <div id="cards" className="grid grid-cols-2 xl:grid-cols-4 gap-10 mt-6">
                <DashboardCard 
                    icon={<PhilippinePeso className={iconStyle} />} 
                    label="Sales Today" 
                    value={formatToPeso(salesToday?.totalSalesToday ?? 0)}
                />
                <DashboardCard 
                    icon={<PhilippinePeso className={iconStyle} />} 
                    label="Sales This Week" 
                    value={formatToPeso(salesThisWeek?.totalSalesThisWeek ?? 0)}
                />
                <DashboardCard 
                    icon={<PhilippinePeso className={iconStyle} />} 
                    label="Sales This Month" 
                    value={formatToPeso(salesThisMonth?.totalSalesThisMonth ?? 0)}
                />
                <DashboardCard 
                    icon={<PhilippinePeso className={iconStyle} />} 
                    label="Sales This Year" 
                    value={formatToPeso(salesThisYear?.totalSalesThisYear ?? 0)}
                />
                <DashboardCard 
                    icon={<PhilippinePeso className={iconStyle} />} 
                    label="Overall Sales" 
                    value={formatToPeso(overallSales?.overallSales ?? 0)}
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
                <DashboardCard 
                    icon={<User2 className={iconStyle} />} 
                    label="Total Customers" 
                    value={customers?.totalCustomers ?? 0}
                />
            </div>
            <div className="flex flex-col xl:flex-row gap-10 mt-16 xl:h-[500px]">
                <div id="sales-per-month" className="w-full bg-white border border-gray-300 shadow-lg rounded-md p-5">
                    <h2 className="font-bold mb-6">Sales Per Month {new Date().getFullYear()}</h2>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={salesPerMonth} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Sales" fill="#000000ff" barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <TopProductsChart />
            </div>
            <div className="w-full flex flex-col md:flex-row gap-10 mt-16 xl:h-[500px]">
                <div id="top-customers">
                    <TopCustomers />
                </div>
                <div id="recent-orders" className="w-[60%] h-[500px] flex flex-col">
                    <h2 className="text-xl font-bold p-5">Recent Orders</h2>
                    <div className="min-h-0 flex-grow overflow-y-auto p-3">
                        <CustomizedTable 
                            cols={<OrderTableColumns />}
                            rows={mostRecentOrders?.recent_orders.map(order => <OrderTableRow key={order.order_id} order={order}/>)}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard