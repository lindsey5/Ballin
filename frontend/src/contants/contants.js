
export const sizes = ['XS', 'S', 'M', 'L', 'XL', '2XL']

export const filterInitialState = {
    page: 1,
    searchTerm: '',
    totalPages: 1,
}

export const statusColorMap = {
  Pending: {
    bg: "#f59e0b", // amber-500
    textColor: "#fff",
  },
  Confirmed: {
    bg: "#3b82f6", // blue-500
    textColor: "#fff",
  },
  Shipped: {
    bg: "#6366f1", // indigo-500
    textColor: "#fff",
  },
  Delivered: {
    bg: "#22c55e", // green-500
    textColor: "#fff",
  },
  Completed: {
    bg: "#10b981", // emerald-500
    textColor: "#fff",
  },
  Cancelled: {
    bg: "#ef4444", // red-500
    textColor: "#fff",
  },
  Refunded: {
    bg: "#6b7280", // gray-500
    textColor: "#fff",
  },
  Failed: {
    bg: "#f43f5e", // rose-500
    textColor: "#fff",
  },
};