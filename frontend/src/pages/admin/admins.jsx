import { Helmet } from "react-helmet"
import Searchfield from "../../components/SearchField"
import { useMemo, useState } from "react"
import useFetch from "../../hooks/useFetch";
import CustomizedTable from "../../components/CustomizedTable";
import { TableRow } from "@mui/material";
import { StyledTableCell, StyledTableRow } from "../../components/CustomizedTable";
import AdminModal from "../../components/modals/AdminModal";
import EditIcon from '@mui/icons-material/Edit';
import IconButton from "@mui/material/IconButton"
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteData } from "../../services/api";
import { confirmDialog, errorAlert, successAlert } from "../../utils/swal";

export const AdminsTableColumns = () => {
    return (
        <TableRow sx={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: 'white'}}>
            <StyledTableCell align="left">Firstname</StyledTableCell>
            <StyledTableCell align="left">Lastname</StyledTableCell>
            <StyledTableCell align="left">Email</StyledTableCell>
            <StyledTableCell align="left">Role</StyledTableCell>
            <StyledTableCell align="left">Actions</StyledTableCell>
        </TableRow>
    )
}

export const AdminsTableRow = ({ admin, handleEdit }) => {
    const handleDelete = async () => {
        if(await confirmDialog('Delete Admin', 'Are you sure you want to permanently delete this admin? This action cannot be undone.')){
            const response = await deleteData(`/api/admins/${admin.id}`);
            if(!response.success){
                await errorAlert('Error', response.message || 'Something went wrong. Please try again.')
                return;
            }

            await successAlert('Success', response.message);
            window.location.reload();
        }

    }

    return (
        <StyledTableRow>
            <StyledTableCell>{admin.firstname}</StyledTableCell>
            <StyledTableCell>{admin.lastname}</StyledTableCell>
            <StyledTableCell>{admin.email}</StyledTableCell>
            <StyledTableCell>{admin.role}</StyledTableCell>
            <StyledTableCell>
                <div className="flex items-center">
                    <IconButton onClick={handleEdit}>
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={handleDelete}>
                        <DeleteIcon />
                    </IconButton>
                </div>
            </StyledTableCell>
        </StyledTableRow>
    )
}

const Admins = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const { data } = useFetch(`/api/admins?searchTerm=${searchTerm}`);
    const [admin, setAdmin] = useState();

    const cols = useMemo(() => <AdminsTableColumns /> ,[])
    const rows = useMemo(() => data?.admins.map(admin => <AdminsTableRow admin={admin} handleEdit={() => handleEdit(admin)}/>) || [] ,[data?.admins])

    const handleEdit = (admin) => {
        setShowModal(true)
        setAdmin(admin)
    }

    const handleClose = () => {
        setShowModal(false);
        setAdmin(undefined);
    }

    return (
        <div className="h-screen p-5 flex flex-col gap-5">
            <Helmet>
                <title>Admins</title>
            </Helmet>
            <AdminModal open={showModal} close={handleClose} admin={admin}/>
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