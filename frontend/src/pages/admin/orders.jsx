import { useMemo, useState } from "react";
import useFetch from "../../hooks/useFetch";
import { filterInitialState } from "../../contants/contants";
import Searchfield from "../../components/SearchField";
import { IconButton, Pagination, TableRow } from "@mui/material";
import CustomizedTable from "../../components/CustomizedTable";
import { StyledTableCell, StyledTableRow } from "../../components/CustomizedTable";
import { exportData, formatToPeso } from "../../utils/utils";
import { useEffect } from "react";
import { formatDate, formatDateYYYYMMDD } from "../../utils/dateUtils";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Helmet } from "react-helmet";
import { DateFilterDropdown, StatusDropdown } from "../../components/Dropdown";
import { StatusChip } from "../../components/Chip";
import { get_date_range } from "../../utils/dateUtils";

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
            <StyledTableCell align="center">{formatDate(order.order_date)}</StyledTableCell>
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
    const [dateFilter, setDateFilter] = useState('All');
    const [specificDate, setSpecificDate] = useState({ start: "", end: "" });
    const [status, setStatus] = useState("");

    const dates = useMemo(() => {
    if (dateFilter === "Specific Date") return { startDate: specificDate.start, endDate: specificDate.end };
        return get_date_range(dateFilter);
    }, [dateFilter, specificDate]);

    const { data } = useFetch(`/api/orders?limit=50&startDate=${formatDateYYYYMMDD(dates.startDate) ?? ''}&endDate=${formatDateYYYYMMDD(dates.endDate)}&page=${filter.page}&searchTerm=${filter.searchTerm}&status=${status}`)

    const handleChange = (_, value) => {
        setFilter(prev => ({...prev, page: value}))
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            setFilter(prev => ({...prev, searchTerm }))
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    const cols = useMemo(() => <OrderTableColumns /> , [])
    const rows = useMemo(() => data?.orders.map(order => <OrderTableRow key={order.order_id} order={order}/>) || [] , [data?.orders])

    const reset = () => {
        setDateFilter('All');
        setStatus('');
        setSpecificDate({ start: "", end: "" })
    }

    const exportOrders = () => {
        const dataToExport = []
        let grandTotal = 0

        data?.orders.forEach(order => {
            order.order_items.forEach(item => {
                grandTotal += Number(item.total) // accumulate total

                dataToExport.push({
                    order_id: order.order_id,
                    product_name: item.product.product_name,
                    color: item.color,
                    size: item.size,
                    quantity: item.quantity,
                    price: formatToPeso(item.price),
                    total: formatToPeso(item.total),
                    order_date: order.order_date,
                    payment_method: order.payment_method
                })
            })
        })

        // Add blank separator row (optional)
        dataToExport.push({
            order_id: "",
            product_name: "",
            color: "",
            size: "",
            quantity: "",
            price: "",
            total: "",
            order_date: "",
            payment_method: ""
        })

        // Add the TOTAL row
        dataToExport.push({
            order_id: "",
            product_name: "GRAND TOTAL",
            color: "",
            size: "",
            quantity: "",
            price: "",
            total: formatToPeso(grandTotal),
            order_date: "",
            payment_method: ""
        })

        exportData({
            dataToExport,
            filename: `Ballin - Orders ${dateFilter !== 'All' ? dateFilter !== 'Specific Date' ? dateFilter : `${dates.startDate} - ${dates.endDate}` : ''}.xlsx`,
            sheetname: 'Orders'
        })
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
                    {dateFilter === 'Specific Date' && <>
                        <div>
                            <p>Start Date</p>
                            <input 
                            className="border px-4 py-2 rounded-lg" 
                            type="date" 
                            value={formatDateYYYYMMDD(specificDate.start)} 
                            onChange={(e) => setSpecificDate(prev => ({
                                ...prev, 
                                start: e.target.value
                                })
                            )}
                                />
                        </div>
                        <div>
                            <p>End Date</p>
                            <input min={formatDateYYYYMMDD(specificDate.start)} disabled={!specificDate.start} className="border px-4 py-2 rounded-lg" type="date" value={formatDateYYYYMMDD(specificDate.end)} onChange={(e) => setSpecificDate(prev => ({...prev, end: e.target.value}))}/>
                        </div>
                    </>}
                    <DateFilterDropdown filter={dateFilter} handleSelect={setDateFilter}/>
                    <StatusDropdown status={status} handleSelect={setStatus}/>
                    {(dateFilter !== 'All' || status) && <button onClick={reset} className="text-red-500 cursor-pointer">Reset</button>}
                </div>
            </div>
            <div className="lg:hidden flex items-center gap-5">
                 {dateFilter === 'Specific Date' && <>
                        <div>
                            <p>Start Date</p>
                            <input className="border px-4 py-2 rounded-lg" type="date" value={formatDateYYYYMMDD(specificDate.start)} onChange={(e) => setSpecificDate(prev => ({...prev, start: e.target.value}))}/>
                        </div>
                        <div>
                            <p>End Date</p>
                            <input min={formatDateYYYYMMDD(specificDate.start)} disabled={!specificDate.start} className="border px-4 py-2 rounded-lg" type="date" value={formatDateYYYYMMDD(specificDate.end)} onChange={(e) => setSpecificDate(prev => ({...prev, end: e.target.value}))}/>
                        </div>
                    </>}
                <DateFilterDropdown filter={dateFilter} handleSelect={setDateFilter}/>
                <StatusDropdown status={status} handleSelect={setStatus}/>
                {(dates || status) && <button onClick={reset} className="text-red-500 cursor-pointer">Reset</button>}
            </div>
            <div className="min-h-0 flex-grow overflow-y-auto">
                <CustomizedTable 
                    cols={cols}
                    rows={rows}
                />
            </div>
            <div className='mt-4 flex items-center justify-between'>
                <Pagination color="secondary" count={data?.totalPages ?? 1} page={filter.page} onChange={handleChange} />
                <button className="px-3 py-2 rounded-lg bg-gray-600 text-white cursor-pointer" onClick={exportOrders}>Export</button>
            </div>
        </div>
    )
}

export default Orders