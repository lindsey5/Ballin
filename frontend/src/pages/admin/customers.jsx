import { useMemo, useState } from "react";
import useFetch from "../../hooks/useFetch";
import { filterInitialState } from "../../contants/contants";
import Searchfield from "../../components/SearchField";
import { Pagination, TableRow, Select, FormControl, InputLabel, MenuItem } from "@mui/material";
import CustomizedTable from "../../components/CustomizedTable";
import { StyledTableCell, StyledTableRow } from "../../components/CustomizedTable";
import { useEffect } from "react";
import { formatDate } from "../../utils/dateUtils";
import { Helmet } from "react-helmet";
import { updateData } from "../../services/api";
import { confirmDialog, errorAlert, successAlert } from "../../utils/swal";

export const CustomersTableColumns = () => {
    return (
        <TableRow sx={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: 'white'}}>
            <StyledTableCell align="left">Firstname</StyledTableCell>
            <StyledTableCell align="left">Lastname</StyledTableCell>
            <StyledTableCell align="left">Email</StyledTableCell>
            <StyledTableCell align="center">Status</StyledTableCell>
            <StyledTableCell align="center">Pending Orders</StyledTableCell>
            <StyledTableCell align="center">Completed Orders</StyledTableCell>
            <StyledTableCell align="center">Last Order</StyledTableCell>
            <StyledTableCell align="center">Action</StyledTableCell>
        </TableRow>
    )
}

const StatusChip = ({ status }) => {
  const isActive = status.toLowerCase() === "active";

  return (
    <div
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border
        ${isActive
          ? "bg-green-100 text-green-700 border-green-300"
          : "bg-red-100 text-red-700 border-red-300"
        }`}
    >
      <span
        className={`w-2 h-2 rounded-full mr-2 ${
          isActive ? "bg-green-500" : "bg-red-500"
        }`}
      ></span>
      {isActive ? "Active" : "Deactivated"}
    </div>
  );
};

export const CustomersTableRow = ({ customer }) => {
    const updateStatus = async () => {
        const action = customer.status === 'Active' ? 'deactivate' : 'activate';
        const mainMessage = action === 'deactivate' 
            ? 'Deactivate Customer' 
            : 'Activate Customer';
        const subMessage = action === 'deactivate' 
            ? 'Are you sure you want to deactivate this customer? They will lose access to their account until reactivated.'
            : 'Are you sure you want to activate this customer? They will regain access to their account.';

        if (await confirmDialog(mainMessage, subMessage)) {
            const response = await updateData(`/api/customers/${action}/${customer.id}`, {});
            
            if (!response.success) {
                errorAlert('Failed', response.error || 'Failed to update customer status');
                return;
            }

            await successAlert('Success', `Customer has been successfully ${action}d.`);
            window.location.reload();
        }
    };

    return (
        <StyledTableRow>
            <StyledTableCell>{customer.firstname}</StyledTableCell>
            <StyledTableCell>{customer.lastname}</StyledTableCell>
            <StyledTableCell>{customer.email}</StyledTableCell>
            <StyledTableCell align="center"><StatusChip status={customer.status}/></StyledTableCell>
            <StyledTableCell align="center">{customer.pendingOrders}</StyledTableCell>
            <StyledTableCell align="center">{customer.completedOrders}</StyledTableCell>
            <StyledTableCell align="center">{formatDate(customer.lastOrder) || 'N/A'}</StyledTableCell>
            <StyledTableCell align="center">
                <button
                onClick={updateStatus}
                className='cursor-pointer text-white bg-gray-600 y-200 px-3 py-2 rounded-lg'>
                {customer.status === 'Active' ? 'Deactivate' : 'Activate'}
                </button>
            </StyledTableCell>
        </StyledTableRow>
    )
}

const CustomersPage = () => {
    const [filter, setFilter] = useState(filterInitialState)
    const [searchTerm, setSearchTerm] = useState('');
    const [status, setStatus] = useState('All');
    const { data } = useFetch(`/api/customers/all?limit=50&page=${filter.page}&search=${filter.searchTerm}&status=${status}`)
    
    const handleChange = (_, value) => {
        setFilter(prev => ({...prev, page: value}))
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            setFilter(prev => ({...prev, searchTerm }))
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    const cols = useMemo(() => <CustomersTableColumns /> , [])
    const rows = useMemo(() => data?.customers.map(customer => <CustomersTableRow key={customer.id} customer={customer}/>) || [], [data?.customers])

    return (
        <div className="h-screen p-5 flex flex-col gap-5">
            <Helmet>
                <title>Customers</title>
            </Helmet>
            <h1 className="text-3xl font-bold text-black">Customers</h1>
           <div className="flex justify-between">
                <Searchfield placeholder="Search by firstname, lastname, email" onChange={(e) => setSearchTerm(e.target.value)}/>
                <FormControl sx={{ width: '300px'}}>
                <InputLabel id="sort-label">Sort By</InputLabel>
                <Select
                    labelId="status-label"
                    value={status}
                    label="Status"
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <MenuItem value="All">All</MenuItem>
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Deactivated">Deactivated</MenuItem>
                </Select>
                </FormControl>
           </div>

            <div className="min-h-0 flex-grow overflow-y-auto">
                <CustomizedTable 
                    cols={cols}
                    rows={rows}
                />
            </div>
            <div className='mt-4 flex justify-end'>
                <Pagination color="secondary" count={data?.totalPages ?? 1} page={filter.page} onChange={handleChange} />
            </div>
        </div>
    )
}

export default CustomersPage