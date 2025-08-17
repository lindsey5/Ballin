import { useState } from "react";
import useFetch from "../../hooks/useFetch";
import { filterInitialState } from "../../contants/contants";
import Searchfield from "../../components/SearchField";
import { IconButton, Pagination, TableRow } from "@mui/material";
import CustomizedTable from "../../components/CustomizedTable";
import { StyledTableCell, StyledTableRow } from "../../components/CustomizedTable";
import { formatToPeso } from "../../utils/utils";
import { useEffect } from "react";
import { formatDateYYYYMMDD } from "../../utils/dateUtils";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Helmet } from "react-helmet";
import { StatusDropdown } from "../../components/Dropdown";
import { StatusChip } from "../../components/Chip";

export const OrderTableColumns = () => {
    return (
        <TableRow sx={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: 'white'}}>
            <StyledTableCell align="left">Order ID</StyledTableCell>
            <StyledTableCell align="center">Customer</StyledTableCell>
            <StyledTableCell align="center">Payment Method</StyledTableCell>
            <StyledTableCell align="center">Status</StyledTableCell>
            <StyledTableCell align="center">Order Date</StyledTableCell>
            <StyledTableCell align="center">Subtotal</StyledTableCell>
            <StyledTableCell align="center">Total</StyledTableCell>
            <StyledTableCell align="center">Action</StyledTableCell>
        </TableRow>
    )
}

export const OrderTableRow = ({ order }) => {
    return (
        <StyledTableRow>
            <StyledTableCell>{order.order_id}</StyledTableCell>
            <StyledTableCell align="center">{order.customer.firstname} {order.customer.lastname}</StyledTableCell>
            <StyledTableCell align="center">{order.payment_method}</StyledTableCell>
            <StyledTableCell align="center">
                <div className="flex justify-center">
                    <StatusChip status={order.status}/>
                </div>
            </StyledTableCell>
            <StyledTableCell align="center">{order.order_date}</StyledTableCell>
            <StyledTableCell align="center">{formatToPeso(order.subtotal)}</StyledTableCell>
             <StyledTableCell align="center">{formatToPeso(order.total)}</StyledTableCell>
            <StyledTableCell align="center">
                <IconButton onClick={() => window.location.href = `/admin/order/${order.order_id}`}>
                    <VisibilityIcon />
                </IconButton>
            </StyledTableCell>
        </StyledTableRow>
    )
}

const Orders = () => {
    const [filter, setFilter] = useState(filterInitialState)
    const [searchTerm, setSearchTerm] = useState('');
    const [date, setDate] = useState();
    const [status, setStatus] = useState("");
    const { data } = useFetch(`/api/orders?limit=50&date=${formatDateYYYYMMDD(date) ?? ''}&page=${filter.page}&searchTerm=${filter.searchTerm}&status=${status}`)
    
    const handleChange = (_, value) => {
        setFilter(prev => ({...prev, page: value}))
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            setFilter(prev => ({...prev, searchTerm }))
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    const reset = () => {
        setDate();
        setStatus('');
    }

    return (
        <div className="h-screen p-5 flex flex-col gap-5">
            <Helmet>
                <title>Orders</title>
            </Helmet>
            <h1 className="text-3xl font-bold text-black">Orders</h1>
            <div className="flex justify-between items-center gap-5">
                <Searchfield placeholder="Search by order id, customer..." onChange={(e) => setSearchTerm(e.target.value)}/>
                <div className="hidden lg:flex items-center gap-5">
                    <input className="border px-4 py-2 rounded-lg" type="date" value={formatDateYYYYMMDD(date)} onChange={(e) => setDate(e.target.value)}/>
                    <StatusDropdown status={status} handleSelect={setStatus}/>
                    {(date || status) && <button onClick={reset} className="text-red-500 cursor-pointer">Reset</button>}
                </div>
                <button className="px-3 py-2 rounded-lg bg-gray-600 text-white cursor-pointer">Export</button>
            </div>
            <div className="lg:hidden flex items-center gap-5">
                <input className="border px-4 py-2 rounded-lg" type="date" value={formatDateYYYYMMDD(date)} onChange={(e) => setDate(e.target.value)}/>
                <StatusDropdown status={status} handleSelect={setStatus}/>
                {(date || status) && <button onClick={reset} className="text-red-500 cursor-pointer">Reset</button>}
            </div>
            <div className="min-h-0 flex-grow overflow-y-auto">
                <CustomizedTable 
                    cols={<OrderTableColumns />}
                    rows={data?.orders.map(order => <OrderTableRow key={order.order_id} order={order}/>)}
                />
            </div>
            <div className='mt-4 flex justify-end'>
                <Pagination color="secondary" count={data?.totalPages ?? 1} page={filter.page} onChange={handleChange} />
            </div>
        </div>
    )
}

export default Orders