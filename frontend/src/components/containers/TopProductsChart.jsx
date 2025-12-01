import useFetch from "../../hooks/useFetch";
import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const filterOptions = [
    { value: "thisMonth", label: "This Month" },
    { value: "lastMonth", label: "Last Month" },
    { value: "thisYear", label: "This Year" },
    { value: "all", label: "All Time" },
];

const getRandomColor = () => {
  // Generate a random hex color
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
};

const TopProductsChart = () => {
    const [filter, setFilter] = useState("thisMonth");
    const { data : topProducts } = useFetch(`/api/products/top?filter=${filter}`);

    const currentFilterLabel = filterOptions.find(f => f.value === filter)?.label;

    return (
        <div id="top-products" className="xl:w-1/2 h-[500px] bg-white border border-gray-300 shadow-lg rounded-xl p-5 flex flex-col">
            <h2 className="text-xl font-bold mb-3">Top Products {currentFilterLabel}</h2>

            {/* 🔹 Filter Select */}
            <select
                id="filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1"
            >
                {filterOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {topProducts?.topProducts.length > 0 ? <ResponsiveContainer height="85%">
                <PieChart>
                    <Pie
                        data={topProducts?.topProducts}
                        dataKey="totalSold"
                        nameKey="product.product_name"
                    >
                        {topProducts?.topProducts.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={getRandomColor()}/>
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} sold`} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer> : <div className="flex items-center justify-center h-full">
                No Top Products
            </div>}
        </div>
    )
}

export default TopProductsChart