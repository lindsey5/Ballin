import { Helmet } from "react-helmet"
import Searchfield from "../../components/SearchField"
import { useMemo, useState } from "react"
import useFetch from "../../hooks/useFetch";
import CustomizedTable from "../../components/CustomizedTable";
import { TableRow } from "@mui/material";
import { StyledTableCell, StyledTableRow } from "../../components/CustomizedTable";
import AdminModal from "../../components/modals/AdminModal";

export const AdminsTableColumns = () => {
    return (
        <TableRow sx={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: 'white'}}>
            <StyledTableCell align="left">Firstname</StyledTableCell>
            <StyledTableCell align="left">Lastname</StyledTableCell>
            <StyledTableCell align="left">Email</StyledTableCell>
            <StyledTableCell align="center">Role</StyledTableCell>
        </TableRow>
    )
}

export const AdminsTableRow = ({ admin }) => {
    return (
        <StyledTableRow>
            <StyledTableCell>{admin.firstname}</StyledTableCell>
            <StyledTableCell>{admin.lastname}</StyledTableCell>
            <StyledTableCell>{admin.email}</StyledTableCell>
            <StyledTableCell>{admin.role}</StyledTableCell>
        </StyledTableRow>
    )
}

const Admins = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const { data } = useFetch(`/api/admins?searchTerm=${searchTerm}`);

    const cols = useMemo(() => <AdminsTableColumns /> ,[])
    const rows = useMemo(() => data?.admins.map(admin => <AdminsTableRow admin={admin}/>) || [] ,[data?.admins])

    const handleClose = () => {
        setShowModal(false);
        
    }

    return (
        <div className="h-screen p-5 flex flex-col gap-5">
            <Helmet>
                <title>Admins</title>
            </Helmet>
            <AdminModal open={showModal} close={handleClose}/>
            <h1 className="text-3xl font-bold text-black">Admins</h1>
           <div className="flex justify-between">
                <Searchfield placeholder="Search by firstname, lastname, email" onChange={(e) => setSearchTerm(e.target.value)}/>
                <button className="px-3 py-2 rounded-lg bg-purple-600 text-white cursor-pointer" onClick={() => setShowModal(true)}>Create Admin</button>
           </div>
        
            <div className="min-h-0 flex-grow overflow-y-auto">
                <CustomizedTable 
                    cols={cols}
                    rows={rows}
                />
            </div>
        </div>
    )
}

export default Admins