import { useState } from "react";
import useFetch from "../../hooks/useFetch";
import { filterInitialState } from "../../contants/contants";
import Searchfield from "../../components/SearchField";
import { IconButton, Pagination, TableRow } from "@mui/material";
import CustomizedTable from "../../components/CustomizedTable";
import { StyledTableCell, StyledTableRow } from "../../components/CustomizedTable";
import { useEffect } from "react";
import { formatDate } from "../../utils/dateUtils";
import { Helmet } from "react-helmet";

export const CustomersTableColumns = () => {
    return (
        <TableRow sx={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: 'white'}}>
            <StyledTableCell align="left">Firstname</StyledTableCell>
            <StyledTableCell align="left">Lastname</StyledTableCell>
            <StyledTableCell align="left">Email</StyledTableCell>
            <StyledTableCell align="center">Pending Orders</StyledTableCell>
            <StyledTableCell align="center">Completed Orders</StyledTableCell>
            <StyledTableCell align="center">Last Order</StyledTableCell>
        </TableRow>
    )
}

export const CustomersTableRow = ({ customer }) => {
    return (
        <StyledTableRow>
            <StyledTableCell>{customer.firstname}</StyledTableCell>
            <StyledTableCell>{customer.lastname}</StyledTableCell>
            <StyledTableCell>{customer.email}</StyledTableCell>
            <StyledTableCell align="center">{customer.pendingOrders}</StyledTableCell>
            <StyledTableCell align="center">{customer.completedOrders}</StyledTableCell>
            <StyledTableCell align="center">{formatDate(customer.lastOrder)}</StyledTableCell>
        </StyledTableRow>
    )
}

const CustomersPage = () => {
    const [filter, setFilter] = useState(filterInitialState)
    const [searchTerm, setSearchTerm] = useState('');
    const { data } = useFetch(`/api/customers/all?limit=50&page=${filter.page}&search=${filter.searchTerm}`)
    
    const handleChange = (_, value) => {
        setFilter(prev => ({...prev, page: value}))
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            setFilter(prev => ({...prev, searchTerm }))
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    return (
        <div className="h-screen p-5 flex flex-col gap-5">
            <Helmet>
                <title>Customers</title>
            </Helmet>
            <h1 className="text-3xl font-bold text-black">Customers</h1>
           <div>
             <Searchfield placeholder="Search by firstname, lastname, email" onChange={(e) => setSearchTerm(e.target.value)}/>
           </div>

            <div className="min-h-0 flex-grow overflow-y-auto">
                <CustomizedTable 
                    cols={<CustomersTableColumns />}
                    rows={data?.customers.map(customer => <CustomersTableRow key={customer.id} customer={customer}/>)}
                />
            </div>
            <div className='mt-4 flex justify-end'>
                <Pagination color="secondary" count={data?.totalPages ?? 1} page={filter.page} onChange={handleChange} />
            </div>
        </div>
    )
}

export default CustomersPage