import useFetch from "../../hooks/useFetch";
import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";


const getRandomColor = () => {
  // Generate a random hex color
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
};

const TopProductsChart = () => {
    const [filter, setFilter] = useState("thisMonth");
    const { data : topProducts } = useFetch(`/api/products/top?filter=${filter}`);

    return (
        <div className="xl:w-1/2 h-[500px] bg-white border border-gray-300 shadow-lg rounded-xl p-5 flex flex-col">
            <h2 className="text-xl font-bold mb-3">Top Products</h2>

            {/* 🔹 Filter Select */}
            <div className="mb-3">
                <label className="mr-2 font-medium">Filter:</label>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1"
                >
                    <option value="thisMonth">This Month</option>
                    <option value="lastMonth">Last Month</option>
                    <option value="thisYear">This Year</option>
                    <option value="all">All Time</option>
                </select>
            </div>
            <ResponsiveContainer height="85%">
                <PieChart>
                    <Pie
                        data={topProducts?.topProducts}
                        dataKey="totalSold"
                        nameKey="product.product_name"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                    >
                        {topProducts?.topProducts.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={getRandomColor()}/>
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} sold`} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}

export default TopProductsChart