import { useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import OrderContainer from "../../components/OrderContainer";
import { StatusChip } from "../../components/Chip";
import { formatToPeso } from "../../utils/utils";
import LoadingScreen from "../../components/Loading";
import { Helmet } from "react-helmet";
import { formatDate } from "../../utils/dateUtils";
import { useContext, useState } from "react"
import { UserContext } from "../../contexts/User"
import { Navigate } from "react-router-dom";
import { updateData } from "../../services/api";
import { confirmDialog, errorAlert } from "../../utils/swal";
import CancelOrderModal from "../../components/modals/CancelOrderModal";

const MyOrder = () => {
    const { id } = useParams();
    const { data, loading } = useFetch(`/api/orders/${id}/customer`);
    const { user, loading : userLoading } = useContext(UserContext);
    const [updating, setUpdating] = useState(false);
    const [openCancelModal, setOpenCancelModal] = useState(false);

    if(!user && !userLoading){
        return <Navigate to="/" />
    }

    const receivedOrder = async() => {
        if(await confirmDialog('Mark as received?')){
            setUpdating(true)
            const response = await updateData(`/api/orders/${id}/received`)
            if(response.success){
                window.location.reload();
            } else{
                errorAlert(response.error, 'Please reload the page');
            }
            setUpdating(false)
        }
    }

    return (
        <div className="min-h-[calc(100vh-100px)] p-5 flex flex-col gap-5">
            <Helmet>
                <title>Order {id}</title>
            </Helmet>
            <LoadingScreen loading={loading || updating}/>
            {/* Header */}
            <div className="flex items-center gap-5">
                <h1 className="text-2xl font-bold text-black">{id}</h1>
                {data?.order && <StatusChip status={data?.order?.status} />}
            </div>

            {/* Order & Customer Details */}
            <div className="flex md:flex-row flex-col gap-10 md:items-start">
                {/* Order Items */}
                <div className="flex-2 p-5 rounded-lg flex flex-col gap-6 bg-white shadow-md border border-gray-200">
                <div className="space-y-4">
                    {data?.order?.order_items.map((item) => (
                        <OrderContainer key={item.id} item={item} />
                    ))}
                </div>
                {data?.order.cancellation_reason && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                        <strong className="font-bold">Cancellation Reason:</strong>
                        <p>{data?.order.cancellation_reason}</p>
                    </div>
                )}

                {/* Order Summary */}
                <div className="border-t border-gray-300 pt-4">
                    <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatToPeso(data?.order.subtotal ?? 0)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>
                        {data?.order.shipping_fee
                        ? formatToPeso(data?.order.shipping_fee)
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
                    <h2 className="font-semibold">Address:</h2>
                    <p className="text-sm">Fullname: {data?.order.orderAddress.fullname}</p>
                    <p className="text-sm">Phone: {data?.order.orderAddress.phone}</p>
                    <p className="text-sm">{data?.order.orderAddress.address_line_1}</p>
                    <p className="text-sm">{data?.order.orderAddress.address_line_2}</p>
                    <p className="text-sm">{data?.order.orderAddress.admin_area_2}</p>
                    <p className="text-sm">{data?.order.orderAddress.admin_area_1}</p>
                    <p className="text-sm">Order Date: {formatDate(data?.order.order_date)}</p>
                    {data?.order.status === 'Pending' && 
                        <button className="cursor-pointer rounded-md px-3 py-1 text-white bg-red-600" onClick={() => setOpenCancelModal(true)}>Cancel Order</button>
                    }
                    {data?.order.status === 'Delivered' && 
                        <button className="cursor-pointer rounded-md px-3 py-1 text-white bg-green-600" onClick={receivedOrder}>Mark as Received</button>
                    }
                </div>
            </div>
            <CancelOrderModal
                open={openCancelModal}
                close={() => setOpenCancelModal(false)}
                id={id}
                setUpdating={setUpdating}
            />
        </div>
    );
};

export default MyOrder;