import { Helmet } from "react-helmet"
import useFetch from "../../hooks/useFetch"
import { formatDate } from "../../utils/dateUtils"
import { StatusChip } from "../../components/Chip"
import { formatToPeso } from "../../utils/utils"
import { ChevronRight } from "lucide-react"
import { IconButton } from "@mui/material"
import { useEffect, useState } from "react"
import { filterInitialState } from "../../contants/contants"
import { formatDateYYYYMMDD } from "../../utils/dateUtils"
import { Pagination } from "@mui/material"
import { StatusDropdown } from "../../components/Dropdown"
import { useContext } from "react"
import { UserContext } from "../../contexts/User"
import { Navigate } from "react-router-dom";

const MyOrdersPage = () => {
    const { user, loading } = useContext(UserContext);
    const [filter, setFilter] = useState(filterInitialState)
    const [date, setDate] = useState();
    const [status, setStatus] = useState("");
    const { data : orders } = useFetch(`/api/orders/customer?limit=10&date=${formatDateYYYYMMDD(date) ?? ''}&page=${filter.page}&status=${status}`)
    
    const handleChange = (_, value) => {
        setFilter(prev => ({...prev, page: value}))
    };

    if(!user && !loading){
        return <Navigate to="/" />
    }

    useEffect(() => {
        setFilter(prev => ({...prev, page: 1}))
    }, [status, date])

    return (
       <div className="flex flex-col gap-5 min-h-[calc(100vh-100px)] px-4 md:px-10 py-10">
             <Helmet>
                <title>My Orders</title>
            </Helmet>
            <div className="md:flex md:justify-between md:items-center gap-10">
                <h1 className="text-3xl font-bold mb-6">My Orders</h1>
                <div className="flex gap-5">
                    <StatusDropdown status={status} handleSelect={setStatus}/>
                    <input className="border px-4 py-2 rounded-lg" type="date" value={formatDateYYYYMMDD(date)} onChange={(e) => setDate(e.target.value)}/>
                </div>
            </div>
            {orders?.orders.map(order => (
                <div onClick={() => window.location.href = `/order/${order.order_id}`} key={order.order_id} className="border border-gray-300 p-5 rounded-lg hover:shadow-lg hover:scale-102 cursor-pointer">
                    <div className="flex gap-5 items-center">
                        <StatusChip status={order.status}/>
                        <p className="text-sm">{formatDate(order.order_date)}</p>
                    </div>
                    <div className="flex justify-between gap-5 items-center">
                        <div className="flex gap-3 mt-6">
                            <img className="w-20 h-20" src={order.order_items[0].product.thumbnail.thumbnailUrl} alt="" />
                            <div>
                                <h2 className="font-bold text-purple-500">{order.order_id}</h2>
                                <p>
                                {order.order_items.length <= 3
                                    ? order.order_items.map(item => item.product.product_name).join(' | ')
                                    : (
                                        <>
                                        {order.order_items.slice(0, 3).map(item => item.product.product_name).join(' | ')}{' '}
                                        and {order.order_items.length - 3} more item{order.order_items.length - 3 > 1 ? 's' : ''}
                                        </>
                                    )
                                }
                                </p>
                                <h2 className="mt-2 font-bold text-lg">{formatToPeso(order.total)}</h2>
                            </div>
                        </div>
                        <IconButton>
                            <ChevronRight />
                        </IconButton>
                    </div>
                </div>
            ))}
            {orders?.orders.length < 1 && <p>No Orders Found.</p>}
            {orders?.orders.length > 0 && <div className='mt-4 flex justify-end'>
                <Pagination color="secondary" count={orders?.totalPages ?? 1} page={filter.page} onChange={handleChange} />
            </div>}
        </div>
    )
}

export default MyOrdersPage