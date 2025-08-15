import { useParams } from "react-router-dom"
import useFetch from "../../hooks/useFetch";
import OrderContainer from "../../components/OrderContainer";
import { StatusChip } from "../../components/Chip";
import { formatToPeso } from "../../utils/utils";
import LoadingScreen from "../../components/Loading";

const Order = () => {
    const { id } = useParams();
    const { data, loading } = useFetch(`/api/orders/${id}`);

    if(loading){
        return <LoadingScreen />
    }

    return (
        <div className="p-5 flex flex-col gap-5">
            <div className="flex items-center gap-5">
                <h1 className="text-3xl font-bold text-black">{id}</h1>
                <StatusChip status={data?.order.status}/>
            </div>
            <div className="flex gap-10 items-start">
                <div className="flex-2 p-5 rounded-lg flex flex-col gap-6 bg-white shadow-md border border-gray-200">
                {/* Order Items */}
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
                        {data?.order.shipping ? formatToPeso(data?.order.shipping) : "FREE"}
                    </span>
                    </div>
                    <div className="flex justify-between font-bold text-lg text-purple-600 mt-2">
                    <span>Total</span>
                    <span>{formatToPeso(data?.order.total ?? 0)}</span>
                    </div>
                </div>
                </div>
                <div className="flex-1 p-5 rounded-md flex flex-col gap-5 bg-white shadow-md border border-gray-200">
                    <h2 className="text-lg font-semibold">Customer Details:</h2>
                    <p className="text-sm">Fullname: {data?.order.customer.firstname}</p>
                    <p className="text-sm">Email: {data?.order.customer.email}</p>
                    <hr className="border-gray-300 my-3"/>
                    <h2 className="font-semibold">Address:</h2>
                    <p className="text-sm">{data?.order.orderAddress.fullname}</p>
                    <p className="text-sm">{data?.order.orderAddress.address_line_1}</p>
                    <p className="text-sm">{data?.order.orderAddress.address_line_2}</p>
                    <p className="text-sm">{data?.order.orderAddress.admin_area_2}</p>
                    <p className="text-sm">{data?.order.orderAddress.admin_area_1}</p>
                </div>
            </div>
        </div>
    )
}

export default Order