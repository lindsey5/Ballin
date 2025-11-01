import { useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import OrderContainer from "../../components/OrderContainer";
import { StatusChip } from "../../components/Chip";
import { formatToPeso } from "../../utils/utils";
import LoadingScreen from "../../components/Loading";
import { useState } from "react";
import { OrderUpdateButton } from "../../components/Button";
import { confirmDialog, successAlert } from "../../utils/swal";
import { updateData } from "../../services/api";
import { Helmet } from "react-helmet";
import { formatDate } from "../../utils/dateUtils";

const STATUS_FLOW = {
  Pending: ["Confirmed", "Rejected"],
  Confirmed: ["Shipped", "Cancelled"],
  Shipped: ["Delivered", "Failed"],
  Delivered: ["Failed"],
  Completed: [],
  Cancelled: [],
  Rejected: [],
  Refunded: [],
  Failed: []
};

const Order = () => {
    const { id } = useParams();
    const { data, loading } = useFetch(`/api/orders/${id}`);
    const [updating, setUpdating] = useState(false);

    const updateOrder = async (status) => {
        const subMessageMap = {
            Pending: "This will set the order back to pending status.",
            Confirmed: "The order will be confirmed and processed.",
            Shipped: "The order will be marked as shipped to the customer.",
            Delivered: "The order will be marked as delivered.",
            Completed: "The order will be marked as fully completed.",
            Cancelled: "The order will be cancelled.",
            Rejected: "The order will be rejected.",
            Failed: "The order will be marked as failed due to an issue."
        };

        if (await confirmDialog(`Mark as ${status}?`, subMessageMap[status] || "")) {
            setUpdating(true);
            const response = await updateData(`/api/orders/${id}`, { status });
            if (response.success) {
                setUpdating(false);
                await successAlert(
                "Order successfully updated",
                `Order has been successfully marked as ${status}.`
            );
                window.location.reload();
            }
            setUpdating(false);
        }
    };

    const currentStatus = data?.order?.status;
    const availableNextStatuses = STATUS_FLOW[currentStatus] || [];

    return (
        <div className="min-h-screen p-5 flex flex-col gap-5">
            <Helmet>
                <title>Order {id}</title>
            </Helmet>
            <LoadingScreen loading={loading || updating}/>
            {/* Header */}
            <div className="flex items-center gap-5">
                <h1 className="text-3xl font-bold text-black">{id}</h1>
                {data?.order && <StatusChip status={currentStatus} />}
            </div>

            {/* Order & Customer Details */}
            <div className="flex gap-10 items-start">
                {/* Order Items */}
                <div className="flex-2 p-5 rounded-lg flex flex-col gap-6 bg-white shadow-md border border-gray-200">
                <div className="space-y-4">
                    {data?.order?.order_items.map((item) => (
                        <OrderContainer key={item.id} item={item} />
                    ))}
                </div>

                {/* Order Summary */}
                <div className="border-t border-gray-300 pt-4">
                    <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatToPeso(data?.order.subtotal ?? 0)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>
                        {data?.order.shipping
                        ? formatToPeso(data?.order.shipping)
                        : "FREE"}
                    </span>
                    </div>
                    <div className="flex justify-between font-bold text-lg text-purple-600 mt-2">
                    <span>Total</span>
                    <span>{formatToPeso(data?.order.total ?? 0)}</span>
                    </div>
                </div>
                </div>

                {/* Customer Details */}
                <div className="flex-1 p-5 rounded-md flex flex-col gap-5 bg-white shadow-md border border-gray-200">
                    <h2 className="text-lg font-semibold">Customer Details:</h2>
                    <p className="text-sm">
                        Account: {data?.order.customer.firstname} {data?.order.customer.lastname}
                    </p>
                    <p className="text-sm">Email: {data?.order.customer.email}</p>
                    <hr className="border-gray-300 my-3" />
                    <h2 className="font-semibold">Address:</h2>
                    <p className="text-sm">Fullname: {data?.order.orderAddress.fullname}</p>
                    <p className="text-sm">Phone: {data?.order.orderAddress.phone}</p>
                    <p className="text-sm">{data?.order.orderAddress.address_line_1}</p>
                    <p className="text-sm">{data?.order.orderAddress.address_line_2}</p>
                    <p className="text-sm">{data?.order.orderAddress.admin_area_2}</p>
                    <p className="text-sm">{data?.order.orderAddress.admin_area_1}</p>
                    <p className="text-sm">Order Date: {formatDate(data?.order.order_date)}</p>
                    {availableNextStatuses.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                        {availableNextStatuses.map((status) => <OrderUpdateButton onClick={() => updateOrder(status)} key={status} status={status}/>)}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Order;