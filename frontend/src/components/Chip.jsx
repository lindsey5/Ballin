
const statusColors = {
  Pending: { bg: "bg-gray-100", circle: "bg-gray-400", text: "text-gray-800" },
  Confirmed: { bg: "bg-blue-100", circle: "bg-blue-500", text: "text-blue-800" },
  Shipped: { bg: "bg-indigo-100", circle: "bg-indigo-500", text: "text-indigo-800" },
  Delivered: { bg: "bg-green-100", circle: "bg-green-500", text: "text-green-800" },
  Completed: { bg: "bg-green-200", circle: "bg-green-600", text: "text-green-900" },
  Cancelled: { bg: "bg-red-100", circle: "bg-red-500", text: "text-red-800" },
  Rejected: { bg: "bg-red-200", circle: "bg-red-600", text: "text-red-900" },
  Refunded: { bg: "bg-yellow-100", circle: "bg-yellow-500", text: "text-yellow-800" },
  Failed: { bg: "bg-red-300", circle: "bg-red-700", text: "text-red-900" },
};

export const StatusChip = ({ status }) => {
  const color = statusColors[status] || { bg: "bg-gray-100", circle: "bg-gray-400", text: "text-gray-800" };

  return (
    <div className={`flex items-center px-3 py-1 rounded-full gap-2 ${color.bg}`}>
      <span className={`w-3 h-3 rounded-full ${color.circle}`}></span>
      <span className={`text-sm font-medium ${color.text}`}>{status}</span>
    </div>
  );
};